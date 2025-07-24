// export const SLIDE_WIDTH = 500;
// export const SLIDE_HEIGHT = 400;
// export const LEFT_PADDING = 17;
export const getSlideDimensions = () => {
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 500;
  const windowHeight = typeof window !== "undefined" ? window.innerHeight : 400;
  const SLIDE_WIDTH = Math.min(windowWidth * 0.8, 500); // 90% of window width, capped at 500
  const SLIDE_HEIGHT = Math.min(windowHeight * 1.8, 600); // 60% of window height, capped at 400
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
  const minX = LEFT_PADDING; // Left padding
  const minY = 60; // Top margin for title
  const maxX = canvasWidth - width - 10; // Right edge with buffer
  const maxY = canvasHeight - height - 10; // Bottom edge with buffer

  const constrainedX = Math.max(minX, Math.min(x, maxX));
  const constrainedY = Math.max(minY, Math.min(y, maxY));

  // Check if the element is at the canvas boundary
  const isAtBoundary =
    constrainedX === minX ||
    constrainedX === maxX ||
    constrainedY === minY ||
    constrainedY === maxY;

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
          fontSize: 12,
          fontWeight: "",
          fontFamily: "",
          fill: "#444",
          fontStyle: "",
          x: LEFT_PADDING,
          y: 180,
          width: SLIDE_WIDTH - LEFT_PADDING + 10,
        },
      };
    });

  return {
    slide_id: `slide-${Date.now()}`,
    slide_title: {
      text: titles[Math.floor(Math.random() * titles.length)],
      properties: {
        fontSize: 12,
        fontFamily: "",
        fill: "#000",
        fontStyle: "",
        x: LEFT_PADDING,
        y: 50,
        width: SLIDE_WIDTH - LEFT_PADDING,
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
        bullets: { x: LEFT_PADDING, y: 180 },
      };
    case 1:
      return {
        image: { x: 100, y: 60, width: 700, height: 220 },
        title: { x: LEFT_PADDING, y: 350 },
        bullets: { x: LEFT_PADDING, y: 420 },
      };
    case 2:
      return {
        image: { x: SLIDE_WIDTH - 320 - 10, y: 100, width: 320, height: 520 },
        title: { x: LEFT_PADDING, y: 100 },
        bullets: { x: LEFT_PADDING, y: 200 },
      };
    case 3:
      return {
        image: { x: 60, y: 100, width: 320, height: 520 },
        title: { x: SLIDE_WIDTH / 2, y: 100 },
        bullets: { x: SLIDE_WIDTH / 2, y: 200 },
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
        bullets: { x: (SLIDE_WIDTH - 900) / 2, y: 540 },
      };
    case 5:
      return {
        image: null,
        title: { x: LEFT_PADDING, y: 100 },
        bullets: { x: LEFT_PADDING, y: 200 },
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
        bullets: { x: LEFT_PADDING, y: 180 },
      };
  }
};
