// export const SLIDE_WIDTH = 800;
// export const SLIDE_HEIGHT = 400;
// export const LEFT_PADDING = 30;
// export const IMG_WIDTH = 380;
// export const IMG_HEIGHT = 320;
export const restrictShapeBounds = (
  x: number,
  y: number,
  shapeType: string,
  properties: any,
  canvasWidth: number = getSlideDimensions().SLIDE_WIDTH,
  canvasHeight: number = getSlideDimensions().SLIDE_HEIGHT
) => {
  const minSize = 50;
  let width = properties.width || minSize;
  let height = properties.height || minSize;
  let maxX, maxY;
  // Special case for radius-based shapes
  if (shapeType === "Konva.Circle") {
    const radius = Math.max(properties.radius || 25, minSize / 2);
    width = height = radius * 2;
  } else if (shapeType === "Konva.Star") {
    const outerRadius = Math.max(properties.outerRadius || 25, minSize / 2);
    width = height = outerRadius * 2;
  } else if (shapeType === "Konva.Line") {
    const points = [20, 20, 60, 60];
    const xs = points.filter((_, idx) => idx % 2 === 0);
    const ys = points.filter((_, idx) => idx % 2 !== 0);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    width = Math.max(minSize, maxX - minX);
    height = Math.max(minSize, maxY - minY);
    console.log("inserting line: " + points);
    console.log(xs, ys, minX, minY, maxX, maxY);
  } else if (shapeType === "Konva.Arrow") {
    const points = [0, 0, 100, 100];
    const xs = points.filter((_, idx) => idx % 2 === 0);
    const ys = points.filter((_, idx) => idx % 2 !== 0);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    width = Math.max(minSize, maxX - minX);
    height = Math.max(minSize, maxY - minY);
  } else {
    width = Math.max(width, minSize);
    height = Math.max(height, minSize);
  }
const paddingBottom = window.innerHeight <= 830 ? 50 : 10;
  // Clamp position so shape doesn't overflow canvas
  if (["Konva.Line"].includes(shapeType)) {
    maxX = canvasWidth - width;  // extra padding for small shapes
    maxY = canvasHeight - paddingBottom ;
  } else {
    maxX = canvasWidth - width + 50;
    maxY = canvasHeight - paddingBottom + 30;
  }

  const constrainedX = Math.max(0, Math.min(x, maxX));
  const constrainedY = Math.max(0, Math.min(y, maxY));

  return {
    x: constrainedX,
    y: constrainedY,
    width,
    height,
    isAtBoundary: x !== constrainedX || y !== constrainedY,
  };
};
export const getSlideDimensions = () => {
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 960;
  const windowHeight = typeof window !== "undefined" ? window.innerHeight : 540;
  // const SLIDE_WIDTH = Math.min(windowWidth * 0.8, 960); // 90% of window width, capped at 500
  // const SLIDE_HEIGHT = Math.min(windowHeight * 0.6, 540); // 60% of window height, capped at 400
  const SLIDE_WIDTH = 960; // 90% of window width, capped at 500
  const SLIDE_HEIGHT = 600; // 60% of window height, capped at 400
  const LEFT_PADDING = 20;
  const IMAGE_WIDTH = 380;
  const IMAGE_HEIGHT = 320;
  const SLIDE_WIDTH_MOBILE = Math.min(windowWidth * 0.8, 500);
  const SLIDE_HEIGHT_MOBILE = Math.min(windowHeight * 0.6, 400);
  return { SLIDE_WIDTH, SLIDE_HEIGHT, LEFT_PADDING, IMAGE_WIDTH, IMAGE_HEIGHT, SLIDE_HEIGHT_MOBILE,SLIDE_WIDTH_MOBILE };
};


// export const clearCanvas = () => {
//   const { SLIDE_WIDTH, SLIDE_HEIGHT, LEFT_PADDING } = getSlideDimensions();
//   return {
//     slide_id: `slide-${Date.now()}`,
//     slide_title: {
//       text: "",
//       properties: {
//         fontSize: 14,
//         fontWeight: "normal",
//         fontFamily: "Roboto",
//         fill: "#000",
//         fontStyle: "normal",
//         align: "left",
//         x: LEFT_PADDING,
//         y: 25,
//         width: 220,
//       },
//     },
//     elements: [],
//     image_url: null,
//   };
// };

