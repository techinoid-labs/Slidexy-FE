const fs = require('fs');
const path = require('path');

const layoutsDir = path.join('d:', 'slidexy-frontend', 'slidesX-FE - Copy', 'src', 'app', 'components', 'layouts');
const files = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
    // Skip CoverSlideHTML as it's already working
    if (file === 'CoverSlideHTML.tsx') return;

    const filePath = path.join(layoutsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Look for <div style={{ ... position: 'relative'
    // We want to add data-slide-container attribute to that div.
    // Regex matches the opening tag <div followed by style={{
    const regex = /(<div)(\s+style={{)/g;

    // We only want to substitute the ROOT div of each variant.
    // The previously added 'position: relative' is a strong signal, but regex above is broader.
    // But since we standardized all variants to have style={{ ... position: 'relative' ... }},
    // we can look for that pattern?
    // Actually, simpler: replace `<div style={{` with `<div data-slide-container style={{`
    // BUT only for the root divs.
    // The roots are usually the first thing in the return statement.
    // Regex: `return (\n\s*)<div style={{`

    const rootDivRegex = /(return\s*\(\s*)<div\s+style={{/g;

    content = content.replace(rootDivRegex, (match, p1) => {
        changed = true;
        return `${p1}<div data-slide-container style={{`;
    });

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
    } else {
        console.log(`No changes needed for ${file}`);
    }
});
