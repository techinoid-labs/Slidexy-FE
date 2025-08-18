import React from "react";
import { Image } from "react-konva";
import useImage from "use-image";

interface KonvaImageProps {
  draggable?: boolean;
  imageSrc: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number | string;
  rounded?: number;
}

const KonvaImageComponent: React.FC<KonvaImageProps> = ({
  draggable = false,
  imageSrc,
  x,
  y,
  width,
  height,
  zIndex,
  rounded,
}) => {
  const [image] = useImage(imageSrc);

  return (
    <Image
      image={image}
      x={x}
      y={y}
      width={width}
      height={height}
      zIndex={zIndex}
      draggable={draggable}
      cornerRadius={rounded}
    />
  );
};

export default KonvaImageComponent;
