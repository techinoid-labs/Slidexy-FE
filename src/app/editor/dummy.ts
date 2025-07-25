// export const dummyData = [
//   {
//     slide_id: "slide-1",
//     slide_title: {
//       text: "World War 3: A Hypothetical Global Conflict",
//       konva_component: "Konva.Text",
//       properties: {
//         fontSize: 38,
//         fontFamily: "Inter",
//         fill: "#333",
//         fontStyle: "bold",
//       },
//     },
//     elements: [
//       {
//         element_type: "bullet_point",
//         text: "Examining the concept of World War 3.",
//         konva_component: "Konva.Text",
//         properties: {
//           fontSize: 18,
//           fontFamily: "Inter",
//           fill: "#444",
//           fontStyle: "normal",
//         },
//       },
//       {
//         element_type: "bullet_point",
//         text: "Understanding potential triggers and consequences.",
//         konva_component: "Konva.Text",
//         properties: {
//           fontSize: 18,
//           fontFamily: "Inter",
//           fill: "#444",
//           fontStyle: "normal",
//         },
//       },
//     ],
//     image_url:
//       "https://images.unsplash.com/photo-1749740429722-fed0e4e9cf15?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     image_caption: "img",
//   },
//   {
//     slide_id: "slide-2",
//     slide_title: {
//       text: "Potential Scenarios for Global Escalation",
//       konva_component: "Konva.Text",
//       properties: {
//         fontSize: 38,
//         fontFamily: "Inter",
//         fill: "#333",
//         fontStyle: "bold",
//       },
//     },
//     elements: [
//       {
//         element_type: "bullet_point",
//         text: "Geopolitical tensions as a contributing factor.",
//         konva_component: "Konva.Text",
//         properties: {
//           fontSize: 18,
//           fontFamily: "Inter",
//           fill: "#444",
//           fontStyle: "normal",
//         },
//       },
//       {
//         element_type: "bullet_point",
//         text: "Resource scarcity could be a trigger.",
//         konva_component: "Konva.Text",
//         properties: {
//           fontSize: 18,
//           fontFamily: "Inter",
//           fill: "#444",
//           fontStyle: "normal",
//         },
//       },
//     ],
//     image_url:
//       "https://images.unsplash.com/photo-1750797636255-8c939940bcad?q=80&w=1112&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     image_caption: "bird",
//   },
//   {
//     slide_id: "slide-3",
//     slide_title: {
//       text: "The Impact of a Global Conflict",
//       konva_component: "Konva.Text",
//       properties: {
//         fontSize: 38,
//         fontFamily: "Inter",
//         fill: "#333",
//         fontStyle: "bold",
//       },
//     },
//     elements: [
//       {
//         element_type: "bullet_point",
//         text: "Devastating human cost and economic disruption.",
//         konva_component: "Konva.Text",
//         properties: {
//           fontSize: 18,
//           fontFamily: "Inter",
//           fill: "#444",
//           fontStyle: "normal",
//         },
//       },
//       {
//         element_type: "bullet_point",
//         text: "Long-term global instability to follow.",
//         konva_component: "Konva.Text",
//         properties: {
//           fontSize: 18,
//           fontFamily: "Inter",
//           fill: "#444",
//           fontStyle: "normal",
//         },
//       },
//     ],
//     image_url:
//       "https://images.unsplash.com/photo-1751182475956-1ced7a5f474f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     image_caption: "mountain",
//   },
// ];

