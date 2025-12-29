import React from 'react';
import { Slide } from '@/types/presentation';
import { EditableElement } from '../editor/EditableElement';
import { UserElementsRenderer } from '../editor/UserElementsRenderer';

interface CoverSlideHTMLProps {
    slide: Slide;
    theme: any;
    isEditing: boolean;
    onSlideUpdate?: (updates: Partial<Slide>) => void;
    onElementClick?: (elementId: string, type: string, index: number) => void;
    variant?: number;
    slideIndex?: number;
}

export const CoverSlideHTML: React.FC<CoverSlideHTMLProps> = ({
    slide,
    theme,
    isEditing,
    onSlideUpdate,
    onElementClick,
    variant = 1,
    slideIndex = 0
}) => {
    const title = slide.slide_title?.text || '';
    const subtitle = slide.subtitle?.text || '';
    // ✅ Fix: Use both type and element_type to ensure bullets are found
    const bullets = (slide.elements || []).filter((el: any) =>
        el.type === 'bullet_point' || el.element_type === 'bullet_point'
    );
    const imageUrl = slide.image_url || '';

    const {
        bgColor = '#FFFFFF',
        primaryColor = '#1a1a1a',
        secondaryColor = '#4a4a4a',
        accentColor = '#3b82f6',
        accent2Color = '#8b5cf6',
        textColor = '#1a1a1a',
        textLightColor = '#6b7280',
        surfaceColor = '#f9fafb',
    } = theme || {};

    const handleUpdate = (type: 'title' | 'subtitle' | 'bullet', value: string, index?: number) => {
        if (!onSlideUpdate) return;

        if (type === 'title' && slide.slide_title) {
            onSlideUpdate({
                slide_title: { ...slide.slide_title, text: value }
            });
        } else if (type === 'subtitle' && slide.subtitle) {
            onSlideUpdate({
                subtitle: { ...slide.subtitle, text: value }
            });
        } else if (type === 'bullet' && index !== undefined) {
            const updatedElements = [...(slide.elements || [])];
            updatedElements[index] = { ...updatedElements[index], text: value };
            onSlideUpdate({ elements: updatedElements });
        }
    };

    const handleElementUpdate = (index: number, updates: any) => {
        if (!onSlideUpdate) return;
        const updatedElements = [...(slide.elements || [])];
        updatedElements[index] = { ...updatedElements[index], ...updates };
        onSlideUpdate({ elements: updatedElements });
    };

    const TitleElement = ({ style }: { style: React.CSSProperties }) => (
        <EditableElement
            id={`title-${slideIndex}`}
            text={title}
            tagName="h1"
            isEditing={isEditing}
            onChange={(val) => handleUpdate('title', val)}
            onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text', -1)}
            style={style}
            elementProperties={slide.slide_title?.properties || slide.slide_title?.element_properties}
        />
    );

    const SubtitleElement = ({ style }: { style: React.CSSProperties }) => (
        <EditableElement
            id={`subtitle-${slideIndex}`}
            text={subtitle}
            tagName="p"
            isEditing={isEditing}
            onChange={(val) => handleUpdate('subtitle', val)}
            onSelectElement={() => onElementClick?.(`subtitle-${slideIndex}`, 'text', -2)}
            style={style}
            elementProperties={slide.subtitle?.properties || slide.subtitle?.element_properties}
        />
    );

    const ElementsRenderer = () => (
        <UserElementsRenderer
            elements={slide.elements || []}
            isEditing={isEditing}
            onElementClick={onElementClick}
            onElementUpdate={handleElementUpdate}
            slideIndex={slideIndex}
        />
    );

    // Variant 1: Hero Glass Overlay (Gamma Inspired)
    if (variant === 1) {
        return (
            <div data-slide-container style={{
                display: 'flex',
                height: '100%',
                background: bgColor,
                position: 'relative',
                overflow: 'hidden',
                fontFamily: "'Inter', sans-serif",
            }}>
                {/* Background Hero Image */}
                {imageUrl && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.9,
                    }} />
                )}

                {/* Gradient Wash */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(135deg, ${bgColor}E6 0%, ${bgColor}33 100%)`,
                }} />

                {/* Main Content Area */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '3rem',
                    width: '60%',
                    height: '100%',
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.45)',
                        backdropFilter: 'blur(20px)',
                        padding: '2.5rem',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
                        maxWidth: '100%',
                    }}>
                        <TitleElement style={{
                            fontSize: '2.8rem', // ✅ Scaled down from 4rem
                            fontWeight: 700,    // ✅ Scaled down from 800
                            color: primaryColor,
                            margin: '0 0 1rem',
                            lineHeight: 1.2,
                            letterSpacing: '-0.02em',
                        }} />

                        {subtitle && (
                            <SubtitleElement style={{
                                fontSize: '1.1rem', // ✅ Scaled down from 1.4rem
                                color: secondaryColor,
                                lineHeight: 1.5,
                                margin: 0,
                                fontWeight: 400,
                            }} />
                        )}
                    </div>
                </div>

                {/* Bullets Overlay - Floating Badges */}
                <div style={{
                    position: 'absolute',
                    right: '4rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    zIndex: 3,
                    width: '30%',
                }}>
                    {bullets.slice(0, 4).map((bullet: any, idx: number) => {
                        const actualIndex = slide.elements.indexOf(bullet);
                        return (
                            <div key={`bullet-${actualIndex}`} style={{
                                background: 'white',
                                padding: '1rem 1.5rem',
                                borderRadius: '16px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                border: `1px solid ${accentColor}20`,
                                transform: `rotate(${idx % 2 === 0 ? '-1deg' : '1deg'})`,
                            }}>
                                <div style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: accentColor,
                                    flexShrink: 0,
                                }} />
                                <EditableElement
                                    id={`el-${slideIndex}-${actualIndex}`}
                                    text={bullet.text}
                                    tagName="div"
                                    isEditing={isEditing}
                                    onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                    onSelectElement={() => onElementClick?.(`el-${slideIndex}-${actualIndex}`, 'text', actualIndex)}
                                    style={{
                                        fontSize: '0.95rem',
                                        color: primaryColor,
                                        fontWeight: 600,
                                        lineHeight: 1.4,
                                    }}
                                    elementProperties={bullet.properties || bullet.element_properties}
                                />
                            </div>
                        );
                    })}
                </div>

                <ElementsRenderer />
            </div>
        );
    }

    // Variant 2: Modern Split Layout (Gamma Inspired)
    if (variant === 2) {
        return (
            <div data-slide-container style={{
                display: 'flex',
                height: '100%',
                background: bgColor,
                fontFamily: "'Inter', sans-serif",
                gap: '1.5rem',
                padding: '2rem',
            }}>
                {/* Left Content */}
                <div style={{
                    flex: '1.2',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '1.5rem',
                }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.4rem 1rem',
                        background: `${accentColor}10`,
                        borderRadius: '100px',
                        color: accentColor,
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '1.5rem',
                        width: 'fit-content',
                    }}>
                        Introduction
                    </div>

                    <TitleElement style={{
                        fontSize: '2.5rem', // ✅ Scaled down from 3.8rem
                        fontWeight: 700,    // ✅ Scaled down from 900
                        color: primaryColor,
                        margin: '0 0 1rem',
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                    }} />

                    {subtitle && (
                        <SubtitleElement style={{
                            fontSize: '1rem',
                            color: textLightColor,
                            lineHeight: 1.5,
                            margin: '0 0 2rem',
                            fontWeight: 400,
                        }} />
                    )}

                    <div style={{
                        display: 'grid',
                        gap: '0.75rem',
                    }}>
                        {bullets.slice(0, 3).map((bullet: any, idx: number) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            return (
                                <div key={`bullet-${actualIndex}`} style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    background: surfaceColor,
                                    borderRadius: '12px',
                                    border: `1px solid ${accentColor}08`,
                                }}>
                                    <div style={{
                                        fontSize: '1rem',
                                        fontWeight: 800,
                                        color: accentColor,
                                        opacity: 0.6,
                                    }}>
                                        {idx + 1}
                                    </div>
                                    <EditableElement
                                        id={`el-${slideIndex}-${actualIndex}`}
                                        text={bullet.text}
                                        tagName="div"
                                        isEditing={isEditing}
                                        onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                        onSelectElement={() => onElementClick?.(`el-${slideIndex}-${actualIndex}`, 'text', actualIndex)}
                                        style={{
                                            fontSize: '0.95rem',
                                            color: primaryColor,
                                            fontWeight: 500,
                                        }}
                                        elementProperties={bullet.properties || bullet.element_properties}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Image Feature */}
                <div style={{
                    flex: '1',
                    position: 'relative',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
                    height: '100%',
                }}>
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            alt="hero"
                        />
                    ) : (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            background: `linear-gradient(135deg, ${accentColor}, ${accent2Color})`
                        }} />
                    )}

                    {/* Floating Overlay Badge */}
                    <div style={{
                        position: 'absolute',
                        bottom: '1.5rem',
                        left: '1.5rem',
                        right: '1.5rem',
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        padding: '1.25rem',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: accentColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 800,
                                fontSize: '0.8rem',
                            }}>
                                UX
                            </div>
                            <div style={{ fontSize: '0.85rem', color: primaryColor, fontWeight: 600, lineHeight: 1.2 }}>
                                Strategy & Insights
                            </div>
                        </div>
                    </div>
                </div>

                <ElementsRenderer />
            </div>
        );
    }

    // Variant 3: Diagonal Geometric Hero (Gamma Inspired)
    if (variant === 3) {
        return (
            <div data-slide-container style={{
                display: 'flex',
                height: '100%',
                background: bgColor,
                position: 'relative',
                overflow: 'hidden',
                fontFamily: "'Inter', sans-serif",
            }}>
                {/* Large Background Hero */}
                <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '60%',
                    backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: accentColor,
                    clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)',
                }} />

                {/* Content Panel */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '4rem',
                    width: '55%',
                    height: '100%',
                }}>
                    <div style={{
                        maxWidth: '480px',
                    }}>
                        <div style={{
                            width: '35px',
                            height: '5px',
                            background: accentColor,
                            borderRadius: '3px',
                            marginBottom: '2rem',
                        }} />

                        <TitleElement style={{
                            fontSize: '2.8rem', // ✅ Scaled down from 3.5rem
                            fontWeight: 700,    // ✅ Scaled down from 800
                            color: primaryColor,
                            margin: '0 0 1rem',
                            lineHeight: 1.2,
                        }} />

                        {subtitle && (
                            <SubtitleElement style={{
                                fontSize: '1.05rem',
                                color: textLightColor,
                                lineHeight: 1.6,
                                margin: '0 0 2rem',
                            }} />
                        )}

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.25rem',
                        }}>
                            {bullets.slice(0, 3).map((bullet: any, idx: number) => {
                                const actualIndex = slide.elements.indexOf(bullet);
                                return (
                                    <div key={`bullet-${actualIndex}`} style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '0.85rem',
                                    }}>
                                        <div style={{
                                            marginTop: '0.4rem',
                                            width: '14px',
                                            height: '14px',
                                            background: `linear-gradient(45deg, ${accentColor}, ${accent2Color})`,
                                            borderRadius: '3px',
                                            transform: 'rotate(45deg)',
                                            flexShrink: 0,
                                        }} />
                                        <EditableElement
                                            id={`el-${slideIndex}-${actualIndex}`}
                                            text={bullet.text}
                                            tagName="div"
                                            isEditing={isEditing}
                                            onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                            onSelectElement={() => onElementClick?.(`el-${slideIndex}-${actualIndex}`, 'text', actualIndex)}
                                            style={{
                                                fontSize: '1rem',
                                                color: primaryColor,
                                                fontWeight: 500,
                                                lineHeight: 1.4,
                                            }}
                                            elementProperties={bullet.properties || bullet.element_properties}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <ElementsRenderer />
            </div>
        );
    }

    // Variant 4: Minimalist Card Stack (Gamma Inspired)
    if (variant === 4) {
        return (
            <div data-slide-container style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                background: `radial-gradient(circle at top right, ${accentColor}08, ${bgColor})`,
                fontFamily: "'Inter', sans-serif",
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem',
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '900px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}>
                    {/* Top Hero Section */}
                    <div style={{
                        display: 'flex',
                        gap: '2rem',
                        alignItems: 'center',
                    }}>
                        <div style={{ flex: '1.5' }}>
                            <TitleElement style={{
                                fontSize: '3rem',   // ✅ Scaled down from 4.2rem
                                fontWeight: 700,    // ✅ Scaled down from 800
                                color: primaryColor,
                                margin: '0 0 0.75rem',
                                letterSpacing: '-0.02em',
                                lineHeight: 1.1,
                            }} />

                            {subtitle && (
                                <SubtitleElement style={{
                                    fontSize: '1.2rem',
                                    color: textLightColor,
                                    lineHeight: 1.4,
                                    fontWeight: 400,
                                }} />
                            )}
                        </div>

                        <div style={{
                            flex: '1',
                            aspectRatio: '1',
                            borderRadius: '24px',
                            background: surfaceColor,
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
                            padding: '1rem',
                            position: 'relative',
                        }}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                background: `linear-gradient(135deg, ${accentColor}10, ${accent2Color}05)`,
                            }}>
                                {imageUrl && (
                                    <img src={imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="hero" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Features Row */}
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        width: '100%',
                    }}>
                        {bullets.slice(0, 3).map((bullet: any, idx: number) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            return (
                                <div key={`bullet-${actualIndex}`} style={{
                                    flex: 1,
                                    padding: '1.25rem',
                                    background: 'rgba(255, 255, 255, 0.6)',
                                    backdropFilter: 'blur(8px)',
                                    borderRadius: '16px',
                                    border: `1px solid ${accentColor}10`,
                                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.04)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem',
                                }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '6px',
                                        background: `${accentColor}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: accentColor,
                                        fontWeight: 800,
                                        fontSize: '0.65rem',
                                    }}>
                                        {idx + 1}
                                    </div>
                                    <EditableElement
                                        id={`el-${slideIndex}-${actualIndex}`}
                                        text={bullet.text}
                                        tagName="div"
                                        isEditing={isEditing}
                                        onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                        onSelectElement={() => onElementClick?.(`el-${slideIndex}-${actualIndex}`, 'text', actualIndex)}
                                        style={{
                                            fontSize: '0.9rem',
                                            color: primaryColor,
                                            fontWeight: 600,
                                            lineHeight: 1.4,
                                        }}
                                        elementProperties={bullet.properties || bullet.element_properties}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <ElementsRenderer />
            </div>
        );
    }

    // Variant 5: Professional Sidebar Hero (Gamma Inspired)
    return (
        <div data-slide-container style={{
            display: 'flex',
            height: '100%',
            background: bgColor,
            fontFamily: "'Inter', sans-serif",
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background Hero */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.85,
            }} />

            {/* Content Sidebar */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                height: '100%',
                width: '400px', // ✅ Scaled down from 450px
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(30px)',
                padding: '3rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxShadow: '15px 0 40px rgba(0,0,0,0.15)',
                borderRight: '1px solid rgba(255, 255, 255, 0.3)',
            }}>
                <div style={{
                    marginBottom: '2rem',
                }}>
                    <div style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: accentColor,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        marginBottom: '0.75rem',
                    }}>
                        Gamma Design
                    </div>

                    <TitleElement style={{
                        fontSize: '2.5rem', // ✅ Scaled down from 3rem
                        fontWeight: 700,    // ✅ Scaled down from 800
                        color: primaryColor,
                        margin: '0 0 1rem',
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                    }} />

                    {subtitle && (
                        <SubtitleElement style={{
                            fontSize: '1rem',
                            color: textLightColor,
                            lineHeight: 1.5,
                            fontWeight: 400,
                        }} />
                    )}
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}>
                    {bullets.slice(0, 4).map((bullet: any, idx: number) => {
                        const actualIndex = slide.elements.indexOf(bullet);
                        return (
                            <div key={`bullet-${actualIndex}`} style={{
                                padding: '0.85rem',
                                background: 'rgba(255, 255, 255, 0.4)',
                                borderRadius: '12px',
                                borderLeft: `3px solid ${accentColor}`,
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <EditableElement
                                    id={`el-${slideIndex}-${actualIndex}`}
                                    text={bullet.text}
                                    tagName="div"
                                    isEditing={isEditing}
                                    onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                    onSelectElement={() => onElementClick?.(`el-${slideIndex}-${actualIndex}`, 'text', actualIndex)}
                                    style={{
                                        fontSize: '0.9rem',
                                        color: primaryColor,
                                        fontWeight: 500,
                                        lineHeight: 1.4,
                                    }}
                                    elementProperties={bullet.properties || bullet.element_properties}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Graphic */}
                <div style={{
                    marginTop: '2rem',
                    display: 'flex',
                    gap: '0.4rem',
                }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: i === 1 ? accentColor : `${accentColor}20`,
                        }} />
                    ))}
                </div>
            </div>

            <ElementsRenderer />
        </div>
    );
};
