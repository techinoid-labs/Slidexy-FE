"use client";
import React, { useState, useCallback, useRef } from 'react';
import { EditableElement } from './EditableElement';

interface UserElementsRendererProps {
    elements: any[];
    isEditing: boolean;
    onElementClick?: (elementId: string, elementType: string, elementIndex?: number) => void;
    onElementUpdate?: (index: number, updatedElement: any) => void;
    slideIndex: number;
}

/**
 * Renders user-added elements - OPTIMIZED for performance
 * Uses local state for drag to avoid parent re-renders
 */
export const UserElementsRenderer: React.FC<UserElementsRendererProps> = ({
    elements,
    isEditing,
    onElementClick,
    onElementUpdate,
    slideIndex,
}) => {
    const [dragState, setDragState] = useState<{
        index: number;
        startX: number;
        startY: number;
        currentX: number;
        currentY: number;
    } | null>(null);

    const rafRef = useRef<number | null>(null);
    const overlayRef = useRef<HTMLDivElement>(null);



    const handleMouseDown = useCallback((e: React.MouseEvent, actualIndex: number, element: any) => {
        if (!isEditing) return;
        e.preventDefault();
        e.stopPropagation();

        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const parent = target.offsetParent as HTMLElement;
        const parentRect = parent?.getBoundingClientRect() || { left: 0, top: 0 };

        // Calculate offset from mouse to element's top-left corner
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        // Trigger selection on mouse down so panel opens immediately when dragging
        if (element.element_type === 'image' || element.konva_component === 'Konva.Image') {
            const imageId = element.id || element.properties?.id || element.properties?.image_id || element.image_id || `el-${slideIndex}-${actualIndex}`;
            onElementClick?.(imageId, 'image', actualIndex);
        } else if (element.element_type === 'shape') {
            const shapeId = element.id || element.properties?.id || element.shape_id || element.properties?.shape_id || `el-${slideIndex}-${actualIndex}`;
            onElementClick?.(shapeId, 'shape', actualIndex);
        } else if (element.element_type === 'text' || element.konva_component === 'Konva.Text') {
            const textId = element.id || element.properties?.id || `el-${slideIndex}-${actualIndex}`;
            onElementClick?.(textId, 'text', actualIndex);
        }

        setDragState({
            index: actualIndex,
            startX: offsetX,
            startY: offsetY,
            currentX: element.properties?.x || 0,
            currentY: element.properties?.y || 0,
        });
    }, [isEditing, onElementClick, slideIndex]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!dragState) return;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        rafRef.current = requestAnimationFrame(() => {
            // Get parent container to calculate relative position
            const container = overlayRef.current?.parentElement as HTMLElement;
            const containerRect = container?.getBoundingClientRect() || { left: 0, top: 0, width: 960, height: 540 };

            // Calculate scale factor by comparing screen size vs internal slide size
            const scaleX = containerRect.width / 960;
            const scaleY = containerRect.height / 540;

            // Calculate new position relative to container, accounting for scale
            const newX = (e.clientX - containerRect.left - dragState.startX) / (scaleX || 1);
            const newY = (e.clientY - containerRect.top - dragState.startY) / (scaleY || 1);

            setDragState(prev => prev ? { ...prev, currentX: newX, currentY: newY } : null);
        });
    }, [dragState]);

    const handleMouseUp = useCallback(() => {
        if (!dragState || !onElementUpdate) {
            setDragState(null);
            return;
        }

        const element = elements[dragState.index];
        if (element) {
            onElementUpdate(dragState.index, {
                ...element,
                properties: { ...element.properties, x: dragState.currentX, y: dragState.currentY },
            });
        }

        setDragState(null);
    }, [dragState, elements, onElementUpdate]);

    React.useEffect(() => {
        if (dragState) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
                if (rafRef.current) cancelAnimationFrame(rafRef.current);
            };
        }
    }, [dragState, handleMouseMove, handleMouseUp]);

    if (!elements || elements.length === 0) return null;

    console.log(`[UserElementsRenderer] Scanning ${elements.length} elements for slide ${slideIndex}`);

    return (
        <div
            ref={overlayRef}
            className="user-elements-overlay"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 100
            }}
        >
            {elements?.map((element: any, actualIndex: number) => {
                // Determine if this element should be rendered by evaluating the filtering logic in-place
                // This replaces the previous separate filtering + indexOf logic which caused duplicate keys
                const shouldRender = (() => {
                    if (element.properties?.userAdded === true) return true;
                    if (element.element_type === 'bullet_point') return false;
                    if (element.element_type === 'quote' || element.element_type === 'author' || element.element_type === 'context') return false;
                    if ((element.element_type === 'text' || element.konva_component === 'Konva.Text') && element.properties?.x !== undefined) return true;
                    if ((element.element_type === 'image' || element.konva_component === 'Konva.Image') && element.properties?.x !== undefined) return true;
                    if (element.element_type === 'shape' && element.properties?.x !== undefined) return true;
                    return false;
                })();

                if (!shouldRender) return null;

                const elementId = element.id || element.properties?.id || `el-${slideIndex}-${actualIndex}`;
                const isDragging = dragState?.index === actualIndex;
                const x = isDragging ? dragState.currentX : (element.properties?.x || 0);
                const y = isDragging ? dragState.currentY : (element.properties?.y || 0);

                const elementStyle = {
                    pointerEvents: 'auto' as const, // Re-enable pointer events for elements
                };

                // Text
                if (element.element_type === 'text' || element.konva_component === 'Konva.Text') {
                    return (
                        <div key={elementId} onMouseDown={(e) => handleMouseDown(e, actualIndex, element)}
                            style={{
                                ...elementStyle,
                                position: 'absolute', left: x, top: y, width: element.properties?.width || 300,
                                zIndex: element.properties?.zIndex || 200, cursor: isEditing ? (isDragging ? 'grabbing' : 'grab') : 'default',
                                userSelect: isDragging ? 'none' : 'auto'
                            }}>
                            <EditableElement id={elementId} text={element.text || ''} tagName="div" isEditing={isEditing && !isDragging}
                                onChange={(newText) => onElementUpdate?.(actualIndex, { ...element, text: newText })}
                                onSelectElement={() => onElementClick?.(elementId, 'text', actualIndex)}
                                elementProperties={element.properties} />
                        </div>
                    );
                }

                // Image
                if (element.element_type === 'image' || element.konva_component === 'Konva.Image') {
                    const imageId = element.id || element.properties?.id || element.properties?.image_id || element.image_id || elementId;
                    return (
                        <img key={imageId} src={element.properties?.imageSrc} alt="User added"
                            onClick={() => onElementClick?.(imageId, 'image', actualIndex)}
                            onMouseDown={(e) => handleMouseDown(e, actualIndex, element)}
                            style={{
                                ...elementStyle,
                                position: 'absolute', left: x, top: y, width: element.properties?.width || 200,
                                height: element.properties?.height || 200, opacity: element.properties?.opacity ?? 1,
                                borderRadius: element.properties?.borderRadius || 0, objectFit: 'cover',
                                cursor: isEditing ? (isDragging ? 'grabbing' : 'grab') : 'default',
                                zIndex: element.properties?.zIndex || 100, userSelect: 'none',
                                boxShadow: element.properties?.shadow
                                    ? `${element.properties.shadow.offsetX}px ${element.properties.shadow.offsetY}px ${element.properties.shadow.blur}px ${element.properties.shadow.color}`
                                    : 'none'
                            }} />
                    );
                }

                // Shape
                if (element.element_type === 'shape') {
                    const shapeId = element.id || element.properties?.id || element.shape_id || element.properties?.shape_id || elementId;
                    const shapeType = element.konva_component;
                    const baseStyle = {
                        ...elementStyle,
                        position: 'absolute' as const, left: x, top: y,
                        cursor: isEditing ? (isDragging ? 'grabbing' : 'grab') : 'default',
                        zIndex: element.properties?.zIndex || 150, userSelect: 'none' as const
                    };

                    if (shapeType === 'Konva.Rect') {
                        return (
                            <div key={shapeId} onClick={() => onElementClick?.(shapeId, 'shape', actualIndex)}
                                onMouseDown={(e) => handleMouseDown(e, actualIndex, element)}
                                style={{
                                    ...baseStyle, width: element.properties?.width || 100, height: element.properties?.height || 100,
                                    backgroundColor: element.properties?.fill || '#7B4AE2', opacity: element.properties?.opacity ?? 1,
                                    borderRadius: element.properties?.cornerRadius || 0,
                                    border: element.properties?.stroke ? `${element.properties.strokeWidth || 1}px solid ${element.properties.stroke}` : 'none'
                                }} />
                        );
                    }

                    if (shapeType === 'Konva.Circle' || shapeType === 'Konva.Ellipse') {
                        return (
                            <div key={shapeId} onClick={() => onElementClick?.(shapeId, 'shape', actualIndex)}
                                onMouseDown={(e) => handleMouseDown(e, actualIndex, element)}
                                style={{
                                    ...baseStyle, width: element.properties?.radius ? element.properties.radius * 2 : (element.properties?.width || 100),
                                    height: element.properties?.radius ? element.properties.radius * 2 : (element.properties?.height || 100),
                                    backgroundColor: element.properties?.fill || '#7B4AE2', opacity: element.properties?.opacity ?? 1,
                                    borderRadius: '50%',
                                    border: element.properties?.stroke ? `${element.properties.strokeWidth || 1}px solid ${element.properties.stroke}` : 'none'
                                }} />
                        );
                    }

                    if (shapeType === 'Konva.Star') {
                        const numPoints = element.properties?.numPoints || 5;
                        const outerRadius = element.properties?.outerRadius || 40;
                        const innerRadius = element.properties?.innerRadius || 20;

                        // Use standard star points for better rendering
                        const centerX = outerRadius;
                        const centerY = outerRadius;
                        const points: string[] = [];
                        for (let i = 0; i < numPoints * 2; i++) {
                            const angle = (Math.PI / numPoints) * i - Math.PI / 2;
                            const radius = i % 2 === 0 ? outerRadius : innerRadius;
                            const px = centerX + radius * Math.cos(angle);
                            const py = centerY + radius * Math.sin(angle);
                            points.push(`${px},${py}`);
                        }

                        return (
                            <svg key={shapeId} onClick={() => onElementClick?.(shapeId, 'shape', actualIndex)}
                                onMouseDown={(e) => handleMouseDown(e, actualIndex, element)}
                                style={{
                                    ...baseStyle, width: outerRadius * 2, height: outerRadius * 2,
                                    overflow: 'visible'
                                }}>
                                <polygon points={points.join(' ')}
                                    fill={element.properties?.fill || '#f1c40f'}
                                    opacity={element.properties?.opacity ?? 1}
                                    stroke={element.properties?.stroke}
                                    strokeWidth={element.properties?.strokeWidth || 0} />
                            </svg>
                        );
                    }

                    if (shapeType === 'Konva.RegularPolygon') {
                        const sides = element.properties?.sides || 6;
                        const radius = element.properties?.radius || 40;

                        // Calculate polygon points
                        const points: string[] = [];
                        for (let i = 0; i < sides; i++) {
                            const angle = (2 * Math.PI / sides) * i - Math.PI / 2;
                            const px = radius + radius * Math.cos(angle);
                            const py = radius + radius * Math.sin(angle);
                            points.push(`${px},${py}`);
                        }

                        return (
                            <svg key={shapeId} onClick={() => onElementClick?.(shapeId, 'shape', actualIndex)}
                                onMouseDown={(e) => handleMouseDown(e, actualIndex, element)}
                                style={{
                                    ...baseStyle, width: radius * 2, height: radius * 2,
                                    overflow: 'visible'
                                }}>
                                <polygon points={points.join(' ')}
                                    fill={element.properties?.fill || '#8e44ad'}
                                    opacity={element.properties?.opacity ?? 1}
                                    stroke={element.properties?.stroke}
                                    strokeWidth={element.properties?.strokeWidth || 0} />
                            </svg>
                        );
                    }

                    if (shapeType === 'Konva.Line') {
                        const points = element.properties?.points || [20, 20, 60, 60];
                        const width = Math.max(...points.filter((_, i) => i % 2 === 0)) + 10;
                        const height = Math.max(...points.filter((_, i) => i % 2 === 1)) + 10;

                        return (
                            <svg key={shapeId} onClick={() => onElementClick?.(shapeId, 'shape', actualIndex)}
                                onMouseDown={(e) => handleMouseDown(e, actualIndex, element)}
                                style={{ ...baseStyle, width, height, overflow: 'visible' }}>
                                <polyline points={points.join(',')}
                                    fill="none"
                                    stroke={element.properties?.stroke || element.properties?.fill || '#2ecc71'}
                                    strokeWidth={element.properties?.strokeWidth || 4}
                                    opacity={element.properties?.opacity ?? 1} />
                            </svg>
                        );
                    }

                    if (shapeType === 'Konva.Arrow') {
                        const points = element.properties?.points || [20, 20, 60, 60];
                        const width = Math.max(...points.filter((_, i) => i % 2 === 0)) + 20;
                        const height = Math.max(...points.filter((_, i) => i % 2 === 1)) + 20;

                        return (
                            <svg key={shapeId} onClick={() => onElementClick?.(shapeId, 'shape', actualIndex)}
                                onMouseDown={(e) => handleMouseDown(e, actualIndex, element)}
                                style={{ ...baseStyle, width, height, overflow: 'visible' }}>
                                <defs>
                                    <marker id={`arrowhead-${shapeId}`} markerWidth="10" markerHeight="10"
                                        refX="9" refY="3" orient="auto">
                                        <polygon points="0 0, 10 3, 0 6"
                                            fill={element.properties?.stroke || element.properties?.fill || '#e67e22'} />
                                    </marker>
                                </defs>
                                <polyline points={points.join(',')}
                                    fill="none"
                                    stroke={element.properties?.stroke || element.properties?.fill || '#e67e22'}
                                    strokeWidth={element.properties?.strokeWidth || 4}
                                    opacity={element.properties?.opacity ?? 1}
                                    markerEnd={`url(#arrowhead-${shapeId})`} />
                            </svg>
                        );
                    }

                    if (shapeType === 'Konva.Arc') {
                        const innerRadius = element.properties?.innerRadius || 20;
                        const outerRadius = element.properties?.outerRadius || 40;
                        const angle = element.properties?.angle || 90;
                        const size = outerRadius * 2;

                        const startAngle = -90;
                        const endAngle = startAngle + angle;
                        const largeArc = angle > 180 ? 1 : 0;

                        const x1 = outerRadius + outerRadius * Math.cos((startAngle * Math.PI) / 180);
                        const y1 = outerRadius + outerRadius * Math.sin((startAngle * Math.PI) / 180);
                        const x2 = outerRadius + outerRadius * Math.cos((endAngle * Math.PI) / 180);
                        const y2 = outerRadius + outerRadius * Math.sin((endAngle * Math.PI) / 180);
                        const x3 = outerRadius + innerRadius * Math.cos((endAngle * Math.PI) / 180);
                        const y3 = outerRadius + innerRadius * Math.sin((endAngle * Math.PI) / 180);
                        const x4 = outerRadius + innerRadius * Math.cos((startAngle * Math.PI) / 180);
                        const y4 = outerRadius + innerRadius * Math.sin((startAngle * Math.PI) / 180);

                        const pathData = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;

                        return (
                            <svg key={shapeId} onClick={() => onElementClick?.(shapeId, 'shape', actualIndex)}
                                onMouseDown={(e) => handleMouseDown(e, actualIndex, element)}
                                style={{ ...baseStyle, width: size, height: size, overflow: 'visible' }}>
                                <path d={pathData}
                                    fill={element.properties?.fill || '#9b59b6'}
                                    opacity={element.properties?.opacity ?? 1}
                                    stroke={element.properties?.stroke}
                                    strokeWidth={element.properties?.strokeWidth || 0} />
                            </svg>
                        );
                    }

                    if (shapeType === 'Konva.Wedge') {
                        const radius = element.properties?.radius || 40;
                        const angle = element.properties?.angle || 60;
                        const size = radius * 2;

                        const startAngle = -90;
                        const endAngle = startAngle + angle;
                        const largeArc = angle > 180 ? 1 : 0;

                        const x1 = radius + radius * Math.cos((startAngle * Math.PI) / 180);
                        const y1 = radius + radius * Math.sin((startAngle * Math.PI) / 180);
                        const x2 = radius + radius * Math.cos((endAngle * Math.PI) / 180);
                        const y2 = radius + radius * Math.sin((endAngle * Math.PI) / 180);

                        const pathData = `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

                        return (
                            <svg key={shapeId} onClick={() => onElementClick?.(shapeId, 'shape', actualIndex)}
                                onMouseDown={(e) => handleMouseDown(e, actualIndex, element)}
                                style={{ ...baseStyle, width: size, height: size, overflow: 'visible' }}>
                                <path d={pathData}
                                    fill={element.properties?.fill || '#34495e'}
                                    opacity={element.properties?.opacity ?? 1}
                                    stroke={element.properties?.stroke}
                                    strokeWidth={element.properties?.strokeWidth || 0} />
                            </svg>
                        );
                    }

                    // Fallback for unknown shapes
                    return (
                        <div key={shapeId} onClick={() => onElementClick?.(shapeId, 'shape', actualIndex)}
                            onMouseDown={(e) => handleMouseDown(e, actualIndex, element)}
                            style={{
                                ...baseStyle, width: element.properties?.width || 100, height: element.properties?.height || 100,
                                backgroundColor: element.properties?.fill || '#7B4AE2', opacity: element.properties?.opacity ?? 1
                            }} />
                    );
                }

                return null;
            })}
        </div>
    );
};