export const dummyData = [
  {
    slide_id: "slide-1",
    slide_title: {
      element_type: "title",
      text: "World War 3: A Hypothetical Global Conflict",
      konva_component: "Konva.Text",
      properties: {
        fontSize: {xs: 20, md: 21, sm: 22, lg: 23, xl: 24},
        fontFamily: "Inter",
        fill: "#333",
        fontStyle: "bold",
      },
    },
    elements: [
      {
        element_type: "bullet_point",
        text: "Examining the concept of World War 3.",
        konva_component: "Konva.Text",
        properties: {
          fontSize: {xs: 12, md: 12, sm: 12, lg: 12, xl: 12},
          fontFamily: "Inter",
          fill: "#444",
          fontStyle: "normal",
        },
      },
      {
        element_type: "bullet_point",
        text: "Understanding potential triggers and consequences.",
        konva_component: "Konva.Text",
        properties: {
          fontSize: {xs: 12, md: 12, sm: 12, lg: 12, xl: 12},
          fontFamily: "Inter",
          fill: "#444",
          fontStyle: "normal",
        },
      },
      {
        element_type: "shape",
        konva_component: "Konva.Circle",
        properties: {
          x: 100,
          y: 300,
          radius: 40,
          fill: "#FF5733",
        },
      },
      {
        element_type: "shape",
        konva_component: "Konva.Rect",
        properties: {
          x: 200,
          y: 300,
          width: 80,
          height: 60,
          fill: "#3498db",
        },
      },
    ],
    image_url:
      "https://images.unsplash.com/photo-1749740429722-fed0e4e9cf15?q=80&w=1171&auto=format&fit=crop",
    image_caption: "img",
  },
  {
    slide_id: "slide-2",
    slide_title: {
      text: "Potential Scenarios for Global Escalation",
      element_type: "title",
      konva_component: "Konva.Text",
      properties: {
        fontSize: {xs: 20, md: 21, sm: 22, lg: 23, xl: 24},
        fontFamily: "Inter",
        fill: "#333",
        fontStyle: "bold",
      },
    },
    elements: [
      {
        element_type: "bullet_point",
        text: "Geopolitical tensions as a contributing factor.",
        konva_component: "Konva.Text",
        properties: {
          fontSize: {xs: 12, md: 12, sm: 12, lg: 12, xl: 12},
          fontFamily: "Inter",
          fill: "#444",
          fontStyle: "normal",
        },
      },
      {
        element_type: "bullet_point",
        text: "Resource scarcity could be a trigger.",
        konva_component: "Konva.Text",
        properties: {
          fontSize:{xs: 12, md: 12, sm: 12, lg: 12, xl: 12} ,
          fontFamily: "Inter",
          fill: "#444",
          fontStyle: "normal",
        },
      },
      {
        element_type: "shape",
        konva_component: "Konva.RegularPolygon",
        properties: {
          x: 150,
          y: 320,
          sides: 5,
          radius: 40,
          fill: "#8e44ad",
        },
      },
    ],
    image_url:
      "https://images.unsplash.com/photo-1750797636255-8c939940bcad?q=80&w=1112&auto=format&fit=crop",
    image_caption: "bird",
  },
  {
    slide_id: "slide-3",
    slide_title: {
      text: "The Impact of a Global Conflict",
      element_type: "title",
      konva_component: "Konva.Text",
      properties: {
        fontSize: {xs: 20, md: 21, sm: 22, lg: 23, xl: 24},
        fontFamily: "Inter",
        fill: "#333",
        fontStyle: "bold",
      },
    },
    elements: [
      {
        element_type: "bullet_point",
        text: "Devastating human cost and economic disruption.",
        konva_component: "Konva.Text",
        properties: {
          fontSize: {xs: 12, md: 12, sm: 12, lg: 12, xl: 12},
          fontFamily: "Inter",
          fill: "#444",
          fontStyle: "normal",
        },
      },
      {
        element_type: "bullet_point",
        text: "Long-term global instability to follow.",
        konva_component: "Konva.Text",
        properties: {
          fontSize: {xs: 12, md: 12, sm: 12, lg: 12, xl: 12},
          fontFamily: "Inter",
          fill: "#444",
          fontStyle: "normal",
        },
      },
      {
        element_type: "shape",
        konva_component: "Konva.Star",
        properties: {
          x: 300,
          y: 320,
          numPoints: 5,
          innerRadius: 20,
          outerRadius: 40,
          fill: "#f1c40f",
        },
      },
    ],
    image_url:
      "https://images.unsplash.com/photo-1751182475956-1ced7a5f474f?q=80&w=1170&auto=format&fit=crop",
    image_caption: "mountain",
  },
];

// Utility to stack y positions for text/bullet elements
function stackElementY(slide: any, startY = 120, gap = 32) {
  let currentY = startY;
  (slide.elements as any[]).forEach((el: any) => {
    if (el.element_type === "text" || el.element_type === "bullet_point") {
      el.properties.y = currentY;
      const fontSize = el.properties.fontSize || 18;
      currentY += fontSize * 1.2 + gap;
    }
  });
}

// dummyData.forEach(slide => {
//   if (slide.slide_title && slide.slide_title.properties) {
//     //slide.slide_title.properties.fontSize = 48;
//   }
// });

dummyData.forEach(slide => stackElementY(slide));
