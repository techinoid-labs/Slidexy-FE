"use client";
import React from 'react';
import { EditableElement } from '../editor/EditableElement';
import { UserElementsRenderer } from '../editor/UserElementsRenderer';
import { getContrastTextColor } from '@/utils/colorUtils';

interface CoverSlideHTMLProps {
    slide: any;
    theme: any;
    variant?: 1 | 2 | 3 | 4 | 5;
    isEditing?: boolean;
    onSlideUpdate?: (updatedSlide: any) => void;
    onElementClick?: (elementId: string, elementType: string, elementIndex?: number) => void;
    slideIndex?: number;
}

/**
 * Modern Cover Slide - Professional template-based design with theme support
 */
export const CoverSlideHTML: React.FC<CoverSlideHTMLProps> = ({
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
        } else if (field === 'subtitle') {
            updatedSlide.subtitle = { ...updatedSlide.subtitle, text: newText };
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

    const handleElementUpdate = (index: number, updatedElement: any) => {
        if (!onSlideUpdate) return;

        const updatedSlide = { ...slide };
        updatedSlide.elements = [...slide.elements];
        updatedSlide.elements[index] = updatedElement;

        onSlideUpdate(updatedSlide);
    };

    const title = slide.slide_title?.text || "Welcome";
    const subtitle = slide.subtitle?.text || "";
    const bullets = slide.elements?.filter((el: any) => el.element_type === 'bullet_point') || [];

    const bgColor = theme?.backgroundColor || '#F7FAFC';
    const primaryColor = theme?.primaryColor || '#1A202C';
    const secondaryColor = theme?.secondaryColor || '#4A5568';
    const accentColor = theme?.artPalette?.[0] || '#00C4B4';

    console.log(`[CoverSlideHTML] Rendering variant ${variant} for slide "${title}"`);
    const accent2Color = theme?.artPalette?.[1] || '#7C3AED';
    const textColor = '#1a202c';
    const textLightColor = getContrastTextColor(bgColor === '#ffffff' || bgColor === '#fff' ? '#f0f0f0' : bgColor);
    const surfaceColor = theme?.surfaceColor || '#EDF2F7';

    const TitleElement = ({ style }: { style: React.CSSProperties }) => (
        <EditableElement
            id="cover-title"
            text={title}
            tagName="h2"
            isEditing={isEditing}
            onChange={(val) => handleUpdate('title', val)}
            onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
            style={style}
            elementProperties={slide.slide_title?.properties}
        />
    );

    const SubtitleElement = ({ style }: { style: React.CSSProperties }) => (
        <EditableElement
            id="cover-subtitle"
            text={subtitle}
            tagName="p"
            isEditing={isEditing}
            onChange={(val) => handleUpdate('subtitle', val)}
            onSelectElement={() => onElementClick?.(`subtitle-${slideIndex}`, 'text')}
            style={style}
            elementProperties={slide.subtitle?.properties}
        />
    );

    // Variant 1: Hero with Glassmorphism
    if (variant === 1) {
        return (
            <div data-slide-container style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: '4rem',
                background: bgColor,
                position: 'relative',
                overflow: 'hidden',
                fontFamily: "'Raleway', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {/* Wave background */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(135deg, ${accentColor}15 0%, ${accent2Color}15 100%)`,
                    clipPath: 'polygon(0 0, 100% 0, 100% 85%, 80% 95%, 20% 85%, 0 95%)',
                    zIndex: 0,
                }} />

                {/* Circle accents */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '10%',
                    width: '200px',
                    height: '200px',
                    background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)`,
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                    zIndex: 1,
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '8%',
                    width: '180px',
                    height: '180px',
                    background: `radial-gradient(circle, ${accent2Color}25 0%, transparent 70%)`,
                    borderRadius: '50%',
                    filter: 'blur(35px)',
                    zIndex: 1,
                }} />

                {/* Glass card */}
                <div style={{
                    zIndex: 2,
                    textAlign: 'center',
                    maxWidth: '900px',
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: '3.5rem',
                    borderRadius: '24px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <TitleElement style={{
                        fontSize: '3rem',
                        fontWeight: 800,
                        color: primaryColor,
                        margin: '0 0 1.5rem',
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                        textAlign: 'center',
                        width: '100%'
                    }} />

                    {subtitle && (
                        <SubtitleElement style={{
                            fontSize: '1.2rem',
                            color: textLightColor,
                            lineHeight: 1.6,
                            margin: '0 0 2rem',
                            fontWeight: 400,
                            textAlign: 'center',
                            width: '100%'
                        }} />
                    )}

                    {bullets.length > 0 && (
                        <div style={{
                            display: 'flex',
                            gap: '1.5rem',
                            justifyContent: 'center',
                            marginTop: '2.5rem',
                            flexWrap: 'wrap',
                            width: '100%'
                        }}>
                            {bullets.slice(0, 3).map((bullet: any, index: number) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.9rem 1.8rem',
                                    background: surfaceColor,
                                    borderRadius: '14px',
                                    fontSize: '1.05rem',
                                    color: '#1a202c',
                                    fontWeight: 500,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${accentColor} 0%, ${accent2Color} 100%)`,
                                    }} />
                                    <EditableElement
                                        id={`bullet-${index}`}
                                        text={bullet.text}
                                        tagName="span"
                                        isEditing={isEditing}
                                        onChange={(val) => handleUpdate('bullet', val, index)}
                                        onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                                        elementProperties={bullet.properties}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* User-added elements (text, images, shapes from panels) */}
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

    // Variant 2: Bold Gradient Background
    if (variant === 2) {
        return (
            <div data-slide-container style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: '4rem',
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                fontFamily: "'Raleway', sans-serif",
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative circles */}
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    width: '400px',
                    height: '400px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '50%',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-15%',
                    left: '-8%',
                    width: '450px',
                    height: '450px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '50%',
                }} />

                <div style={{ textAlign: 'center', maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <TitleElement style={{
                        fontSize: '3rem',
                        fontWeight: 800,
                        margin: '0 0 1.5rem',
                        lineHeight: 1.1,
                        textShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        textAlign: 'center',
                        width: '100%',
                        color: '#fff',
                    }} />

                    {subtitle && (
                        <SubtitleElement style={{
                            fontSize: '1.2rem',
                            opacity: 0.95,
                            lineHeight: 1.6,
                            margin: '0 0 2.5rem',
                            textAlign: 'center',
                            width: '100%',
                            color: '#fff',
                        }} />
                    )}

                    {bullets.length > 0 && (
                        <div style={{
                            display: 'flex',
                            gap: '1.2rem',
                            justifyContent: 'center',
                            marginTop: '2rem',
                            flexWrap: 'wrap',
                        }}>
                            {bullets.slice(0, 3).map((bullet: any, index: number) => (
                                <div key={index} style={{
                                    padding: '0.8rem 1.5rem',
                                    background: 'rgba(255,255,255,0.15)',
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                }}>
                                    <EditableElement
                                        id={`bullet-${index}`}
                                        text={bullet.text}
                                        tagName="span"
                                        isEditing={isEditing}
                                        onChange={(val) => handleUpdate('bullet', val, index)}
                                        onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                                        style={{ color: '#fff', fontSize: '1.05rem' }}
                                        elementProperties={bullet.properties}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* User-added elements */}
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

    // Variant 3: Minimalist Split
    if (variant === 3) {
        return (
            <div data-slide-container style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                height: '100%',
                background: bgColor,
                fontFamily: "'Raleway', sans-serif",
                overflow: 'hidden',
            }}>
                {/* Left side - solid color */}
                <div style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${accent2Color})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3rem',
                    position: 'relative',
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '300px',
                        height: '300px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%',
                        filter: 'blur(60px)',
                    }} />
                    <div style={{
                        fontSize: '8rem',
                        fontWeight: 900,
                        color: 'rgba(255,255,255,0.15)',
                        letterSpacing: '-0.05em',
                        position: 'relative',
                        zIndex: 1,
                    }}>
                        {title.charAt(0)}
                    </div>
                </div>

                {/* Right side - content */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '4rem',
                }}>
                    <TitleElement style={{
                        fontSize: '2.2rem',
                        fontWeight: 700,
                        color: primaryColor,
                        margin: '0 0 1.5rem',
                        lineHeight: 1.0,
                        width: '100%'
                    }} />

                    {subtitle && (
                        <SubtitleElement style={{
                            fontSize: '1.2rem',
                            color: textLightColor,
                            lineHeight: 1.6,
                            margin: '0 0 2rem',
                            width: '100%'
                        }} />
                    )}

                    {bullets.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                            {bullets.slice(0, 3).map((bullet: any, index: number) => (
                                <div key={index} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: accentColor,
                                    }} />
                                    <EditableElement
                                        id={`bullet-${index}`}
                                        text={bullet.text}
                                        tagName="span"
                                        isEditing={isEditing}
                                        onChange={(val) => handleUpdate('bullet', val, index)}
                                        onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                                        style={{ color: '#1a202c', fontSize: '1.1rem' }}
                                        elementProperties={bullet.properties}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* User-added elements */}
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

    // Variant 4: Centered with Top Accent
    if (variant === 4) {
        return (
            <div data-slide-container style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                background: bgColor,
                fontFamily: "'Raleway', sans-serif",
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Top accent bar */}
                <div style={{
                    height: '8px',
                    background: `linear-gradient(to right, ${accentColor}, ${accent2Color})`,
                }} />

                {/* Content */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '4rem',
                    textAlign: 'center',
                }}>
                    <div style={{
                        maxWidth: '800px',
                        width: '100%',
                    }}>
                        <TitleElement style={{
                            fontSize: '3.5rem',
                            fontWeight: 800,
                            color: primaryColor,
                            margin: '0 0 1.5rem',
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                            width: '100%'
                        }} />

                        {subtitle && (
                            <SubtitleElement style={{
                                fontSize: '1.4rem',
                                color: textLightColor,
                                lineHeight: 1.6,
                                margin: '0 0 3rem',
                                width: '100%'
                            }} />
                        )}

                        {bullets.length > 0 && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1.5rem',
                                marginTop: '2.5rem',
                            }}>
                                {bullets.slice(0, 3).map((bullet: any, index: number) => (
                                    <div key={index} style={{
                                        padding: '1.5rem',
                                        background: `${accentColor}10`,
                                        borderRadius: '16px',
                                        border: `2px solid ${accentColor}30`,
                                    }}>
                                        <EditableElement
                                            id={`bullet-${index}`}
                                            text={bullet.text}
                                            tagName="div"
                                            isEditing={isEditing}
                                            onChange={(val) => handleUpdate('bullet', val, index)}
                                            onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                                            style={{ color: '#1a202c', fontSize: '1.1rem', fontWeight: 500 }}
                                            elementProperties={bullet.properties}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* User-added elements */}
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

    // Variant 5: Diagonal Split
    return (
        <div data-slide-container style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: bgColor,
            fontFamily: "'Raleway', sans-serif",
            position: 'relative',
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4rem',
        }}>
            {/* Diagonal background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, ${accentColor}12 0%, transparent 60%)`,
                clipPath: 'polygon(0 0, 70% 0, 40% 100%, 0 100%)',
                zIndex: 0,
            }} />

            {/* Content */}
            <div style={{
                maxWidth: '900px',
                width: '100%',
                textAlign: 'center',
                position: 'relative',
                zIndex: 1,
            }}>
                <TitleElement style={{
                    fontSize: '3.6rem',
                    fontWeight: 800,
                    color: primaryColor,
                    margin: '0 0 1.5rem',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    width: '100%'
                }} />

                {subtitle && (
                    <SubtitleElement style={{
                        fontSize: '1.5rem',
                        color: textLightColor,
                        lineHeight: 1.6,
                        margin: '0 0 2.5rem',
                        width: '100%'
                    }} />
                )}

                {bullets.length > 0 && (
                    <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        justifyContent: 'center',
                        marginTop: '2.5rem',
                        flexWrap: 'wrap',
                    }}>
                        {bullets.slice(0, 3).map((bullet: any, index: number) => (
                            <div key={index} style={{
                                padding: '1rem 1.8rem',
                                background: 'rgba(255,255,255,0.9)',
                                borderRadius: '14px',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                                borderLeft: `4px solid ${accentColor}`,
                            }}>
                                <EditableElement
                                    id={`bullet-${index}`}
                                    text={bullet.text}
                                    tagName="span"
                                    isEditing={isEditing}
                                    onChange={(val) => handleUpdate('bullet', val, index)}
                                    onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                                    style={{ color: textColor, fontSize: '1.05rem', fontWeight: 500 }}
                                    elementProperties={bullet.properties}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* User-added elements */}
                <UserElementsRenderer
                    elements={slide.elements || []}
                    isEditing={isEditing}
                    onElementClick={onElementClick}
                    onElementUpdate={handleElementUpdate}
                    slideIndex={slideIndex}
                />
            </div>
        </div>
    );
};
