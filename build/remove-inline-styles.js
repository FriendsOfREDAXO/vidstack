#!/usr/bin/env node

/**
 * Post-build script to remove inline styles for CSP compliance
 * This script removes inline style attributes that violate Content Security Policy
 */

const fs = require('fs');
const path = require('path');

const files = [
  './dist/vidstack.js',
  './dist/vs_js_out.js'
];

console.log('Removing inline styles for CSP compliance...\n');

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remove pointer-events: none inline style
  const beforePointerEvents = content;
  content = content.replace(
    /(<media-controls-group[^>]*class="vds-controls-group"[^>]*)\s+style="pointer-events:\s*none;?"/gi,
    '$1'
  );
  if (content !== beforePointerEvents) {
    console.log(`✓ Removed pointer-events inline style from ${file}`);
    modified = true;
  }

  // Remove max-width: unset inline style
  const beforeMaxWidth = content;
  content = content.replace(
    /(<video[^>]*)\s+style="max-width:\s*unset;?"/gi,
    '$1'
  );
  if (content !== beforeMaxWidth) {
    console.log(`✓ Removed max-width inline style from ${file}`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated ${file}\n`);
  } else {
    console.log(`ℹ No inline styles found in ${file}\n`);
  }
});

console.log('Done! All inline styles removed for CSP compliance.');
