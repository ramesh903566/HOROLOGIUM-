import fs from 'fs';
import path from 'path';

const dataDir = 'public/data';
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const missing = data.filter(item => !item.image || item.image.trim() === '');
  if (missing.length > 0) {
    console.log(`${file}: ${missing.length} / ${data.length} missing images`);
  } else {
    console.log(`${file}: All ${data.length} have images`);
  }
});
