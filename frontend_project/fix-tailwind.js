import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const replacements = [
  { search: /z-\[100\]/g, replace: 'z-100' },
  { search: /z-\[9999\]/g, replace: 'z-9999' },
  { search: /flex-\[2\]/g, replace: 'flex-2' },
  { search: /flex-shrink-0/g, replace: 'shrink-0' },
  { search: /\bflex-grow\b/g, replace: 'grow' },
  // Remove duplicates/conflicts
  { search: /\bh-5\s+h-6\b/g, replace: 'h-5' },
  { search: /\bh-6\s+h-5\b/g, replace: 'h-5' },
  { search: /\bleading-none\s+leading-none\b/g, replace: 'leading-none' },
  { search: /\btracking-wide\s+tracking-widest\b/g, replace: 'tracking-wide' },
  { search: /\btracking-widest\s+tracking-wide\b/g, replace: 'tracking-wide' },
];

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    replacements.forEach(({ search, replace }) => {
      content = content.replace(search, replace);
    });
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  }
});
