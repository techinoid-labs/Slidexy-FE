import type React from "react"
import { Image } from "react-konva"
import useImage from "use-image"

interface KonvaImageProps {
  draggable?: boolean
  imageSrc: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number | string
  rounded?: number
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
  const [image, status] = useImage(imageSrc, "anonymous")

  console.log("Image loading status:", status, "for URL:", imageSrc)

  if (status === "loading") {
    console.log("Image still loading:", imageSrc)
    return null
  }

  if (status === "failed" || !image) {
    console.log("Image failed to load, using fallback:", imageSrc)
    return (
      <Image
        image={undefined}
        x={x}
        y={y}
        width={width}
        height={height}
        draggable={draggable}
        fill="#f0f0f0"
        stroke="#ccc"
        strokeWidth={2}
      />
    )
  }

  const notBackground = width < 960 && height < 540
  console.log("Successfully rendering image:", imageSrc)

  return (
    <Image
      image={image}
      x={x}
      y={y}
      width={width}
      height={height}
      draggable={draggable}
      cornerRadius={notBackground ? 20 : rounded}
    />
  )
}

export default KonvaImageComponent
