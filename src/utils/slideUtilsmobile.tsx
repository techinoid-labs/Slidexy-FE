export const getSlideDimensions = () => {
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 500;
  const windowHeight = typeof window !== "undefined" ? window.innerHeight : 400;
  const SLIDE_WIDTH = Math.min(windowWidth * 0.8, 500);
  const SLIDE_HEIGHT = Math.min(windowHeight * 0.6, 400);
  const LEFT_PADDING = 17;

  return { SLIDE_WIDTH, SLIDE_HEIGHT, LEFT_PADDING };
};

export const restrictShapeBounds = (
  x: number,
  y: number,
  shapeType: string,
  properties: any,
  canvasWidth: number = getSlideDimensions().SLIDE_WIDTH,
  canvasHeight: number = getSlideDimensions().SLIDE_HEIGHT
) => {
  const { LEFT_PADDING } = getSlideDimensions();
  const paddingLeft = LEFT_PADDING-20;
  const paddingRight = -40;
  const paddingTop = 10;
  const paddingBottom = Math.max(window.innerHeight * 0.01, 10);

  const minWidth = 30;
  const minHeight = 30;

  let width = properties.width || 50;
  let height = properties.height || 50;

  switch (shapeType) {
    case "Konva.Circle":
      width = (properties.radius || 25) * 2;
      height = width;
      break;
    case "Konva.Star":
      width = (properties.outerRadius || 25) * 2;
      height = width;
      break;
    case "Konva.Line":
    case "Konva.Arrow":
      const points = properties.points || [0, 0, 100, 100];
      width = Math.max(...points.filter((_: number, idx: number) => idx % 2 === 0)) -
              Math.min(...points.filter((_: number, idx: number) => idx % 2 === 0));
      height = Math.max(...points.filter((_: number, idx: number) => idx % 2 !== 0)) -
               Math.min(...points.filter((_: number, idx: number) => idx % 2 !== 0));
      break;
  }

  const isAtMinSize = width <= minWidth || height <= minHeight;

  const minX = isAtMinSize ? paddingLeft - 45 : paddingLeft;
  const minY = isAtMinSize ? -10 : paddingTop;
  const maxX = canvasWidth - (isAtMinSize ? paddingRight : Math.max(width, minWidth) + paddingRight);
  const maxY = canvasHeight - (isAtMinSize ? paddingBottom : Math.max(height, minHeight) + paddingBottom);

  const constrainedX = Math.max(minX, Math.min(x, maxX));
  const constrainedY = Math.max(minY, Math.min(y, maxY));
  const constrainedWidth = Math.max(minWidth, Math.min(width, canvasWidth - constrainedX - paddingRight));
  const constrainedHeight = Math.max(minHeight, Math.min(height, canvasHeight - constrainedY - paddingBottom));

  const isAtBoundary =
    x !== constrainedX ||
    y !== constrainedY ||
    width !== constrainedWidth ||
    height !== constrainedHeight;

  return { x: constrainedX, y: constrainedY, width: constrainedWidth, height: constrainedHeight, isAtBoundary };
};

