"use client";
import React from 'react';
import { getContrastTextColor } from '@/utils/colorUtils';
import { EditableElement } from '../editor/EditableElement';

interface ComparisonSlideHTMLProps {
    slide: any;
    theme: any;
    isEditing?: boolean;
    onSlideUpdate?: (updatedSlide: any) => void;
    variant?: 1 | 2 | 3;
    onElementClick?: (elementId: string, elementType: string, elementIndex?: number) => void;
    slideIndex?: number;
}

/**
 * Side-by-side comparison layout with glass cards.
 * Uses the first half of bullet_point elements for the left column
 * and the second half for the right column.
 */
export const ComparisonSlideHTML: React.FC<ComparisonSlideHTMLProps> = ({
    slide,
    theme,
    isEditing = false,
    onSlideUpdate,
    onElementClick,
    slideIndex = 0,
}) => {
    const title = slide.slide_title?.text || "Comparison";
    const bullets = slide.elements?.filter((el: any) => el.element_type === 'bullet_point') || [];
    const midpoint = Math.ceil(bullets.length / 2);
    const leftItems = bullets.slice(0, midpoint);
    const rightItems = bullets.slice(midpoint);

    const bgColor = theme?.backgroundColor || '#0f172a';
    const primaryColor = theme?.primaryColor || '#6c5ce7';
    const accent = theme?.artPalette?.[0] || '#22d3ee';
    const accent2 = theme?.artPalette?.[1] || '#a855f7';
    const textColor = '#1a202c';

    const handleUpdate = (type: 'title' | 'bullet', value: string, index?: number) => {
        if (!onSlideUpdate) return;
        const updatedSlide = { ...slide };

        if (type === 'title') {
            updatedSlide.slide_title = { ...updatedSlide.slide_title, text: value };
        } else if (type === 'bullet' && typeof index === 'number') {
            const target = bullets[index];
            if (target) {
                updatedSlide.elements = slide.elements.map((el: any) =>
                    el.id === target.id ? { ...el, text: value } : el
                );
            }
        }

        onSlideUpdate(updatedSlide);
    };

    const Card = ({ heading, items, offset }: { heading: string; items: any[]; offset: number }) => (
        <div style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '20px',
            padding: '2.2rem',
            boxShadow: '0 12px 32px rgba(0,0,0,0.16), inset 0 1px 2px rgba(255,255,255,0.4)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.4rem',
            animation: 'fadeInUp 0.6s ease-out'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${accent} 0%, ${accent2} 100%)`
                }} />
                <h3 style={{
                    margin: 0,
                    color: '#fff',
                    fontSize: '1.35rem',
                    letterSpacing: '-0.01em'
                }}>{heading}</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {items.map((item: any, localIdx: number) => {
                    const globalIndex = offset + localIdx;
                    return (
                        <div key={item.id || globalIndex} style={{
                            display: 'flex',
                            gap: '0.9rem',
                            alignItems: 'flex-start',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '14px',
                            padding: '0.9rem 1rem',
                            border: '1px solid rgba(255,255,255,0.08)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s ease',
                            animation: `fadeInUp 0.6s ease-out ${localIdx * 0.1}s both`
                        }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                marginTop: '0.55rem',
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${accent} 0%, ${accent2} 100%)`,
                                flexShrink: 0
                            }} />
                            <EditableElement
                                id={`comparison-${globalIndex}`}
                                text={item.text}
                                tagName="div"
                                isEditing={isEditing}
                                onChange={(val) => handleUpdate('bullet', val, globalIndex)}
                                onSelectElement={() => onElementClick?.(`el-${slideIndex}-${globalIndex}`, 'text', globalIndex)}
                                style={{
                                    fontSize: item.properties?.fontSize ? `${item.properties.fontSize}px` : '1.05rem',
                                    color: item.useThemeColor === false ? (item.properties?.fill || '#1a202c') : '#1a202c',
                                    lineHeight: item.properties?.lineHeight || 1.6,
                                    fontWeight: item.properties?.fontWeight || 400,
                                    textAlign: item.properties?.align || 'left',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <>
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: '3.5rem',
                background: `radial-gradient(circle at 20% 20%, ${accent}10, transparent 35%), radial-gradient(circle at 80% 30%, ${accent2}12, transparent 40%), ${bgColor}`,
                fontFamily: "'Raleway', sans-serif",
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <EditableElement
                    id="comparison-title"
                    text={title}
                    tagName="h2"
                    isEditing={isEditing}
                    onChange={(val) => handleUpdate('title', val)}
                    onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                    style={{
                        fontSize: slide.slide_title?.properties?.fontSize ? `${slide.slide_title.properties.fontSize}px` : '2.6rem',
                        fontWeight: slide.slide_title?.properties?.fontWeight || 800,
                        margin: '0 0 2.5rem',
                        textAlign: slide.slide_title?.properties?.align || 'center',
                        letterSpacing: '-0.02em',
                        color: slide.slide_title?.useThemeColor === false ? (slide.slide_title?.properties?.fill || '#1a202c') : '#1a202c',
                        textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                        animation: 'fadeInDown 0.6s ease-out'
                    }}
                />

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1.8rem',
                    flex: 1,
                    alignItems: 'stretch'
                }}>
                    <Card heading="Option A" items={leftItems} offset={0} />
                    <Card heading="Option B" items={rightItems} offset={midpoint} />
                </div>
            </div>
        </>
    );
};
