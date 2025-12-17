"use client";
import React from 'react';
import { EditableElement } from '../editor/EditableElement';
import { getContrastTextColor } from '@/utils/colorUtils';

interface SplitContentHTMLProps {
    slide: any;
    theme: any;
    variant?: 1 | 2 | 3 | 4 | 5;
    isEditing?: boolean;
    onSlideUpdate?: (updatedSlide: any) => void;
    onElementClick?: (elementId: string, elementType: string, elementIndex?: number) => void;
    slideIndex?: number;
}

export const SplitContentHTML: React.FC<SplitContentHTMLProps> = ({
    slide,
    theme,
    isEditing = false,
    onSlideUpdate,
    onElementClick,
    slideIndex = 0,
    variant = 1
}) => {
    const handleUpdate = (field: string, newText: string, index?: number) => {
        if (!onSlideUpdate) return;
        let updatedSlide = { ...slide };

        if (field === 'title') {
            updatedSlide.slide_title = { ...updatedSlide.slide_title, text: newText };
        } else if (field === 'bullet' && typeof index === 'number') {
            const bullets = slide.elements.filter((el: any) => el.element_type === 'bullet_point');
            if (bullets[index]) {
                const targetId = bullets[index].id;
                updatedSlide.elements = slide.elements.map((el: any) =>
                    el.id === targetId ? { ...el, text: newText } : el
                );
            }
        }
        onSlideUpdate(updatedSlide);
    };

    const title = slide.slide_title?.text || "Slide Title";
    const bullets = slide.elements?.filter((el: any) => el.element_type === 'bullet_point') || [];
    const midPoint = Math.ceil(bullets.length / 2);
    const leftBullets = bullets.slice(0, midPoint);
    const rightBullets = bullets.slice(midPoint);

    // Theme colors
    const bgColor = theme?.backgroundColor || '#F7FAFC';
    const primaryColor = theme?.primaryColor || '#1A202C';
    const accentColor = theme?.artPalette?.[0] || '#00C4B4';
    const textColor = '#1a202c';

    // Variant 1: Standard Split (Left Title, Right Bullets)
    if (variant === 1) {
        return (
            <div style={{
                display: 'flex',
                height: '100%',
                background: bgColor,
                fontFamily: "'Raleway', sans-serif",
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Left Side - Title */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '4rem',
                    background: '#f8fafc',
                    borderRight: '1px solid #e2e8f0'
                }}>
                    <div style={{
                        width: '60px',
                        height: '4px',
                        background: accentColor,
                        marginBottom: '2rem'
                    }} />
                    <EditableElement
                        id="slide-title"
                        text={title}
                        tagName="h2"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                        style={{
                            fontSize: '3.5rem',
                            fontWeight: 800,
                            color: '#000000',
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em'
                        }}
                    />
                </div>

                {/* Right Side - Content */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '4rem',
                    background: bgColor
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.2rem' }}>
                        {bullets.map((bullet: any, index: number) => (
                            <div key={bullet.id || index} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: accentColor,
                                    marginTop: '10px',
                                    flexShrink: 0
                                }} />
                                <EditableElement
                                    id={`bullet-${index}`}
                                    text={bullet.text}
                                    tagName="p"
                                    isEditing={isEditing}
                                    onChange={(val) => handleUpdate('bullet', val, index)}
                                    onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                                    style={{ fontSize: '1.2rem', color: '#000000', lineHeight: 1.5 }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Variant 2: Diagonal Split with Dark Side Accent
    if (variant === 2) {
        return (
            <div style={{
                display: 'flex',
                height: '100%',
                background: bgColor,
                fontFamily: "'Raleway', sans-serif",
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '60%',
                    height: '100%',
                    background: '#f1f5f9',
                    clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)',
                    zIndex: 0
                }} />

                <div style={{ zIndex: 1, display: 'flex', width: '100%', height: '100%' }}>
                    <div style={{ flex: '0 0 40%', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <EditableElement
                            id="slide-title"
                            text={title}
                            tagName="h2"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('title', val)}
                            onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                            style={{
                                fontSize: '3rem',
                                fontWeight: 800,
                                color: '#000000',
                                marginBottom: '2rem'
                            }}
                        />
                        <div style={{
                            width: '100px',
                            height: '6px',
                            background: accentColor,
                            borderRadius: '3px'
                        }} />
                    </div>

                    <div style={{ flex: 1, padding: '4rem 4rem 4rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {bullets.map((bullet: any, index: number) => (
                                <div key={bullet.id || index} style={{
                                    background: '#ffffff',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                    borderLeft: `4px solid ${accentColor}`
                                }}>
                                    <EditableElement
                                        id={`bullet-${index}`}
                                        text={bullet.text}
                                        tagName="p"
                                        isEditing={isEditing}
                                        onChange={(val) => handleUpdate('bullet', val, index)}
                                        onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                                        style={{ fontSize: '1.1rem', color: '#000000', margin: 0 }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Variant 3: Card Grid Split
    if (variant === 3) {
        return (
            <div style={{
                height: '100%',
                background: bgColor,
                fontFamily: "'Raleway', sans-serif",
                padding: '3rem',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <EditableElement
                        id="slide-title"
                        text={title}
                        tagName="h2"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                        style={{
                            fontSize: '2.8rem',
                            fontWeight: 700,
                            color: '#000000'
                        }}
                    />
                    <div style={{ width: '60px', height: '3px', background: accentColor, margin: '1rem auto 0' }} />
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '2rem',
                    flex: 1,
                    alignContent: 'center'
                }}>
                    {bullets.map((bullet: any, index: number) => (
                        <div key={bullet.id || index} style={{
                            background: index % 2 === 0 ? '#f8fafc' : '#ffffff',
                            padding: '2rem',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem'
                        }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: `${accentColor}20`,
                                color: accentColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                flexShrink: 0
                            }}>
                                {index + 1}
                            </div>
                            <EditableElement
                                id={`bullet-${index}`}
                                text={bullet.text}
                                tagName="p"
                                isEditing={isEditing}
                                onChange={(val) => handleUpdate('bullet', val, index)}
                                onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                                style={{ fontSize: '1.1rem', color: '#000000', margin: 0 }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Variant 4: Asymmetric Modern Split
    if (variant === 4) {
        return (
            <div style={{
                display: 'flex',
                height: '100%',
                background: bgColor,
                fontFamily: "'Raleway', sans-serif"
            }}>
                <div style={{
                    flex: '0 0 35%',
                    background: '#1a202c', // Dark side bar
                    padding: '4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    color: '#ffffff'
                }}>
                    <EditableElement
                        id="slide-title"
                        text={title}
                        tagName="h2"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                        style={{
                            fontSize: '2.5rem',
                            fontWeight: 700,
                            color: '#ffffff', // Explicit white for dark background
                            lineHeight: 1.2
                        }}
                    />
                    <div style={{
                        marginTop: '2rem',
                        paddingTop: '2rem',
                        borderTop: '1px solid rgba(255,255,255,0.2)',
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.9rem'
                    }}>
                        KEY POINTS
                    </div>
                </div>

                <div style={{ flex: 1, padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#ffffff' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {bullets.map((bullet: any, index: number) => (
                            <div key={bullet.id || index} style={{
                                display: 'flex',
                                gap: '0.5rem',
                                paddingBottom: '0.2rem',
                                borderBottom: index < bullets.length - 1 ? '1px solid #f0f0f0' : 'none'
                            }}>
                                <div style={{
                                    fontSize: '1.5rem',
                                    lineHeight: 0.9,
                                    fontWeight: 800,
                                    color: '#f0f0f0',
                                    marginTop: '-2px'
                                }}>
                                    0{index + 1}
                                </div>
                                <EditableElement
                                    id={`bullet-${index}`}
                                    text={bullet.text}
                                    tagName="p"
                                    isEditing={isEditing}
                                    onChange={(val) => handleUpdate('bullet', val, index)}
                                    onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                                    style={{ fontSize: '1rem', color: '#000000', marginTop: '0.2rem' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Default / Variant 5: Balanced Top-Bottom Split (Original-like but improved)
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: bgColor,
            padding: '4rem',
            fontFamily: "'Raleway', sans-serif",
        }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <span style={{
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    background: `${accentColor}15`,
                    color: accentColor,
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textTransform: 'uppercase'
                }}>
                    Overview
                </span>
                <EditableElement
                    id="slide-title"
                    text={title}
                    tagName="h2"
                    isEditing={isEditing}
                    onChange={(val) => handleUpdate('title', val)}
                    onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                    style={{
                        fontSize: '3rem',
                        fontWeight: 700,
                        color: '#000000',
                       
                    }}
                />
            </div>

            <div style={{
                flex: 1,
                background: '#ffffff',
                borderRadius: '20px',
                padding: '1.5rem',
                border: '1px solid #edf2f7',
                boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4rem',
                alignItems: 'flex-start'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {leftBullets.map((bullet: any, index: number) => (
                        <div key={bullet.id || index} style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                background: primaryColor,
                                color: '#fff',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                flexShrink: 0,
                                marginTop: '4px'
                            }}>
                                {index + 1}
                            </div>
                            <EditableElement
                                id={`bullet-${index}`}
                                text={bullet.text}
                                tagName="p"
                                isEditing={isEditing}
                                onChange={(val) => handleUpdate('bullet', val, index)}
                                onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                                style={{ fontSize: '1rem', color: '#000000' }}
                            />
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {rightBullets.map((bullet: any, index: number) => (
                        <div key={bullet.id || index + midPoint} style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                background: accentColor,
                                color: '#fff',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                flexShrink: 0,
                                marginTop: '4px'
                            }}>
                                {index + midPoint + 1}
                            </div>
                            <EditableElement
                                id={`bullet-${index + midPoint}`}
                                text={bullet.text}
                                tagName="p"
                                isEditing={isEditing}
                                onChange={(val) => handleUpdate('bullet', val, index + midPoint)}
                                onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index + midPoint}`, 'text', index + midPoint)}
                                style={{ fontSize: '1rem', color: '#000000' }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
