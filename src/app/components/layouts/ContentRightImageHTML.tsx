"use client";
import React from 'react';
import { EditableElement } from '../editor/EditableElement';
import { getContrastTextColor } from '@/utils/colorUtils';

interface ContentRightImageHTMLProps {
    slide: any;
    theme: any;
    variant?: 1 | 2 | 3 | 4 | 5;
    isEditing?: boolean;
    onSlideUpdate?: (updatedSlide: any) => void;
    onElementClick?: (elementId: string, elementType: string, elementIndex?: number) => void;
    slideIndex?: number;
}

export const ContentRightImageHTML: React.FC<ContentRightImageHTMLProps> = ({
    slide,
    theme,
    variant = 1,
    isEditing = false,
    onSlideUpdate,
    onElementClick,
    slideIndex = 0
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
    const imageUrl = slide.image_url;

    // Theme colors
    const bgColor = theme?.backgroundColor || '#F7FAFC';
    const primaryColor = theme?.primaryColor || '#1A202C';
    const accentColor = theme?.artPalette?.[0] || '#00C4B4';
    const accent2Color = theme?.artPalette?.[1] || '#7C3AED';
    const textColor = '#1a202c';

    // Variant 1: Clean Card Layout (mirrored)
    if (variant === 1) {
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: '55% 45%',
                height: '100%',
                background: bgColor,
                overflow: 'hidden',
                fontFamily: "'Raleway', sans-serif",
            }}>
                {/* Left Content */}
                <div style={{
                    padding: '3.5rem 2rem 3.5rem 3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
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
                            color: primaryColor,
                            marginBottom: '2rem',
                            lineHeight: 1.2
                        }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.3rem' }}>
                        {bullets.slice(0, 4).map((bullet: any, index: number) => (
                            <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: `${accentColor}20`,
                                    marginTop: '0.2rem',
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: accentColor,
                                    }} />
                                </div>
                                <EditableElement
                                    id={`bullet-${index}`}
                                    text={bullet.text}
                                    tagName="div"
                                    isEditing={isEditing}
                                    onChange={(val) => handleUpdate('bullet', val, index)}
                                    onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                                    style={{
                                        fontSize: '1.15rem',
                                        color: '#1a202c',
                                        lineHeight: 1.6,
                                        flex: 1
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Image with Card Style */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2.5rem',
                }}>
                    <div style={{
                        width: '100%',
                        height: '85%',
                        background: imageUrl ? `url(${imageUrl}) center/cover` : `linear-gradient(135deg, ${accentColor}20, ${accent2Color}15)`,
                        borderRadius: '20px',
                        border: `2px solid ${accentColor}30`,
                        boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                        cursor: isEditing ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#cbd5e0',
                        fontSize: '1.1rem',
                        position: 'relative',
                    }}
                        onClick={() => onElementClick?.(`image-${slideIndex}`, 'image', 0)}>
                        {!imageUrl && 'Image'}
                        <div style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            width: '4px',
                            height: '100%',
                            background: accentColor,
                            borderRadius: '0 20px 20px 0',
                        }} />
                    </div>
                </div>
            </div>
        );
    }

    // Variant 2: Floating Card with Shadow
    if (variant === 2) {
        return (
            <div style={{
                display: 'flex',
                height: '100%',
                background: `linear-gradient(135deg, ${bgColor}, ${accentColor}08)`,
                overflow: 'hidden',
                fontFamily: "'Raleway', sans-serif",
                padding: '2.5rem',
                gap: '2rem',
            }}>
                {/* Left Content */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '1rem 0',
                }}>
                    <EditableElement
                        id="slide-title"
                        text={title}
                        tagName="h2"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                        style={{
                            fontSize: '1.9rem',
                            fontWeight: 700,
                            color: primaryColor,
                            marginBottom: '2rem',
                            lineHeight: 1.2
                        }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        {bullets.slice(0, 4).map((bullet: any, index: number) => (
                            <div key={index} style={{
                                display: 'flex',
                                gap: '0.9rem',
                                alignItems: 'flex-start',
                                padding: '0.5rem 1rem',
                                background: 'rgba(255,255,255,0.6)',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            }}>
                                <div style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: accentColor,
                                    marginTop: '0.6rem',
                                    flexShrink: 0,
                                }} />
                                <EditableElement
                                    id={`bullet-${index}`}
                                    text={bullet.text}
                                    tagName="div"
                                    isEditing={isEditing}
                                    onChange={(val) => handleUpdate('bullet', val, index)}
                                    onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                                    style={{
                                        fontSize: '1.1rem',
                                        color: '#1a202c',
                                        lineHeight: 1.6,
                                        flex: 1
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Image */}
                <div style={{
                    flex: '0 0 42%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <div style={{
                        width: '100%',
                        height: '90%',
                        background: imageUrl ? `url(${imageUrl}) center/cover` : `linear-gradient(135deg, ${accentColor}25, ${accent2Color}20)`,
                        borderRadius: '24px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
                        cursor: isEditing ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#cbd5e0',
                        fontSize: '1.1rem',
                    }}
                        onClick={() => onElementClick?.(`image-${slideIndex}`, 'image', 0)}>
                        {!imageUrl && 'Image'}
                    </div>
                </div>
            </div>
        );
    }

    // Variant 3: Split with Vertical Accent
    if (variant === 3) {
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: '58% 42%',
                height: '100%',
                background: bgColor,
                overflow: 'hidden',
                fontFamily: "'Raleway', sans-serif",
            }}>
                {/* Left Content */}
                <div style={{
                    padding: '3.5rem 2.5rem 3.5rem 3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderRight: `3px solid ${accentColor}`,
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
                            fontWeight: 600,
                            color: primaryColor,
                            marginBottom: '2rem',
                            lineHeight: 1.2
                        }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                        {bullets.slice(0, 4).map((bullet: any, index: number) => (
                            <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    minWidth: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${accentColor}, ${accent2Color})`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    marginTop: '0.1rem',
                                }}>
                                    {index + 1}
                                </div>
                                <EditableElement
                                    id={`bullet-${index}`}
                                    text={bullet.text}
                                    tagName="div"
                                    isEditing={isEditing}
                                    onChange={(val) => handleUpdate('bullet', val, index)}
                                    onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                                    style={{
                                        fontSize: '1.15rem',
                                        color: '#1a202c',
                                        lineHeight: 1.6,
                                        flex: 1
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Image */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3rem 2.5rem',
                }}>
                    <div style={{
                        width: '100%',
                        height: '85%',
                        background: imageUrl ? `url(${imageUrl}) center/cover` : `linear-gradient(135deg, ${accentColor}15, ${accent2Color}10)`,
                        borderRadius: '16px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        cursor: isEditing ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#cbd5e0',
                        fontSize: '1.1rem',
                    }}
                        onClick={() => onElementClick?.(`image-${slideIndex}`, 'image', 0)}>
                        {!imageUrl && 'Image'}
                    </div>
                </div>
            </div>
        );
    }

    // Variant 4: Modern Asymmetric
    if (variant === 4) {
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: '52% 48%',
                height: '100%',
                background: bgColor,
                overflow: 'hidden',
                fontFamily: "'Raleway', sans-serif",
                position: 'relative',
            }}>
                {/* Decorative background */}
                <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    width: '48%',
                    height: '100%',
                    background: `linear-gradient(135deg, transparent, ${accentColor}06)`,
                    zIndex: 0,
                }} />

                {/* Left Content */}
                <div style={{
                    padding: '3.5rem 2rem 3.5rem 3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <EditableElement
                        id="slide-title"
                        text={title}
                        tagName="h2"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                        style={{
                            fontSize: '2.2rem',
                            fontWeight: 700,
                            color: primaryColor,
                            marginBottom: '2rem',
                            lineHeight: 1.2
                        }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        {bullets.slice(0, 4).map((bullet: any, index: number) => (
                            <div key={index} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '4px',
                                    height: '35px',
                                    background: `linear-gradient(to bottom, ${accentColor}, transparent)`,
                                    borderRadius: '2px',
                                    marginTop: '0.2rem',
                                }} />
                                <EditableElement
                                    id={`bullet-${index}`}
                                    text={bullet.text}
                                    tagName="div"
                                    isEditing={isEditing}
                                    onChange={(val) => handleUpdate('bullet', val, index)}
                                    onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                                    style={{
                                        fontSize: '1.1rem',
                                        color: '#1a202c',
                                        lineHeight: 1.6,
                                        flex: 1
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Image */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3rem 2.5rem',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <div style={{
                        width: '100%',
                        height: '80%',
                        background: imageUrl ? `url(${imageUrl}) center/cover` : `linear-gradient(135deg, ${accentColor}18, ${accent2Color}12)`,
                        borderRadius: '20px',
                        boxShadow: '0 14px 40px rgba(0,0,0,0.14)',
                        cursor: isEditing ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#cbd5e0',
                        fontSize: '1.1rem',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                        onClick={() => onElementClick?.(`image-${slideIndex}`, 'image', 0)}>
                        {!imageUrl && 'Image'}
                        {/* Corner accent */}
                        <div style={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            width: '70px',
                            height: '70px',
                            background: accent2Color,
                            borderRadius: '20px 0 20px 0',
                            opacity: 0.8,
                        }} />
                    </div>
                </div>
            </div>
        );
    }

    // Variant 5: Bold with Top Accent
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '56% 44%',
            height: '100%',
            background: bgColor,
            overflow: 'hidden',
            fontFamily: "'Raleway', sans-serif",
            position: 'relative',
        }}>
            {/* Top accent bar */}
            <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '6px',
                background: `linear-gradient(to right, ${accentColor}, ${accent2Color})`,
                zIndex: 10,
            }} />

            {/* Left Content */}
            <div style={{
                padding: '3.5rem 2rem 3.5rem 3rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}>
                <EditableElement
                    id="slide-title"
                    text={title}
                    tagName="h2"
                    isEditing={isEditing}
                    onChange={(val) => handleUpdate('title', val)}
                    onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                    style={{
                        fontSize: '2.2rem',
                        fontWeight: 700,
                        color: primaryColor,
                        marginBottom: '2rem',
                        lineHeight: 1.2
                    }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {bullets.slice(0, 4).map((bullet: any, index: number) => (
                        <div key={index} style={{
                            display: 'flex',
                            gap: '0.9rem',
                            alignItems: 'flex-start',
                            paddingLeft: '1rem',
                            borderLeft: `3px solid ${accentColor}${Math.max(80 - index * 15, 30).toString(16)}`,
                        }}>
                            <EditableElement
                                id={`bullet-${index}`}
                                text={bullet.text}
                                tagName="div"
                                isEditing={isEditing}
                                onChange={(val) => handleUpdate('bullet', val, index)}
                                onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                                style={{
                                    fontSize: '1.15rem',
                                    color: textColor,
                                    lineHeight: 1.6,
                                    flex: 1
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Image */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 2.5rem',
            }}>
                <div style={{
                    width: '100%',
                    height: '85%',
                    background: imageUrl ? `url(${imageUrl}) center/cover` : `linear-gradient(135deg, ${accentColor}18, ${accent2Color}12)`,
                    borderRadius: '22px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                    cursor: isEditing ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#cbd5e0',
                    fontSize: '1.1rem',
                }}
                    onClick={() => onElementClick?.(`image-${slideIndex}`, 'image', 0)}>
                    {!imageUrl && 'Image'}
                </div>
            </div>
        </div>
    );
};
