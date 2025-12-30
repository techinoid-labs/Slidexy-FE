const fs = require('fs');
const path = require('path');

const layoutsDir = path.join('d:', 'slidexy-frontend', 'slidesX-FE - Copy', 'src', 'app', 'components', 'layouts');
const files = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.tsx'));

const preambles = {
    'InfographicBulletsHTML.tsx': (num) => `if (variant === ${num}) {\n        const gridCols = bullets.length <= 2 ? 2 : bullets.length === 3 ? 3 : 2;\n\n        return (\n            `,
    'TimelineSlideHTML.tsx': (num) => `if (variant === ${num}) {\n        return (\n            `,
    'ConclusionSlideHTML.tsx': (num) => `if (variant === ${num}) {\n        return (\n            `,
    'QuoteSlideHTML.tsx': (num) => `if (variant === ${num}) {\n        return (\n            `,
    'SplitContentHTML.tsx': (num) => `if (variant === ${num}) {\n        return (\n            `,
    'ContentRightImageHTML.tsx': (num) => `if (variant === ${num}) {\n        return (\n            `,
    'ContentLeftImageHTML.tsx': (num) => `if (variant === ${num}) {\n        return (\n            `,
};

files.forEach(file => {
    const filePath = path.join(layoutsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Search for variant header and followed by <div without if/return
    // We match the header and the div start
    const regex = /(\/\/ Variant (\d+):[^\n]*\n\s*)(<div\s+style={{)/g;

    content = content.replace(regex, (match, header, num, divStart) => {
        // Check if if statement is missing immediately after header
        const remaining = content.substring(content.indexOf(match) + header.length);
        if (!remaining.startsWith('if (variant')) {
            changed = true;
            const preambleFn = preambles[file] || ((n) => `if (variant === ${n}) {\n        return (\n            `);
            return `${header}${preambleFn(num)}${divStart}`;
        }
        return match;
    });

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Repaired ${file}`);
    } else {
        console.log(`No repair needed for ${file}`);
    }
});
