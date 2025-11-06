#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..'); // client
const srcDir = path.join(root, 'src');
const exts = ['.js', '.jsx', '.ts', '.tsx', '.css', '.html'];

function walk(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      // skip node_modules and .git
      if (e.name === 'node_modules' || e.name === '.git') continue;
      walk(full, fileList);
    } else if (exts.includes(path.extname(e.name).toLowerCase())) {
      fileList.push(full);
    }
  }
  return fileList;
}

function fileExists(p) {
  try { return fs.statSync(p).isFile(); } catch (e) { return false; }
}

const importRegex = /(["'`])((?:\.\.\/|\.\/)[^"'`]+?)\.(png|jpg|jpeg)\1/gi;
const urlRegex = /url\((['"]?)([^)'"]+?)\.(png|jpg|jpeg)\1?\)/gi;

const files = walk(srcDir);
const report = { changed: [], skipped: [] };

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  let replacements = 0;

  // handle import-like / string occurrences (./path/file.png or ../path/file.jpg)
  content = content.replace(importRegex, (fullMatch, quote, relPathNoExt, ext) => {
    const rel = relPathNoExt + '.webp';
    const abs = path.resolve(path.dirname(file), rel);
    if (fileExists(abs)) {
      replacements++;
      return quote + rel + quote;
    } else {
      report.skipped.push({ file, match: fullMatch });
      return fullMatch;
    }
  });

  // handle url(...) occurrences
  content = content.replace(urlRegex, (fullMatch, quote, relPathNoExt, ext) => {
    // relPathNoExt may be absolute or relative; we only update relative paths
    // if it starts with http or data:, skip
    if (/^https?:|^data:/i.test(relPathNoExt)) return fullMatch;
    const rel = relPathNoExt + '.webp';
    const abs = path.resolve(path.dirname(file), rel);
    if (fileExists(abs)) {
      replacements++;
      return `url(${quote}${rel}${quote})`;
    } else {
      report.skipped.push({ file, match: fullMatch });
      return fullMatch;
    }
  });

  if (replacements > 0 && content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    report.changed.push({ file, replacements });
  }
}

// Print summary
console.log('\n=== convert-image-imports-to-webp.cjs run complete ===');
console.log(`Scanned files: ${files.length}`);
console.log(`Files changed: ${report.changed.length}`);
for (const c of report.changed) console.log(`  CHANGED: ${c.file} (replacements: ${c.replacements})`);
console.log(`Entries skipped (no .webp found at resolved path): ${report.skipped.length}`);
if (report.skipped.length > 0) {
  // show at most 20 skipped to avoid flooding
  const show = report.skipped.slice(0, 20);
  console.log('\nSample skipped entries (file, matched string):');
  for (const s of show) console.log(`  ${s.file} -> ${s.match}`);
  if (report.skipped.length > show.length) console.log(`  ...and ${report.skipped.length - show.length} more`);
}
console.log('\nNote: Only relative imports like ./... or ../... are updated. Remote URLs and data: URIs are left unchanged.');
console.log('If you want the script to also add .webp fallbacks or copy/convert missing webp files, run it with changes accordingly.');

process.exit(0);
