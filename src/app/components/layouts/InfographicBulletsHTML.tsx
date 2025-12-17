"use client";
import React from 'react';
import { EditableElement } from '../editor/EditableElement';
import { getContrastTextColor } from '@/utils/colorUtils';

interface InfographicBulletsHTMLProps {
  slide: any;
  theme: any;
  isEditing?: boolean;
  onSlideUpdate?: (updatedSlide: any) => void;
  variant?: 1 | 2 | 3 | 4 | 5;
  onElementClick?: (elementId: string, elementType: string, elementIndex?: number) => void;
  slideIndex?: number;
}

/**
 * Professional metric/infographic layouts optimized for 960x540 slides.
 * Each bullet_point becomes a card with extracted metrics.
 */
export const InfographicBulletsHTML: React.FC<InfographicBulletsHTMLProps> = ({
  slide,
  theme,
  isEditing = false,
  onSlideUpdate,
  onElementClick,
  slideIndex = 0,
  variant = 1
}) => {
  const title = slide.slide_title?.text || "Key Metrics";
  const bullets = slide.elements?.filter((el: any) => el.element_type === 'bullet_point') || [];
  const bgColor = theme?.backgroundColor || '#ffffff';
  const accent = theme?.artPalette?.[0] || '#6c5ce7';
  const accent2 = theme?.artPalette?.[1] || '#00b894';
  const accent3 = theme?.artPalette?.[2] || '#fdcb6e';
  const accent4 = theme?.artPalette?.[3] || '#e17055';

  const handleUpdate = (type: 'title' | 'bullet', value: string, index?: number) => {
    if (!onSlideUpdate) return;
    const updated = { ...slide };
    if (type === 'title') {
      updated.slide_title = { ...updated.slide_title, text: value };
    } else if (type === 'bullet' && typeof index === 'number') {
      const target = bullets[index];
      if (target) {
        updated.elements = slide.elements.map((el: any) =>
          el.id === target.id ? { ...el, text: value } : el
        );
      }
    }
    onSlideUpdate(updated);
  };

  const parseMetric = (text: string) => {
    const match = text.match(/^([0-9]+(?:\.[0-9]+)?[%$KkMm]?)[\s\-–—]*(.*)$/i);
    if (match) {
      return { metric: match[1], description: match[2] || '' };
    }
    return { metric: null, description: text };
  };

  const getAccentColor = (index: number) => {
    const colors = [accent, accent2, accent3, accent4];
    return colors[index % colors.length];
  };

  // Variant 1: Gradient Cards with Professional Spacing
  if (variant === 1) {
    const gridCols = bullets.length <= 2 ? 2 : bullets.length === 3 ? 3 : 2;
    
    return (
      <div style={{
        width: '960px',
        height: '540px',
        backgroundColor: bgColor,
        padding: '48px 56px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}>
        <EditableElement
          id={`title-${slideIndex}`}
          text={title}
          isEditing={isEditing}
          tagName="h1"
          onChange={(val) => handleUpdate('title', val)}
          onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
          style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            margin: '0 0 32px',
            letterSpacing: '-0.02em',
            color: '#1a202c',
            lineHeight: 1.2
          }}
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gap: '20px',
          flex: 1,
          alignContent: 'start'
        }}>
          {bullets.map((bullet: any, index: number) => {
            const { metric, description } = parseMetric(bullet.text || '');
            const color = getAccentColor(index);
            
            return (
              <div
                key={bullet.id}
                style={{
                  background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
                  border: `2px solid ${color}30`,
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'transform 0.2s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: color,
                  backgroundColor: `${color}20`,
                  padding: '4px 10px',
                  borderRadius: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Metric
                </div>

                <EditableElement
                  id={`el-${slideIndex}-${index}-metric`}
                  text={metric || bullet.text}
                  isEditing={isEditing}
                  tagName="div"
                  onChange={(val) => {
                    const newText = metric ? `${val} - ${description}` : val;
                    handleUpdate('bullet', newText, index);
                  }}
                  onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                  style={{
                    fontSize: metric ? '2.5rem' : '1.1rem',
                    fontWeight: 800,
                    color: '#1a202c',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    marginTop: metric ? '24px' : '0'
                  }}
                />

                {metric && description && (
                  <EditableElement
                    id={`el-${slideIndex}-${index}-desc`}
                    text={description}
                    isEditing={isEditing}
                    tagName="p"
                    onChange={(val) => handleUpdate('bullet', `${metric} - ${val}`, index)}
                    onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                    style={{
                      fontSize: '0.9rem',
                      color: '#4a5568',
                      lineHeight: 1.5,
                      marginTop: '4px'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Variant 2: Minimalist Grid with Numbers
  if (variant === 2) {
    const gridCols = bullets.length <= 2 ? 2 : bullets.length === 3 ? 3 : 2;
    
    return (
      <div style={{
        width: '960px',
        height: '540px',
        backgroundColor: bgColor,
        padding: '48px 56px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}>
        <EditableElement
          id={`title-${slideIndex}`}
          text={title}
          isEditing={isEditing}
          tagName="h1"
          onChange={(val) => handleUpdate('title', val)}
          onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
          style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            textAlign: 'center',
            color: '#1a202c',
            marginBottom: '36px',
            letterSpacing: '-0.02em'
          }}
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gap: '24px',
          flex: 1,
          alignContent: 'start'
        }}>
          {bullets.map((bullet: any, index: number) => {
            const { metric, description } = parseMetric(bullet.text || '');
            const color = getAccentColor(index);
            
            return (
              <div
                key={bullet.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  transition: 'box-shadow 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {index + 1}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <EditableElement
                    id={`el-${slideIndex}-${index}-metric`}
                    text={metric || bullet.text}
                    isEditing={isEditing}
                    tagName="div"
                    onChange={(val) => {
                      const newText = metric ? `${val} - ${description}` : val;
                      handleUpdate('bullet', newText, index);
                    }}
                    onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                    style={{
                      fontSize: metric ? '1.75rem' : '1rem',
                      fontWeight: 700,
                      color: '#1a202c',
                      lineHeight: 1.2
                    }}
                  />

                  {metric && description && (
                    <EditableElement
                      id={`el-${slideIndex}-${index}-desc`}
                      text={description}
                      isEditing={isEditing}
                      tagName="p"
                      onChange={(val) => handleUpdate('bullet', `${metric} - ${val}`, index)}
                      onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                      style={{
                        fontSize: '0.85rem',
                        color: '#718096',
                        lineHeight: 1.4
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Variant 3: Circular Progress Cards
  if (variant === 3) {
    const gridCols = bullets.length <= 2 ? 2 : bullets.length === 3 ? 3 : 2;
    
    return (
      <div style={{
        width: '960px',
        height: '520px',
        backgroundColor: bgColor,
        padding: '50px 50px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}>
        <EditableElement
          id={`title-${slideIndex}`}
          text={title}
          isEditing={isEditing}
          tagName="h1"
          onChange={(val) => handleUpdate('title', val)}
          onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
          style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            color: '#1a202c',
            marginBottom: '36px',
            letterSpacing: '-0.02em'
          }}
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gap: '24px',
          flex: 1,
          alignContent: 'start'
        }}>
          {bullets.map((bullet: any, index: number) => {
            const { metric, description } = parseMetric(bullet.text || '');
            const color = getAccentColor(index);
            
            return (
              <div
                key={bullet.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: `2px solid ${color}20`,
                  borderRadius: '16px',
                  padding: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '12px'
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: `conic-gradient(${color} 0deg 270deg, ${color}20 270deg 360deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <EditableElement
                      id={`el-${slideIndex}-${index}-metric`}
                      text={metric || (index + 1).toString()}
                      isEditing={isEditing}
                      tagName="div"
                      onChange={(val) => {
                        const newText = metric ? `${val} - ${description}` : val;
                        handleUpdate('bullet', newText, index);
                      }}
                      onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: color
                      }}
                    />
                  </div>
                </div>

                <EditableElement
                  id={`el-${slideIndex}-${index}-desc`}
                  text={description || bullet.text}
                  isEditing={isEditing}
                  tagName="p"
                  onChange={(val) => handleUpdate('bullet', metric ? `${metric} - ${val}` : val, index)}
                  onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                  style={{
                    fontSize: '0.85rem',
                    color: '#4a5568',
                    lineHeight: 1.5
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Variant 4: Vertical List with Big Numbers
  if (variant === 4) {
    return (
      <div style={{
        width: '960px',
        height: '540px',
        backgroundColor: bgColor,
        padding: '48px 56px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}>
        <EditableElement
          id={`title-${slideIndex}`}
          text={title}
          isEditing={isEditing}
          tagName="h1"
          onChange={(val) => handleUpdate('title', val)}
          onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
          style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            color: '#1a202c',
            borderBottom: `4px solid ${accent}`,
            display: 'inline-block',
            paddingBottom: '12px',
            marginBottom: '32px',
            letterSpacing: '-0.02em'
          }}
        />

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          flex: 1,
          overflowY: 'auto'
        }}>
          {bullets.map((bullet: any, index: number) => {
            const { metric, description } = parseMetric(bullet.text || '');
            const color = getAccentColor(index);
            
            return (
              <div
                key={bullet.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '16px 20px',
                  backgroundColor: '#ffffff',
                  border: `1px solid #e2e8f0`,
                  borderLeft: `4px solid ${color}`,
                  borderRadius: '8px',
                  transition: 'transform 0.2s'
                }}
              >
                <EditableElement
                  id={`el-${slideIndex}-${index}-metric`}
                  text={metric || (index + 1).toString()}
                  isEditing={isEditing}
                  tagName="div"
                  onChange={(val) => {
                    const newText = metric ? `${val} - ${description}` : val;
                    handleUpdate('bullet', newText, index);
                  }}
                  onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: color,
                    lineHeight: 1,
                    minWidth: '120px',
                    textAlign: 'center'
                  }}
                />

                <EditableElement
                  id={`el-${slideIndex}-${index}-desc`}
                  text={description || bullet.text}
                  isEditing={isEditing}
                  tagName="p"
                  onChange={(val) => handleUpdate('bullet', metric ? `${metric} - ${val}` : val, index)}
                  onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                  style={{
                    fontSize: '1rem',
                    color: '#4a5568',
                    flex: 1,
                    lineHeight: 1.5
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Variant 5: Icon Grid with Modern Cards
  const gridCols = bullets.length <= 2 ? 2 : bullets.length === 3 ? 3 : 2;
  
  return (
    <div style={{
      width: '960px',
      height: '540px',
      backgroundColor: bgColor,
      padding: '48px 56px',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <EditableElement
        id={`title-${slideIndex}`}
        text={title}
        isEditing={isEditing}
        tagName="h1"
        onChange={(val) => handleUpdate('title', val)}
        onSelectElement={() => onElementClick?.(`title-${slideIndex}`, 'text')}
        style={{
          fontSize: '2.25rem',
          fontWeight: 800,
          color: '#1a202c',
          marginBottom: '36px',
          letterSpacing: '-0.02em'
        }}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        gap: '20px',
        flex: 1,
        alignContent: 'start'
      }}>
        {bullets.map((bullet: any, index: number) => {
          const { metric, description } = parseMetric(bullet.text || '');
          const color = getAccentColor(index);
          const icons = ['📊', '🎯', '💡', '🚀', '⚡', '✨'];
          
          return (
            <div
              key={bullet.id}
              style={{
                backgroundColor: '#ffffff',
                border: `2px solid ${color}15`,
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                flexShrink: 0
              }}>
                {icons[index % icons.length]}
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <EditableElement
                  id={`el-${slideIndex}-${index}-metric`}
                  text={metric || bullet.text}
                  isEditing={isEditing}
                  tagName="div"
                  onChange={(val) => {
                    const newText = metric ? `${val} - ${description}` : val;
                    handleUpdate('bullet', newText, index);
                  }}
                  onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                  style={{
                    fontSize: metric ? '1.75rem' : '1.1rem',
                    fontWeight: 800,
                    color: '#1a202c',
                    lineHeight: 1.2
                  }}
                />

                {metric && description && (
                  <EditableElement
                    id={`el-${slideIndex}-${index}-desc`}
                    text={description}
                    isEditing={isEditing}
                    tagName="p"
                    onChange={(val) => handleUpdate('bullet', `${metric} - ${val}`, index)}
                    onSelectElement={() => onElementClick?.(`el-${slideIndex}-${index}`, 'text', index)}
                    style={{
                      fontSize: '0.85rem',
                      color: '#718096',
                      lineHeight: 1.5
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};