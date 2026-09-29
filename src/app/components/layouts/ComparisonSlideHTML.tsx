"use client";
import React from 'react';
import { getContrastTextColor } from '@/utils/colorUtils';
import { EditableElement } from '../editor/EditableElement';
import { UserElementsRenderer } from '../editor/UserElementsRenderer';
import { getBulletIcon } from '@/utils/bulletIcons';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarsIcon from '@mui/icons-material/Stars';

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
            if (slide.elements[index]) {
                updatedSlide.elements = [...slide.elements];
                updatedSlide.elements[index] = { ...slide.elements[index], text: value };
            }
        }

        onSlideUpdate(updatedSlide);
    };

    const handleElementUpdate = (index: number, updates: any) => {
        if (!onSlideUpdate) return;
        const updatedElements = [...(slide.elements || [])];
        updatedElements[index] = { ...updatedElements[index], ...updates };
        onSlideUpdate({ ...slide, elements: updatedElements });
    };

    const Card = ({ heading, items, offset, color }: { heading: string; items: any[]; offset: number; color: string }) => (
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
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, ${accent} 0%, ${accent2} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px ${accent}40`,
                }}>
                    <StarsIcon style={{ fontSize: '17px', color: '#fff' }} />
                </div>
                <h3 style={{
                    margin: 0,
                    color: '#fff',
                    fontSize: '1.35rem',
                    letterSpacing: '-0.01em'
                }}>{heading}</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {items.map((item: any, localIdx: number) => {
                    const actualIndex = slide.elements.indexOf(item);
                    return (
                        <div key={item.id || actualIndex} style={{
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
                            <CheckCircleIcon style={{
                                fontSize: '18px',
                                marginTop: '0.15rem',
                                color,
                                flexShrink: 0
                            }} />
                            <EditableElement
                                id={item.id || item.properties?.id || `el-${slideIndex}-${actualIndex}`}
                                text={item.text}
                                tagName="div"
                                isEditing={isEditing}
                                onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                onSelectElement={() => {
                                    const bId = item.id || item.properties?.id || `el-${slideIndex}-${actualIndex}`;
                                    onElementClick?.(bId, 'text', actualIndex);
                                }}
                                style={{
                                    fontSize: '1.05rem',
                                    color: '#1a202c',
                                    lineHeight: 1.6,
                                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                }}
                                elementProperties={item.properties}
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
                        fontSize: '2.6rem',
                        fontWeight: 800,
                        margin: '0 0 2.5rem',
                        textAlign: 'center',
                        letterSpacing: '-0.02em',
                        color: '#1a202c',
                        textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                        animation: 'fadeInDown 0.6s ease-out'
                    }}
                    elementProperties={slide.slide_title?.properties}
                />

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1.8rem',
                    flex: 1,
                    alignItems: 'stretch'
                }}>
                    <Card heading="Option A" items={leftItems} offset={0} color={accent} />
                    <Card heading="Option B" items={rightItems} offset={midpoint} color={accent2} />
                </div>
            </div>
            <UserElementsRenderer
                elements={slide.elements || []}
                isEditing={isEditing}
                onElementClick={onElementClick}
                onElementUpdate={handleElementUpdate}
                slideIndex={slideIndex}
            />
        </>
    );
};