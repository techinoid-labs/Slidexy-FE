"use client";
import React from 'react';
import { EditableElement } from '../editor/EditableElement';
import { UserElementsRenderer } from '../editor/UserElementsRenderer';
import { getContrastTextColor } from '@/utils/colorUtils';
import { getBulletIcon } from '@/utils/bulletIcons';

interface ConclusionSlideHTMLProps {
    slide: any;
    theme: any;
    isEditing?: boolean;
    onSlideUpdate?: (updatedSlide: any) => void;
    variant?: 1 | 2 | 3 | 4 | 5;
    onElementClick?: (elementId: string, elementType: string, elementIndex?: number) => void;
    slideIndex?: number;
}

/**
 * Closing / CTA slide with bold headline, supporting bullets, and a CTA chip.
 */
export const ConclusionSlideHTML: React.FC<ConclusionSlideHTMLProps> = ({
    slide,
    theme,
    isEditing = false,
    onSlideUpdate,
    onElementClick,
    slideIndex = 0,
    variant = 1
}) => {
    const title = slide.slide_title?.text || "Thanks!";
    const subtitle = slide.subtitle?.text || "Ready to take the next step?";
    const bullets = slide.elements?.filter((el: any) => el.element_type === 'bullet_point') || [];

    const bgColor = theme?.backgroundColor || '#0c1024';
    const accent = theme?.artPalette?.[0] || '#00c4b4';
    const accent2 = theme?.artPalette?.[1] || '#6c5ce7';
    const textColor = '#1a202c';
    const subText = theme?.textLightColor || 'rgba(255,255,255,0.9)';
    const primaryColor = theme?.primaryColor || theme?.colorPalette?.[0] || '#3b82f6';

    const handleUpdate = (type: 'title' | 'subtitle' | 'bullet', value: string, index?: number) => {
        if (!onSlideUpdate) return;
        const updated = { ...slide };

        if (type === 'title') {
            updated.slide_title = { ...updated.slide_title, text: value };
        } else if (type === 'subtitle') {
            updated.subtitle = { ...updated.subtitle, text: value };
        } else if (type === 'bullet' && typeof index === 'number') {
            if (slide.elements[index]) {
                updated.elements = [...slide.elements];
                updated.elements[index] = { ...slide.elements[index], text: value };
            }
        }
        onSlideUpdate(updated);
    };

    const handleElementUpdate = (index: number, updates: any) => {
        if (!onSlideUpdate) return;
        const updatedElements = [...(slide.elements || [])];
        updatedElements[index] = { ...updatedElements[index], ...updates };
        onSlideUpdate({ ...slide, elements: updatedElements });
    };

    // Variant 1: Centered Focus (Dark Text)
    if (variant === 1) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: '4rem',
                background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}ee 100%)`,
                fontFamily: "'Raleway', sans-serif",
                color: '#000000',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
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
                        fontWeight: 900,
                        margin: '0 0 1rem',
                        color: slide.slide_title?.properties?.fill || primaryColor,
                        ...(slide.slide_title?.properties?.fill ? {} : {
                            backgroundImage: `linear-gradient(120deg, ${accent} 0%, ${accent2} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }),
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    }}
                    elementProperties={slide.slide_title?.properties}
                />

                <EditableElement
                    id={`subtitle-${slideIndex}`}
                    text={subtitle}
                    tagName="h3"
                    isEditing={isEditing}
                    onChange={(val) => handleUpdate('subtitle', val)}
                    onSelectElement={() => onElementClick?.(`subtitle-${slideIndex}`, 'text')}
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 400,
                        color: '#000000',
                        opacity: 0.8,
                        margin: '0 0 4rem',
                        maxWidth: '800px',
                    }}
                    elementProperties={slide.subtitle?.properties}
                />

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '2rem',
                    width: '100%',
                    maxWidth: '1000px',
                }}>
                    {bullets.map((bullet: any, idx: number) => {
                        const actualIndex = slide.elements.indexOf(bullet);
                        const BulletIcon = getBulletIcon(bullet.text, idx);
                        return (
                            <div key={bullet.id || actualIndex} style={{
                                background: '#ffffff',
                                padding: '2rem',
                                borderRadius: '16px',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                                flex: '1 1 300px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                borderTop: `4px solid ${accent}`
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '14px',
                                    background: `${accent}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1rem',
                                }}>
                                    <BulletIcon style={{ fontSize: '24px', color: accent }} />
                                </div>
                                <EditableElement
                                    id={bullet.id || bullet.properties?.id || `el-${slideIndex}-${actualIndex}`}
                                    text={bullet.text}
                                    tagName="p"
                                    isEditing={isEditing}
                                    onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                    onSelectElement={() => {
                                        const bId = bullet.id || bullet.properties?.id || `el-${slideIndex}-${actualIndex}`;
                                        onElementClick?.(bId, 'text', actualIndex);
                                    }}
                                    style={{
                                        fontSize: '1.2rem',
                                        color: '#000000',
                                        lineHeight: 1.5,
                                        margin: 0
                                    }}
                                    elementProperties={bullet.properties}
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

    // Variant 2: Left Aligned Hero
    if (variant === 2) {
        return (
            <div style={{
                position: 'relative',
                display: 'flex',
                height: '100%',
                background: bgColor,
                fontFamily: "'Raleway', sans-serif",
                padding: '5rem',
                alignItems: 'center'
            }}>
                <div style={{ flex: 1, paddingRight: '4rem' }}>
                    <div style={{ width: '80px', height: '8px', background: accent, marginBottom: '2rem' }} />
                    <EditableElement
                        id={`title-${slideIndex}`}
                        text={title}
                        tagName="h2"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                        style={{
                            fontSize: '4rem',
                            fontWeight: 800,
                            margin: '0 0 2.2rem',
                            color: '#000000',
                            lineHeight: 1.1
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
                            fontSize: '1.4rem',
                            fontWeight: 400,
                            color: '#000000',
                            opacity: 0.7,
                            marginBottom: '3rem'
                        }}
                        elementProperties={slide.subtitle?.properties}
                    />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {bullets.map((bullet: any) => {
                        const actualIndex = slide.elements.indexOf(bullet);
                        return (
                            <div key={bullet.id || actualIndex} style={{
                                background: '#ffffff',
                                padding: '1.5rem 2rem',
                                borderRadius: '12px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: `${accent}20`,
                                    color: accent,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold'
                                }}>✓</div>
                                <EditableElement
                                    id={bullet.id || bullet.properties?.id || `el-${slideIndex}-${actualIndex}`}
                                    text={bullet.text}
                                    tagName="p"
                                    isEditing={isEditing}
                                    onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                    onSelectElement={() => {
                                        const bId = bullet.id || bullet.properties?.id || `el-${slideIndex}-${actualIndex}`;
                                        onElementClick?.(bId, 'text', actualIndex);
                                    }}
                                    style={{
                                        fontSize: '1.15rem',
                                        color: '#000000',
                                        lineHeight: 1.4,
                                        margin: 0
                                    }}
                                    elementProperties={bullet.properties}
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

    // Variant 3: Dark Mode Minimal (Inverted for "Dark Text" request - White cards on color)
    if (variant === 3) {
        return (
            <div style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                background: primaryColor, // Use generic primary color
                padding: '4rem',
                justifyContent: 'center'
            }}>
                <div style={{
                    background: '#ffffff',
                    padding: '4rem',
                    borderRadius: '24px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                    textAlign: 'center'
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
                            marginBottom: '2rem',
                            color: '#000000'
                        }}
                        elementProperties={slide.slide_title?.properties}
                    />

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem',
                        marginTop: '3rem'
                    }}>
                        {bullets.map((bullet: any, idx: number) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            const BulletIcon = getBulletIcon(bullet.text, idx);
                            return (
                                <div key={bullet.id || actualIndex} style={{ padding: '1rem', borderTop: `1px solid #e2e8f0` }}>
                                    <BulletIcon style={{ fontSize: '20px', color: accent, marginBottom: '0.5rem', display: 'block' }} />
                                    <EditableElement
                                        id={bullet.id || bullet.properties?.id || `el-${slideIndex}-${actualIndex}`}
                                        text={bullet.text}
                                        tagName="p"
                                        isEditing={isEditing}
                                        onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                        onSelectElement={() => {
                                            const bId = bullet.id || bullet.properties?.id || `el-${slideIndex}-${actualIndex}`;
                                            onElementClick?.(bId, 'text', actualIndex);
                                        }}
                                        style={{
                                            fontSize: '1.2rem',
                                            color: '#000000',
                                            fontWeight: 500
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

    // Variant 4: Split with Image Placeholder
    if (variant === 4) {
        return (
            <div style={{
                position: 'relative',
                display: 'flex',
                height: '100%',
                background: '#ffffff',
                fontFamily: "'Raleway', sans-serif"
            }}>
                <div
                    onClick={() => onElementClick?.(`layout-image-${slideIndex}`, 'image', -99)}
                    style={{
                        flex: '0 0 40%',
                        background: slide.image_url
                            ? `url(${slide.image_url}) center/cover`
                            : `linear-gradient(135deg, ${accent}25, ${accent2}18)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        color: '#94a3b8',
                        fontWeight: 600,
                        cursor: isEditing ? 'pointer' : 'default',
                    }}>
                    {!slide.image_url && 'Summary'}
                </div>
                <div style={{
                    flex: 1,
                    padding: '5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <EditableElement
                        id={`title-${slideIndex}`}
                        text={title}
                        tagName="h2"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                        style={{
                            fontSize: '3.5rem',
                            fontWeight: 800,
                            marginBottom: '1rem',
                            color: '#000000'
                        }}
                        elementProperties={slide.slide_title?.properties}
                    />
                    <div style={{ width: '100%', height: '1px', background: '#e2e8f0', margin: '2rem 0' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {bullets.map((bullet: any, idx: number) => {
                            const actualIndex = slide.elements.indexOf(bullet);
                            const BulletIcon = getBulletIcon(bullet.text, idx);
                            return (
                                <div key={bullet.id || actualIndex} style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '26px',
                                        height: '26px',
                                        borderRadius: '8px',
                                        backgroundColor: `${accent}18`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <BulletIcon style={{ fontSize: '14px', color: accent }} />
                                    </div>
                                    <EditableElement
                                        id={bullet.id || bullet.properties?.id || `el-${slideIndex}-${actualIndex}`}
                                        text={bullet.text}
                                        tagName="p"
                                        isEditing={isEditing}
                                        onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                        onSelectElement={() => {
                                            const bId = bullet.id || bullet.properties?.id || `el-${slideIndex}-${actualIndex}`;
                                            onElementClick?.(bId, 'text', actualIndex);
                                        }}
                                        style={{
                                            fontSize: '1.2rem',
                                            color: '#000000'
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

    // Variant 5/Default: Gradient Accent
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '4rem',
            background: '#ffffff',
            fontFamily: "'Raleway', sans-serif",
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '10px',
                background: `linear-gradient(90deg, ${accent} 0%, ${accent2} 100%)`
            }} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <EditableElement
                    id={`title-${slideIndex}`}
                    text={title}
                    tagName="h2"
                    isEditing={isEditing}
                    onChange={(val) => handleUpdate('title', val)}
                    onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                    style={{
                        fontSize: '4rem',
                        fontWeight: 900,
                        marginBottom: '1rem',
                        color: '#000000',
                        letterSpacing: '-0.03em'
                    }}
                    elementProperties={slide.slide_title?.properties}
                />
                <EditableElement
                    id={`subtitle-${slideIndex}`}
                    text={subtitle}
                    tagName="h3"
                    isEditing={isEditing}
                    onChange={(val) => handleUpdate('subtitle', val)}
                    onSelectElement={() => onElementClick?.(`subtitle-${slideIndex}`, 'text')}
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 400,
                        color: '#000000',
                        opacity: 0.6,
                        marginBottom: '4rem'
                    }}
                    elementProperties={slide.subtitle?.properties}
                />

                <div style={{
                    display: 'flex',
                    gap: '2rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    width: '100%'
                }}>
                    {bullets.map((bullet: any, idx: number) => {
                        const actualIndex = slide.elements.indexOf(bullet);
                        const BulletIcon = getBulletIcon(bullet.text, idx);
                        return (
                            <div key={bullet.id || actualIndex} style={{
                                border: '2px solid #000000',
                                padding: '1rem 2rem',
                                borderRadius: '50px',
                                minWidth: '200px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                            }}>
                                <BulletIcon style={{ fontSize: '18px', color: accent, flexShrink: 0 }} />
                                <EditableElement
                                    id={bullet.id || bullet.properties?.id || `el-${slideIndex}-${actualIndex}`}
                                    text={bullet.text}
                                    tagName="p"
                                    isEditing={isEditing}
                                    onChange={(val) => handleUpdate('bullet', val, actualIndex)}
                                    onSelectElement={() => {
                                        const bId = bullet.id || bullet.properties?.id || `el-${slideIndex}-${actualIndex}`;
                                        onElementClick?.(bId, 'text', actualIndex);
                                    }}
                                    style={{
                                        fontSize: '1.2rem',
                                        color: '#000000',
                                        fontWeight: 600,
                                        margin: 0
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