// 1. Fix the findElementById function in SlidesContext.tsx
const findElementById = (
  elements: KonvaComponent[],
  id: string,
  slideIndex?: number
): { element: KonvaComponent | null; index: number } => {
  // Handle title elements
  if (id.startsWith("title-")) {
    const titleSlideIndex = parseInt(id.split("-")[1], 10);
    if (slideIndex !== undefined && titleSlideIndex === slideIndex) {
      // Return a special marker for title elements
      return { element: { isTitle: true } as any, index: -1 };
    }
  }

  // Handle regular text elements with el- prefix
  if (id.startsWith("el-")) {
    const parts = id.split("-");
    const elSlideIndex = parseInt(parts[1], 10);
    const elIndex = parseInt(parts[2], 10);
    
    if (slideIndex !== undefined && elSlideIndex === slideIndex && elements[elIndex]) {
      return { element: elements[elIndex], index: elIndex };
    }
  }

  // Handle shape and image elements by their actual IDs
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (
      (el.shape_id && el.shape_id === id) ||
      (el.properties?.image_id && el.properties.image_id === id) ||
      (el.id && el.id === id) ||
      (el.text_id && el.text_id === id)
    ) {
      return { element: el, index: i };
    }
  }
  return { element: null, index: -1 };
};

// 2. Update the bringElementForward function
const bringElementForward = (el: number | string | KonvaComponent) => {
  console.log("bringElementForward clicked", el);

  let selectedElement: KonvaComponent | null = null;
  let isTitle = false;

  const currentSlide = slides[selectedSlideIndex];
  if (!currentSlide) return;

  // Handle title elements specially
  if (typeof el === "string" && el.startsWith("title-")) {
    // For title elements, we need to work with slide_title
    const updatedSlides = structuredClone(slides);
    const titleElement = updatedSlides[selectedSlideIndex].slide_title;
    
    if (!titleElement.properties) {
      titleElement.properties = {} as any;
    }
    
    // Give title element the highest z-index in text range
    titleElement.properties.zIndex = Z_INDEX_RANGES.TEXT.END;
    
    handleSetSlides(updatedSlides);
    return;
  }

  const elements = currentSlide.elements.map((el: KonvaComponent) => ({
    ...el,
    properties: { ...el.properties },
  }));

  if (typeof el === "number") {
    selectedElement = elements[el];
  } else if (typeof el === "string") {
    const found = findElementById(elements, el, selectedSlideIndex);
    selectedElement = found.element;
    if (found.element && (found.element as any).isTitle) {
      isTitle = true;
    }
  } else {
    // Use current selections
    if (selectedImageId) {
      const found = findElementById(elements, selectedImageId, selectedSlideIndex);
      selectedElement = found.element;
    } else if (selectedShapeId) {
      const found = findElementById(elements, selectedShapeId, selectedSlideIndex);
      selectedElement = found.element;
    } else if (selectedTextId) {
      if (selectedTextId.startsWith("title-")) {
        isTitle = true;
        const updatedSlides = structuredClone(slides);
        const titleElement = updatedSlides[selectedSlideIndex].slide_title;
        
        if (!titleElement.properties) {
          titleElement.properties = {} as any;
        }
        
        titleElement.properties.zIndex = Z_INDEX_RANGES.TEXT.END;
        handleSetSlides(updatedSlides);
        return;
      } else {
        const found = findElementById(elements, selectedTextId, selectedSlideIndex);
        selectedElement = found.element;
      }
    } else {
      console.warn("No element selected for forward operation");
      return;
    }
  }

  if (!selectedElement || isTitle) {
    if (isTitle) return; // Already handled above
    console.warn("Selected element not found");
    return;
  }

  const imageElements = elements.filter((el: KonvaComponent) =>
    isImageElement(el)
  );
  const textElements = elements.filter((el: KonvaComponent) =>
    isTextElement(el)
  );
  const shapeElements = elements.filter((el: KonvaComponent) =>
    isShapeElement(el)
  );
  const otherElements = elements.filter(
    (el: KonvaComponent) =>
      !isImageElement(el) && !isTextElement(el) && !isShapeElement(el)
  );

  // Proper layering logic for bringing forward
  if (isImageElement(selectedElement)) {
    assignZIndexToElements(shapeElements, Z_INDEX_RANGES.IMAGES.START);
    assignZIndexToElements(imageElements, Z_INDEX_RANGES.SHAPES.START);
    assignZIndexToElements(textElements, Z_INDEX_RANGES.TEXT.START);
  } else if (isShapeElement(selectedElement)) {
    assignZIndexToElements(imageElements, Z_INDEX_RANGES.IMAGES.START);
    assignZIndexToElements(shapeElements, Z_INDEX_RANGES.SHAPES.START);
    assignZIndexToElements(textElements, Z_INDEX_RANGES.TEXT.START);
  } else if (isTextElement(selectedElement)) {
    assignZIndexToElements(imageElements, Z_INDEX_RANGES.IMAGES.START);
    assignZIndexToElements(shapeElements, Z_INDEX_RANGES.SHAPES.START);
    assignZIndexToElements(textElements, Z_INDEX_RANGES.TEXT.START);
    
    // Move the selected text element to highest z-index within text range
    const maxTextZIndex = Math.max(
      ...textElements.map(el => el.properties?.zIndex || Z_INDEX_RANGES.TEXT.START),
      Z_INDEX_RANGES.TEXT.START
    );
    selectedElement.properties.zIndex = Math.min(maxTextZIndex + 1, Z_INDEX_RANGES.TEXT.END);
  } else {
    const currentZIndex = selectedElement.properties?.zIndex || 1;
    const maxZIndex = Math.max(
      ...elements.map((el: KonvaComponent) => el.properties?.zIndex || 1)
    );

    if (currentZIndex < maxZIndex) {
      selectedElement.properties.zIndex = Math.min(maxZIndex + 1, Z_INDEX_RANGES.OTHERS.END);
    }
  }

  assignZIndexToElements(otherElements, Z_INDEX_RANGES.OTHERS.START);

  const updatedSlides = structuredClone(slides);
  updatedSlides[selectedSlideIndex] = {
    ...updatedSlides[selectedSlideIndex],
    elements,
  };

  handleSetSlides(updatedSlides);
};