export const constrainToCanvas = (
  x: number,
  y: number,
  width: number,
  height: number,
  canvasWidth: number = getSlideDimensions().SLIDE_WIDTH,
  canvasHeight: number = getSlideDimensions().SLIDE_HEIGHT
) => {
  const { LEFT_PADDING } = getSlideDimensions();
  const paddingLeft = LEFT_PADDING - 200; // 17
  const paddingRight = 10;
  const paddingTop = 60;
  const paddingBottom = window.innerHeight <= 830 ? 50 : 10;

  const minX = paddingLeft;

  // const minY = paddingTop - 80;
  // const safeHeight = height || 30;
  // // Use a less restrictive maxX to allow dragging across the canvas
  // const maxX = canvasWidth - paddingRight; // e.g., 300 - 10 = 290
  // const maxY = canvasHeight - paddingBottom + 50;

  const minY = paddingTop - 70;
  const safeHeight = height || 30;
  // Use a less restrictive maxX to allow dragging across the canvas
  const maxX = canvasWidth - paddingRight; // e.g., 300 - 10 = 290
  const maxY = canvasHeight - paddingBottom + 40;

  const constrainedX = Math.max(minX, Math.min(x, maxX));
  const constrainedY = Math.max(minY, Math.min(y, maxY));

  const isAtBoundary =
    (x < minX && constrainedX === minX) ||
    (x > maxX && constrainedX === maxX) ||
    (y < minY && constrainedY === minY) ||
    (y > maxY && constrainedY === maxY);

  console.log({
    x,
    y,
    width,
    height: safeHeight,
    canvasWidth,
    canvasHeight,
    minX,
    maxX,
    minY,
    maxY,
    constrainedX,
    constrainedY,
    isAtBoundary,
  });

  return { x: constrainedX, y: constrainedY, isAtBoundary };
};
export const constrainImageToCanvas = (
  x: number,
  y: number,
  width: number,
  height: number,
  canvasWidth: number = getSlideDimensions().SLIDE_WIDTH,
  canvasHeight: number = getSlideDimensions().SLIDE_HEIGHT
) => {
  const { LEFT_PADDING, IMAGE_WIDTH, IMAGE_HEIGHT } = getSlideDimensions();
  const paddingLeft = LEFT_PADDING - 200; // Adjusted for web context
  const paddingRight = 10; // Minimum 10px
  const paddingTop = -100; // Minimum 60px
  const paddingBottom = window.innerHeight <= 830 ? 50 : 10; // Responsive padding

  const minWidth = 50; // Minimum image width
  const minHeight = 50; // Minimum image height

  // Check if image is at minimum size
  const isAtMinSize = width <= minWidth || height <= minHeight;

  // Expand boundaries when at minimum size
  const minX = isAtMinSize ? LEFT_PADDING - 45 : paddingLeft;
  const minY = isAtMinSize ? -10 : paddingTop;
  const maxX = isAtMinSize
    ? canvasWidth - paddingRight
    : canvasWidth - minWidth - paddingRight;
  const maxY = isAtMinSize
    ? canvasHeight - paddingBottom + (minWidth - 10)
    : canvasHeight - paddingBottom + 40;

  const constrainedX = Math.max(minX, Math.min(x, maxX));
  const constrainedY = Math.max(minY, Math.min(y, maxY));
  const constrainedWidth = Math.max(
    minWidth,
    Math.min(width, canvasWidth - constrainedX - paddingRight)
  );
  const constrainedHeight = Math.max(
    minHeight,
    Math.min(height, canvasHeight - constrainedY - paddingBottom)
  );

  const isAtBoundary =
    x !== constrainedX ||
    y !== constrainedY ||
    width !== constrainedWidth ||
    height !== constrainedHeight;

  console.log("[constrainImageToCanvas]", {
    x,
    y,
    width,
    height,
    canvasWidth,
    canvasHeight,
    minX,
    maxX,
    minY,
    maxY,
    minWidth,
    minHeight,
    constrainedX,
    constrainedY,
    constrainedWidth,
    constrainedHeight,
    isAtMinSize,
    isAtBoundary,
  });

  return {
    x: constrainedX,
    y: constrainedY,
    width: constrainedWidth,
    height: constrainedHeight,
    isAtBoundary,
  };
};
export const getRandomSlide = () => {
  const { SLIDE_WIDTH, SLIDE_HEIGHT, LEFT_PADDING } = getSlideDimensions();
  const titles: any = [
    "5 Ways to Boost Productivity",
    "Understanding AI in 2025",
    "Why Design Thinking Works",
    "Top Marketing Trends This Year",
    "The Future of Remote Work",
  ];

  const bullets: any = [
    "Keep tasks short and focused",
    "Automate where possible",
    "Use data to drive decisions",
    "Stay aligned with team goals",
    "Prioritize clarity over complexity",
    "Break problems into smaller chunks",
    "Embrace flexible tooling",
    "Focus on outcomes, not outputs",
    "Be user-first in every decision",
  ];

  const getRandomBullets = (count: number) =>
    Array.from({ length: count }, () => {
      const text = bullets[Math.floor(Math.random() * bullets.length)];
      return {
        element_type: "bullet_point",
        text,
        konva_component: "Konva.Text",
        properties: {
          fontSize: 18,
          fontWeight: "",
          fontFamily: "Roboto",
          fill: "#444",
          fontStyle: "",
        },
      };
    });

  return {
    slide_id: `slide-${Date.now()}`,
    slide_title: {
      text: titles[Math.floor(Math.random() * titles.length)],
      properties: {
        fontSize: 24,
        fontFamily: "",
        fill: "#000",
        fontWeight: "bold",
      },
    },
    elements: [
      ...getRandomBullets(3),
      {
        element_type: "image",
        konva_component: "Konva.Image",
        properties: {
          imageSrc: "/images/create-presentation/new-slide-img.png",
          // x: SLIDE_WIDTH - 500,
          // y: (SLIDE_HEIGHT - 400) / 2,
          // width: 480,
          // height: 400,
          x: SLIDE_WIDTH - 400,
          y: (SLIDE_HEIGHT - 320) / 2,
          width: getSlideDimensions().IMAGE_WIDTH,
          height: getSlideDimensions().IMAGE_HEIGHT,
        },
      },
    ],
    image_url: "/images/create-presentation/new-slide-img.png",
  };

  // return {
  //   slide_id: `slide-${Date.now()}`,
  //   slide_title: {
  //     text: "",
  //     properties: {
  //       fontSize: 24,
  //       fontFamily: "Arial",
  //       fill: "#000",
  //       fontStyle: "normal",
  //     },
  //   },
  //   elements: [],
  //   image_url: null,
  // };
};

