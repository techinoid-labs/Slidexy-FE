import { Text, Circle, RegularPolygon, Line } from 'react-konva';
import { Html } from 'react-konva-utils';
import KonvaImageComponent from './KonvaImageComponent';
import type { Presentation } from '../types/presentation';
import React, { useEffect, useRef, useState } from 'react';

const SlideRenderer: React.FC<{ slide: Presentation['slides'][number]; slideIndex?: number }> = ({ slide, slideIndex = 0 }) => {
  const stageWidth = 960;
  const stageHeight = 540;
  const stageRef = useRef<any>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (stageRef.current) {
      const stageId = slide.slide_id || `slide-${slideIndex}`;
      if (!window.konvaStages) {
        window.konvaStages = {};
      }
      window.konvaStages[slideIndex] = stageRef.current;
      stageRef.current.batchDraw();
      console.log(`Stored Konva stage for slide ${slideIndex}:`, stageId);

      const canvas = stageRef.current.getCanvas?._canvas;
      if (canvas) {
        canvas.setAttribute('data-slide-id', stageId);
        canvas.setAttribute('data-slide-index', slideIndex.toString());
        
        // Add crossOrigin attribute for CORS handling
        canvas.crossOrigin = 'anonymous';
      }

      setTimeout(() => {
        setIsRendered(true);
        console.log(`Slide ${slideIndex} rendering completed`);
      }, 100);
    }

    return () => {
      if (window.konvaStages && window.konvaStages[slideIndex]) {
        delete window.konvaStages[slideIndex];
      }
    };
  }, [slide.slide_id, slideIndex]);

  const handleImageError = (imageSrc: string) => {
    setImageErrors(prev => new Set([...prev, imageSrc]));
    console.warn(`Image failed to load: ${imageSrc}`);
  };

  const sortedElements = [...(slide.elements || [])].sort(
    (a, b) => (a.properties?.zIndex ?? 0) - (b.properties?.zIndex ?? 0)
  );

  return (
    <>
      {sortedElements.map((el) => {
        const elementKey = `${el.element_type}-${el.id || Math.random()}`;
        console.log(`Rendering element: ${el.element_type} with key: ${elementKey}`);

        switch (el.element_type) {
          case 'html':
            return (
              <Html
                key={elementKey}
                groupProps={{
                  x: el.properties.x || 0,
                  y: el.properties.y || 0,
                }}
                divProps={{
                  style: {
                    width: `${el.properties.width || stageWidth}px`,
                    height: `${el.properties.height || stageHeight}px`,
                    visibility: 'visible',
                    opacity: 1,
                  },
                  'data-konva-html': 'true',
                  'data-slide-index': slideIndex.toString(),
                  'data-element-type': 'html',
                } as React.HTMLAttributes<HTMLDivElement>}
              >
                <div
                  dangerouslySetInnerHTML={{ 
                    __html: el.properties.htmlContent?.replace(
                      /<img([^>]*?)>/g, 
                      '<img$1 crossorigin="anonymous" onerror="this.style.display=\'none\'">'
                    ) || '' 
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    visibility: 'visible',
                    opacity: 1,
                  }}
                />
              </Html>
            );

          case 'text':
          case 'title':
          case 'bullet_point': {
            const p = el.properties;
            return (
              <Text
                key={elementKey}
                text={el.text || ''}
                x={p.x || 0}
                y={p.y || 0}
                fontSize={p.fontSize || 16}
                fontFamily={p.fontFamily || 'Arial'}
                fill={p.fill || '#000000'}
                fontStyle={p.fontStyle || 'normal'}
                fontWeight={p.fontWeight || 'normal'}
                width={p.width || 400}
                height={p.height || 30}
                align={p.align || 'left'}
              />
            );
          }

          case 'shape': {
            const p = el.properties;
            const fill = p.fill || 'transparent';
            const stroke = p.stroke || '#000';
            const strokeWidth = p.strokeWidth ?? 1;

            switch (el.konva_component) {
              case 'Konva.Circle':
                return (
                  <Circle
                    key={elementKey}
                    x={p.x || 0}
                    y={p.y || 0}
                    radius={p.radius || 50}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                  />
                );
              case 'Konva.RegularPolygon':
                return (
                  <RegularPolygon
                    key={elementKey}
                    x={p.x || 0}
                    y={p.y || 0}
                    sides={p.sides || 3}
                    radius={p.radius || 50}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                  />
                );
              case 'Konva.Line':
                return (
                  <Line
                    key={elementKey}
                    points={p.points || []}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    tension={0}
                  />
                );
              default:
                return null;
            }
          }

          case 'image': {
            const p = el.properties;
            const imageSrc = p.imageSrc || '';
            
            // Skip rendering if image had error
            if (imageErrors.has(imageSrc)) {
              return (
                <Text
                  key={elementKey}
                  text="[Image failed to load]"
                  x={p.x || 0}
                  y={p.y || 0}
                  width={p.width || 300}
                  height={p.height || 200}
                  fontSize={12}
                  fill="#999"
                  align="center"
                />
              );
            }

            return (
              <KonvaImageComponent
                key={elementKey}
                imageSrc={imageSrc}
                x={p.x || 0}
                y={p.y || 0}
                width={p.width || 300}
                height={p.height || 200}
                zIndex={p.zIndex || 1}
                rounded={p.rounded || 0}
              />
            );
          }

          default:
            console.log(`Unknown element type: ${el.element_type}`);
            return null;
        }
      })}
    </>
  );
};

export default SlideRenderer;

declare global {
  interface Window {
    konvaStages: Record<number, any>;
    [key: string]: any;
  }
}