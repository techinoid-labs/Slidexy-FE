"use client";
import React from 'react';
import { EditableElement } from '../editor/EditableElement';
import { UserElementsRenderer } from '../editor/UserElementsRenderer';
import { getContrastTextColor } from '@/utils/colorUtils';
import { getBulletIcon } from '@/utils/bulletIcons';

interface ContentRightImageHTMLProps {
    slide: any;
    theme: any;
    variant?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
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
    const bullets = slide.elements?.filter((el: any) => el.element_type === 'bullet_point') || [];
    const imageUrl = slide.image_url;

    // Theme colors
    const bgColor = theme?.backgroundColor || '#F7FAFC';
    const primaryColor = theme?.primaryColor || '#1A202C';
    const accentColor = theme?.artPalette?.[0] || '#00C4B4';
    const accent2Color = theme?.artPalette?.[1] || '#7C3AED';
    const surfaceColor = theme?.artPalette?.[3] || '#f5f7fa';
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
                position: 'relative',
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
                        elementProperties={slide.slide_title?.properties}
                    />

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
                            right: 0,
                            top: 0,
                            width: '4px',
                            height: '100%',
                            background: accentColor,
                            borderRadius: '0 20px 20px 0',
                        }} />
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

    // Variant 2: Floating Card with Shadow
    if (variant === 2) {
        return (
            <div style={{
                position: 'relative',
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
                        elementProperties={slide.slide_title?.properties}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        {bullets.slice(0, 4).map((bullet: any) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            const bulletIndex = bullets.indexOf(bullet);
                            const BulletIcon = getBulletIcon(bullet.text, bulletIndex);
                            return (
                                <div key={actualIndex} style={{
                                    display: 'flex',
                                    gap: '0.9rem',
                                    alignItems: 'center',
                                    padding: '0.6rem 1rem',
                                    background: 'rgba(255,255,255,0.6)',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                }}>
                                    <div style={{
                                        width: '26px',
                                        height: '26px',
                                        borderRadius: '8px',
                                        background: `${accentColor}18`,
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <BulletIcon style={{ fontSize: '15px', color: accentColor }} />
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
                        borderRadius: `${slide.image_properties?.borderRadius ?? 24}px`,
                        boxShadow: slide.image_properties?.shadow
                            ? `${slide.image_properties.shadow.offsetX}px ${slide.image_properties.shadow.offsetY}px ${slide.image_properties.shadow.blur}px ${slide.image_properties.shadow.color}`
                            : '0 20px 60px rgba(0,0,0,0.18)',
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

    // Variant 3: Split with Vertical Accent
    if (variant === 3) {
        return (
            <div style={{
                position: 'relative',
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
                        elementProperties={slide.slide_title?.properties}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                        {bullets.slice(0, 4).map((bullet: any) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            return (
                                <div key={actualIndex} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
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
                                        {bullets.indexOf(bullet) + 1}
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
                        elementProperties={slide.slide_title?.properties}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        {bullets.slice(0, 4).map((bullet: any) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            const bulletIndex = bullets.indexOf(bullet);
                            const BulletIcon = getBulletIcon(bullet.text, bulletIndex);
                            return (
                                <div key={actualIndex} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${accentColor}, ${accent2Color})`,
                                        marginTop: '0.1rem',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: `0 4px 12px ${accentColor}40`,
                                    }}>
                                        <BulletIcon style={{ fontSize: '16px', color: '#fff' }} />
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
                        borderRadius: `${slide.image_properties?.borderRadius ?? 20}px`,
                        boxShadow: slide.image_properties?.shadow
                            ? `${slide.image_properties.shadow.offsetX}px ${slide.image_properties.shadow.offsetY}px ${slide.image_properties.shadow.blur}px ${slide.image_properties.shadow.color}`
                            : '0 14px 40px rgba(0,0,0,0.14)',
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
                    elementProperties={slide.slide_title?.properties}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {bullets.slice(0, 4).map((bullet: any) => {
                        const actualIndex = slide.elements.indexOf(bullet);
                        return (
                            <div key={actualIndex} style={{
                                display: 'flex',
                                gap: '0.9rem',
                                alignItems: 'flex-start',
                                paddingLeft: '1rem',
                                borderLeft: `3px solid ${accentColor}${Math.max(80 - bullets.indexOf(bullet) * 15, 30).toString(16)}`,
                            }}>
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
                                        flex: 1
                                    }}
                                    elementProperties={bullet.properties}
                                />
                            </div>
                        );
                    })}
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
                }}
                    onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}>
                    {!imageUrl && 'Image'}
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

    // ─── Variant 6: Dark Mode Premium ────────────────────────────────────────
    if (variant === 6) {
        return (
            <div style={{
                display: 'grid', gridTemplateColumns: '55% 45%',
                height: '100%', overflow: 'hidden',
                fontFamily: "'Raleway', sans-serif",
                background: '#0f0f14', position: 'relative',
            }}>
                {/* Ambient glow */}
                <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: `${accentColor}15`, filter: 'blur(80px)', pointerEvents: 'none' }} />

                {/* Left content */}
                <div style={{ padding: '3rem 2.5rem 3rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                    {/* Accent tab */}
                    <div style={{ width: '36px', height: '4px', background: `linear-gradient(90deg, ${accentColor}, ${accent2Color})`, borderRadius: '2px', marginBottom: '1.5rem' }} />
                    <EditableElement
                        id={`title-${slideIndex}`} text={title} tagName="h2"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                        style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '2rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}
                        elementProperties={slide.slide_title?.properties}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {bullets.slice(0, 4).map((bullet: any) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            const bulletIndex = bullets.indexOf(bullet);
                            const BulletIcon = getBulletIcon(bullet.text, bulletIndex);
                            return (
                                <div key={actualIndex} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${accentColor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <BulletIcon style={{ fontSize: '14px', color: accentColor }} />
                                    </div>
                                    <EditableElement id={`el-${slideIndex}-${actualIndex}`} text={bullet.text} tagName="div" isEditing={isEditing} onChange={(val) => handleUpdate('bullet', val, actualIndex)} onSelectElement={() => onElementClick?.(`el-${slideIndex}-${actualIndex}`, 'text', actualIndex)} style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, flex: 1 }} elementProperties={bullet.properties} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right image */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1 }}>
                    <div
                        onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}
                        style={{ width: '100%', height: '85%', borderRadius: '20px', background: imageUrl ? `url(${imageUrl}) center/cover` : `linear-gradient(135deg, ${accentColor}30, ${accent2Color}20)`, boxShadow: `0 0 0 1px rgba(255,255,255,0.08), 0 20px 60px rgba(0,0,0,0.5)`, cursor: isEditing ? 'pointer' : 'default', opacity: slide.image_properties?.opacity ?? 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>
                        {!imageUrl && 'Image'}
                    </div>
                </div>
                <UserElementsRenderer elements={slide.elements || []} isEditing={isEditing} onElementClick={onElementClick} onElementUpdate={handleElementUpdate} slideIndex={slideIndex} />
            </div>
        );
    }

    // ─── Variant 7: Bento Grid Layout ─────────────────────────────────────────
    if (variant === 7) {
        return (
            <div style={{
                display: 'grid', gridTemplateColumns: '60% 40%',
                gridTemplateRows: '1fr 1fr', height: '100%', gap: '1rem',
                padding: '1.25rem', background: surfaceColor || '#f5f7fa',
                fontFamily: "'Raleway', sans-serif", boxSizing: 'border-box',
            }}>
                {/* Title cell — spans full left column */}
                <div style={{ gridRow: '1 / 3', background: bgColor, borderRadius: '20px', padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                    <div style={{ width: '32px', height: '4px', background: `linear-gradient(90deg, ${accentColor}, ${accent2Color})`, borderRadius: '2px', marginBottom: '1.25rem' }} />
                    <EditableElement
                        id={`title-${slideIndex}`} text={title} tagName="h2"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                        style={{ fontSize: '2rem', fontWeight: 800, color: primaryColor, marginBottom: '1.75rem', lineHeight: 1.2 }}
                        elementProperties={slide.slide_title?.properties}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {bullets.slice(0, 4).map((bullet: any) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            const BulletIcon = getBulletIcon(bullet.text, bullets.indexOf(bullet));
                            return (
                                <div key={actualIndex} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                    <BulletIcon style={{ fontSize: '16px', color: accentColor, marginTop: '3px', flexShrink: 0 }} />
                                    <EditableElement id={`el-${slideIndex}-${actualIndex}`} text={bullet.text} tagName="div" isEditing={isEditing} onChange={(val) => handleUpdate('bullet', val, actualIndex)} onSelectElement={() => onElementClick?.(`el-${slideIndex}-${actualIndex}`, 'text', actualIndex)} style={{ fontSize: '0.95rem', color: primaryColor, lineHeight: 1.5, flex: 1 }} elementProperties={bullet.properties} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Image cell — top right */}
                <div
                    onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}
                    style={{ background: imageUrl ? `url(${imageUrl}) center/cover` : `linear-gradient(135deg, ${accentColor}25, ${accent2Color}15)`, borderRadius: '20px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', cursor: isEditing ? 'pointer' : 'default', opacity: slide.image_properties?.opacity ?? 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `${accentColor}50`, fontSize: '0.9rem' }}>
                    {!imageUrl && 'Image'}
                </div>

                {/* Accent stat cell — bottom right */}
                <div style={{ background: `linear-gradient(135deg, ${accentColor}, ${accent2Color})`, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.25rem', boxShadow: `0 8px 24px ${accentColor}35` }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>✦</span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Key Insight</span>
                </div>
                <UserElementsRenderer elements={slide.elements || []} isEditing={isEditing} onElementClick={onElementClick} onElementUpdate={handleElementUpdate} slideIndex={slideIndex} />
            </div>
        );
    }

    // ─── Variant 8: Cinematic Horizontal Strip ────────────────────────────────
    if (variant === 8) {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column',
                height: '100%', overflow: 'hidden',
                fontFamily: "'Raleway', sans-serif", background: bgColor, position: 'relative',
            }}>
                {/* Top image strip */}
                <div
                    onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}
                    style={{ height: '38%', background: imageUrl ? `url(${imageUrl}) center/cover` : `linear-gradient(135deg, ${accentColor}30, ${accent2Color}20)`, cursor: isEditing ? 'pointer' : 'default', position: 'relative', opacity: slide.image_properties?.opacity ?? 1, flexShrink: 0 }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 100%)' }} />
                    {!imageUrl && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `${accentColor}60`, fontSize: '0.9rem' }}>Image</div>}
                </div>
                {/* Accent line */}
                <div style={{ height: '4px', background: `linear-gradient(90deg, ${accentColor}, ${accent2Color})`, flexShrink: 0 }} />
                {/* Content below */}
                <div style={{ flex: 1, padding: '1.5rem 3rem 2rem', display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}>
                    <div style={{ flex: '0 0 45%' }}>
                        <EditableElement
                            id={`title-${slideIndex}`} text={title} tagName="h2"
                            isEditing={isEditing}
                            onChange={(val) => handleUpdate('title', val)}
                            onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                            style={{ fontSize: '1.8rem', fontWeight: 800, color: primaryColor, margin: 0, lineHeight: 1.25 }}
                            elementProperties={slide.slide_title?.properties}
                        />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {bullets.slice(0, 4).map((bullet: any) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            return (
                                <div key={actualIndex} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accentColor, marginTop: '0.55rem', flexShrink: 0 }} />
                                    <EditableElement id={`el-${slideIndex}-${actualIndex}`} text={bullet.text} tagName="div" isEditing={isEditing} onChange={(val) => handleUpdate('bullet', val, actualIndex)} onSelectElement={() => onElementClick?.(`el-${slideIndex}-${actualIndex}`, 'text', actualIndex)} style={{ fontSize: '0.9rem', color: primaryColor, lineHeight: 1.5, flex: 1 }} elementProperties={bullet.properties} />
                                </div>
                            );
                        })}
                    </div>
                </div>
                <UserElementsRenderer elements={slide.elements || []} isEditing={isEditing} onElementClick={onElementClick} onElementUpdate={handleElementUpdate} slideIndex={slideIndex} />
            </div>
        );
    }

    // ─── Variant 9: Timeline / Step Layout ───────────────────────────────────
    if (variant === 9) {
        return (
            <div style={{
                display: 'grid', gridTemplateColumns: '50% 50%',
                height: '100%', overflow: 'hidden',
                fontFamily: "'Raleway', sans-serif", background: bgColor,
            }}>
                {/* Left */}
                <div style={{ padding: '3rem 2rem 3rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <EditableElement
                        id={`title-${slideIndex}`} text={title} tagName="h2"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                        style={{ fontSize: '2rem', fontWeight: 800, color: primaryColor, marginBottom: '2rem', lineHeight: 1.2 }}
                        elementProperties={slide.slide_title?.properties}
                    />
                    {/* Timeline bullets */}
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {/* Vertical line */}
                        <div style={{ position: 'absolute', left: '13px', top: '14px', bottom: '14px', width: '2px', background: `${accentColor}25` }} />
                        {bullets.slice(0, 4).map((bullet: any, idx: number) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            return (
                                <div key={actualIndex} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', paddingBottom: idx < bullets.length - 1 ? '1.25rem' : 0, position: 'relative' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: idx === 0 ? accentColor : `${accentColor}15`, border: `2px solid ${accentColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: idx === 0 ? '#fff' : accentColor }}>{idx + 1}</span>
                                    </div>
                                    <EditableElement id={`el-${slideIndex}-${actualIndex}`} text={bullet.text} tagName="div" isEditing={isEditing} onChange={(val) => handleUpdate('bullet', val, actualIndex)} onSelectElement={() => onElementClick?.(`el-${slideIndex}-${actualIndex}`, 'text', actualIndex)} style={{ fontSize: '0.95rem', color: primaryColor, lineHeight: 1.5, flex: 1, paddingTop: '0.3rem' }} elementProperties={bullet.properties} />
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* Right image */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: `${accentColor}05` }}>
                    <div onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)} style={{ width: '100%', height: '85%', borderRadius: '20px', background: imageUrl ? `url(${imageUrl}) center/cover` : `linear-gradient(135deg, ${accentColor}20, ${accent2Color}15)`, boxShadow: '0 12px 40px rgba(0,0,0,0.12)', cursor: isEditing ? 'pointer' : 'default', opacity: slide.image_properties?.opacity ?? 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `${accentColor}50`, fontSize: '0.9rem' }}>
                        {!imageUrl && 'Image'}
                    </div>
                </div>
                <UserElementsRenderer elements={slide.elements || []} isEditing={isEditing} onElementClick={onElementClick} onElementUpdate={handleElementUpdate} slideIndex={slideIndex} />
            </div>
        );
    }

    // ─── Variant 10: Bold Typographic Full-Width ──────────────────────────────
    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: '100%', overflow: 'hidden',
            fontFamily: "'Raleway', sans-serif",
            background: bgColor, position: 'relative',
        }}>
            {/* Left accent bar */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px', background: `linear-gradient(to bottom, ${accentColor}, ${accent2Color})` }} />

            <div style={{ display: 'grid', gridTemplateColumns: '52% 48%', height: '100%' }}>
                {/* Content */}
                <div style={{ padding: '3rem 2rem 3rem 3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>Key Insights</div>
                    <EditableElement
                        id={`title-${slideIndex}`} text={title} tagName="h2"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                        style={{ fontSize: '2.2rem', fontWeight: 900, color: primaryColor, marginBottom: '2rem', lineHeight: 1.15, letterSpacing: '-0.02em' }}
                        elementProperties={slide.slide_title?.properties}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {bullets.slice(0, 4).map((bullet: any) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            const bulletIndex = bullets.indexOf(bullet);
                            const BulletIcon = getBulletIcon(bullet.text, bulletIndex);
                            return (
                                <div key={actualIndex} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', padding: '0.85rem', background: bulletIndex % 2 === 0 ? `${accentColor}07` : 'transparent', borderRadius: '10px' }}>
                                    <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: `linear-gradient(135deg, ${accentColor}22, ${accent2Color}15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <BulletIcon style={{ fontSize: '13px', color: accentColor }} />
                                    </div>
                                    <EditableElement id={`el-${slideIndex}-${actualIndex}`} text={bullet.text} tagName="div" isEditing={isEditing} onChange={(val) => handleUpdate('bullet', val, actualIndex)} onSelectElement={() => onElementClick?.(`el-${slideIndex}-${actualIndex}`, 'text', actualIndex)} style={{ fontSize: '0.93rem', color: primaryColor, lineHeight: 1.5, flex: 1 }} elementProperties={bullet.properties} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right image */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 2rem 1.5rem 1rem' }}>
                    <div
                        onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}
                        style={{ width: '100%', height: '88%', borderRadius: '24px', background: imageUrl ? `url(${imageUrl}) center/cover` : `linear-gradient(135deg, ${accentColor}20, ${accent2Color}12)`, boxShadow: `0 0 0 6px ${accentColor}10, 0 16px 48px rgba(0,0,0,0.12)`, cursor: isEditing ? 'pointer' : 'default', opacity: slide.image_properties?.opacity ?? 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `${accentColor}50`, fontSize: '0.9rem' }}>
                        {!imageUrl && 'Image'}
                    </div>
                </div>
            </div>
            <UserElementsRenderer elements={slide.elements || []} isEditing={isEditing} onElementClick={onElementClick} onElementUpdate={handleElementUpdate} slideIndex={slideIndex} />
        </div>
    );
};