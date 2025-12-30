
const fs = require('fs');
const files = [
    'd:/slidexy-frontend/slidesX-FE - Copy/src/app/components/layouts/ConclusionSlideHTML.tsx',
    'd:/slidexy-frontend/slidesX-FE - Copy/src/app/components/modify-presentation/ThemePallete.tsx',
    'd:/slidexy-frontend/slidesX-FE - Copy/src/app/components/layouts/QuoteSlideHTML.tsx'
];

files.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        const cleaned = content.split(/\r?\n/).map(line => line.trimEnd()).join('\n');
        fs.writeFileSync(file, cleaned, 'utf8');
        console.log(`Cleaned ${file}`);
    } catch (e) {
        console.error(`Error cleaning ${file}: ${e.message}`);
    }
});