// 3. Similar fix for sendElementBackward (apply the same logic)
const sendElementBackward = (el: number | string | KonvaComponent) => {
  console.log("sendElementBackward clicked", el);

  let selectedElement: KonvaComponent | null = null;
  let isTitle = false;

  const currentSlide = slides[selectedSlideIndex];
  if (!currentSlide) return;

  // Handle title elements specially
  if (typeof el === "string" && el.startsWith("title-")) {
    const updatedSlides = structuredClone(slides);
    const titleElement = updatedSlides[selectedSlideIndex].slide_title;
    
    if (!titleElement.properties) {
      titleElement.properties = {} as any;
    }
    
    // Give title element the lowest z-index in text range
    titleElement.properties.zIndex = Z_INDEX_RANGES.TEXT.START;
    
    handleSetSlides(updatedSlides);
    return;
  }

  const elements = currentSlide.elements.map((el: KonvaComponent) => ({
    ...el,
    properties: { ...el.properties },
  }));

  if (typeof el === "number") {
    selectedElement = elements[el];
  } else if (typeof el === "string") {
    const found = findElementById(elements, el, selectedSlideIndex);
    selectedElement = found.element;
    if (found.element && (found.element as any).isTitle) {
      isTitle = true;
    }
  } else {
    // Use current selections
    if (selectedImageId) {
      const found = findElementById(elements, selectedImageId, selectedSlideIndex);
      selectedElement = found.element;
    } else if (selectedShapeId) {
      const found = findElementById(elements, selectedShapeId, selectedSlideIndex);
      selectedElement = found.element;
    } else if (selectedTextId) {
      if (selectedTextId.startsWith("title-")) {
        isTitle = true;
        const updatedSlides = structuredClone(slides);
        const titleElement = updatedSlides[selectedSlideIndex].slide_title;
        
        if (!titleElement.properties) {
          titleElement.properties = {} as any;
        }
        
        titleElement.properties.zIndex = Z_INDEX_RANGES.TEXT.START;
        handleSetSlides(updatedSlides);
        return;
      } else {
        const found = findElementById(elements, selectedTextId, selectedSlideIndex);
        selectedElement = found.element;
      }
    } else {
      console.warn("No element selected for backward operation");
      return;
    }
  }

  if (!selectedElement || isTitle) {
    if (isTitle) return; // Already handled above
    console.warn("Selected element not found");
    return;
  }

  // Apply the backward logic similar to forward but in reverse
  // ... (rest of the backward logic similar to the fixed forward logic)
  
  const updatedSlides = structuredClone(slides);
  updatedSlides[selectedSlideIndex] = {
    ...updatedSlides[selectedSlideIndex],
    elements,
  };

  handleSetSlides(updatedSlides);
};