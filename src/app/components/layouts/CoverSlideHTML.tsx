import React from 'react';
import { Slide } from '@/types/presentation';
import { EditableElement } from '../editor/EditableElement';
import { UserElementsRenderer } from '../editor/UserElementsRenderer';
import { getBulletIcon } from '@/utils/bulletIcons';

interface CoverSlideHTMLProps {
    slide: Slide;
    theme: any;
    isEditing: boolean;
    onSlideUpdate?: (updates: Partial<Slide>) => void;
    onElementClick?: (elementId: string, type: string, index: number) => void;
    variant?: number;    slideIndex?: number;
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


    // Variant 1: Hero Glass Overlay (Gamma Inspired)
    if (variant === 1) {
        return (
            <div data-slide-container style={{
                display: 'flex',
                height: '100%',
                background: bgColor,
                position: 'relative',
                overflow: 'hidden',
                fontFamily: "'Raleway', sans-serif",
            }}>
                {/* Background Hero Image */}
                {imageUrl && (
                    <div
                        onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url(${imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: slide.image_properties?.opacity ?? 0.9,
                            cursor: isEditing ? 'pointer' : 'default',
                            filter: slide.image_properties?.shadow
                                ? `drop-shadow(${slide.image_properties.shadow.offsetX}px ${slide.image_properties.shadow.offsetY}px ${slide.image_properties.shadow.blur}px ${slide.image_properties.shadow.color})`
                                : undefined,
                        }}
                    />
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
                        <EditableElement
                            id={`title-${slideIndex}`}
                            text={title}
                            tagName="h1"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('title', val)}
                            onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text', -1)}
                            style={{
                                fontSize: '2.8rem', // ✅ Scaled down from 4rem
                                fontWeight: 700,    // ✅ Scaled down from 800
                                color: primaryColor,
                                margin: '0 0 1rem',
                                lineHeight: 1.2,
                                letterSpacing: '-0.02em',
                            }}
                            elementProperties={slide.slide_title?.properties || slide.slide_title?.element_properties}
                        />

                        {subtitle && (
                            <EditableElement
                                id={`subtitle-${slideIndex}`}
                                text={subtitle}
                                tagName="p"
                                isEditing={isEditing}
                                onChange={(val) => handleUpdate('subtitle', val)}
                                onSelectElement={() => onElementClick?.(`subtitle-${slideIndex}`, 'text', -2)}
                                style={{
                                    fontSize: '1.1rem', // ✅ Scaled down from 1.4rem
                                    color: secondaryColor,
                                    lineHeight: 1.5,
                                    margin: 0,
                                    fontWeight: 400,
                                }}
                                elementProperties={slide.subtitle?.properties || slide.subtitle?.element_properties}
                            />
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
                        const BulletIcon = getBulletIcon(bullet.text, idx);
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
                            }}>
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '9px',
                                    background: `${accentColor}18`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <BulletIcon style={{ fontSize: '15px', color: accentColor }} />
                                </div>
                                <EditableElement
                                    id={bullet.id || bullet.properties?.id || `el-${slideIndex}-${actualIndex}`}
                                    text={bullet.text}
                                    tagName="div"
                                    isEditing={isEditing}
                                    onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                    onSelectElement={() => {
                                        const bId = bullet.id || bullet.properties?.id || `el-${slideIndex}-${actualIndex}`;
                                        onElementClick?.(bId, 'text', actualIndex);
                                    }}
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

    // Variant 2: Modern Split Layout (Gamma Inspired)
    if (variant === 2) {
        return (
            <div data-slide-container style={{
                display: 'flex',
                height: '100%',
                background: bgColor,
                fontFamily: "'Raleway', sans-serif",
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

                    <EditableElement
                        id={`title-${slideIndex}`}
                        text={title}
                        tagName="h1"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text', -1)}
                        style={{
                            fontSize: '2.5rem', // ✅ Scaled down from 3.8rem
                            fontWeight: 700,    // ✅ Scaled down from 900
                            color: primaryColor,
                            margin: '0 0 1rem',
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                        }}
                        elementProperties={slide.slide_title?.properties || slide.slide_title?.element_properties}
                    />

                    {subtitle && (
                        <EditableElement
                            id={`subtitle-${slideIndex}`}
                            text={subtitle}
                            tagName="p"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('subtitle', val)}
                            onSelectElement={() => onElementClick?.(`subtitle-${slideIndex}`, 'text', -2)}
                            style={{
                                fontSize: '1rem',
                                color: textLightColor,
                                lineHeight: 1.5,
                                margin: '0 0 2rem',
                                fontWeight: 400,
                            }}
                            elementProperties={slide.subtitle?.properties || slide.subtitle?.element_properties}
                        />
                    )}

                    <div style={{
                        display: 'grid',
                        gap: '0.75rem',
                    }}>
                        {bullets.slice(0, 3).map((bullet: any, idx: number) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            const BulletIcon = getBulletIcon(bullet.text, idx);
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
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '9px',
                                        background: `${accentColor}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <BulletIcon style={{ fontSize: '16px', color: accentColor }} />
                                    </div>
                                    <EditableElement
                                        id={bullet.id || bullet.properties?.id || `el-${slideIndex}-${actualIndex}`}
                                        text={bullet.text}
                                        tagName="div"
                                        isEditing={isEditing}
                                        onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                        onSelectElement={() => {
                                            const bId = bullet.id || bullet.properties?.id || `el-${slideIndex}-${actualIndex}`;
                                            onElementClick?.(bId, 'text', actualIndex);
                                        }}
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
                            onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}
                            src={imageUrl}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                cursor: isEditing ? 'pointer' : 'default',
                                opacity: slide.image_properties?.opacity ?? 1,
                                borderRadius: `${slide.image_properties?.borderRadius ?? 0}px`,
                                filter: slide.image_properties?.shadow
                                    ? `drop-shadow(${slide.image_properties.shadow.offsetX}px ${slide.image_properties.shadow.offsetY}px ${slide.image_properties.shadow.blur}px ${slide.image_properties.shadow.color})`
                                    : undefined,
                            }}
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
                                flexShrink: 0,
                            }}>
                                {(() => {
                                    const BadgeIcon = getBulletIcon(title || subtitle, 0);
                                    return <BadgeIcon style={{ fontSize: '19px', color: 'white' }} />;
                                })()}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: primaryColor, fontWeight: 600, lineHeight: 1.2 }}>
                                {subtitle ? subtitle.slice(0, 40) : title.slice(0, 40)}
                            </div>
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

    // Variant 3: Diagonal Geometric Hero (Gamma Inspired)
    if (variant === 3) {
        return (
            <div data-slide-container style={{
                display: 'flex',
                height: '100%',
                background: bgColor,
                position: 'relative',
                overflow: 'hidden',
                fontFamily: "'Raleway', sans-serif",
            }}>
                {/* Large Background Hero */}
                <div
                    onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}
                    style={{
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
                        cursor: isEditing ? 'pointer' : 'default',
                        opacity: slide.image_properties?.opacity ?? 1,
                        filter: slide.image_properties?.shadow
                            ? `drop-shadow(${slide.image_properties.shadow.offsetX}px ${slide.image_properties.shadow.offsetY}px ${slide.image_properties.shadow.blur}px ${slide.image_properties.shadow.color})`
                            : undefined,
                    }}
                />

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

                        <EditableElement
                            id={`title-${slideIndex}`}
                            text={title}
                            tagName="h1"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('title', val)}
                            onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text', -1)}
                            style={{
                                fontSize: '2.8rem', // ✅ Scaled down from 3.5rem
                                fontWeight: 700,    // ✅ Scaled down from 800
                                color: primaryColor,
                                margin: '0 0 1rem',
                                lineHeight: 1.2,
                            }}
                            elementProperties={slide.slide_title?.properties || slide.slide_title?.element_properties}
                        />

                        {subtitle && (
                            <EditableElement
                                id={`subtitle-${slideIndex}`}
                                text={subtitle}
                                tagName="p"
                                isEditing={isEditing}
                                onChange={(val) => handleUpdate('subtitle', val)}
                                onSelectElement={() => onElementClick?.(`subtitle-${slideIndex}`, 'text', -2)}
                                style={{
                                    fontSize: '1.05rem',
                                    color: textLightColor,
                                    lineHeight: 1.6,
                                    margin: '0 0 2rem',
                                }}
                                elementProperties={slide.subtitle?.properties || slide.subtitle?.element_properties}
                            />
                        )}

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.25rem',
                        }}>
                            {bullets.slice(0, 3).map((bullet: any, idx: number) => {
                                const actualIndex = slide.elements.indexOf(bullet);
                                const BulletIcon = getBulletIcon(bullet.text, idx);
                                return (
                                    <div key={`bullet-${actualIndex}`} style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '0.85rem',
                                    }}>
                                        <div style={{
                                            width: '28px',
                                            height: '28px',
                                            background: `linear-gradient(135deg, ${accentColor}, ${accent2Color})`,
                                            borderRadius: '9px',
                                            flexShrink: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: `0 4px 10px ${accentColor}35`,
                                        }}>
                                            <BulletIcon style={{ fontSize: '15px', color: '#fff' }} />
                                        </div>
                                        <EditableElement
                                            id={bullet.id || bullet.properties?.id || `el-${slideIndex}-${actualIndex}`}
                                            text={bullet.text}
                                            tagName="div"
                                            isEditing={isEditing}
                                            onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                            onSelectElement={() => {
                                                const bId = bullet.id || bullet.properties?.id || `el-${slideIndex}-${actualIndex}`;
                                                onElementClick?.(bId, 'text', actualIndex);
                                            }}
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

    // Variant 4: Minimalist Card Stack (Gamma Inspired)
    if (variant === 4) {
        return (
            <div data-slide-container style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                background: `radial-gradient(circle at top right, ${accentColor}08, ${bgColor})`,
                fontFamily: "'Raleway', sans-serif",
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
                            <EditableElement
                                id={`title-${slideIndex}`}
                                text={title}
                                tagName="h1"
                                isEditing={isEditing}
                                onChange={(val) => handleUpdate('title', val)}
                                onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text', -1)}
                                style={{
                                    fontSize: '3rem',   // ✅ Scaled down from 4.2rem
                                    fontWeight: 700,    // ✅ Scaled down from 800
                                    color: primaryColor,
                                    margin: '0 0 0.75rem',
                                    letterSpacing: '-0.02em',
                                    lineHeight: 1.1,
                                }}
                                elementProperties={slide.slide_title?.properties || slide.slide_title?.element_properties}
                            />

                            {subtitle && (
                                <EditableElement
                                    id={`subtitle-${slideIndex}`}
                                    text={subtitle}
                                    tagName="p"
                                    isEditing={isEditing}
                                    onChange={(val) => handleUpdate('subtitle', val)}
                                    onSelectElement={() => onElementClick?.(`subtitle-${slideIndex}`, 'text', -2)}
                                    style={{
                                        fontSize: '1.2rem',
                                        color: textLightColor,
                                        lineHeight: 1.4,
                                        fontWeight: 400,
                                    }}
                                    elementProperties={slide.subtitle?.properties || slide.subtitle?.element_properties}
                                />
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
                                    <img
                                        onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}
                                        src={imageUrl}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            cursor: isEditing ? 'pointer' : 'default',
                                            opacity: slide.image_properties?.opacity ?? 1,
                                            borderRadius: `${slide.image_properties?.borderRadius ?? 0}px`,
                                            filter: slide.image_properties?.shadow
                                                ? `drop-shadow(${slide.image_properties.shadow.offsetX}px ${slide.image_properties.shadow.offsetY}px ${slide.image_properties.shadow.blur}px ${slide.image_properties.shadow.color})`
                                                : undefined,
                                        }}
                                        alt="hero"
                                    />
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
                            const BulletIcon = getBulletIcon(bullet.text, idx);
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
                                        width: '26px',
                                        height: '26px',
                                        borderRadius: '8px',
                                        background: `${accentColor}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: accentColor,
                                    }}>
                                        <BulletIcon style={{ fontSize: '14px' }} />
                                    </div>
                                    <EditableElement
                                        id={bullet.id || bullet.properties?.id || `el-${slideIndex}-${actualIndex}`}
                                        text={bullet.text}
                                        tagName="div"
                                        isEditing={isEditing}
                                        onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                        onSelectElement={() => {
                                            const bId = bullet.id || bullet.properties?.id || `el-${slideIndex}-${actualIndex}`;
                                            onElementClick?.(bId, 'text', actualIndex);
                                        }}
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

    // Variant 5: Professional Sidebar Hero (Gamma Inspired)
    return (
        <div data-slide-container style={{
            display: 'flex',
            height: '100%',
            background: bgColor,
            fontFamily: "'Raleway', sans-serif",
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background Hero */}
            <div
                onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: slide.image_properties?.opacity ?? 0.85,
                    cursor: isEditing ? 'pointer' : 'default',
                    filter: slide.image_properties?.shadow
                        ? `drop-shadow(${slide.image_properties.shadow.offsetX}px ${slide.image_properties.shadow.offsetY}px ${slide.image_properties.shadow.blur}px ${slide.image_properties.shadow.color})`
                        : undefined,
                }}
            />

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

                    <EditableElement
                        id={`title-${slideIndex}`}
                        text={title}
                        tagName="h1"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text', -1)}
                        style={{
                            fontSize: '2.5rem', // ✅ Scaled down from 3rem
                            fontWeight: 700,    // ✅ Scaled down from 800
                            color: primaryColor,
                            margin: '0 0 1rem',
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                        }}
                        elementProperties={slide.slide_title?.properties || slide.slide_title?.element_properties}
                    />

                    {subtitle && (
                        <EditableElement
                            id={`subtitle-${slideIndex}`}
                            text={subtitle}
                            tagName="p"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('subtitle', val)}
                            onSelectElement={() => onElementClick?.(`subtitle-${slideIndex}`, 'text', -2)}
                            style={{
                                fontSize: '1rem',
                                color: textLightColor,
                                lineHeight: 1.5,
                                fontWeight: 400,
                            }}
                            elementProperties={slide.subtitle?.properties || slide.subtitle?.element_properties}
                        />
                    )}
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}>
                    {bullets.slice(0, 4).map((bullet: any, idx: number) => {
                        const actualIndex = slide.elements.indexOf(bullet);
                        const BulletIcon = getBulletIcon(bullet.text, idx);
                        return (
                            <div key={`bullet-${actualIndex}`} style={{
                                padding: '0.85rem',
                                background: 'rgba(255, 255, 255, 0.4)',
                                borderRadius: '12px',
                                borderLeft: `3px solid ${accentColor}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.65rem',
                            }}>
                                <BulletIcon style={{ fontSize: '15px', color: accentColor, flexShrink: 0 }} />
                                <EditableElement
                                    id={bullet.id || bullet.properties?.id || `el-${slideIndex}-${actualIndex}`}
                                    text={bullet.text}
                                    tagName="div"
                                    isEditing={isEditing}
                                    onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                    onSelectElement={() => {
                                        const bId = bullet.id || bullet.properties?.id || `el-${slideIndex}-${actualIndex}`;
                                        onElementClick?.(bId, 'text', actualIndex);
                                    }}
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

            <UserElementsRenderer
                elements={slide.elements || []}
                isEditing={isEditing}
                onElementClick={onElementClick}
                onElementUpdate={handleElementUpdate}
                slideIndex={slideIndex}
            />
        </div>
    );

    // ─── Variant 6: Bold Cinematic Full-Bleed ─────────────────────────────────
    // Full-bleed image, deep dark scrim from bottom, giant white title, numbered bullet chips
    if (variant === 6) {
        return (
            <div data-slide-container style={{
                position: 'relative',
                height: '100%',
                overflow: 'hidden',
                fontFamily: "'Raleway', sans-serif",
                background: '#0a0a0a',
            }}>
                {/* Full-bleed image */}
                {imageUrl && (
                    <div
                        onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}
                        style={{
                            position: 'absolute', inset: 0,
                            backgroundImage: `url(${imageUrl})`,
                            backgroundSize: 'cover', backgroundPosition: 'center',
                            opacity: slide.image_properties?.opacity ?? 0.55,
                            cursor: isEditing ? 'pointer' : 'default',
                        }}
                    />
                )}
                {/* Dark gradient scrim */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.1) 100%)',
                }} />
                {/* Accent color top stripe */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                    background: `linear-gradient(90deg, ${accentColor}, ${accent2Color})`,
                }} />

                {/* Content positioned at bottom */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '2.5rem 3rem',
                    zIndex: 2,
                }}>
                    <EditableElement
                        id={`title-${slideIndex}`} text={title} tagName="h1"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text', -1)}
                        style={{
                            fontSize: '3.2rem', fontWeight: 800, color: '#ffffff',
                            margin: '0 0 0.75rem', lineHeight: 1.1,
                            letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                        }}
                        elementProperties={slide.slide_title?.properties || slide.slide_title?.element_properties}
                    />
                    {subtitle && (
                        <EditableElement
                            id={`subtitle-${slideIndex}`} text={subtitle} tagName="p"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('subtitle', val)}
                            onSelectElement={() => onElementClick?.(`subtitle-${slideIndex}`, 'text', -2)}
                            style={{
                                fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)',
                                margin: '0 0 1.75rem', lineHeight: 1.5, fontWeight: 400,
                            }}
                            elementProperties={slide.subtitle?.properties || slide.subtitle?.element_properties}
                        />
                    )}
                    {/* Numbered bullet chips in a horizontal row */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {bullets.slice(0, 3).map((bullet: any, idx: number) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            return (
                                <div key={`bullet-${actualIndex}`} style={{
                                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                                    background: 'rgba(255,255,255,0.12)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '100px', padding: '0.5rem 1rem',
                                    maxWidth: '280px',
                                }}>
                                    <span style={{
                                        width: '20px', height: '20px', borderRadius: '50%',
                                        background: accentColor, color: '#fff',
                                        fontSize: '0.7rem', fontWeight: 800,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>{idx + 1}</span>
                                    <EditableElement
                                        id={bullet.id || `el-${slideIndex}-${actualIndex}`}
                                        text={bullet.text} tagName="div"
                                        isEditing={isEditing}
                                        onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                        onSelectElement={() => onElementClick?.(`el-${slideIndex}-${actualIndex}`, 'text', actualIndex)}
                                        style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600, lineHeight: 1.3 }}
                                        elementProperties={bullet.properties}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
                <UserElementsRenderer elements={slide.elements || []} isEditing={isEditing} onElementClick={onElementClick} onElementUpdate={handleElementUpdate} slideIndex={slideIndex} />
            </div>
        );
    }

    // ─── Variant 7: Magazine Bold Split ──────────────────────────────────────
    // Left half: solid accent gradient with big white title. Right half: image.
    if (variant === 7) {
        return (
            <div data-slide-container style={{
                display: 'grid', gridTemplateColumns: '48% 52%',
                height: '100%', overflow: 'hidden',
                fontFamily: "'Raleway', sans-serif",
            }}>
                {/* Left accent panel */}
                <div style={{
                    background: `linear-gradient(145deg, ${accentColor} 0%, ${accent2Color} 100%)`,
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between', padding: '2.5rem',
                    position: 'relative', overflow: 'hidden',
                }}>
                    {/* Background texture circles */}
                    <div style={{
                        position: 'absolute', top: '-60px', right: '-60px',
                        width: '220px', height: '220px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.08)',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '-40px', left: '-40px',
                        width: '160px', height: '160px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.06)',
                    }} />

                    {/* Top label */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '6px', padding: '0.35rem 0.85rem',
                        width: 'fit-content',
                    }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />
                        <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Presentation</span>
                    </div>

                    {/* Title */}
                    <div>
                        <EditableElement
                            id={`title-${slideIndex}`} text={title} tagName="h1"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('title', val)}
                            onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text', -1)}
                            style={{
                                fontSize: '2.6rem', fontWeight: 800, color: '#ffffff',
                                margin: '0 0 1rem', lineHeight: 1.1, letterSpacing: '-0.02em',
                            }}
                            elementProperties={slide.slide_title?.properties || slide.slide_title?.element_properties}
                        />
                        {subtitle && (
                            <EditableElement
                                id={`subtitle-${slideIndex}`} text={subtitle} tagName="p"
                                isEditing={isEditing}
                                onChange={(val) => handleUpdate('subtitle', val)}
                                onSelectElement={() => onElementClick?.(`subtitle-${slideIndex}`, 'text', -2)}
                                style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, margin: 0 }}
                                elementProperties={slide.subtitle?.properties || slide.subtitle?.element_properties}
                            />
                        )}
                    </div>

                    {/* Bullet row at bottom */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {bullets.slice(0, 3).map((bullet: any, idx: number) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            return (
                                <div key={actualIndex} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.7)', marginTop: '0.55rem', flexShrink: 0 }} />
                                    <EditableElement
                                        id={`el-${slideIndex}-${actualIndex}`} text={bullet.text} tagName="div"
                                        isEditing={isEditing}
                                        onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                        onSelectElement={() => onElementClick?.(`el-${slideIndex}-${actualIndex}`, 'text', actualIndex)}
                                        style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.4, fontWeight: 500 }}
                                        elementProperties={bullet.properties}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right image panel */}
                <div
                    onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}
                    style={{
                        backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        background: imageUrl ? undefined : `linear-gradient(135deg, ${accentColor}30, ${accent2Color}20)`,
                        cursor: isEditing ? 'pointer' : 'default',
                        position: 'relative', overflow: 'hidden',
                        opacity: slide.image_properties?.opacity ?? 1,
                    }}
                >
                    {!imageUrl && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: `${accentColor}60`, fontSize: '1rem', fontWeight: 600,
                        }}>Image</div>
                    )}
                </div>
                <UserElementsRenderer elements={slide.elements || []} isEditing={isEditing} onElementClick={onElementClick} onElementUpdate={handleElementUpdate} slideIndex={slideIndex} />
            </div>
        );
    }

    // ─── Variant 8: Glassmorphism Dark ────────────────────────────────────────
    // Dark background with abstract blob gradients, centered frosted-glass content card
    if (variant === 8) {
        return (
            <div data-slide-container style={{
                position: 'relative', height: '100%', overflow: 'hidden',
                fontFamily: "'Raleway', sans-serif",
                background: `linear-gradient(135deg, #0d0d1a 0%, #1a0d2e 50%, #0d1a1a 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {/* Ambient blobs */}
                <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: `${accentColor}25`, filter: 'blur(80px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: `${accent2Color}20`, filter: 'blur(70px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '40%', left: '40%', width: '200px', height: '200px', borderRadius: '50%', background: `${accentColor}12`, filter: 'blur(50px)', pointerEvents: 'none' }} />

                {/* If image, show it faintly in background */}
                {imageUrl && (
                    <div
                        onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}
                        style={{
                            position: 'absolute', inset: 0,
                            backgroundImage: `url(${imageUrl})`,
                            backgroundSize: 'cover', backgroundPosition: 'center',
                            opacity: 0.1, cursor: isEditing ? 'pointer' : 'default',
                        }}
                    />
                )}

                {/* Center glass card */}
                <div style={{
                    position: 'relative', zIndex: 2,
                    width: '80%', maxWidth: '700px',
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '28px',
                    padding: '2.5rem 3rem',
                    boxShadow: `0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`,
                }}>
                    {/* Pill accent tag */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        background: `${accentColor}22`, border: `1px solid ${accentColor}40`,
                        borderRadius: '100px', padding: '0.3rem 0.9rem', marginBottom: '1.25rem',
                    }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: accentColor }} />
                        <span style={{ fontSize: '0.7rem', color: accentColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Overview</span>
                    </div>

                    <EditableElement
                        id={`title-${slideIndex}`} text={title} tagName="h1"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text', -1)}
                        style={{
                            fontSize: '2.6rem', fontWeight: 800, color: '#ffffff',
                            margin: '0 0 1rem', lineHeight: 1.15, letterSpacing: '-0.025em',
                        }}
                        elementProperties={slide.slide_title?.properties || slide.slide_title?.element_properties}
                    />
                    {subtitle && (
                        <EditableElement
                            id={`subtitle-${slideIndex}`} text={subtitle} tagName="p"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('subtitle', val)}
                            onSelectElement={() => onElementClick?.(`subtitle-${slideIndex}`, 'text', -2)}
                            style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 2rem', lineHeight: 1.5 }}
                            elementProperties={slide.subtitle?.properties || slide.subtitle?.element_properties}
                        />
                    )}

                    {/* Bullet grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {bullets.slice(0, 4).map((bullet: any, idx: number) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            const BulletIcon = getBulletIcon(bullet.text, idx);
                            return (
                                <div key={actualIndex} style={{
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '12px', padding: '0.75rem 1rem',
                                    display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
                                }}>
                                    <BulletIcon style={{ fontSize: '14px', color: accentColor, marginTop: '2px', flexShrink: 0 }} />
                                    <EditableElement
                                        id={`el-${slideIndex}-${actualIndex}`} text={bullet.text} tagName="div"
                                        isEditing={isEditing}
                                        onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                        onSelectElement={() => onElementClick?.(`el-${slideIndex}-${actualIndex}`, 'text', actualIndex)}
                                        style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, fontWeight: 500 }}
                                        elementProperties={bullet.properties}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
                <UserElementsRenderer elements={slide.elements || []} isEditing={isEditing} onElementClick={onElementClick} onElementUpdate={handleElementUpdate} slideIndex={slideIndex} />
            </div>
        );
    }

    // ─── Variant 9: Clean Executive Minimal ───────────────────────────────────
    // White/light bg, large bold title with colored underbar, image floated top-right
    if (variant === 9) {
        return (
            <div data-slide-container style={{
                display: 'flex', height: '100%', overflow: 'hidden',
                fontFamily: "'Raleway', sans-serif",
                background: bgColor, position: 'relative',
            }}>
                {/* Left content */}
                <div style={{
                    flex: '1.1', display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', padding: '3rem 2.5rem 3rem 3.5rem',
                }}>
                    {/* Category label */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem',
                    }}>
                        <div style={{ width: '28px', height: '3px', background: accentColor, borderRadius: '2px' }} />
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Presentation</span>
                    </div>

                    <EditableElement
                        id={`title-${slideIndex}`} text={title} tagName="h1"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text', -1)}
                        style={{
                            fontSize: '2.8rem', fontWeight: 800, color: primaryColor,
                            margin: '0 0 0.5rem', lineHeight: 1.15, letterSpacing: '-0.025em',
                        }}
                        elementProperties={slide.slide_title?.properties || slide.slide_title?.element_properties}
                    />
                    {/* Accent underbar */}
                    <div style={{ width: '60px', height: '4px', background: `linear-gradient(90deg, ${accentColor}, ${accent2Color})`, borderRadius: '3px', marginBottom: '1.25rem' }} />

                    {subtitle && (
                        <EditableElement
                            id={`subtitle-${slideIndex}`} text={subtitle} tagName="p"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('subtitle', val)}
                            onSelectElement={() => onElementClick?.(`subtitle-${slideIndex}`, 'text', -2)}
                            style={{ fontSize: '1rem', color: textLightColor, margin: '0 0 2rem', lineHeight: 1.6 }}
                            elementProperties={slide.subtitle?.properties || slide.subtitle?.element_properties}
                        />
                    )}

                    {/* Clean bullet list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {bullets.slice(0, 3).map((bullet: any, idx: number) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            return (
                                <div key={actualIndex} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '24px', height: '24px', borderRadius: '6px',
                                        background: `${accentColor}15`, border: `1px solid ${accentColor}30`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0, color: accentColor, fontSize: '0.7rem', fontWeight: 800,
                                    }}>{String.fromCharCode(65 + idx)}</div>
                                    <EditableElement
                                        id={`el-${slideIndex}-${actualIndex}`} text={bullet.text} tagName="div"
                                        isEditing={isEditing}
                                        onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                        onSelectElement={() => onElementClick?.(`el-${slideIndex}-${actualIndex}`, 'text', actualIndex)}
                                        style={{ fontSize: '0.95rem', color: primaryColor, lineHeight: 1.5, fontWeight: 500 }}
                                        elementProperties={bullet.properties}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right image area */}
                <div style={{ flex: '0.9', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 2.5rem 2rem 1.5rem' }}>
                    {/* Decorative background circle */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%', height: '90%',
                        background: `${accentColor}08`,
                        borderRadius: '50%',
                    }} />
                    <div
                        onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}
                        style={{
                            width: '100%', height: '78%',
                            borderRadius: '24px',
                            background: imageUrl ? `url(${imageUrl}) center/cover` : `linear-gradient(135deg, ${accentColor}20, ${accent2Color}15)`,
                            boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                            cursor: isEditing ? 'pointer' : 'default',
                            opacity: slide.image_properties?.opacity ?? 1,
                            position: 'relative',
                        }}
                    >
                        {!imageUrl && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `${accentColor}50`, fontSize: '0.9rem' }}>Image</div>}
                    </div>
                </div>
                <UserElementsRenderer elements={slide.elements || []} isEditing={isEditing} onElementClick={onElementClick} onElementUpdate={handleElementUpdate} slideIndex={slideIndex} />
            </div>
        );
    }

    // ─── Variant 10: Dashboard / App-UI Style ─────────────────────────────────
    // Mimics a SaaS dashboard — top bar, image in mock browser frame, metrics at side
    return (
        <div data-slide-container style={{
            display: 'flex', flexDirection: 'column',
            height: '100%', overflow: 'hidden',
            fontFamily: "'Raleway', sans-serif",
            background: surfaceColor, position: 'relative',
        }}>
            {/* Top nav bar */}
            <div style={{
                height: '44px', background: bgColor,
                borderBottom: `1px solid ${accentColor}15`,
                display: 'flex', alignItems: 'center',
                padding: '0 1.5rem', gap: '1rem', flexShrink: 0,
            }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }} />
                <div style={{ flex: 1, height: '22px', background: `${accentColor}10`, borderRadius: '6px', display: 'flex', alignItems: 'center', paddingLeft: '0.75rem' }}>
                    <span style={{ fontSize: '0.65rem', color: textLightColor, fontWeight: 500 }}>slidexy.ai · {title.slice(0, 40)}</span>
                </div>
            </div>

            {/* Main content grid */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1rem', padding: '1rem', overflow: 'hidden' }}>
                {/* Left: image in browser-style frame + title overlay */}
                <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: bgColor, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                    {/* Browser chrome */}
                    <div style={{
                        height: '32px', background: `${accentColor}10`,
                        display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '0.4rem',
                    }}>
                        {[accentColor, accent2Color, `${accentColor}60`].map((c, i) => (
                            <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: c }} />
                        ))}
                    </div>
                    {/* Image */}
                    <div
                        onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}
                        style={{
                            height: 'calc(100% - 32px)',
                            backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                            backgroundSize: 'cover', backgroundPosition: 'center',
                            background: imageUrl ? undefined : `linear-gradient(135deg, ${accentColor}15, ${accent2Color}10)`,
                            cursor: isEditing ? 'pointer' : 'default',
                            opacity: slide.image_properties?.opacity ?? 1,
                            position: 'relative',
                        }}
                    >
                        {/* Bottom overlay strip */}
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                            padding: '2rem 1.5rem 1.25rem',
                        }}>
                            <EditableElement
                                id={`title-${slideIndex}`} text={title} tagName="h1"
                                isEditing={isEditing}
                                onChange={(val) => handleUpdate('title', val)}
                                onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text', -1)}
                                style={{
                                    fontSize: '2rem', fontWeight: 800, color: '#fff',
                                    margin: 0, lineHeight: 1.2, letterSpacing: '-0.02em',
                                }}
                                elementProperties={slide.slide_title?.properties || slide.slide_title?.element_properties}
                            />
                            {subtitle && (
                                <EditableElement
                                    id={`subtitle-${slideIndex}`} text={subtitle} tagName="p"
                                    isEditing={isEditing}
                                    onChange={(val) => handleUpdate('subtitle', val)}
                                    onSelectElement={() => onElementClick?.(`subtitle-${slideIndex}`, 'text', -2)}
                                    style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', margin: '0.4rem 0 0', lineHeight: 1.4 }}
                                    elementProperties={slide.subtitle?.properties || slide.subtitle?.element_properties}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: metric cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflow: 'hidden' }}>
                    {bullets.slice(0, 3).map((bullet: any, idx: number) => {
                        const actualIndex = slide.elements.indexOf(bullet);
                        const BulletIcon = getBulletIcon(bullet.text, idx);
                        const colors = [accentColor, accent2Color, `${accentColor}cc`];
                        return (
                            <div key={actualIndex} style={{
                                background: bgColor, borderRadius: '14px', padding: '1rem 1.25rem',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                border: `1px solid ${colors[idx % 3]}20`,
                                flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem',
                            }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '10px',
                                    background: `${colors[idx % 3]}15`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <BulletIcon style={{ fontSize: '16px', color: colors[idx % 3] }} />
                                </div>
                                <EditableElement
                                    id={`el-${slideIndex}-${actualIndex}`} text={bullet.text} tagName="div"
                                    isEditing={isEditing}
                                    onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                    onSelectElement={() => onElementClick?.(`el-${slideIndex}-${actualIndex}`, 'text', actualIndex)}
                                    style={{ fontSize: '0.82rem', color: primaryColor, lineHeight: 1.4, fontWeight: 600 }}
                                    elementProperties={bullet.properties}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            <UserElementsRenderer elements={slide.elements || []} isEditing={isEditing} onElementClick={onElementClick} onElementUpdate={handleElementUpdate} slideIndex={slideIndex} />
        </div>
    );
};