// ... (other existing functions: constrainToCanvas, constrainImageToCanvas, getRandomSlide, getLayoutProps remain unchanged)
export const constrainToCanvas = (
  x: number,
  y: number,
  width: number,
  height: number,
  canvasWidth: number = getSlideDimensions().SLIDE_WIDTH,
  canvasHeight: number = getSlideDimensions().SLIDE_HEIGHT
) => {
  const { LEFT_PADDING } = getSlideDimensions();
  const paddingLeft = LEFT_PADDING;
  const paddingRight = Math.max(window.innerWidth * 0.02, 8);
  const paddingTop = 60;
  const paddingBottom = Math.max(window.innerHeight * 0.02, 30);

  const minX = -80;
  const minY = paddingTop - 60;
  const safeHeight = height || 30;
  const maxX = window.innerWidth - 80;
  const maxY = window.innerHeight - 330;

  const constrainedX = Math.max(minX, Math.min(x, maxX));
  const constrainedY = Math.max(minY, Math.min(y, maxY));

  const isAtBoundary =
    (x < minX && constrainedX === minX) ||
    (x > maxX && constrainedX === maxX) ||
    (y < minY && constrainedY === minY) ||
    (y > maxY && constrainedY === maxY);

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
  const { LEFT_PADDING } = getSlideDimensions();
  const paddingLeft = LEFT_PADDING - 50;
  const paddingRight = Math.max(window.innerWidth * 0.01, 10);
  const paddingTop = -10;
  const paddingBottom = Math.max(window.innerHeight * 0.07, 30);

  const minWidth = 50;
  const minHeight = 50;

  const isAtMinSize = width <= minWidth || height <= minHeight;

  const minX = isAtMinSize ? LEFT_PADDING - 45 : paddingLeft;
  const minY = isAtMinSize ? -20 : paddingTop;
  const maxX = isAtMinSize
    ? canvasWidth - paddingRight
    : canvasWidth - minWidth - paddingRight;
  const maxY = isAtMinSize
    ? window.innerHeight - 350
    : window.innerHeight - 330;

  const constrainedX = Math.max(minX, Math.min(x, maxX));
  const constrainedY = Math.max(minY, Math.min(y, maxY));
  const constrainedWidth = Math.max(minWidth, Math.min(width, canvasWidth - constrainedX - paddingRight));
  const constrainedHeight = Math.max(minHeight, Math.min(height, canvasHeight - constrainedY - paddingBottom));

  const isAtBoundary =
    x !== constrainedX ||
    y !== constrainedY ||
    width !== constrainedWidth ||
    height !== constrainedHeight;

  return { x: constrainedX, y: constrainedY, width: constrainedWidth, height: constrainedHeight, isAtBoundary };
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
          fontSize: 12,
          fontWeight: "10px",
          fontFamily: "",
          fill: "#444",
          color: "1a1a1a",
          fontStyle: "",
          x: LEFT_PADDING + 10,
          y: 52,
          width: 20,
        },
      };
    });

  return {
    slide_id: `slide-${Date.now()}`,
    slide_title: {
      text: titles[Math.floor(Math.random() * titles.length)],
      properties: {
        fontSize: 14,
        fontWeight: "normal",
        fontFamily: "Roboto",
        fill: "#000",
        fontStyle: "normal",
        align: "left",
        x: LEFT_PADDING,
        y: 25,
        width: 220,
      },
    },
    elements: getRandomBullets(3),
    image_url: "/images/create-presentation/new-slide-img.png",
  };
};

export const getLayoutProps = (layout: number) => {
  const { SLIDE_WIDTH, SLIDE_HEIGHT, LEFT_PADDING } = getSlideDimensions();
  switch (layout) {
    case 0:
      return {
        image: { x: 100, y: SLIDE_HEIGHT - 220 - 10, width: 700, height: 220 },
        title: { x: LEFT_PADDING, y: 60 },
        bullets: { x: LEFT_PADDING, y: 62 },
      };
    case 1:
      return {
        image: { x: 100, y: 60, width: 700, height: 220 },
        title: { x: LEFT_PADDING, y: 350 },
        bullets: { x: LEFT_PADDING, y: 64 },
      };
    case 2:
      return {
        image: { x: SLIDE_WIDTH - 320 - 10, y: 100, width: 320, height: 520 },
        title: { x: LEFT_PADDING, y: 100 },
        bullets: { x: LEFT_PADDING, y: 66 },
      };
    case 3:
      return {
        image: { x: 60, y: 100, width: 320, height: 520 },
        title: { x: SLIDE_WIDTH / 2, y: 100 },
        bullets: { x: SLIDE_WIDTH / 2, y: 68 },
      };
    case 4:
      return {
        image: {
          x: (SLIDE_WIDTH - 500) / 2,
          y: 300,
          width: 500,
          height: 200,
        },
        title: { x: (SLIDE_WIDTH - 900) / 2, y: 80 },
        bullets: { x: (SLIDE_WIDTH - 900) / 2, y: 70 },
      };
    case 5:
      return {
        image: null,
        title: { x: LEFT_PADDING, y: 100 },
        bullets: { x: LEFT_PADDING, y: 71 },
      };
    default:
      return {
        image: {
          x: SLIDE_WIDTH - 700,
          y: (SLIDE_HEIGHT - 600) / 2,
          width: 700,
          height: 600,
        },
        title: { x: LEFT_PADDING, y: 60 },
        bullets: { x: LEFT_PADDING, y: 72 },
      };
  }
};