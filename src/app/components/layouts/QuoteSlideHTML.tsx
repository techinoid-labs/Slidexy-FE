"use client";
import React from 'react';
import { EditableElement } from '../editor/EditableElement';
import { getContrastTextColor } from '@/utils/colorUtils';

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
    // Helper to update elements
    const handleUpdate = (type: string, newText: string) => {
        if (!onSlideUpdate) return;

        const updatedElements = slide.elements.map((el: any) => {
            if (el.element_type === type) {
                return { ...el, text: newText };
            }
            return el;
        });

        // If element doesn't exist (e.g. context), logic would be needed to add it, 
        // but for now we assume elements exist or we use slide_title fallback

        onSlideUpdate({
            ...slide,
            elements: updatedElements,
            // special handler for title if it's used as fallback
            slide_title: (type === 'quote' && !slide.elements.find((e: any) => e.element_type === 'quote'))
                ? { ...slide.slide_title, text: newText }
                : slide.slide_title
        });
    };

    // Extract quote data from elements array (backend structure)
    // Fix: Prioritize 'quote' element, fallback to 'slide_title' ONLY if no quote element
    const quoteElement = slide.elements?.find((el: any) => el.element_type === 'quote');
    const authorElement = slide.elements?.find((el: any) => el.element_type === 'author');
    const contextElement = slide.elements?.find((el: any) => el.element_type === 'context');

    // Prepare values for display (and IDs for editing)
    const quoteText = quoteElement?.text || slide.slide_title?.text || "Inspiring quote goes here";
    const authorText = authorElement?.text || "Author Name";
    const contextText = contextElement?.text || "Context";

    // Use theme colors or fallback to defaults
    const bgColor = theme?.backgroundColor || '#111827';
    const primaryColor = theme?.primaryColor || '#6c5ce7';
    const accentColor = theme?.artPalette?.[0] || '#00C4B4';
    const accent2Color = theme?.artPalette?.[1] || '#7C3AED';

    const QuoteContent = () => (
        <EditableElement
            id="quote-text"
            text={quoteText}
            tagName="blockquote"
            isEditing={isEditing}
            onChange={(val) => handleUpdate('quote', val)}
            onSelectElement={() => onElementClick?.(`el-${slideIndex}-quote`, 'text')}
            style={{
                fontSize: '2.4rem',
                fontWeight: 300,
                color: '#000000',
                lineHeight: 1.6,
                margin: '0 0 2rem',
                fontStyle: 'italic',
                letterSpacing: '-0.02em',
                textAlign: 'center',
                width: '100%'
            }}
        />
    );

    const AuthorContent = () => (
        <EditableElement
            id="author-text"
            text={authorText}
            tagName="cite"
            isEditing={isEditing}
            onChange={(val) => handleUpdate('author', val)}
            onSelectElement={() => onElementClick?.(`el-${slideIndex}-author`, 'text')}
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
        />
    );

    const ContextContent = () => (
        <EditableElement
            id="context-text"
            text={contextText}
            tagName="p"
            isEditing={isEditing}
            onChange={(val) => handleUpdate('context', val)}
            onSelectElement={() => onElementClick?.(`el-${slideIndex}-context`, 'text')}
            style={{
                fontSize: '1.05rem',
                color: '#000000',
                margin: 0,
                lineHeight: 1.5,
                textAlign: 'center',
                width: '100%',
                opacity: 0.8
            }}
        />
    );

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
                    alignItems: 'center'
                }}>
                    <QuoteContent />
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1.5rem' }}>
                        <div style={{
                            width: '100px',
                            height: '4px',
                            background: `linear-gradient(90deg, ${accentColor} 0%, ${accent2Color} 100%)`,
                            marginBottom: '1.5rem',
                            borderRadius: '2px',
                        }} />
                        <AuthorContent />
                        <ContextContent />
                    </div>
                </div>
            </div>
        );
    }

    // Variant 2: Minimalist Centered
    if (variant === 2) {
        return (
            <div style={{
                display: 'flex',
                height: '100%',
                background: bgColor,
                fontFamily: "'Raleway', sans-serif",
                padding: '4rem',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{ textAlign: 'center', maxWidth: '800px' }}>
                    <div style={{ fontSize: '4rem', color: accentColor, lineHeight: 0.5, marginBottom: '2rem' }}>“</div>
                    <QuoteContent />
                    <div style={{ fontSize: '4rem', color: accentColor, lineHeight: 0.5, marginTop: '2rem', transform: 'rotate(180deg)' }}>“</div>
                    <div style={{ marginTop: '3rem' }}>
                        <AuthorContent />
                        <ContextContent />
                    </div>
                </div>
            </div>
        );
    }

    // Variant 3: Big Typography Split
    if (variant === 3) {
        return (
            <div style={{
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
                        <AuthorContent />
                        <ContextContent />
                    </div>
                </div>
                <div style={{ flex: 1, padding: '4rem', display: 'flex', alignItems: 'center' }}>
                    <QuoteContent />
                </div>
            </div>
        );
    }

    // Variant 4: Card with Photo Placeholder (Simulated)
    if (variant === 4) {
        return (
            <div style={{
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
                        background: '#e2e8f0',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94a3b8',
                        fontSize: '2rem'
                    }}>
                        Img
                    </div>
                    <div style={{ flex: 1 }}>
                        <QuoteContent />
                        <div style={{ textAlign: 'left' }}>
                            <AuthorContent />
                            <ContextContent />
                        </div>
                    </div>
                </div>
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
                padding: '4rem 0',
                maxWidth: '900px',
                textAlign: 'center'
            }}>
                <QuoteContent />
                <div style={{ marginTop: '2rem' }}>
                    <AuthorContent />
                    <ContextContent />
                </div>
            </div>
        </div>
    );
};
