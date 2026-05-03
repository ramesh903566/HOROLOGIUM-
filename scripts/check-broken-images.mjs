import fs from 'fs';
import path from 'path';
import https from 'https';

const dataDir = 'public/data';
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

async function checkUrl(url) {
  if (!url || !url.startsWith('http')) return false;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => resolve(false));
  });
}

async function run() {
  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`Checking ${file}...`);
    const results = await Promise.all(data.map(item => checkUrl(item.image)));
    const broken = results.filter(ok => !ok).length;
    console.log(`${file}: ${broken} / ${data.length} broken images`);
  }
}

run();
