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

    if (!elements || elements.length === 0) return null;

    // Filter user-added elements
    const userElements = elements.filter((el: any) => {
        if (el.properties?.userAdded === true) return true;
        if (el.element_type === 'bullet_point') return false;
        if (el.element_type === 'quote' || el.element_type === 'author' || el.element_type === 'context') return false;
        if ((el.element_type === 'text' || el.konva_component === 'Konva.Text') && el.properties?.x !== undefined) return true;
        if ((el.element_type === 'image' || el.konva_component === 'Konva.Image') && el.properties?.x !== undefined) return true;
        if (el.element_type === 'shape' && el.properties?.x !== undefined) return true;
        return false;
    });

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

        setDragState({
            index: actualIndex,
            startX: offsetX,
            startY: offsetY,
            currentX: element.properties?.x || 0,
            currentY: element.properties?.y || 0,
        });
    }, [isEditing]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!dragState) return;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        rafRef.current = requestAnimationFrame(() => {
            // Get parent container to calculate relative position
            const slideContainer = document.querySelector('[data-slide-container]') as HTMLElement;
            const containerRect = slideContainer?.getBoundingClientRect() || { left: 0, top: 0 };

            // Calculate new position relative to container
            const newX = Math.max(0, e.clientX - containerRect.left - dragState.startX);
            const newY = Math.max(0, e.clientY - containerRect.top - dragState.startY);

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

    if (userElements.length === 0) return null;

    return (
        <>
            {userElements.map((element: any) => {
                const actualIndex = elements.indexOf(element);
                const elementId = `el-${slideIndex}-${actualIndex}`;
                const isDragging = dragState?.index === actualIndex;
                const x = isDragging ? dragState.currentX : (element.properties?.x || 0);
                const y = isDragging ? dragState.currentY : (element.properties?.y || 0);

                // Text
                if (element.element_type === 'text' || element.konva_component === 'Konva.Text') {
                    return (
                        <div key={elementId} onMouseDown={(e) => handleMouseDown(e, actualIndex, element)}
                            style={{
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
                    const imageId = element.properties?.image_id || element.image_id || elementId;
                    return (
                        <img key={imageId} src={element.properties?.imageSrc} alt="User added"
                            onClick={() => onElementClick?.(imageId, 'image', actualIndex)}
                            onMouseDown={(e) => handleMouseDown(e, actualIndex, element)}
                            style={{
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
                    const shapeId = element.shape_id || element.properties?.shape_id || elementId;
                    const shapeType = element.konva_component;
                    const baseStyle = {
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
        </>
    );
};
