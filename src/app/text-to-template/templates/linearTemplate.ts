import type { Slide, BackendSlide } from "../types/presentation";

// Linear template color palette
const linearPalette = {
  primary: "#2643E9", // Royal Blue
  secondary: "#FF7847", // Sunset Orange
  neutral: "#FAFAFA", // Off-White
  dark: "#222222", // Graphite
  lightGray: "#F5F5F5",
  mediumGray: "#E0E0E0",
  textLight: "#666666",
  accent: "#4F63FF", // Lighter blue variant
  warning: "#FFB347", // Lighter orange variant
} ;

// Utility function to create linear dividers
const linearDivider = (
  orientation: 'horizontal' | 'vertical',
  position: string,
  length = "100%",
  thickness = "1px",
  color = linearPalette.primary,
  opacity = 0.3
): string => {
  const isHorizontal = orientation === 'horizontal';
  return `
    <div style="
      position: absolute;
      ${isHorizontal ? `top: ${position}; left: 50%; width: ${length}; height: ${thickness}; transform: translateX(-50%);` : 
                       `left: ${position}; top: 50%; height: ${length}; width: ${thickness}; transform: translateY(-50%);`}
      background: ${color};
      opacity: ${opacity};
      z-index: 1;
    "></div>
  `;
};

// Utility function to create linear accent bars
const accentBar = (
  position: 'top' | 'bottom' | 'left' | 'right',
  size = "4px",
  color = linearPalette.secondary,
  length = "60px"
): string => {
  const styles = {
    top: `top: 0; left: 50%; width: ${length}; height: ${size}; transform: translateX(-50%);`,
    bottom: `bottom: 0; left: 50%; width: ${length}; height: ${size}; transform: translateX(-50%);`,
    left: `left: 0; top: 50%; width: ${size}; height: ${length}; transform: translateY(-50%);`,
    right: `right: 0; top: 50%; width: ${size}; height: ${length}; transform: translateY(-50%);`,
  };

  return `
    <div style="
      position: absolute;
      ${styles[position]}
      background: ${color};
      border-radius: 2px;
      z-index: 2;
    "></div>
  `;
};

// Utility function for minimal geometric elements
const linearShape = (
  type: 'line' | 'dot' | 'square',
  top: string,
  left: string,
  color = linearPalette.primary,
  size = "8px"
): string => {
  const shapes = {
    line: `width: 24px; height: 2px; background: ${color}; border-radius: 1px;`,
    dot: `width: ${size}; height: ${size}; background: ${color}; border-radius: 50%;`,
    square: `width: ${size}; height: ${size}; background: ${color}; border-radius: 1px;`,
  };

  return `
    <div style="
      position: absolute;
      top: ${top};
      left: ${left};
      ${shapes[type]}
      opacity: 0.6;
      z-index: 1;
    "></div>
  `;
};

