"use client";
import React from 'react';
import { EditableElement } from '../editor/EditableElement';
import { UserElementsRenderer } from '../editor/UserElementsRenderer';
import { getContrastTextColor } from '@/utils/colorUtils';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface FullImageTextOverlayHTMLProps {
    slide: any;
    theme: any;
    isEditing?: boolean;
    onSlideUpdate?: (updatedSlide: any) => void;
    variant?: 1 | 2 | 3 | 4 | 5;
    onElementClick?: (elementId: string, elementType: string, elementIndex?: number) => void;
    slideIndex?: number;
}

/**
 * Hero-style full image with dark overlay and caption.
 */
export const FullImageTextOverlayHTML: React.FC<FullImageTextOverlayHTMLProps> = ({
    slide,
    theme,
    isEditing = false,
    onSlideUpdate,
    onElementClick,
    slideIndex = 0,
}) => {
    const title = slide.slide_title?.text || "Headline";
    const subtitle = slide.subtitle?.text || "Supporting copy";

    const bgImage = slide.image_url || theme?.image_url || '';
    const accent = theme?.artPalette?.[0] || '#00c4b4';
    const accent2 = theme?.artPalette?.[1] || '#6c5ce7';
    const bgColor = slide.background?.color || theme?.backgroundColor || '#0b0f1c';
    const textColor = '#1a202c';

    const handleUpdate = (type: 'title' | 'subtitle', value: string) => {
        if (!onSlideUpdate) return;
        const updated = { ...slide };
        if (type === 'title') {
            updated.slide_title = { ...updated.slide_title, text: value };
        } else {
            updated.subtitle = { ...updated.subtitle, text: value };
        }
        onSlideUpdate(updated);
    };

    const handleElementUpdate = (index: number, updates: any) => {
        if (!onSlideUpdate) return;
        const updatedElements = [...(slide.elements || [])];
        updatedElements[index] = { ...updatedElements[index], ...updates };
        onSlideUpdate({ ...slide, elements: updatedElements });
    };

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: '16px',
            fontFamily: "'Raleway', sans-serif",
            background: '#0b0f1c',
            color: '#1a202c',
        }}>
            {/* Background image */}
            <div
                onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: bgImage ? `url(${bgImage}) center/cover` : 'linear-gradient(135deg, #1f2937, #111827)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: `brightness(0.72)${slide.image_properties?.shadow
                        ? ` drop-shadow(${slide.image_properties.shadow.offsetX}px ${slide.image_properties.shadow.offsetY}px ${slide.image_properties.shadow.blur}px ${slide.image_properties.shadow.color})`
                        : ''}`,
                    opacity: slide.image_properties?.opacity ?? 1,
                    cursor: isEditing ? 'pointer' : 'default',
                    borderRadius: `${slide.image_properties?.borderRadius ?? 16}px`,
                }}
            />

            {/* Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(115deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.35) 100%)',
            }} />

            {/* Accents */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '-6%',
                width: '220px',
                height: '220px',
                background: `radial-gradient(circle, ${accent}22 0%, transparent 65%)`,
                filter: 'blur(6px)',
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-8%',
                right: '-4%',
                width: '260px',
                height: '260px',
                background: `radial-gradient(circle, ${accent2}18 0%, transparent 65%)`,
                filter: 'blur(8px)',
            }} />

            {/* Content */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '3.5rem',
                maxWidth: '780px',
                gap: '1.1rem',
            }}>
                <EditableElement
                    id={`title-${slideIndex}`}
                    text={title}
                    tagName="h2"
                    isEditing={isEditing}
                    onChange={(val) => handleUpdate('title', val)}
                    onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                    style={{
                        fontSize: '3rem',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                        margin: 0,
                        textShadow: '0 14px 35px rgba(0,0,0,0.55)',
                    }}
                    elementProperties={slide.slide_title?.properties}
                />

                <EditableElement
                    id={`subtitle-${slideIndex}`}
                    text={subtitle}
                    tagName="p"
                    isEditing={isEditing}
                    onChange={(val) => handleUpdate('subtitle', val)}
                    onSelectElement={() => onElementClick?.(`subtitle-${slideIndex}`, 'text')}
                    style={{
                        fontSize: '1.15rem',
                        color: 'rgba(255,255,255,0.82)',
                        lineHeight: 1.6,
                        margin: 0,
                        maxWidth: '640px',
                    }}
                    elementProperties={slide.subtitle?.properties}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginTop: '0.4rem' }}>
                    <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '14px',
                        background: `linear-gradient(135deg, ${accent} 0%, ${accent2} 100%)`,
                        display: 'grid',
                        placeItems: 'center',
                        color: '#0b0f1c',
                        fontWeight: 800,
                        boxShadow: '0 12px 32px rgba(0,0,0,0.16), inset 0 1px 2px rgba(255,255,255,0.4)',
                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}>
                        <ArrowForwardIcon style={{ fontSize: '20px' }} />
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.78)', fontWeight: 700 }}>
                        Explore the details
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
};