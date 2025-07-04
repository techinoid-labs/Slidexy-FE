// KonvaComponents/SlideImage.tsx
"use client";

import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";

interface SlideImageProps {
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const SlideImage = ({ url, x, y, width, height }: SlideImageProps) => {
  const [image] = useImage(url);
  return (
    <KonvaImage
      draggable
      image={image}
      x={x}
      y={y}
      width={width}
      height={height}
    />
  );
};

export default SlideImage;
