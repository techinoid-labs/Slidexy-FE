export const SLIDE_WIDTH = 920;
export const SLIDE_HEIGHT = 430;
export const LEFT_PADDING = 50;

export const getRandomSlide = () => {
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
          fontFamily: "",
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
        fontStyle: "",
      },
    },
    elements: getRandomBullets(3),
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
        image: { x: 900, y: 100, width: 320, height: 520 },
        title: { x: LEFT_PADDING, y: 100 },
        bullets: { x: LEFT_PADDING, y: 200 },
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
