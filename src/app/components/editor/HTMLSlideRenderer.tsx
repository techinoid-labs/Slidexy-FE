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

    // Get current variant index
    const variantIndex = slide.currentVariantIndex ?? 0;

    const commonProps = {
        slide,
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
