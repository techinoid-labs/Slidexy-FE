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

interface HTMLSlideRendererProps {
    slide: any;
    theme: any;
    isEditing?: boolean;
    onSlideUpdate?: (updatedSlide: any) => void;
    onElementClick?: (elementId: string, elementType: string, elementIndex?: number) => void;
    slideIndex?: number;
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
}) => {
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
            const userShapes = (slide.elements || []).filter((el: any) =>
                el.properties?.userAdded === true ||
                (el.element_type === 'shape' && el.shape_id?.startsWith('user-')) ||
                (el.element_type === 'image' && el.properties?.image_id) ||
                (el.element_type === 'text' && el.id?.startsWith('user-'))
            );

            // Merge variant properties with original slide structure
            currentSlide = {
                ...slide,
                // Override with variant-specific data
                slide_title: variant.slide_title || slide.slide_title,
                subtitle: variant.subtitle || slide.subtitle,
                // Combine variant elements with user-added shapes (deduplicated by shape_id)
                elements: [
                    ...(variant.elements || []),
                    ...userShapes.filter((us: any) =>
                        !(variant.elements || []).some((ve: any) => ve.shape_id === us.shape_id)
                    )
                ],
                image_url: variant.image_url || slide.image_url,
                background: variant.background || slide.background,
            };
        }
    }

    const commonProps = {
        slide: currentSlide, // ✅ Pass current variant slide, not original
        theme,
        isEditing,
        onSlideUpdate,
        variant: (variantIndex + 1) as 1 | 2 | 3 | 4 | 5
    };

    console.log(`[HTMLSlideRenderer] Rendering ${layoutType} with variant ${commonProps.variant} (currentVariantIndex: ${variantIndex})`);

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
