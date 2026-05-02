import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'public', 'data');
const URL_FILE = path.join(ROOT, 'url.txt');
const REPORT_FILE = path.join(ROOT, 'official-url-report.json');
const USER_AGENT = 'Mozilla/5.0 (compatible; HorologiumOfficialUrlResolver/1.0)';

const normalizeReferenceForUrl = (reference = '') =>
  reference
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '');

const compactReference = (reference = '') =>
  reference.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

const decodeEntities = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const normalizeHost = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
};

const readBrandUrls = async () => {
  const text = await fs.readFile(URL_FILE, 'utf8');
  return new Map(
    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [brand, rawUrl] = line.split(/\s+—\s+/);
        return [brand, rawUrl];
      })
  );
};

const fetchText = async (url) => {
  try {
    const response = await fetch(url, {
      headers: { 'user-agent': USER_AGENT },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
};

const parseLocs = (xml) =>
  [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => decodeEntities(match[1].trim()));

const parseRobotSitemaps = (robotsText) =>
  [...robotsText.matchAll(/^sitemap:\s*(.+)$/gim)].map((match) => match[1].trim());

const collectSitemapUrls = async (baseUrl, watches) => {
  const base = new URL(baseUrl);
  const roots = new Set([
    new URL('/sitemap.xml', base).href,
    new URL('/sitemap_index.xml', base).href,
    new URL('/sitemap-index.xml', base).href,
  ]);

  const robots = await fetchText(new URL('/robots.txt', base).href);
  if (robots) {
    parseRobotSitemaps(robots).forEach((sitemap) => roots.add(sitemap));
  }

  const visited = new Set();
  const queue = [...roots];
  const urls = new Set();
  const officialHost = normalizeHost(baseUrl);
  const referenceNeedles = watches
    .flatMap((watch) => [normalizeReferenceForUrl(watch.reference), compactReference(watch.reference)])
    .filter((needle) => needle.length >= 5);

  while (queue.length && visited.size < 30) {
    const sitemap = queue.shift();
    if (visited.has(sitemap)) continue;
    visited.add(sitemap);

    const xml = await fetchText(sitemap);
    if (!xml || !xml.includes('<loc>')) continue;

    const nestedSitemaps = [];
    for (const loc of parseLocs(xml)) {
      const lower = loc.toLowerCase();
      const locHost = normalizeHost(loc);
      if (!locHost.endsWith(officialHost)) continue;

      if (lower.endsWith('.xml') || lower.endsWith('.xml.gz')) {
        nestedSitemaps.push(loc);
      } else if (!/\.(png|jpe?g|webp|gif|svg|pdf)$/i.test(lower)) {
        const compactLoc = compactReference(loc);
        if (referenceNeedles.some((needle) => lower.includes(needle) || compactLoc.includes(needle))) {
          urls.add(loc);
        }
      }
    }

    nestedSitemaps
      .sort((a, b) => Number(/(product|watch|timepiece|collection|model)/i.test(b)) - Number(/(product|watch|timepiece|collection|model)/i.test(a)))
      .forEach((loc) => queue.push(loc));
  }

  return [...urls];
};

const scoreUrlForWatch = (url, watch) => {
  const lower = url.toLowerCase();
  const refSlug = normalizeReferenceForUrl(watch.reference);
  const refCompact = compactReference(watch.reference);
  const urlCompact = compactReference(url);
  let score = 0;

  if (lower.includes(refSlug)) score += 40;
  if (refCompact.length >= 5 && urlCompact.includes(refCompact)) score += 35;
  if (/\/(watch|watches|timepieces|product|collections?|models?)\//.test(lower)) score += 8;
  if (watch.collection && lower.includes(normalizeReferenceForUrl(watch.collection))) score += 6;
  if (/(press|privacy|service|contact|manual|brochure|store-locator|boutique|retailer|news|journal|blog|faq)/.test(lower)) score -= 20;
  if (/\/(en|en-us|en_us|us-en|global-en|ww-en|eu-en)\//.test(lower)) score += 4;

  return score;
};

const resolveWatchUrl = (watch, sitemapUrls) => {
  const candidates = sitemapUrls
    .map((url) => ({ url, score: scoreUrlForWatch(url, watch) }))
    .filter((candidate) => candidate.score >= 35)
    .sort((a, b) => b.score - a.score || a.url.length - b.url.length);

  return candidates[0]?.url || null;
};

const run = async () => {
  const brandUrls = await readBrandUrls();
  const sitemapCache = new Map();
  const files = (await fs.readdir(DATA_DIR)).filter((file) => file.endsWith('.json')).sort();
  const report = {
    generatedAt: new Date().toISOString(),
    found: [],
    missing: [],
    sitemapCounts: {},
  };

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const watches = JSON.parse(await fs.readFile(filePath, 'utf8'));
    const brand = watches[0]?.brand;
    const officialBaseUrl = brandUrls.get(brand);

    if (!officialBaseUrl) {
      for (const watch of watches) {
        watch.officialUrlStatus = 'missing_brand_url';
        report.missing.push({ file, brand: watch.brand, reference: watch.reference, name: watch.name, reason: 'missing_brand_url' });
      }
      await fs.writeFile(filePath, `${JSON.stringify(watches, null, 2)}\n`);
      continue;
    }

    if (!sitemapCache.has(brand)) {
      process.stdout.write(`Reading official sitemap for ${brand}... `);
      const sitemapUrls = await collectSitemapUrls(officialBaseUrl, watches);
      sitemapCache.set(brand, sitemapUrls);
      report.sitemapCounts[brand] = sitemapUrls.length;
      process.stdout.write(`${sitemapUrls.length} urls\n`);
    }

    const sitemapUrls = sitemapCache.get(brand);

    for (const watch of watches) {
      const officialUrl = resolveWatchUrl(watch, sitemapUrls);

      if (officialUrl) {
        watch.officialUrl = officialUrl;
        delete watch.officialUrlStatus;
        report.found.push({ file, brand: watch.brand, reference: watch.reference, name: watch.name, url: officialUrl });
      } else {
        delete watch.officialUrl;
        watch.officialUrlStatus = 'not_found';
        report.missing.push({ file, brand: watch.brand, reference: watch.reference, name: watch.name, reason: 'not_found' });
      }
    }

    await fs.writeFile(filePath, `${JSON.stringify(watches, null, 2)}\n`);
  }

  await fs.writeFile(REPORT_FILE, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Resolved ${report.found.length} official URLs; ${report.missing.length} models were not found.`);
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
