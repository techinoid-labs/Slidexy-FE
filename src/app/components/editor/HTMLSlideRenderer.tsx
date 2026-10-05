"use client";
import React from 'react';
import { CoverSlideHTML } from '../layouts/CoverSlideHTML';
import { ContentRightImageHTML } from '../layouts/ContentRightImageHTML';
import { ContentLeftImageHTML } from '../layouts/ContentLeftImageHTML';
import { SplitContentHTML } from '../layouts/SplitContentHTML';
import { ComparisonSlideHTML } from '../layouts/ComparisonSlideHTML';
import { InfographicBulletsHTML } from '../layouts/InfographicBulletsHTML';
import { TimelineSlideHTML } from '../layouts/TimelineSlideHTML';
import { QuoteSlideHTML } from '../layouts/QuoteSlideHTML';
import { ConclusionSlideHTML } from '../layouts/ConclusionSlideHTML';
import { FullImageTextOverlayHTML } from '../layouts/FullImageTextOverlayHTML';
import { TemplateHTMLSlide, TEMPLATE_REGISTRY } from '../layouts/TemplateHTMLSlide';
import { SlideSpecRenderer } from '@/templates/SlideSpecRenderer';
import { applyBlockTextEdit } from '@/templates/applyEdit';
import {
    addBlockItem,
    moveBlock,
    removeBlock,
    setBlockValue,
} from '@/templates/mutate';
import { isBlockSlide, themeForSlide } from '@/templates/toDeck';
import { DEFAULT_THEME } from '@/templates/themes';

interface HTMLSlideRendererProps {
    slide: any;
    theme: any;
    isEditing?: boolean;
    onSlideUpdate?: (updatedSlide: any) => void;
    onElementClick?: (elementId: string, elementType: string, elementIndex?: number) => void;
    slideIndex?: number;
    /** Current selection, so block slides can outline the active block. */
    selectedElementId?: string | null;
}

/**
 * Main HTML Slide Renderer
 * Routes to appropriate HTML layout component based on layout_type
 */
