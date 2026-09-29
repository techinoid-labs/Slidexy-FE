"use client";
import React from 'react';
import { EditableElement } from '../editor/EditableElement';
import { UserElementsRenderer } from '../editor/UserElementsRenderer';
import { getContrastTextColor } from '@/utils/colorUtils';
import { getBulletIcon } from '@/utils/bulletIcons';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import FlagIcon from '@mui/icons-material/Flag';

const getStepIcon = (text: string, index: number, total: number) => {
    if (index === 0) return RocketLaunchIcon;
    if (index === total - 1) return FlagIcon;
    return getBulletIcon(text, index);
};

interface TimelineSlideHTMLProps {
    slide: any;
    theme: any;
    isEditing?: boolean;
    onSlideUpdate?: (updatedSlide: any) => void;
    variant?: 1 | 2 | 3 | 4 | 5;
    onElementClick?: (elementId: string, elementType: string, elementIndex?: number) => void;
    slideIndex?: number;
}

/**
 * Vertical timeline layout. Each bullet_point is a step.
 */
export const TimelineSlideHTML: React.FC<TimelineSlideHTMLProps> = ({
    slide,
    theme,
    isEditing = false,
    onSlideUpdate,
    onElementClick,
    slideIndex = 0,
    variant = 1
}) => {
    const title = slide.slide_title?.text || "Timeline";
    const bullets = slide.elements?.filter((el: any) => el.element_type === 'bullet_point') || [];

    const bgColor = theme?.backgroundColor || '#0f172a';
    const accent = theme?.artPalette?.[0] || '#22d3ee';
    const accent2 = theme?.artPalette?.[1] || '#8b5cf6';
    const textColor = '#1a202c';
    const subText = theme?.textLightColor || 'rgba(255,255,255,0.9)';

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

    // Variant 1: Standard Vertical Timeline (Dark Text)
    if (variant === 1) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: '3.5rem',
                background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}ee 100%)`,
                fontFamily: "'Raleway', sans-serif",
                color: '#000000',
                position: 'relative',
                overflow: 'hidden',
                alignItems: 'center'
            }}>
                <EditableElement
                    id="timeline-title"
                    text={title}
                    tagName="h2"
                    isEditing={isEditing}
                    onChange={(val) => handleUpdate('title', val)}
                    onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                    style={{
                        fontSize: '2.4rem',
                        fontWeight: 800,
                        margin: '0 0 2.4rem',
                        letterSpacing: '-0.02em',
                        color: '#000000',
                        textAlign: 'center'
                    }}
                    elementProperties={slide.slide_title?.properties}
                />

                <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '800px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.6rem',
                    paddingLeft: '1.5rem',
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '16px',
                        width: '2px',
                        height: '100%',
                        background: accent,
                        opacity: 0.6,
                    }} />

                    {bullets.map((bullet: any) => {
                        const actualIndex = slide.elements.indexOf(bullet);
                        const stepIndex = bullets.indexOf(bullet);
                        const StepIcon = getStepIcon(bullet.text, stepIndex, bullets.length);
                        return (
                            <div key={bullet.id || actualIndex} style={{
                                display: 'grid',
                                gridTemplateColumns: '32px 1fr',
                                gap: '1rem',
                                alignItems: 'flex-start',
                            }}>
                                <div style={{ position: 'relative', width: '32px', height: '32px' }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: '2px',
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        background: '#ffffff',
                                        border: `2px solid ${accent}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: `0 2px 8px ${accent}30`,
                                        zIndex: 2
                                    }}>
                                        <StepIcon style={{ fontSize: '15px', color: accent }} />
                                    </div>
                                </div>

                                <div style={{
                                    background: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '14px',
                                    padding: '1rem 1.2rem',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.6rem',
                                        marginBottom: '0.3rem',
                                    }}>
                                        <span style={{ fontWeight: 700, color: '#000000' }}>Step {bullets.indexOf(bullet) + 1}</span>
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
                                            fontSize: '1.05rem',
                                            color: '#000000',
                                            lineHeight: 1.55,
                                        }}
                                        elementProperties={bullet.properties}
                                    />
                                </div>
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

    // Variant 2: Horizontal Process Steps
    if (variant === 2) {
        return (
            <div style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                backgroundColor: bgColor,
                padding: '4rem',
                justifyContent: 'center'
            }}>
                <EditableElement
                    id="timeline-title"
                    text={title}
                    tagName="h2"
                    isEditing={isEditing}
                    onChange={(val) => handleUpdate('title', val)}
                    onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                    style={{
                        fontSize: '3rem',
                        fontWeight: 800,
                        textAlign: 'center',
                        color: '#000000',
                        marginBottom: '4rem'
                    }}
                    elementProperties={slide.slide_title?.properties}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: '25px',
                        left: '0',
                        width: '100%',
                        height: '2px',
                        background: '#e2e8f0',
                        zIndex: 0
                    }} />

                    {bullets.map((bullet: any) => {
                        const actualIndex = slide.elements.indexOf(bullet);
                        const stepIndex = bullets.indexOf(bullet);
                        const StepIcon = getStepIcon(bullet.text, stepIndex, bullets.length);
                        return (
                            <div key={bullet.id || actualIndex} style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                padding: '0 1rem',
                                zIndex: 1
                            }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                                    color: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.5rem',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                }}>
                                    <StepIcon style={{ fontSize: '22px', color: '#fff' }} />
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
                                        fontSize: '1.05rem',
                                        color: '#000000',
                                        lineHeight: 1.55,
                                        background: '#ffffff',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        width: '100%'
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

    // Variant 3: Alternating Side Timeline
    if (variant === 3) {
        return (
            <div style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                backgroundColor: bgColor,
                padding: '3rem',
                overflowY: 'auto'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <EditableElement
                        id="timeline-title"
                        text={title}
                        tagName="h2"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                        style={{ fontSize: '3rem', fontWeight: 800, color: '#000000' }}
                        elementProperties={slide.slide_title?.properties}
                    />
                </div>

                <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                    <div style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '4px',
                        height: '100%',
                        background: '#e2e8f0'
                    }} />

                    {bullets.map((bullet: any) => {
                        const actualIndex = slide.elements.indexOf(bullet);
                        const stepIndex = bullets.indexOf(bullet);
                        const isLeft = stepIndex % 2 === 0;
                        const StepIcon = getStepIcon(bullet.text, stepIndex, bullets.length);
                        return (
                            <div key={bullet.id || actualIndex} style={{
                                display: 'flex',
                                justifyContent: isLeft ? 'flex-end' : 'flex-start',
                                marginBottom: '2rem',
                                position: 'relative'
                            }}>
                                <div style={{
                                    width: '50%',
                                    paddingRight: isLeft ? '3rem' : '0',
                                    paddingLeft: isLeft ? '0' : '3rem',
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{
                                        background: '#ffffff',
                                        padding: '1.5rem',
                                        borderRadius: '12px',
                                        borderLeft: isLeft ? 'none' : `4px solid ${accent}`,
                                        borderRight: isLeft ? `4px solid ${accent}` : 'none',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                    }}>
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
                                            style={{ fontSize: '1.1rem', color: '#000000', margin: 0 }}
                                            elementProperties={bullet.properties}
                                        />
                                    </div>
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                                    border: '4px solid #ffffff',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <StepIcon style={{ fontSize: '14px', color: '#fff' }} />
                                </div>
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

    // Variant 4: Card Stack Timeline
    if (variant === 4) {
        return (
            <div style={{
                position: 'relative',
                display: 'flex',
                height: '100%',
                backgroundColor: bgColor,
                padding: '4rem',
                flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <EditableElement
                        id="timeline-title"
                        text={title}
                        tagName="h2"
                        isEditing={isEditing}
                        onChange={(val) => handleUpdate('title', val)}
                        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                        style={{ fontSize: '2.5rem', fontWeight: 800, color: '#000000' }}
                        elementProperties={slide.slide_title?.properties}
                    />
                    <div style={{ fontSize: '5rem', fontWeight: 900, color: `${accent}20`, lineHeight: 1 }}>
                        {new Date().getFullYear()}
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2rem',
                    alignContent: 'center',
                    flex: 1
                }}>
                    {bullets.map((bullet: any) => {
                        const actualIndex = slide.elements.indexOf(bullet);
                        const stepIndex = bullets.indexOf(bullet);
                        const stepColor = stepIndex % 2 === 0 ? accent : accent2;
                        const StepIcon = getStepIcon(bullet.text, stepIndex, bullets.length);
                        return (
                            <div key={bullet.id || actualIndex} style={{
                                background: '#ffffff',
                                padding: '2rem',
                                borderRadius: '16px',
                                borderTop: `6px solid ${stepColor}`,
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{
                                        fontSize: '2rem',
                                        fontWeight: 900,
                                        color: stepColor,
                                        opacity: 0.5
                                    }}>
                                        0{stepIndex + 1}
                                    </span>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '10px',
                                        background: `${stepColor}18`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <StepIcon style={{ fontSize: '18px', color: stepColor }} />
                                    </div>
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
                                    style={{ fontSize: '1.05rem', color: '#000000', lineHeight: 1.5 }}
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

    // Variant 5 / Default: Left-Aligned Minimal (Original Improved)
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '3.5rem',
            background: bgColor,
            fontFamily: "'Raleway', sans-serif",
            color: '#000000',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <EditableElement
                id="timeline-title"
                text={title}
                tagName="h2"
                isEditing={isEditing}
                onChange={(val) => handleUpdate('title', val)}
                onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
                style={{
                    fontSize: '2.4rem',
                    fontWeight: 800,
                    margin: '0 0 3rem',
                    letterSpacing: '-0.02em',
                    borderLeft: `5px solid ${accent}`,
                    paddingLeft: '1rem'
                }}
                elementProperties={slide.slide_title?.properties}
            />

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '1.2rem',
                flex: 1,
                overflowY: 'auto'
            }}>
                {bullets.map((bullet: any) => {
                    const actualIndex = slide.elements.indexOf(bullet);
                    const stepIndex = bullets.indexOf(bullet);
                    const StepIcon = getStepIcon(bullet.text, stepIndex, bullets.length);
                    return (
                        <div key={bullet.id || actualIndex} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            padding: '1.5rem',
                            background: '#ffffff',
                            borderRadius: '0 12px 12px 0',
                            borderLeft: `2px solid ${accent}`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                minWidth: '40px',
                                borderRadius: '10px',
                                background: `${accent}18`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <StepIcon style={{ fontSize: '19px', color: accent }} />
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
                                    fontSize: '1.1rem',
                                    color: '#000000',
                                    lineHeight: 1.5,
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
};