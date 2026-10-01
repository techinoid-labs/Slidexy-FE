"use client";
import React from 'react';
import { EditableElement } from '../editor/EditableElement';
import { UserElementsRenderer } from '../editor/UserElementsRenderer';
import { getContrastTextColor } from '@/utils/colorUtils';
import { getBulletIcon } from '@/utils/bulletIcons';

interface ContentLeftImageHTMLProps {
    slide: any;
    theme: any;
    variant?: 1 | 2 | 3 | 4 | 5;
    isEditing?: boolean;
    onSlideUpdate?: (updatedSlide: any) => void;
    onElementClick?: (elementId: string, elementType: string, elementIndex?: number) => void;
    slideIndex?: number;
}

export const ContentLeftImageHTML: React.FC<ContentLeftImageHTMLProps> = ({
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
            if (slide.elements[index]) {
                updatedSlide.elements = [...slide.elements];
                updatedSlide.elements[index] = { ...slide.elements[index], text: newText };
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

    const title = slide.slide_title?.text || "Slide Title";
    const subtitle = slide.subtitle?.text || '';
    const bullets = slide.elements?.filter((el: any) => el.element_type === 'bullet_point') || [];
    const imageUrl = slide.image_url;

    // Theme colors
    const bgColor = theme?.backgroundColor || '#F7FAFC';
    const primaryColor = theme?.primaryColor || '#1A202C';
    const accentColor = theme?.artPalette?.[0] || '#00C4B4';
    const accent2Color = theme?.artPalette?.[1] || '#7C3AED';
    const textColor = '#1a202c';

    // Variant 1: Clean Card Layout with Elegant Spacing
    if (variant === 1) {
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: '45% 55%',
                height: '100%',
                background: bgColor,
                overflow: 'hidden',
                fontFamily: "'Raleway', sans-serif",
                position: 'relative',
            }}>
                {/* Left Image with Card Style */}
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
                        borderRadius: `${slide.image_properties?.borderRadius ?? 20}px`,
                        border: `2px solid ${accentColor}30`,
                        boxShadow: slide.image_properties?.shadow
                            ? `${slide.image_properties.shadow.offsetX}px ${slide.image_properties.shadow.offsetY}px ${slide.image_properties.shadow.blur}px ${slide.image_properties.shadow.color}`
                            : '0 12px 32px rgba(0,0,0,0.12)',
                        opacity: slide.image_properties?.opacity ?? 1,
                        cursor: isEditing ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#cbd5e0',
                        fontSize: '1.1rem',
                        position: 'relative',
                    }}
                        onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}>
                        {!imageUrl && 'Image'}
                        <div style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '4px',
                            height: '100%',
                            background: accentColor,
                            borderRadius: '20px 0 0 20px',
                        }} />
                    </div>
                </div>

                {/* Right Content */}
                <div style={{
                    padding: '3.5rem 3rem 3.5rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    <EditableElement
                        id={`title-${slideIndex}`}
                        text={title}
                        tagName="h2"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                        style={{
                            fontSize: '2.2rem',
                            fontWeight: 700,
                            color: primaryColor,
                            marginBottom: '0.5rem',
                            lineHeight: 1.2
                        }}
                        elementProperties={slide.slide_title?.properties}
                    />
                    {subtitle && (
                        <EditableElement
                            id={`subtitle-${slideIndex}`}
                            text={subtitle}
                            tagName="p"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('subtitle', val)}
                            onSelectElement={() => onElementClick?.(`subtitle-${slideIndex}`, 'text')}
                            style={{
                                fontSize: '1.05rem',
                                fontWeight: 400,
                                lineHeight: 1.45,
                                color: primaryColor,
                                opacity: 0.72,
                                marginTop: 0,
                                marginBottom: '2rem',
                            }}
                            elementProperties={slide.subtitle?.properties}
                        />
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.3rem' }}>
                        {bullets.slice(0, 4).map((bullet: any) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            const bulletIndex = bullets.indexOf(bullet);
                            const BulletIcon = getBulletIcon(bullet.text, bulletIndex);
                            return (
                                <div key={actualIndex} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '10px',
                                        background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}0d)`,
                                        border: `1px solid ${accentColor}30`,
                                        marginTop: '0.1rem',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <BulletIcon style={{ fontSize: '17px', color: accentColor }} />
                                    </div>
                                    <EditableElement
                                        id={`bullet-${actualIndex}`}
                                        text={bullet.text}
                                        tagName="div"
                                        isEditing={isEditing}
                                        onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                        onSelectElement={() => onElementClick?.(`el-${slideIndex}-${actualIndex}`, 'text', actualIndex)}
                                        style={{
                                            fontSize: '1.15rem',
                                            color: '#1a202c',
                                            lineHeight: 1.6,
                                            flex: 1
                                        }}
                                        elementProperties={bullet.properties}
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

    // Variant 2: Modern Split with Gradient Accent
    if (variant === 2) {
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: '48% 52%',
                height: '100%',
                background: bgColor,
                overflow: 'hidden',
                fontFamily: "'Raleway', sans-serif",
                position: 'relative',
            }}>
                {/* Gradient background panel */}
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '48%',
                    height: '100%',
                    background: `linear-gradient(135deg, ${accentColor}08, transparent)`,
                    zIndex: 0,
                }} />

                {/* Left Image */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3rem 2rem',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <div style={{
                        width: '100%',
                        height: '80%',
                        background: imageUrl ? `url(${imageUrl}) center/cover` : `linear-gradient(135deg, ${accentColor}25, ${accent2Color}20)`,
                        borderRadius: `${slide.image_properties?.borderRadius ?? 24}px`,
                        boxShadow: slide.image_properties?.shadow
                            ? `${slide.image_properties.shadow.offsetX}px ${slide.image_properties.shadow.offsetY}px ${slide.image_properties.shadow.blur}px ${slide.image_properties.shadow.color}`
                            : '0 16px 48px rgba(0,0,0,0.15)',
                        opacity: slide.image_properties?.opacity ?? 1,
                        cursor: isEditing ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#cbd5e0',
                        fontSize: '1.1rem',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                        onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}>
                        {!imageUrl && 'Image'}
                        {/* Decorative corner */}
                        <div style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '80px',
                            height: '80px',
                            background: accentColor,
                            borderRadius: '24px 0 24px 0',
                            opacity: 0.9,
                        }} />
                    </div>
                </div>

                {/* Right Content */}
                <div style={{
                    padding: '3.5rem 3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    <EditableElement
                        id={`title-${slideIndex}`}
                        text={title}
                        tagName="h2"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                        style={{
                            fontSize: '2.2rem',
                            fontWeight: 700,
                            color: primaryColor,
                            marginBottom: '0.5rem',
                            lineHeight: 1.2
                        }}
                        elementProperties={slide.slide_title?.properties}
                    />
                    {subtitle && (
                        <EditableElement
                            id={`subtitle-${slideIndex}`}
                            text={subtitle}
                            tagName="p"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('subtitle', val)}
                            onSelectElement={() => onElementClick?.(`subtitle-${slideIndex}`, 'text')}
                            style={{
                                fontSize: '1.05rem',
                                fontWeight: 400,
                                lineHeight: 1.45,
                                color: primaryColor,
                                opacity: 0.72,
                                marginTop: 0,
                                marginBottom: '2rem',
                            }}
                            elementProperties={slide.subtitle?.properties}
                        />
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        {bullets.slice(0, 4).map((bullet: any) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            const bulletIndex = bullets.indexOf(bullet);
                            const BulletIcon = getBulletIcon(bullet.text, bulletIndex);
                            return (
                                <div key={actualIndex} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        minWidth: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        background: `${accentColor}18`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: '0.1rem',
                                    }}>
                                        <BulletIcon style={{ fontSize: '16px', color: accentColor }} />
                                    </div>
                                    <EditableElement
                                        id={`bullet-${actualIndex}`}
                                        text={bullet.text}
                                        tagName="div"
                                        isEditing={isEditing}
                                        onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                        onSelectElement={() => onElementClick?.(`el-${slideIndex}-${actualIndex}`, 'text', actualIndex)}
                                        style={{
                                            fontSize: '1.1rem',
                                            color: '#1a202c',
                                            lineHeight: 1.6,
                                            flex: 1
                                        }}
                                        elementProperties={bullet.properties}
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

    // Variant 3: Minimalist with Divider
    if (variant === 3) {
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: '42% 58%',
                height: '100%',
                background: bgColor,
                overflow: 'hidden',
                fontFamily: "'Raleway', sans-serif",
                position: 'relative',
            }}>
                {/* Left Image */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3rem 2.5rem',
                    borderRight: `2px solid ${accentColor}25`,
                }}>
                    <div style={{
                        width: '100%',
                        height: '85%',
                        background: imageUrl ? `url(${imageUrl}) center/cover` : `linear-gradient(135deg, ${accentColor}15, ${accent2Color}10)`,
                        borderRadius: `${slide.image_properties?.borderRadius ?? 16}px`,
                        boxShadow: slide.image_properties?.shadow
                            ? `${slide.image_properties.shadow.offsetX}px ${slide.image_properties.shadow.offsetY}px ${slide.image_properties.shadow.blur}px ${slide.image_properties.shadow.color}`
                            : '0 8px 24px rgba(0,0,0,0.1)',
                        opacity: slide.image_properties?.opacity ?? 1,
                        cursor: isEditing ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#cbd5e0',
                        fontSize: '1.1rem',
                    }}
                        onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}>
                        {!imageUrl && 'Image'}
                    </div>
                </div>

                {/* Right Content */}
                <div style={{
                    padding: '3.5rem 3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    <EditableElement
                        id={`title-${slideIndex}`}
                        text={title}
                        tagName="h2"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                        style={{
                            fontSize: '2.2rem',
                            fontWeight: 600,
                            color: primaryColor,
                            marginBottom: '0.5rem',
                            lineHeight: 1.2
                        }}
                        elementProperties={slide.slide_title?.properties}
                    />
                    {subtitle && (
                        <EditableElement
                            id={`subtitle-${slideIndex}`}
                            text={subtitle}
                            tagName="p"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('subtitle', val)}
                            onSelectElement={() => onElementClick?.(`subtitle-${slideIndex}`, 'text')}
                            style={{
                                fontSize: '1.05rem',
                                fontWeight: 400,
                                lineHeight: 1.45,
                                color: primaryColor,
                                opacity: 0.72,
                                marginTop: 0,
                                marginBottom: '2rem',
                            }}
                            elementProperties={slide.subtitle?.properties}
                        />
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {bullets.slice(0, 4).map((bullet: any) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            const bulletIndex = bullets.indexOf(bullet);
                            const BulletIcon = getBulletIcon(bullet.text, bulletIndex);
                            return (
                                <div key={actualIndex}>
                                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                        <div style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '7px',
                                            background: `${accentColor}16`,
                                            flexShrink: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <BulletIcon style={{ fontSize: '13px', color: accentColor }} />
                                        </div>
                                        <EditableElement
                                            id={`bullet-${actualIndex}`}
                                            text={bullet.text}
                                            tagName="div"
                                            isEditing={isEditing}
                                            onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                            onSelectElement={() => onElementClick?.(`el-${slideIndex}-${actualIndex}`, 'text', actualIndex)}
                                            style={{
                                                fontSize: '1.15rem',
                                                color: '#1a202c',
                                                lineHeight: 1.6,
                                                flex: 1
                                            }}
                                            elementProperties={bullet.properties}
                                        />
                                    </div>
                                    {bullets.indexOf(bullet) < bullets.length - 1 && (
                                        <div style={{
                                            marginTop: '1rem',
                                            height: '1px',
                                            background: `${textColor}10`,
                                            marginLeft: '1.4rem',
                                        }} />
                                    )}
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

    // Variant 4: Card Stack with Depth
    if (variant === 4) {
        return (
            <div style={{
                position: 'relative',
                display: 'flex',
                height: '100%',
                background: bgColor,
                overflow: 'hidden',
                fontFamily: "'Raleway', sans-serif",
                padding: '2.5rem',
                gap: '2rem',
            }}>
                {/* Left Image with layered effect */}
                <div style={{
                    flex: '0 0 40%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                }}>
                    {/* Shadow layer */}
                    <div style={{
                        position: 'absolute',
                        width: '90%',
                        height: '85%',
                        background: `${accentColor}10`,
                        borderRadius: '20px',
                        transform: 'translate(8px, 8px)',
                    }} />
                    {/* Main image */}
                    <div style={{
                        width: '90%',
                        height: '85%',
                        background: imageUrl ? `url(${imageUrl}) center/cover` : `linear-gradient(135deg, ${accentColor}20, ${accent2Color}15)`,
                        borderRadius: `${slide.image_properties?.borderRadius ?? 20}px`,
                        boxShadow: slide.image_properties?.shadow
                            ? `${slide.image_properties.shadow.offsetX}px ${slide.image_properties.shadow.offsetY}px ${slide.image_properties.shadow.blur}px ${slide.image_properties.shadow.color}`
                            : '0 16px 40px rgba(0,0,0,0.15)',
                        opacity: slide.image_properties?.opacity ?? 1,
                        cursor: isEditing ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#cbd5e0',
                        fontSize: '1.1rem',
                        position: 'relative',
                        zIndex: 1,
                    }}
                        onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}>
                        {!imageUrl && 'Image'}
                    </div>
                </div>

                {/* Right Content */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '1rem 0',
                }}>
                    <EditableElement
                        id={`title-${slideIndex}`}
                        text={title}
                        tagName="h2"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                        style={{
                            fontSize: '2.2rem',
                            fontWeight: 700,
                            color: primaryColor,
                            marginBottom: '0.5rem',
                            lineHeight: 1.2
                        }}
                        elementProperties={slide.slide_title?.properties}
                    />
                    {subtitle && (
                        <EditableElement
                            id={`subtitle-${slideIndex}`}
                            text={subtitle}
                            tagName="p"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('subtitle', val)}
                            onSelectElement={() => onElementClick?.(`subtitle-${slideIndex}`, 'text')}
                            style={{
                                fontSize: '1.05rem',
                                fontWeight: 400,
                                lineHeight: 1.45,
                                color: primaryColor,
                                opacity: 0.72,
                                marginTop: 0,
                                marginBottom: '2rem',
                            }}
                            elementProperties={slide.subtitle?.properties}
                        />
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        {bullets.slice(0, 4).map((bullet: any) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            const bulletIndex = bullets.indexOf(bullet);
                            const BulletIcon = getBulletIcon(bullet.text, bulletIndex);
                            return (
                                <div key={actualIndex} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        minWidth: '28px',
                                        height: '28px',
                                        borderRadius: '6px',
                                        background: `${accentColor}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: '0.1rem',
                                    }}>
                                        <BulletIcon style={{ fontSize: '14px', color: accentColor }} />
                                    </div>
                                    <EditableElement
                                        id={`bullet-${actualIndex}`}
                                        text={bullet.text}
                                        tagName="div"
                                        isEditing={isEditing}
                                        onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                        onSelectElement={() => onElementClick?.(`el-${slideIndex}-${actualIndex}`, 'text', actualIndex)}
                                        style={{
                                            fontSize: '1.1rem',
                                            color: '#1a202c',
                                            lineHeight: 1.6,
                                            flex: 1
                                        }}
                                        elementProperties={bullet.properties}
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

    // Variant 5: Contemporary with Accent Bar
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '44% 56%',
            height: '100%',
            background: bgColor,
            overflow: 'hidden',
            fontFamily: "'Raleway', sans-serif",
            position: 'relative',
        }}>
            {/* Accent bar */}
            <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '6px',
                height: '100%',
                background: accentColor,
                zIndex: 10,
            }} />

            {/* Left Image */}
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
                    borderRadius: `${slide.image_properties?.borderRadius ?? 22}px`,
                    boxShadow: slide.image_properties?.shadow
                        ? `${slide.image_properties.shadow.offsetX}px ${slide.image_properties.shadow.offsetY}px ${slide.image_properties.shadow.blur}px ${slide.image_properties.shadow.color}`
                        : '0 10px 30px rgba(0,0,0,0.12)',
                    opacity: slide.image_properties?.opacity ?? 1,
                    cursor: isEditing ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#cbd5e0',
                    fontSize: '1.1rem',
                    position: 'relative',
                }}
                    onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}>
                    {!imageUrl && 'Image'}
                    {/* Decorative circle */}
                    <div style={{
                        position: 'absolute',
                        right: '-15px',
                        top: '20%',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: accentColor,
                        opacity: 0.3,
                    }} />
                </div>
            </div>

            {/* Right Content */}
            <div style={{
                padding: '3.5rem 3rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}>
                <EditableElement
                    id={`title-${slideIndex}`}
                    text={title}
                    tagName="h2"
                    isEditing={isEditing}
                    onChange={(val) => handleUpdate('title', val)}
                    onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                    style={{
                        fontSize: '2.2rem',
                        fontWeight: 700,
                        color: primaryColor,
                        marginBottom: '0.5rem',
                        lineHeight: 1.2
                    }}
                    elementProperties={slide.slide_title?.properties}
                />
                {subtitle && (
                    <EditableElement
                        id={`subtitle-${slideIndex}`}
                        text={subtitle}
                        tagName="p"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('subtitle', val)}
                        onSelectElement={() => onElementClick?.(`subtitle-${slideIndex}`, 'text')}
                        style={{
                            fontSize: '1.05rem',
                            fontWeight: 400,
                            lineHeight: 1.45,
                            color: primaryColor,
                            opacity: 0.72,
                            marginTop: 0,
                            marginBottom: '2rem',
                        }}
                        elementProperties={slide.subtitle?.properties}
                    />
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {bullets.slice(0, 4).map((bullet: any) => {
                        const actualIndex = slide.elements.indexOf(bullet);
                        return (
                            <div key={actualIndex} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '3px',
                                    height: '40px',
                                    background: `linear-gradient(to bottom, ${accentColor}, ${accentColor}40)`,
                                    borderRadius: '2px',
                                    marginTop: '0.2rem',
                                    opacity: 1 - (bullets.indexOf(bullet) * 0.15),
                                }} />
                                <EditableElement
                                    id={`bullet-${actualIndex}`}
                                    text={bullet.text}
                                    tagName="div"
                                    isEditing={isEditing}
                                    onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                    onSelectElement={() => onElementClick?.(`el-${slideIndex}-${actualIndex}`, 'text', actualIndex)}
                                    style={{
                                        fontSize: '1.15rem',
                                        color: textColor,
                                        lineHeight: 1.6,
                                        flex: 1,
                                        opacity: 1 - (bullets.indexOf(bullet) * 0.08),
                                    }}
                                    elementProperties={bullet.properties}
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
};