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
  const MIN_SIZE = 50; // Default minimum size for most shapes
  const LINE_ARROW_MIN_SIZE = 30; // Custom minimum size for lines and arrows
  let width = properties.width || MIN_SIZE;
  let height = properties.height || MIN_SIZE;

  // Handle size for specific shape types
  if (shapeType === "Konva.Circle") {
    const radius = Math.max(properties.radius || MIN_SIZE / 2, MIN_SIZE / 2);
    width = height = radius * 2;
  } else if (shapeType === "Konva.Star") {
    const outerRadius = Math.max(properties.outerRadius || MIN_SIZE / 2, MIN_SIZE / 2);
    width = height = outerRadius * 2;
  } else if (shapeType === "Konva.RegularPolygon") {
    const radius = Math.max(properties.radius || MIN_SIZE / 2, MIN_SIZE / 2);
    width = height = radius * 2;
  } else if (shapeType === "Konva.Ellipse") {
    const radiusX = Math.max(properties.radiusX || MIN_SIZE / 2, MIN_SIZE / 2);
    const radiusY = Math.max(properties.radiusY || MIN_SIZE / 2, MIN_SIZE / 2);
    width = radiusX * 2;
    height = radiusY * 2;
  } else if (shapeType === "Konva.Line" || shapeType === "Konva.Arrow") {
    const points = properties.points || [0, 0, 100, 100];
    const xs = points.filter((_: any, idx: number) => idx % 2 === 0);
    const ys = points.filter((_: any, idx: number) => idx % 2 !== 0);
    width = Math.max(LINE_ARROW_MIN_SIZE, Math.max(...xs) - Math.min(...xs));
    height = Math.max(LINE_ARROW_MIN_SIZE, Math.max(...ys) - Math.min(...ys));
  } else {
    width = Math.max(MIN_SIZE, properties.width || MIN_SIZE);
    height = Math.max(MIN_SIZE, properties.height || MIN_SIZE);
  }

  // Define canvas boundaries with padding
  const padding = 10;
  const maxX = canvasWidth - width - padding;
  const maxY =
    shapeType === "Konva.Line" || shapeType === "Konva.Arrow"
      ? canvasHeight - height - padding
      : canvasHeight - height - padding + 50;

  // Clamp position to stay within canvas
  const constrainedX = Math.max(padding, Math.min(x, maxX));
  const constrainedY = Math.max(padding, Math.min(y, maxY));

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
  const SLIDE_HEIGHT = 540; // 60% of window height, capped at 400
  const LEFT_PADDING = 20;
  const IMAGE_WIDTH = 380;
  const IMAGE_HEIGHT = 320;
  const SLIDE_WIDTH_MOBILE = Math.min(windowWidth * 0.8, 500);
  const SLIDE_HEIGHT_MOBILE = Math.min(windowHeight * 0.6, 400);
  return {
    SLIDE_WIDTH,
    SLIDE_HEIGHT,
    LEFT_PADDING,
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
    SLIDE_HEIGHT_MOBILE,
    SLIDE_WIDTH_MOBILE,
  };
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
  node: any,
  canvasWidth: number = getSlideDimensions().SLIDE_WIDTH,
  canvasHeight: number = getSlideDimensions().SLIDE_HEIGHT,
  padding: number = 20 // loosen boundary a bit
) => {
  const rect = node.getClientRect({ relativeTo: node.getStage() }); // accounts for rotation
  let newX = node.x();
  let newY = node.y();

  // Allow some tolerance (so it doesn’t feel too strict)
  const allowedLeft = padding - rect.width / 4;
  const allowedTop = padding - rect.height / 4;
  const allowedRight = canvasWidth - padding - rect.width * 0.75;
  const allowedBottom = canvasHeight - padding - rect.height * 0.75;

  if (rect.x < allowedLeft) {
    newX += allowedLeft - rect.x;
  }
  if (rect.y < allowedTop) {
    newY += allowedTop - rect.y;
  }
  if (rect.x + rect.width > allowedRight + rect.width) {
    newX -= rect.x + rect.width - (allowedRight + rect.width);
  }
  if (rect.y + rect.height > allowedBottom + rect.height) {
    newY -= rect.y + rect.height - (allowedBottom + rect.height);
  }

  const isAtBoundary =
    rect.x <= allowedLeft ||
    rect.y <= allowedTop ||
    rect.x + rect.width >= allowedRight + rect.width ||
    rect.y + rect.height >= allowedBottom + rect.height;

  return { x: newX, y: newY, isAtBoundary };
};



export const constrainImageToCanvas = (
  node: any,
  slideWidth: number,
  slideHeight: number,
  padding = { left: 10, right: 10, top: 10, bottom: 10 }
) => {
  const rect = node.getClientRect(); // includes rotation
  let newX = node.x();
  let newY = node.y();

  // Allow half of the shape to go outside
  const allowedLeft = padding.left - rect.width / 2;
  const allowedTop = padding.top - rect.height / 2;
  const allowedRight = slideWidth - padding.right - rect.width / 2;
  const allowedBottom = slideHeight - padding.bottom - rect.height / 2;

  // Clamp so at least half of shape stays inside
  if (rect.x < allowedLeft) {
    newX += allowedLeft - rect.x;
  }
  if (rect.y < allowedTop) {
    newY += allowedTop - rect.y;
  }
  if (rect.x + rect.width > allowedRight + rect.width) {
    newX -= rect.x + rect.width - (allowedRight + rect.width);
  }
  if (rect.y + rect.height > allowedBottom + rect.height) {
    newY -= rect.y + rect.height - (allowedBottom + rect.height);
  }

  const isAtBoundary =
    rect.x <= allowedLeft ||
    rect.y <= allowedTop ||
    rect.x + rect.width >= allowedRight + rect.width ||
    rect.y + rect.height >= allowedBottom + rect.height;

  return { x: newX, y: newY, isAtBoundary };
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
    Array.from({ length: count }, (_, index) => {
      const text = bullets[Math.floor(Math.random() * bullets.length)];
      const fontSize = 18;
      const lineSpacing = 8;
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
          zIndex: index + 1,
          x: LEFT_PADDING + 10,
          y: 80 + index * (fontSize + lineSpacing),

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
        fill: "#444",
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
          zIndex: 4,
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
