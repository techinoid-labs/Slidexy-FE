"use client";
import React from 'react';
import { EditableElement } from '../editor/EditableElement';
import { UserElementsRenderer } from '../editor/UserElementsRenderer';
import { getContrastTextColor } from '@/utils/colorUtils';
import { v4 as uuidv4 } from 'uuid';

interface QuoteSlideHTMLProps {
    slide: any;
    theme: any;
    variant?: 1 | 2 | 3 | 4 | 5;
    isEditing?: boolean;
    onSlideUpdate?: (updatedSlide: any) => void;
    onElementClick?: (elementId: string, elementType: string, elementIndex?: number) => void;
    slideIndex?: number;
}

/**
 * Premium Quote Slide - Multiple elegant variants
 * Properly extracts quote, author, and context from backend data
 */
export const QuoteSlideHTML: React.FC<QuoteSlideHTMLProps> = ({
    slide,
    theme,
    variant = 1,
    isEditing = false,
    onSlideUpdate,
    onElementClick,
    slideIndex = 0
}) => {
    // Helper to update elements - creates them if they don't exist and syncs to variants
    const handleUpdate = (type: string, newText: string) => {
        if (!onSlideUpdate) return;

        const elements = slide.elements || [];
        const existingElementIndex = elements.findIndex((el: any) => el.element_type === type);

        let updatedElements;

        if (existingElementIndex >= 0) {
            // Element exists, update it
            updatedElements = elements.map((el: any, idx: number) => {
                if (idx === existingElementIndex) {
                    return { ...el, text: newText };
                }
                return el;
            });
        } else {
            // Element doesn't exist, create it
            const elementId = `${type}-${uuidv4()}`;
            const newElement = {
                id: elementId,
                element_type: type,
                text: newText,
                userAdded: true,
                properties: {
                    id: elementId,
                    fontSize: type === 'quote' ? 32 : type === 'author' ? 24 : 18,
                    fontFamily: 'Raleway',
                    fill: type === 'author' ? (theme?.artPalette?.[0] || '#00C4B4') : '#000000',
                    fontWeight: type === 'author' ? '600' : type === 'quote' ? '300' : 'normal',
                    fontStyle: type === 'quote' ? 'italic' : 'normal',
                    userAdded: true,
                },
            };
            updatedElements = [...elements, newElement];
        }

        // ✅ FIX: Update both original slide and current variant to keep indices in sync
        const updatedSlide = { ...slide, elements: updatedElements };

        // If there are variants, update the current variant too
        // This ensures indices match between original and variant slides for TextPanel compatibility
        if (slide.layouts && slide.layouts.length > 0) {
            const variantIndex = slide.currentVariantIndex ?? 0;
            const updatedLayouts = [...slide.layouts];
            const variant = updatedLayouts[variantIndex];

            if (variant) {
                const variantElements = variant.elements || [];
                const variantElIndex = variantElements.findIndex((el: any) => el.element_type === type);

                if (variantElIndex >= 0) {
                    // Update existing element in variant
                    updatedLayouts[variantIndex] = {
                        ...variant,
                        elements: variantElements.map((el: any, idx: number) => {
                            if (idx === variantElIndex) {
                                return { ...el, text: newText };
                            }
                            return el;
                        })
                    };
                } else {
                    // Create element in variant at same position
                    updatedLayouts[variantIndex] = {
                        ...variant,
                        elements: [...variantElements, structuredClone(updatedElements[updatedElements.length - 1])]
                    };
                }
            }

            updatedSlide.layouts = updatedLayouts;
        }

        onSlideUpdate(updatedSlide);
    };

    const handleElementUpdate = (index: number, updates: any) => {
        if (!onSlideUpdate) return;

        // ✅ FIX: Update both original slide and variant slide elements
        const updatedSlide = { ...slide };
        const updatedElements = [...(slide.elements || [])];

        if (updatedElements[index]) {
            updatedElements[index] = { ...updatedElements[index], ...updates };
            updatedSlide.elements = updatedElements;

            // Also update variant if it exists
            if (slide.layouts && slide.layouts.length > 0) {
                const variantIndex = slide.currentVariantIndex ?? 0;
                const updatedLayouts = [...slide.layouts];
                if (updatedLayouts[variantIndex] && updatedLayouts[variantIndex].elements) {
                    const variantElements = [...updatedLayouts[variantIndex].elements];
                    // Find the same element in variant by element_type (to handle index mismatches)
                    const elementType = updatedElements[index].element_type;
                    const variantElIdx = variantElements.findIndex((el: any) => el.element_type === elementType);
                    if (variantElIdx >= 0) {
                        variantElements[variantElIdx] = { ...variantElements[variantElIdx], ...updates };
                        updatedLayouts[variantIndex] = {
                            ...updatedLayouts[variantIndex],
                            elements: variantElements
                        };
                    }
                }
                updatedSlide.layouts = updatedLayouts;
            }
        }

        onSlideUpdate(updatedSlide);
    };

    // Extract quote data from elements array (backend structure)
    // ✅ FIX: Check elements array first, then top-level fields, then fallbacks
    const quoteElement = slide.elements?.find((el: any) => el.element_type === 'quote');
    const authorElement = slide.elements?.find((el: any) => el.element_type === 'author');
    const contextElement = slide.elements?.find((el: any) => el.element_type === 'context');

    // ✅ FIX: Ensure elements have properties objects so text panel can update them
    // Returns null if element is missing so fallbacks work correctly
    const getElementProperties = (element: any) => {
        return element?.properties;
    };

    const quoteProps = getElementProperties(quoteElement);
    const authorProps = getElementProperties(authorElement);
    const contextProps = getElementProperties(contextElement);

    // Default quotes for variants
    const defaultQuotes = [
        { quote: "\"The only way to do great work is to love what you do.\"", author: "Steve Jobs", context: "Apple Inc. Co-founder" },
        { quote: "\"Innovation distinguishes between a leader and a follower.\"", author: "Steve Jobs", context: "Apple Inc. Co-founder" },
        { quote: "\"Your time is limited, so don't waste it living someone else's life.\"", author: "Steve Jobs", context: "Apple Inc. Co-founder" },
        { quote: "\"Stay hungry, stay foolish.\"", author: "Steve Jobs", context: "Apple Inc. Co-founder" },
        { quote: "\"The best way to predict the future is to create it.\"", author: "Peter Drucker", context: "Management Consultant" },
    ];

    const defaultIndex = (variant || 1) - 1;
    const defaultQuote = defaultQuotes[defaultIndex % defaultQuotes.length];

    // ✅ FIX: Prepare values with proper fallback chain:
    // 1. Check elements array (quoteElement?.text)
    // 2. Check top-level slide.quote/author/context fields (from backend)
    // 3. Fall back to defaults
    const quoteText = quoteElement?.text || slide.quote || slide.slide_title?.text || defaultQuote.quote;
    const authorText = authorElement?.text || slide.author || defaultQuote.author;
    const contextText = contextElement?.text || slide.context || defaultQuote.context;

    // Use theme colors or fallback to defaults
    const bgColor = theme?.backgroundColor || '#111827';
    const primaryColor = theme?.primaryColor || '#6c5ce7';
    const accentColor = theme?.artPalette?.[0] || '#00C4B4';
    const accent2Color = theme?.artPalette?.[1] || '#7C3AED';

    // ✅ FIX: Helper to find element index that works with TextPanel
    // TextPanel reads from variant slide (getCurrentVariantSlide) but updates original slide
    // The key insight: TextPanel uses elementIndex from the ID (el-slideIndex-elementIndex)
    // and reads from currentSlide.elements[elementIndex] (variant slide)
    // but updates originalSlide.elements[elementIndex] (original slide)
    // So we need indices that work for BOTH the variant slide (for reading) AND original slide (for writing)
    // Since variant slides preserve quote/author/context elements, indices should match
    const findElementIndexForTextPanel = (elementType: string): number => {
        // Find in current slide's elements array (which might be merged variant)
        const elements = slide.elements || [];
        let idx = elements.findIndex((el: any) => el.element_type === elementType);

        // If found, use that index - it should work for both variant and original
        // because variant slides preserve these elements at the same positions
        if (idx >= 0) {
            return idx;
        }

        // If not found and we have layouts, check the variant directly
        // This handles the case where element exists in variant but not yet merged
        if (slide.layouts && slide.layouts.length > 0) {
            const variantIndex = slide.currentVariantIndex ?? 0;
            const variant = slide.layouts[variantIndex];
            if (variant && variant.elements) {
                idx = variant.elements.findIndex((el: any) => el.element_type === elementType);
                if (idx >= 0) {
                    return idx;
                }
            }
        }

        return -1; // Not found
    };

    // ✅ FIX: Pre-calculate indices for TextPanel compatibility
    const quoteIdx = findElementIndexForTextPanel('quote');
    const authorIdx = findElementIndexForTextPanel('author');
    const contextIdx = findElementIndexForTextPanel('context');

    // Variant 1: Glassmorphism with Large Quotation Marks (Dark Text)
    if (variant === 1) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: '4rem',
                background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
                fontFamily: "'Raleway', sans-serif",
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '8%',
                    fontSize: '15rem',
                    color: 'rgba(0, 0, 0, 0.03)',
                    fontFamily: 'Georgia, serif',
                    lineHeight: 1,
                    userSelect: 'none'
                }}>"</div>
                <div style={{
                    position: 'absolute',
                    bottom: '5%',
                    right: '8%',
                    fontSize: '15rem',
                    color: 'rgba(0, 0, 0, 0.03)',
                    fontFamily: 'Georgia, serif',
                    lineHeight: 1,
                    transform: 'rotate(180deg)',
                    userSelect: 'none'
                }}>"</div>

                <div style={{
                    position: 'absolute',
                    top: '20%',
                    right: '15%',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)`,
                    filter: 'blur(40px)',
                }} />

                <div style={{
                    zIndex: 2,
                    maxWidth: '900px',
                    width: '100%',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.6)',
                    padding: '3.5rem',
                    borderRadius: '24px',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                }}>
                    <EditableElement
                        id={quoteElement?.id || quoteElement?.properties?.id || (quoteIdx >= 0 ? `el-${slideIndex}-${quoteIdx}` : `quote-${slideIndex}`)}
                        text={quoteText}
                        tagName="blockquote"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('quote', val)}
                        onSelectElement={() => {
                            const qId = quoteElement?.id || quoteElement?.properties?.id;
                            if (qId) {
                                onElementClick?.(qId, 'text', quoteIdx);
                            } else if (quoteIdx >= 0) {
                                onElementClick?.(`el-${slideIndex}-${quoteIdx}`, 'text', quoteIdx);
                            } else {
                                onElementClick?.(`quote-${slideIndex}`, 'text', -1);
                            }
                        }}
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: 300,
                            color: '#000000',
                            lineHeight: 1.5,
                            margin: '0 0 1.5rem',
                            fontStyle: 'italic',
                            letterSpacing: '-0.01em',
                            textAlign: 'center',
                            width: '100%',
                            maxWidth: '100%',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            padding: '0 1rem',
                            boxSizing: 'border-box'
                        }}
                        elementProperties={quoteProps || slide.slide_title?.properties || {}}
                    />
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1.5rem' }}>
                        <div style={{
                            width: '100px',
                            height: '4px',
                            background: `linear-gradient(90deg, ${accentColor} 0%, ${accent2Color} 100%)`,
                            marginBottom: '1.5rem',
                            borderRadius: '2px',
                        }} />
                        <EditableElement
                            id={authorElement?.id || authorElement?.properties?.id || (authorIdx >= 0 ? `el-${slideIndex}-${authorIdx}` : `author-${slideIndex}`)}
                            text={authorText}
                            tagName="cite"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('author', val)}
                            onSelectElement={() => {
                                const aId = authorElement?.id || authorElement?.properties?.id;
                                if (aId) {
                                    onElementClick?.(aId, 'text', authorIdx);
                                } else if (authorIdx >= 0) {
                                    onElementClick?.(`el-${slideIndex}-${authorIdx}`, 'text', authorIdx);
                                } else {
                                    onElementClick?.(`author-${slideIndex}`, 'text', -1);
                                }
                            }}
                            style={{
                                fontSize: '1.4rem',
                                fontWeight: 600,
                                color: accentColor,
                                fontStyle: 'normal',
                                display: 'block',
                                marginBottom: '0.5rem',
                                textAlign: 'center',
                                width: '100%'
                            }}
                            elementProperties={authorProps || slide.subtitle?.properties || {}}
                        />
                        <EditableElement
                            id={contextElement?.id || contextElement?.properties?.id || (contextIdx >= 0 ? `el-${slideIndex}-${contextIdx}` : `context-${slideIndex}`)}
                            text={contextText}
                            tagName="p"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('context', val)}
                            onSelectElement={() => {
                                const cId = contextElement?.id || contextElement?.properties?.id;
                                if (cId) {
                                    onElementClick?.(cId, 'text', contextIdx);
                                } else if (contextIdx >= 0) {
                                    onElementClick?.(`el-${slideIndex}-${contextIdx}`, 'text', contextIdx);
                                } else {
                                    onElementClick?.(`context-${slideIndex}`, 'text', -1);
                                }
                            }}
                            style={{
                                fontSize: '1.05rem',
                                fontWeight: 'normal',
                                color: '#000000',
                                margin: 0,
                                lineHeight: 1.5,
                                textAlign: 'center',
                                width: '100%',
                                opacity: 0.8
                            }}
                            elementProperties={contextProps || {}}
                        />
                    </div>
                </div>
                <UserElementsRenderer
                    elements={slide.elements || []}
                    isEditing={isEditing}
                    onElementClick={onElementClick}
                    onElementUpdate={handleElementUpdate}
                    slideIndex={slideIndex}
                />
            </div>
        );
    }

    // Variant 2: Minimalist Centered
    if (variant === 2) {
        return (
            <div style={{
                position: 'relative',
                display: 'flex',
                height: '100%',
                background: bgColor,
                fontFamily: "'Raleway', sans-serif",
                padding: '4rem',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{ textAlign: 'center', maxWidth: '800px', width: '100%', padding: '0 1rem', boxSizing: 'border-box', overflow: 'hidden' }}>
                    <div style={{ fontSize: '4rem', color: accentColor, lineHeight: 0.5, marginBottom: '2rem' }}>“</div>
                    <EditableElement
                        id={quoteIdx >= 0 ? `el-${slideIndex}-${quoteIdx}` : `quote-${slideIndex}`}
                        text={quoteText}
                        tagName="blockquote"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('quote', val)}
                        onSelectElement={() => {
                            if (quoteIdx >= 0) {
                                onElementClick?.(`el-${slideIndex}-${quoteIdx}`, 'text', quoteIdx);
                            } else {
                                onElementClick?.(`quote-${slideIndex}`, 'text', -1);
                            }
                        }}
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: 300,
                            color: '#000000',
                            lineHeight: 1.5,
                            margin: '0 0 1.5rem',
                            fontStyle: 'italic',
                            letterSpacing: '-0.01em',
                            textAlign: 'center',
                            width: '100%',
                            maxWidth: '100%',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            padding: '0 1rem',
                            boxSizing: 'border-box'
                        }}
                        elementProperties={quoteProps || slide.slide_title?.properties || {}}
                    />
                    <div style={{ fontSize: '4rem', color: accentColor, lineHeight: 0.5, marginTop: '2rem', transform: 'rotate(180deg)' }}>“</div>
                    <div style={{ marginTop: '3rem' }}>
                        <EditableElement
                            id={authorIdx >= 0 ? `el-${slideIndex}-${authorIdx}` : `author-${slideIndex}`}
                            text={authorText}
                            tagName="cite"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('author', val)}
                            onSelectElement={() => {
                                if (authorIdx >= 0) {
                                    onElementClick?.(`el-${slideIndex}-${authorIdx}`, 'text', authorIdx);
                                } else {
                                    onElementClick?.(`author-${slideIndex}`, 'text', -1);
                                }
                            }}
                            style={{
                                fontSize: '1.4rem',
                                fontWeight: 600,
                                color: accentColor,
                                fontStyle: 'normal',
                                display: 'block',
                                marginBottom: '0.5rem',
                                textAlign: 'center',
                                width: '100%'
                            }}
                            elementProperties={authorProps || slide.subtitle?.properties || {}}
                        />
                        <EditableElement
                            id={contextIdx >= 0 ? `el-${slideIndex}-${contextIdx}` : `context-${slideIndex}`}
                            text={contextText}
                            tagName="p"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('context', val)}
                            onSelectElement={() => {
                                if (contextIdx >= 0) {
                                    onElementClick?.(`el-${slideIndex}-${contextIdx}`, 'text', contextIdx);
                                } else {
                                    onElementClick?.(`context-${slideIndex}`, 'text', -1);
                                }
                            }}
                            style={{
                                fontSize: '1.05rem',
                                fontWeight: 'normal',
                                color: '#000000',
                                margin: 0,
                                lineHeight: 1.5,
                                textAlign: 'center',
                                width: '100%',
                                opacity: 0.8
                            }}
                            elementProperties={contextProps || {}}
                        />
                    </div>
                </div>
                <UserElementsRenderer
                    elements={slide.elements || []}
                    isEditing={isEditing}
                    onElementClick={onElementClick}
                    onElementUpdate={handleElementUpdate}
                    slideIndex={slideIndex}
                />
            </div>
        );
    }

    // Variant 3: Big Typography Split
    if (variant === 3) {
        return (
            <div style={{
                position: 'relative',
                display: 'flex',
                height: '100%',
                background: bgColor,
                fontFamily: "'Raleway', sans-serif",
            }}>
                <div style={{
                    flex: '0 0 40%',
                    background: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    padding: '4rem',
                    borderRight: `8px solid ${accentColor}`
                }}>
                    <div style={{ textAlign: 'right' }}>
                        <EditableElement
                            id={authorIdx >= 0 ? `el-${slideIndex}-${authorIdx}` : `author-${slideIndex}`}
                            text={authorText}
                            tagName="cite"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('author', val)}
                            onSelectElement={() => {
                                if (authorIdx >= 0) {
                                    onElementClick?.(`el-${slideIndex}-${authorIdx}`, 'text', authorIdx);
                                } else {
                                    onElementClick?.(`author-${slideIndex}`, 'text', -1);
                                }
                            }}
                            style={{
                                fontSize: '1.4rem',
                                fontWeight: 600,
                                color: accentColor,
                                fontStyle: 'normal',
                                display: 'block',
                                marginBottom: '0.5rem',
                                textAlign: 'right',
                                width: '100%'
                            }}
                            elementProperties={authorProps || slide.subtitle?.properties || {}}
                        />
                        <EditableElement
                            id={contextIdx >= 0 ? `el-${slideIndex}-${contextIdx}` : `context-${slideIndex}`}
                            text={contextText}
                            tagName="p"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('context', val)}
                            onSelectElement={() => {
                                if (contextIdx >= 0) {
                                    onElementClick?.(`el-${slideIndex}-${contextIdx}`, 'text', contextIdx);
                                } else {
                                    onElementClick?.(`context-${slideIndex}`, 'text', -1);
                                }
                            }}
                            style={{
                                fontSize: '1rem',
                                color: '#64748b',
                                fontWeight: 'normal',
                                textAlign: 'right',
                                width: '100%'
                            }}
                            elementProperties={contextProps || {}}
                        />
                    </div>
                </div>
                <div style={{ flex: 1, padding: '4rem', display: 'flex', alignItems: 'center', overflow: 'hidden', boxSizing: 'border-box' }}>
                    <EditableElement
                        id={quoteIdx >= 0 ? `el-${slideIndex}-${quoteIdx}` : `quote-${slideIndex}`}
                        text={quoteText}
                        tagName="blockquote"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('quote', val)}
                        onSelectElement={() => {
                            if (quoteIdx >= 0) {
                                onElementClick?.(`el-${slideIndex}-${quoteIdx}`, 'text', quoteIdx);
                            } else {
                                onElementClick?.(`quote-${slideIndex}`, 'text', -1);
                            }
                        }}
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: 300,
                            color: '#000000',
                            lineHeight: 1.5,
                            margin: '0 0 1.5rem',
                            fontStyle: 'italic',
                            letterSpacing: '-0.01em',
                            textAlign: 'left',
                            width: '100%',
                            maxWidth: '100%',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            padding: '0 1rem',
                            boxSizing: 'border-box'
                        }}
                        elementProperties={quoteProps || slide.slide_title?.properties || {}}
                    />
                </div>
                <UserElementsRenderer
                    elements={slide.elements || []}
                    isEditing={isEditing}
                    onElementClick={onElementClick}
                    onElementUpdate={handleElementUpdate}
                    slideIndex={slideIndex}
                />
            </div>
        );
    }

    // Variant 4: Card with Photo Placeholder (Simulated)
    if (variant === 4) {
        return (
            <div style={{
                position: 'relative',
                display: 'flex',
                height: '100%',
                background: '#f1f5f9',
                fontFamily: "'Raleway', sans-serif",
                justifyContent: 'center',
                alignItems: 'center',
                padding: '4rem'
            }}>
                <div style={{
                    background: '#ffffff',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                    padding: '4rem',
                    maxWidth: '900px',
                    display: 'flex',
                    gap: '3rem',
                    alignItems: 'center'
                }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: slide.image_url
                            ? `url(${slide.image_url}) center/cover`
                            : `linear-gradient(135deg, ${accentColor}30, ${accent2Color}20)`,
                        border: `3px solid ${accentColor}40`,
                        boxShadow: `0 8px 24px ${accentColor}25`,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: accentColor,
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        cursor: isEditing ? 'pointer' : 'default',
                    }}
                        onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}>
                        {!slide.image_url && authorText?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden', boxSizing: 'border-box' }}>
                        <EditableElement
                            id={`quote-${slideIndex}`}
                            text={quoteText}
                            tagName="blockquote"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('quote', val)}
                            onSelectElement={() => {
                                if (quoteIdx >= 0) {
                                    onElementClick?.(`el-${slideIndex}-${quoteIdx}`, 'text', quoteIdx);
                                } else {
                                    onElementClick?.(`quote-${slideIndex}`, 'text', -1);
                                }
                            }}
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: 300,
                                color: '#000000',
                                lineHeight: 1.5,
                                margin: '0 0 1.5rem',
                                fontStyle: 'italic',
                                letterSpacing: '-0.01em',
                                textAlign: 'left',
                                width: '100%',
                                maxWidth: '100%',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                padding: '0 1rem',
                                boxSizing: 'border-box'
                            }}
                            elementProperties={quoteProps || slide.slide_title?.properties || {}}
                        />
                        <div style={{ textAlign: 'left' }}>
                            <EditableElement
                                id={`author-${slideIndex}`}
                                text={authorText}
                                tagName="cite"
                                isEditing={isEditing}
                                onChange={(val) => handleUpdate('author', val)}
                                onSelectElement={() => {
                                    if (authorIdx >= 0) {
                                        onElementClick?.(`el-${slideIndex}-${authorIdx}`, 'text', authorIdx);
                                    } else {
                                        onElementClick?.(`author-${slideIndex}`, 'text', -1);
                                    }
                                }}
                                style={{
                                    fontSize: '1.4rem',
                                    fontWeight: 600,
                                    color: accentColor,
                                    fontStyle: 'normal',
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    textAlign: 'left',
                                    width: '100%'
                                }}
                                elementProperties={authorProps || slide.subtitle?.properties || {}}
                            />
                            <EditableElement
                                id={`context-${slideIndex}`}
                                text={contextText}
                                tagName="p"
                                isEditing={isEditing}
                                onChange={(val) => handleUpdate('context', val)}
                                onSelectElement={() => {
                                    if (contextIdx >= 0) {
                                        onElementClick?.(`el-${slideIndex}-${contextIdx}`, 'text', contextIdx);
                                    } else {
                                        onElementClick?.(`context-${slideIndex}`, 'text', -1);
                                    }
                                }}
                                style={{
                                    fontSize: '1rem',
                                    color: '#64748b',
                                    fontWeight: 'normal',
                                    textAlign: 'left',
                                    width: '100%'
                                }}
                                elementProperties={contextProps || {}}
                            />
                        </div>
                    </div>
                </div>
                <UserElementsRenderer
                    elements={slide.elements || []}
                    isEditing={isEditing}
                    onElementClick={onElementClick}
                    onElementUpdate={handleElementUpdate}
                    slideIndex={slideIndex}
                />
            </div>
        );
    }

    // Variant 5: Elegant Serif
    return (
        <div style={{
            display: 'flex',
            height: '100%',
            background: bgColor,
            fontFamily: "'Playfair Display', serif", // Serif override
            padding: '5rem',
            justifyContent: 'center',
            alignItems: 'center',
            border: `20px solid #ffffff`
        }}>
            <div style={{
                borderTop: `1px solid ${accentColor}`,
                borderBottom: `1px solid ${accentColor}`,
                padding: '4rem 1rem',
                maxWidth: '900px',
                width: '100%',
                textAlign: 'center',
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}>
                <EditableElement
                    id={quoteIdx >= 0 ? `el-${slideIndex}-${quoteIdx}` : `quote-${slideIndex}`}
                    text={quoteText}
                    tagName="blockquote"
                    isEditing={isEditing}
                    onChange={(val) => handleUpdate('quote', val)}
                    onSelectElement={() => {
                        if (quoteIdx >= 0) {
                            onElementClick?.(`el-${slideIndex}-${quoteIdx}`, 'text', quoteIdx);
                        } else {
                            onElementClick?.(`quote-${slideIndex}`, 'text', -1);
                        }
                    }}
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 300,
                        color: '#000000',
                        lineHeight: 1.5,
                        margin: '0 0 1.5rem',
                        fontStyle: 'italic',
                        letterSpacing: '-0.01em',
                        textAlign: 'center',
                        width: '100%',
                        maxWidth: '100%',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        padding: '0 1rem',
                        boxSizing: 'border-box'
                    }}
                    elementProperties={quoteProps || slide.slide_title?.properties || {}}
                />
                <div style={{ marginTop: '2rem' }}>
                    <EditableElement
                        id={authorIdx >= 0 ? `el-${slideIndex}-${authorIdx}` : `author-${slideIndex}`}
                        text={authorText}
                        tagName="cite"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('author', val)}
                        onSelectElement={() => {
                            if (authorIdx >= 0) {
                                onElementClick?.(`el-${slideIndex}-${authorIdx}`, 'text', authorIdx);
                            } else {
                                onElementClick?.(`author-${slideIndex}`, 'text', -1);
                            }
                        }}
                        style={{
                            fontSize: '1.4rem',
                            fontWeight: 600,
                            color: accentColor,
                            fontStyle: 'normal',
                            display: 'block',
                            marginBottom: '0.5rem',
                            textAlign: 'center',
                            width: '100%'
                        }}
                        elementProperties={authorProps || slide.subtitle?.properties || {}}
                    />
                    <EditableElement
                        id={contextIdx >= 0 ? `el-${slideIndex}-${contextIdx}` : `context-${slideIndex}`}
                        text={contextText}
                        tagName="p"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('context', val)}
                        onSelectElement={() => {
                            if (contextIdx >= 0) {
                                onElementClick?.(`el-${slideIndex}-${contextIdx}`, 'text', contextIdx);
                            } else {
                                onElementClick?.(`context-${slideIndex}`, 'text', -1);
                            }
                        }}
                        style={{
                            fontSize: '1rem',
                            color: '#64748b',
                            fontWeight: 'normal',
                            textAlign: 'center',
                            width: '100%'
                        }}
                        elementProperties={contextProps || {}}
                    />
                </div>
            </div>
            <UserElementsRenderer
                elements={slide.elements || []}
                isEditing={isEditing}
                onElementClick={onElementClick}
                onElementUpdate={handleElementUpdate}
                slideIndex={slideIndex}
            />
        </div>
    );
};