import type React from "react"
import { Text, Rect, Circle, RegularPolygon, Line } from "react-konva"
import KonvaImageComponent from "./KonvaImageComponent"
import type { Presentation, ShapeElement, TextElement, ImageElement } from "../types/presentation"

const SlideRenderer: React.FC<{ slide: Presentation["slides"][number] }> = ({ slide }) => {
  const stageWidth = 960
  const stageHeight = 540

  console.log("Rendering slide:", slide.slide_id || slide.title)
  console.log("Slide elements count:", slide.elements?.length || 0)

  const sortedElements = [...(slide.elements || [])].sort(
    (a, b) => (a.properties?.zIndex ?? 0) - (b.properties?.zIndex ?? 0),
  )

  return (
    <>
      {slide.image_url && (
        <KonvaImageComponent
          imageSrc={slide.image_url}
          x={0}
          y={0}
          width={stageWidth}
          height={stageHeight}
          zIndex={-1}
        />
      )}

      {sortedElements.map((el) => {
        const elementKey = `${el.element_type}-${Math.random()}`
        console.log(`Rendering element:`, el.element_type, "with key:", elementKey)

        switch (el.element_type) {
          case "text":
          case "title":
          case "bullet_point": {
            const p = (el as TextElement).properties
            console.log(` Text element properties:`, p)
            console.log(` Text content:`, (el as TextElement).text)

            return (
              <Text
                key={elementKey}
                text={(el as TextElement).text}
                x={p.x || 0}
                y={p.y || 0}
                fontSize={p.fontSize || 16}
                fontFamily={p.fontFamily || "Arial"}
                fill={p.fill || "#000000"}
                fontStyle={p.fontStyle}
                fontWeight={p.fontWeight}
                width={p.width || 400}
                height={p.height || 30}
                align={(p.align as any) || "left"}
              />
            )
          }
          case "shape": {
            const p = (el as ShapeElement).properties
            const fill = p.fill || "transparent"
            const stroke = p.stroke || "#000"
            const strokeWidth = p.strokeWidth ?? 1

            switch (el.konva_component) {
              case "Konva.Rect":
                return (
                  <Rect
                    key={elementKey}
                    x={p.x || 0}
                    y={p.y || 0}
                    width={p.width || 50}
                    height={p.height || 50}
                    fill={fill}
                    stroke={stroke}
                    opacity={p.opacity || 1}
                    cornerRadius={p.cornerRadius || 0}
                    strokeWidth={strokeWidth}
                  />
                )
              case "Konva.Circle":
                return (
                  <Circle
                    key={elementKey}
                    x={p.x || 0}
                    y={p.y || 0}
                    radius={p.radius || 50}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                  />
                )
              case "Konva.RegularPolygon":
                return (
                  <RegularPolygon
                    key={elementKey}
                    x={p.x || 0}
                    y={p.y || 0}
                    sides={p.sides || 3}
                    radius={p.radius || 50}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                  />
                )
              case "Konva.Line":
                return (
                  <Line
                    key={elementKey}
                    points={p.points || []}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    tension={0}
                  />
                )
              default:
                return null
            }
          }
          case "image": {
            const p = (el as ImageElement).properties
            console.log(`Image element properties:`, p)

            return (
              <KonvaImageComponent
                key={elementKey}
                imageSrc={p.imageSrc}
                x={p.x || 0}
                y={p.y || 0}
                width={p.width || 300}
                height={p.height || 200}
                zIndex={p.zIndex || 1}
                rounded={p.rounded}
              />
            )
          }
          default:
            console.log(`Unknown element type`)
            return null
        }
      })}
    </>
  )
}

export default SlideRenderer
