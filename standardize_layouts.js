const fs = require('fs');
const path = require('path');

const layoutsDir = path.join('d:', 'slidexy-frontend', 'slidesX-FE - Copy', 'src', 'app', 'components', 'layouts');
const files = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
    const filePath = path.join(layoutsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Ensure position: 'relative' is in all variant roots
    // Capture the preamble (if, code, return) and the div start
    const variantRegex = /(if\s*\(variant\s*===\s*\d+\)\s*{[\s\S]*?return\s*\(\s*)(<div\s+style={{)([\s\S]*?)(}})/g;

    content = content.replace(variantRegex, (match, preamble, divStart, styleProps, divEnd) => {
        if (!styleProps.includes("position: 'relative'") && !styleProps.includes('position: "relative"')) {
            changed = true;
            // Insert position: 'relative' after the first {
            return `${preamble}${divStart}\n                position: 'relative',${styleProps}${divEnd}`;
        }
        return match;
    });

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
    } else {
        console.log(`No changes needed for ${file}`);
    }
});
