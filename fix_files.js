
const fs = require('fs');

// 1. Fix QuoteSlideHTML.tsx (Variant 2)
function fixQuoteSlide() {
    const path = 'd:/slidexy-frontend/slidesX-FE - Copy/src/app/components/layouts/QuoteSlideHTML.tsx';
    let content = fs.readFileSync(path, 'utf8');

    const target = '                        <AuthorContent />\n                        <ContextContent />\n                    </div>\n                </div>\n            </div>';
    const replacement = '                        <AuthorContent />\n                        <ContextContent />\n                    </div>\n                </div>\n                <UserElementsRenderer\n                    elements={slide.elements || []}\n                    isEditing={isEditing}\n                    onElementClick={onElementClick}\n                    onElementUpdate={handleElementUpdate}\n                    slideIndex={slideIndex}\n                />\n            </div>';

    if (content.includes(target)) {
        content = content.replace(target, replacement);
        fs.writeFileSync(path, content, 'utf8');
        console.log('Fixed QuoteSlideHTML.tsx Variant 2');
    } else {
        console.log('Target not found in QuoteSlideHTML.tsx Variant 2');
    }
}

// 2. Fix ConclusionSlideHTML.tsx (Variant 1 and 2)
function fixConclusionSlide() {
    const path = 'd:/slidexy-frontend/slidesX-FE - Copy/src/app/components/layouts/ConclusionSlideHTML.tsx';
    let content = fs.readFileSync(path, 'utf8');

    // Variant 1
    const target1 = '                    })}\n                </div>\n            </div>';
    const replacement1 = '                    })}\n                </div>\n                <UserElementsRenderer\n                    elements={slide.elements || []}\n                    isEditing={isEditing}\n                    onElementClick={onElementClick}\n                    onElementUpdate={handleElementUpdate}\n                    slideIndex={slideIndex}\n                />\n            </div>';

    // Variant 2
    const target2 = '                    })}\n                </div>\n            </div>'; // This might be used in multiple variants, be careful

    // Let's use more context for Variant 1 and 2
    // Variant 1 end is after the map loop at the end of its div
    // Variant 2 end is also after its map loop.

    // I already successfully added Variant 3, 4, 5.
    // Let's do a global replace for all variants that are missing it.
    // But safely.

    const variantEnd = '                </div>\n            </div>\n        );\n    }';
    const variantReplacement = '                </div>\n                <UserElementsRenderer\n                    elements={slide.elements || []}\n                    isEditing={isEditing}\n                    onElementClick={onElementClick}\n                    onElementUpdate={handleElementUpdate}\n                    slideIndex={slideIndex}\n                />\n            </div>\n        );\n    }';

    let count = 0;
    while (content.includes(variantEnd)) {
        content = content.replace(variantEnd, variantReplacement);
        count++;
    }

    if (count > 0) {
        fs.writeFileSync(path, content, 'utf8');
        console.log(`Updated ${count} variants in ConclusionSlideHTML.tsx`);
    } else {
        console.log('No targets found in ConclusionSlideHTML.tsx');
    }
}

// 3. Fix ThemePallete.tsx
function fixThemePallete() {
    const path = 'd:/slidexy-frontend/slidesX-FE - Copy/src/app/components/modify-presentation/ThemePallete.tsx';
    let content = fs.readFileSync(path, 'utf8');

    const target = '    }\n  };';
    const replacement = '    }\n\n    // Reset background color if it exists\n    if (item.background) {\n      item.background = { ...item.background, color: null }; // setting to null allows theme color to take over\n    }\n  };';

    // We only want to replace the first occurrence which is in updateContent
    if (content.includes(target)) {
        content = content.replace(target, replacement);
        fs.writeFileSync(path, content, 'utf8');
        console.log('Fixed ThemePallete.tsx updateContent');
    } else {
        console.log('Target not found in ThemePallete.tsx');
    }
}

fixQuoteSlide();
fixConclusionSlide();
fixThemePallete();