export const getLayoutProps = (layout: number) => {
  switch (layout) {
    case 0:
      return {
        image: { x: 100, y: 500, width: 700, height: 220 },
        title: { x: getSlideDimensions().LEFT_PADDING, y: 60 },
        bullets: { x: getSlideDimensions().LEFT_PADDING, y: 180 },
      };
    case 1:
      return {
        image: { x: 100, y: 60, width: 700, height: 220 },
        title: { x: getSlideDimensions().LEFT_PADDING, y: 350 },
        bullets: { x: getSlideDimensions().LEFT_PADDING, y: 420 },
      };
    case 2:
      return {
        image: { x: 900, y: 100, width: 320, height: 520 },
        title: { x: getSlideDimensions().LEFT_PADDING, y: 100 },
        bullets: { x: getSlideDimensions().LEFT_PADDING, y: 200 },
      };
    case 3:
      return {
        image: { x: 60, y: 100, width: 320, height: 520 },
        title: { x: 500, y: 100 },
        bullets: { x: 500, y: 200 },
      };
    case 4:
      return {
        image: {
          x: (getSlideDimensions().SLIDE_WIDTH - 500) / 2,
          y: 300,
          width: 500,
          height: 200,
        },
        title: { x: (getSlideDimensions().SLIDE_WIDTH - 900) / 2, y: 80 },
        bullets: { x: (getSlideDimensions().SLIDE_WIDTH - 900) / 2, y: 540 },
      };
    case 5:
      return {
        image: null,
        title: { x: getSlideDimensions().LEFT_PADDING, y: 100 },
        bullets: { x: getSlideDimensions().LEFT_PADDING, y: 200 },
      };
    default:
      return {
        image: {
          x: getSlideDimensions().SLIDE_WIDTH - 700,
          y: (getSlideDimensions().SLIDE_HEIGHT - 600) / 2,
          width: 700,
          height: 600,
        },
        title: { x: getSlideDimensions().LEFT_PADDING, y: 60 },
        bullets: { x: getSlideDimensions().LEFT_PADDING, y: 180 },
      };
  }
};