export const HTMLSlideRenderer: React.FC<HTMLSlideRendererProps> = ({
    slide,
    theme,
    isEditing = false,
    onSlideUpdate,
    onElementClick,
    slideIndex = 0,
    selectedElementId,
}) => {
    // Block-based template slides own their whole rendering path: the layout,
    // the theme and the editing plumbing all come from the spec. Checked first
    // so it wins over layout_type and templateStyle.
    if (isBlockSlide(slide)) {
        return (
            <SlideSpecRenderer
                spec={slide.blockSpec}
                theme={themeForSlide(slide, DEFAULT_THEME)}
                isEditing={isEditing}
                slideIndex={slideIndex}
                slideNumber={slideIndex + 1}
                selectedElementId={selectedElementId}
                onTextChange={(blockId, path, value) => {
                    if (!onSlideUpdate) return;
                    const nextSpec = applyBlockTextEdit(slide.blockSpec, blockId, path, value);
                    if (nextSpec === slide.blockSpec) return;

                    // Keep slide_title in sync so the carousel, outline and
                    // export filename follow the heading the user just edited.
                    const headingBlock: any = nextSpec.blocks.find((b) => b.type === 'heading');
                    onSlideUpdate({
                        ...slide,
                        blockSpec: nextSpec,
                        slide_title: {
                            ...(slide.slide_title ?? {}),
                            text: headingBlock?.title?.text ?? slide.slide_title?.text ?? '',
                        },
                    });
                }}
                onValueChange={(blockId, path, value) => {
                    if (!onSlideUpdate) return;
                    const nextSpec = setBlockValue(slide.blockSpec, blockId, path, value);
                    if (nextSpec === slide.blockSpec) return;
                    onSlideUpdate({ ...slide, blockSpec: nextSpec });
                }}
                onBlockAction={(blockId, action) => {
                    if (!onSlideUpdate) return;
                    const spec = slide.blockSpec;
                    const block: any = spec.blocks.find((b: any) => b.id === blockId);
                    if (!block) return;

                    // Style toggles cycle through a short list rather than
                    // opening a menu — one click is the whole interaction.
                    const cycle = (list: any[], current: any) =>
                        list[(Math.max(0, list.indexOf(current)) + 1) % list.length];

                    let next = spec;
                    switch (action) {
                        case 'moveUp':   next = moveBlock(spec, blockId, -1); break;
                        case 'moveDown': next = moveBlock(spec, blockId, 1); break;
                        case 'delete':   next = removeBlock(spec, blockId); break;
                        case 'addItem':  next = addBlockItem(spec, blockId); break;
                        case 'duplicate': {
                            const i = spec.blocks.findIndex((b: any) => b.id === blockId);
                            const copy = JSON.parse(JSON.stringify(block));
                            copy.id = `${block.id}-copy-${Math.random().toString(36).slice(2, 6)}`;
                            const blocks = spec.blocks.slice();
                            blocks.splice(i + 1, 0, copy);
                            next = { ...spec, blocks };
                            break;
                        }
                        case 'cycleAlign':
                            next = setBlockValue(spec, blockId, 'style.align',
                                cycle(['left', 'center', 'right'], block.style?.align ?? 'left'));
                            break;
                        case 'cycleColumns':
                            next = setBlockValue(spec, blockId, 'style.columns',
                                cycle([1, 2, 3, 4], block.style?.columns ?? 1));
                            break;
                        case 'cycleCard':
                            next = setBlockValue(spec, blockId, 'style.cardStyle',
                                cycle(['flat', 'outlined', 'elevated', 'tinted', 'brutalist'],
                                      block.style?.cardStyle ?? 'outlined'));
                            break;
                    }
                    if (next === spec) return;
                    onSlideUpdate({ ...slide, blockSpec: next });
                }}
                onSelect={(elementId) => onElementClick?.(elementId, 'text', -1)}
            />
        );
    }

    const layoutType = slide.layout_type || 'cover-hero';

    // ✅ FIX: Determine which variant to render. 
    // If slide has variantNumber (it's a variant object from preview), use it.
    // Otherwise use currentVariantIndex from the main slide object.
    const variantIndex = typeof slide.variantNumber === 'number'
        ? slide.variantNumber - 1
        : (slide.currentVariantIndex ?? 0);

    // Extract the current variant slide (or use original if no variants)
    let currentSlide = slide;
    if (slide.layouts && slide.layouts.length > 0) {
        const variant = slide.layouts[variantIndex];
        if (variant) {
            // Extract user-added elements (those with userAdded: true or specific ID patterns)
            const userElements = (slide.elements || []).filter((el: any) => {
                // 1. Elements marked with userAdded property
                if (el.userAdded === true || el.properties?.userAdded === true) return true;

                // 2. Elements with known user-generated ID prefixes
                const id = el.id || el.shape_id || el.properties?.shape_id || el.properties?.image_id || el.image_id;
                if (typeof id === "string") {
                    if (id.startsWith("user-")) return true;
                    if (id.startsWith("el-")) return true;
                    if (id.startsWith("img-")) return true;
                }

                // 3. Fallback for specific element types
                if (el.element_type === 'shape' || el.element_type === 'image') return true;

                return false;
            });

            // Merge variant properties with original slide structure
            currentSlide = {
                ...slide,
                // Override with variant-specific data
                slide_title: variant.slide_title || slide.slide_title,
                subtitle: variant.subtitle || slide.subtitle,
                // ✅ FIX: Combine variant elements with user-added elements (deduplicated by multiple ID fields)
                elements: [
                    ...(variant.elements || []),
                    ...userElements.filter((ue: any) => {
                        const ueId = ue.id || ue.shape_id || ue.properties?.shape_id || ue.properties?.image_id || ue.image_id;
                        return !(variant.elements || []).some((ve: any) => {
                            const veId = ve.id || ve.shape_id || ve.properties?.shape_id || ve.properties?.image_id || ve.image_id;
                            return ueId && veId && ueId === veId;
                        });
                    })
                ],
                image_url: variant.image_url || slide.image_url,
                background: variant.background || slide.background,
            };
            console.log(`[HTMLSlideRenderer] Merged ${currentSlide.elements.length} elements (User: ${userElements.length}, Variant: ${variant.elements?.length || 0})`);
        }
    }

    const commonProps = {
        slide: currentSlide, // ✅ Pass current variant slide, not original
        theme,
        isEditing,
        onSlideUpdate,
        variant: (variantIndex + 1) as any  // supports 1-10 variants
    };

    console.log(`[HTMLSlideRenderer] Rendering ${layoutType} with variant ${commonProps.variant} (currentVariantIndex: ${variantIndex})`);

    // Template styles override the layout-type system entirely
    if (currentSlide.templateStyle && TEMPLATE_REGISTRY[currentSlide.templateStyle]) {
        return (
            <TemplateHTMLSlide
                slide={currentSlide}
                templateStyle={currentSlide.templateStyle}
                slideIndex={slideIndex}
                isEditing={isEditing}
                onSlideUpdate={onSlideUpdate}
            />
        );
    }

    // Render based on layout type
    switch (layoutType) {
        case 'cover-hero':
            return <CoverSlideHTML {...commonProps} onElementClick={onElementClick} slideIndex={slideIndex} />;

        case 'content-right-image':
            return <ContentRightImageHTML {...commonProps} onElementClick={onElementClick} slideIndex={slideIndex} />;

        case 'content-left-image':
            return <ContentLeftImageHTML {...commonProps} onElementClick={onElementClick} slideIndex={slideIndex} />;

        case 'content-split':
            return <SplitContentHTML {...commonProps} onElementClick={onElementClick} slideIndex={slideIndex} />;

        case 'comparison-slide':
            return <ComparisonSlideHTML {...commonProps} variant={Math.min(3, variantIndex + 1) as 1 | 2 | 3} onElementClick={onElementClick} slideIndex={slideIndex} />;

        case 'infographic-bullets':
            return <InfographicBulletsHTML {...commonProps} variant={(variantIndex + 1) as 1 | 2 | 3 | 4 | 5} onElementClick={onElementClick} slideIndex={slideIndex} />;

        case 'timeline-slide':
            return <TimelineSlideHTML {...commonProps} onElementClick={onElementClick} slideIndex={slideIndex} />;

        case 'quote-slide':
            return <QuoteSlideHTML {...commonProps} onElementClick={onElementClick} slideIndex={slideIndex} />;

        case 'conclusion':
        case 'call-to-action':
            return <ConclusionSlideHTML {...commonProps} onElementClick={onElementClick} slideIndex={slideIndex} />;

        case 'full-image-text-overlay':
            return <FullImageTextOverlayHTML {...commonProps} onElementClick={onElementClick} slideIndex={slideIndex} />;

        default:
            // Fallback for unknown layouts
            return (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center p-8">
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">
                            {slide.slide_title?.text || 'Slide'}
                        </h2>
                        <p className="text-gray-500">
                            Layout: {layoutType}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            Unknown layout type
                        </p>
                    </div>
                </div>
            );
    }
};