// Utility function for clean icons
const linearIcon = (type: 'arrow' | 'plus' | 'minus', size = 20, color = linearPalette.primary): string => {
  const icons: Record<string, string> = {
    arrow: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    plus: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V19M5 12H19" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    minus: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  };
  return icons[type] || icons.arrow;
};

// Extract text content from block
const getTextContent = (block: BackendSlide['textBlock']): string[] => {
  if (!block?.elements) return [];
  return block.elements
    .map((el) => el.text || '')
    .filter((text) => text.length > 0);
};

// Extract images from backend slide
const getImages = (backendSlide: BackendSlide): string[] => {
  const images: string[] = [];
  if (backendSlide.image_url && typeof backendSlide.image_url === 'string' && backendSlide.image_url.trim()) {
    images.push(backendSlide.image_url.trim());
  }
  if (backendSlide.imageBlock?.elements && Array.isArray(backendSlide.imageBlock.elements)) {
    backendSlide.imageBlock.elements.forEach((el) => {
      if (el.properties?.imageSrc && typeof el.properties.imageSrc === 'string' && el.properties.imageSrc.trim()) {
        images.push(el.properties.imageSrc.trim());
      }
    });
  }
  if (images.length === 0) {
    console.warn(`No valid images found for slide ${backendSlide.slide_id || 'unknown'}`);
  }
  return images;
};

export const createLinearTemplate = (backendSlide: BackendSlide, slideIndex: number): Slide => {
  const { slide_id, slide_title, textBlock, imageBlock, titleBlock } = backendSlide;
  const elements: Slide['elements'] = [];
  
  const textContent = getTextContent(textBlock);
  const titleText = titleBlock?.elements?.[0]?.text || slide_title?.text || `Slide ${slideIndex + 1}`;
  const images = getImages(backendSlide);
  const layoutType = slideIndex % 5;
  let htmlTemplate = '';

  switch (layoutType) {
    case 0: // Linear Header Layout
      htmlTemplate = `
        <div style="
          display: flex;
          flex-direction: column;
          height: 100%;
          background: ${linearPalette.neutral};
          position: relative;
          overflow: hidden;
        ">
          ${accentBar('top', '6px', linearPalette.primary, '120px')}
          ${linearDivider('horizontal', '25%', '80%', '1px', linearPalette.mediumGray, 0.5)}
          ${linearShape('dot', '15%', '5%', linearPalette.secondary, '6px')}
          ${linearShape('line', '15%', '7%', linearPalette.primary)}
          ${linearShape('square', '15%', '92%', linearPalette.secondary, '8px')}
          
          <div style="
            padding: 3rem 3rem 2rem;
            background: ${linearPalette.neutral};
            border-bottom: 3px solid ${linearPalette.primary};
            position: relative;
            z-index: 10;
          ">
            <h2 style="
              font-family: 'Raleway', sans-serif;
              font-size: 2.8rem;
              font-weight: 700;
              color: ${linearPalette.dark};
              margin: 0 0 1rem;
              letter-spacing: -0.02em;
              line-height: 1.1;
            ">
              ${titleText}
            </h2>
            ${textContent.slice(0, 2).map((text) => `
              <p style="
                font-family: 'Raleway', sans-serif;
                font-size: 1.1rem;
                color: ${linearPalette.textLight};
                line-height: 1.6;
                margin: 0 0 1rem;
                max-width: 70%;
              ">
                ${text}
              </p>
            `).join('')}
          </div>
          
          <div style="
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 3rem;
            position: relative;
            z-index: 5;
          ">
            ${images.length > 0 ? `
              <div style="
                width: 85%;
                height: 100%;
                marginbotttom: 20px;
                position: relative;
                border: 2px solid ${linearPalette.mediumGray};
                background: white;
                overflow: hidden;
              ">
                ${accentBar('left', '4px', linearPalette.secondary, '40%')}
                <img src="${images[0]}" style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  display: block;
                "/>
              </div>
            ` : `
              <div style="
                width: 85%;
                height: 75%;
                background: ${linearPalette.lightGray};
                border: 2px solid ${linearPalette.mediumGray};
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
              ">
                ${accentBar('left', '4px', linearPalette.secondary, '40%')}
                <p style="
                  font-family: 'Raleway', sans-serif;
                  color: ${linearPalette.textLight};
                  font-size: 1rem;
                ">Content Area</p>
              </div>
            `}
          </div>
        </div>`;
      break;

    case 1: // Linear Sidebar Layout
      htmlTemplate = `
        <div style="
          display: grid;
          grid-template-columns: 1fr 2px 2fr;
          height: 100%;
          background: ${linearPalette.neutral};
          position: relative;
          overflow: hidden;
        ">
          ${linearShape('dot', '10%', '33%', linearPalette.primary, '4px')}
          ${linearShape('line', '90%', '10%', linearPalette.secondary)}
          ${linearShape('square', '90%', '90%', linearPalette.primary, '6px')}
          
          <div style="
            padding: 3rem 2rem;
            background: white;
            border-right: 1px solid ${linearPalette.mediumGray};
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            z-index: 10;
          ">
            ${accentBar('top', '4px', linearPalette.secondary, '80px')}
            <h2 style="
              font-family: 'Raleway', sans-serif;
              font-size: 1.5rem;
              font-weight: 600;
              color: ${linearPalette.dark};
              margin: 0 0 2rem;
              line-height: 1.2;
            ">
              ${titleText}
            </h2>
            ${textContent.map((text, idx) => `
              <div style="
                margin: 0 0 1.5rem;
                padding-left: 1rem;
                border-left: 3px solid ${idx === 0 ? linearPalette.primary : linearPalette.secondary};
                position: relative;
                gap = 0.5rem;
              ">
                <p style="
                  font-family: 'Raleway', sans-serif;
                  font-size: 1rem;
                  color: ${linearPalette.textLight};
                  line-height: 1;
                  margin: 0;
                ">
                  ${text}
                </p>
              </div>
            `).join('')}
          </div>
          
          <div style="
            background: ${linearPalette.primary};
            position: relative;
            z-index: 5;
          "></div>
          
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            background: ${linearPalette.lightGray};
            position: relative;
            z-index: 10;
          ">
            ${images.length > 0 ? `
              <div style="
                width: 90%;
                height: 80%;
                background: white;
                border: 1px solid ${linearPalette.mediumGray};
                position: relative;
                overflow: hidden;
              ">
                ${accentBar('bottom', '3px', linearPalette.secondary, '100%')}
                <img src="${images[0]}" style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  display: block;
                "/>
              </div>
            ` : `
              <div style="
                width: 90%;
                height: 80%;
                background: white;
                border: 1px solid ${linearPalette.mediumGray};
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
              ">
                ${accentBar('bottom', '3px', linearPalette.secondary, '100%')}
                ${linearIcon('plus', 40, linearPalette.textLight)}
              </div>
            `}
          </div>
        </div>`;
      break;

   case 2: // Linear Grid Layout (3 cards)
  htmlTemplate = `
    <div style="
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: auto 1fr;
      height: 100%;
      gap: 2px;
      background: ${linearPalette.mediumGray};
      position: relative;
      overflow: hidden;
    ">
      ${linearShape('line', '5%', '50%', linearPalette.primary)}
      ${linearShape('dot', '95%', '5%', linearPalette.secondary, '5px')}
      ${linearShape('square', '50%', '2%', linearPalette.secondary, '4px')}
      ${linearShape('line', '50%', '98%', linearPalette.primary)}
      ${linearDivider('horizontal', '70%', '30%', '2px', linearPalette.primary, 0.6)}
      
      <!-- Header -->
      <div style="
        grid-column: 1 / -1;
        padding: 1.5rem 3rem;
        background: ${linearPalette.dark};
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        z-index: 10;
      ">
        ${accentBar('bottom', '4px', linearPalette.primary, '150px')}
        <h2 style="
          font-family: 'Raleway', sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: ${linearPalette.neutral};
          margin: 0;
          letter-spacing: -0.01em;
        ">
          ${titleText}
        </h2>
        <div style="
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <div style="width: 20px; height: 2px; background: ${linearPalette.secondary};"></div>
          <div style="width: 6px; height: 6px; background: ${linearPalette.secondary}; border-radius: 50%;"></div>
          <div style="width: 40px; height: 2px; background: ${linearPalette.secondary};"></div>
        </div>
      </div>
      
      <!-- 3 Cards -->
      ${[...Array(3)].map((_, idx) => {
        const text = textContent[idx] || `Key point ${idx + 1} - Supporting details and information for this section.`;
        const hasImage = images[idx] && images[idx].trim();
        return `
          <div style="
            padding: 1.2rem;
            background: ${linearPalette.neutral};
            display: flex;
            flex-direction: column;
            position: relative;
            z-index: 10;
          ">
            <div style="
              width: 29px;
              height: 10px;
              background: ${idx % 2 === 0 ? linearPalette.primary : linearPalette.secondary};
              margin-bottom: 0.6rem; /* reduced gap */
            "></div>
            <h3 style="
              font-family: 'Raleway', sans-serif;
              font-size: 1.1rem;
              font-weight: 600;
              color: ${linearPalette.dark};
              margin: 0 0 0.4rem;
            ">
              ${idx === 0 ? 'Overview' : idx === 1 ? 'Analysis' : 'Strategy'}
            </h3>
            <p style="
              font-family: 'Raleway', sans-serif;
              font-size: 0.85rem;
              color: ${linearPalette.textLight};
              line-height: 1.4;
              margin: 0 0 0.4rem; /* reduced gap */
              flex: 1;
            ">
              ${text}
            </p>
            ${hasImage ? `
              <div style="
                height: 140px; /* increased height */
                background: white;
                border: 1px solid ${linearPalette.mediumGray};
                overflow: hidden;
                position: relative;
              ">
                ${accentBar('top', '2px', idx % 2 === 0 ? linearPalette.primary : linearPalette.secondary, '40%')}
                <img src="${images[idx]}" style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  display: block;
                " onerror="this.src='https://via.placeholder.com/300x200?text=Image+Failed'" />
              </div>
            ` : `
              <div style="
                height: 140px; /* increased height */
                background: ${linearPalette.lightGray};
                border: 1px solid ${linearPalette.mediumGray};
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                color: ${linearPalette.textLight};
                font-family: 'Raleway', sans-serif;
                font-size: 0.9rem;
              ">
                ${accentBar('top', '2px', idx % 2 === 0 ? linearPalette.primary : linearPalette.secondary, '40%')}
                No Image Available
              </div>
            `}
          </div>
        `;
      }).join('')}
    </div>`;
  break;
    case 3: // Linear Steps Layout
  htmlTemplate = `
    <div style="
      display: flex;
      flex-direction: column;
      height: 100%;
      background: ${linearPalette.neutral};
      position: relative;
      overflow: hidden;
    ">
      ${linearDivider('horizontal', '35%', '100%', '1px', linearPalette.mediumGray, 0.5)}
      ${linearShape('square', '8%', '2%', linearPalette.primary, '4px')}
      ${linearShape('line', '92%', '98%', linearPalette.secondary)}
      
      <div style="
        padding: 2.5rem 3rem;
        background: white;
        border-bottom: 1px solid ${linearPalette.mediumGray};
        position: relative;
        z-index: 10;
      ">
        <div style="
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background: ${linearPalette.primary};
            border-radius: 50%;
          "></div>
          <div style="
            flex: 1;
            height: 1px;
            background: ${linearPalette.mediumGray};
          "></div>
          <div style="
            width: 6px;
            height: 6px;
            background: ${linearPalette.secondary};
            border-radius: 50%;
          "></div>
        </div>
        <h2 style="
          font-family: 'Raleway', sans-serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: ${linearPalette.dark};
          margin: 0;
          line-height: 1.1;
        ">
          ${titleText}
        </h2>
      </div>
      
      <div style="
        flex: 1;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1px;
        background: ${linearPalette.mediumGray};
        position: relative;
        z-index: 5;
      ">
        ${textContent.slice(0, 3).map((text, idx) => `
          <div style="
            padding: 1.5rem 1.2rem;
            background: ${linearPalette.neutral};
            display: flex;
            flex-direction: column;
            position: relative;
            z-index: 10;
          ">
            <div style="
              display: flex;
              align-items: center;
              gap: 0.8rem;
              margin-bottom: 1rem;
            ">
              <div style="
                width: 28px;
                height: 28px;
                background: ${idx % 2 === 0 ? linearPalette.primary : linearPalette.secondary};
                color: white;
                border-radius: 2px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Raleway', sans-serif;
                font-weight: 600;
                font-size: 0.9rem;
              ">
                ${idx + 1}
              </div>
              <div style="
                flex: 1;
                height: 2px;
                background: ${linearPalette.lightGray};
              "></div>
            </div>
            <h3 style="
              font-family: 'Raleway', sans-serif;
              font-size: 1.1rem;
              font-weight: 600;
              color: ${linearPalette.dark};
              margin: 0 0 0.8rem;
            ">
              Step ${idx + 1}
            </h3>
            <p style="
              font-family: 'Raleway', sans-serif;
              font-size: 0.95rem;
              color: ${linearPalette.textLight};
              line-height: 1.5;
              margin: 0 0 1rem;
              flex: 1;
            ">
              ${text}
            </p>
            ${images[idx] ? `
              <div style="
                height: 160px; /* increased height */
                background: white;
                border: 1px solid ${linearPalette.mediumGray};
                overflow: hidden;
                position: relative;
              ">
                ${accentBar('bottom', '2px', idx % 2 === 0 ? linearPalette.primary : linearPalette.secondary, '100%')}
                <img src="${images[idx]}" style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  display: block;
                "/>
              </div>
            ` : `
              <div style="
                height: 160px; /* increased height */
                background: ${linearPalette.lightGray};
                border: 1px solid ${linearPalette.mediumGray};
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
              ">
                ${accentBar('bottom', '2px', idx % 2 === 0 ? linearPalette.primary : linearPalette.secondary, '100%')}
                <div style="
                  display: flex;
                  align-items: center;
                  gap: 0.5rem;
                  color: ${linearPalette.textLight};
                  font-size: 0.8rem;
                  font-family: 'Raleway', sans-serif;
                ">
                  ${linearIcon('plus', 14, linearPalette.mediumGray)}
                  <span>Visual</span>
                </div>
              </div>
            `}
          </div>
        `).join('')}
      </div>
    </div>`;
  break;

  case 4: // Linear Minimal Layout
  htmlTemplate = `
    <div style="
      display: flex;
      height: 100%;
      background: white;
      position: relative;
      overflow: hidden;
    ">
      ${linearDivider('vertical', '40%', '100%', '1px', linearPalette.primary, 0.8)}
      ${linearShape('dot', '5%', '39%', linearPalette.secondary, '6px')}
      ${linearShape('line', '95%', '41%', linearPalette.primary)}
      
      <div style="
        flex: 2;
        padding: 4rem 3rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        z-index: 10;
      ">
        <div style="
          width: 60px;
          height: 4px;
          background: ${linearPalette.secondary};
          margin-bottom: 2rem;
        "></div>
        <h2 style="
          font-family: 'Raleway', sans-serif;
          font-size: 3rem;
          font-weight: 300;
          color: ${linearPalette.dark};
          margin: 0 0 2rem;
          line-height: 1.1;
          letter-spacing: -0.02em;
        ">
          ${titleText}
        </h2>
        ${textContent.slice(0, 2).map((text, idx) => `
          <p style="
            font-family: 'Raleway', sans-serif;
            font-size: 1.1rem;
            color: ${linearPalette.textLight};
            line-height: 1.7;
            margin: 0 0 1.5rem;
            padding-left: ${idx === 0 ? '2rem' : '0'};
            border-left: ${idx === 0 ? `3px solid ${linearPalette.primary}` : 'none'};
          ">
            ${text}
          </p>
        `).join('')}
      </div>
      
      <div style="
        flex: 3;
        background: ${linearPalette.lightGray};
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem; /* reduced padding */
        position: relative;
        z-index: 5;
      ">
        ${accentBar('left', '6px', linearPalette.primary, '60%')}
        ${images.length > 0 ? `
          <div style="
            width: 90%;
            height: 85%; /* increased height */
            background: white;
            border: 1px solid ${linearPalette.mediumGray};
            overflow: hidden;
            position: relative;
          ">
            <img src="${images[0]}" style="
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            "/>
            <div style="
              position: absolute;
              bottom: 0;
              right: 0;
              width: 40px;
              height: 40px;
              background: ${linearPalette.secondary};
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              ${linearIcon('arrow', 20, 'white')}
            </div>
          </div>
        ` : `
          <div style="
            width: 90%;
            height: 85%; /* increased height */
            background: white;
            border: 1px solid ${linearPalette.mediumGray};
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          ">
            <div style="
              text-align: center;
              color: ${linearPalette.textLight};
            ">
              ${linearIcon('plus', 60, linearPalette.mediumGray)}
            </div>
            <div style="
              position: absolute;
              bottom: 0;
              right: 0;
              width: 40px;
              height: 40px;
              background: ${linearPalette.secondary};
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              ${linearIcon('arrow', 20, 'white')}
            </div>
          </div>
        `}
      </div>
    </div>`;
  break;

    default:
      htmlTemplate = `<div>Error: Invalid layout type</div>`;
  }

  elements.push({
    element_type: 'html',
    konva_component: 'Konva.HTML',
    properties: {
      x: 0,
      y: 0,
      width: 960,
      height: 540,
      htmlContent: htmlTemplate,
      zIndex: 0,
    },
    id: `html-linear-${slide_id || slideIndex}`,
  });

  return {
    slide_id: slide_id || `slide-${slideIndex}`,
    title: titleText,
    image_url: images[0],
    elements,
    htmlTemplate,
  };
};
