// export const SLIDE_WIDTH = 500;
// export const SLIDE_HEIGHT = 400;
// export const LEFT_PADDING = 17;
export const getSlideDimensions = () => {
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 500;
  const windowHeight = typeof window !== "undefined" ? window.innerHeight : 400;
  const SLIDE_WIDTH = Math.min(windowWidth * 0.8, 500); // 90% of window width, capped at 500
  const SLIDE_HEIGHT = Math.min(windowHeight * 0.6, 400); // 60% of window height, capped at 400
  const LEFT_PADDING = 17;

  return { SLIDE_WIDTH, SLIDE_HEIGHT, LEFT_PADDING };
};

export const constrainToCanvas = (
  x: number,
  y: number,
  width: number,
  height: number,
  canvasWidth: number = getSlideDimensions().SLIDE_WIDTH,
  canvasHeight: number = getSlideDimensions().SLIDE_HEIGHT
) => {
  const { LEFT_PADDING } = getSlideDimensions();
  const paddingLeft = LEFT_PADDING; // 17
  const paddingRight = 10;
  const paddingTop = 60;
  const paddingBottom = window.innerHeight <= 830 ? 50 : 10;

  const minX = paddingLeft;
  const minY = paddingTop;
  const safeHeight = height || 30;
  // Use a less restrictive maxX to allow dragging across the canvas
  const maxX = canvasWidth - paddingRight; // e.g., 300 - 10 = 290
  const maxY = canvasHeight - paddingBottom;

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
          fontSize: 15,
          fontWeight: "10px",
          fontFamily: "",
          fill: "#444",
          color: "1a1a1a",
          fontStyle: "",
          x: LEFT_PADDING+10,
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
        fontSize: 15,
        fontWeight: "30px", 
        fontFamily: "",
        fill: "#000",
        fontStyle: "",
         x: LEFT_PADDING,
        // y: 50,
        // width: SLIDE_WIDTH - LEFT_PADDING,
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
