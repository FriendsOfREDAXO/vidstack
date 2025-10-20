import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// JS Dateien zusammenführen (gleich für Frontend und Backend)
const jsFiles = [
    join(__dirname, 'dist/vidstack.js'),
    join(__dirname, 'dist/vidstack_helper.min.js')
];

const jsContent = jsFiles.map(file => readFileSync(file, 'utf8')).join('\n');
writeFileSync(join(__dirname, '../assets/vidstack.min.js'), jsContent);

console.log('✓ Merged vidstack.min.js (Frontend + Backend)');

// CSS Dateien zusammenführen (gleich für Frontend und Backend)
const cssFiles = [
    join(__dirname, 'dist/vidstack.css'),
    join(__dirname, 'dist/vidstack_helper.min.css')
];

const cssContent = cssFiles.map(file => readFileSync(file, 'utf8')).join('\n');
writeFileSync(join(__dirname, '../assets/vidstack.min.css'), cssContent);

console.log('✓ Merged vidstack.min.css (Frontend + Backend)');
