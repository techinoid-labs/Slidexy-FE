import React from "react";
import { Stage, Layer, Rect, Text, Circle, Line, Ellipse } from "react-konva";
import useImage from "use-image";
import { Box, Typography, Chip } from "@mui/material";

interface VariantPreviewProps {
  variant: any;
  isSelected?: boolean;
  onClick?: () => void;
  size?: { width: number; height: number };
  index?: number;
}

const LayoutVariantPreview: React.FC<VariantPreviewProps> = ({
  variant,
  isSelected = false,
  onClick,
  size = { width: 200, height: 112.5 },
  index = 0,
}) => {
  const { width, height } = size;
  const scaleFactor = width / 960; // Backend uses 960x540
  const [bgImage] = useImage(variant.image_url || "");

  // Render background with proper fallback
  const renderBackground = () => {
    const bg = variant.background || { type: "solid", color: "#ffffff" };
    
    if (bg.type === "solid") {
      return (
        <Rect
          width={width}
          height={height}
          fill={bg.color || "#ffffff"}
          cornerRadius={4}
          shadowColor="rgba(0,0,0,0.08)"
          shadowBlur={2}
          shadowOpacity={0.3}
        />
      );
    } else if (bg.type === "linear" && bg.gradient) {
      const stops = bg.gradient.stops || [0, bg.gradient.start || "#ffffff", 1, bg.gradient.end || "#f0f0f0"];
      return (
        <Rect
          width={width}
          height={height}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: width, y: height }}
          fillLinearGradientColorStops={stops}
          cornerRadius={4}
          shadowColor="rgba(0,0,0,0.08)"
          shadowBlur={2}
          shadowOpacity={0.3}
        />
      );
    } else if (bg.type === "image" && bgImage) {
      return (
        <Rect
          width={width}
          height={height}
          fillPatternImage={bgImage}
          fillPatternScaleX={scaleFactor}
          fillPatternScaleY={scaleFactor}
          cornerRadius={4}
          shadowColor="rgba(0,0,0,0.08)"
          shadowBlur={2}
          shadowOpacity={0.3}
        />
      );
    }
    
    return <Rect width={width} height={height} fill="#ffffff" cornerRadius={4} />;
  };

  // Render shape elements
  const renderShape = (el: any, i: number) => {
    const props = el.properties || {};
    const component = el.konva_component;

    const scaleProps = {
      x: (props.x || 0) * scaleFactor,
      y: (props.y || 0) * scaleFactor,
      width: props.width ? props.width * scaleFactor : undefined,
      height: props.height ? props.height * scaleFactor : undefined,
      radius: props.radius ? props.radius * scaleFactor : undefined,
      radiusX: props.radiusX ? props.radiusX * scaleFactor : undefined,
      radiusY: props.radiusY ? props.radiusY * scaleFactor : undefined,
      strokeWidth: props.strokeWidth ? props.strokeWidth * scaleFactor : undefined,
    };

    const commonProps: any = {
      ...scaleProps,
      fill: props.fill,
      stroke: props.stroke,
      cornerRadius: props.cornerRadius ? props.cornerRadius * scaleFactor : undefined,
      opacity: props.opacity,
      shadowColor: "rgba(0,0,0,0.15)",
      shadowBlur: 1,
      shadowOpacity: 0.4,
    };

    if (props.fillLinearGradientColorStops) {
      commonProps.fillLinearGradientStartPoint = props.fillLinearGradientStartPoint 
        ? { x: props.fillLinearGradientStartPoint.x * scaleFactor, y: props.fillLinearGradientStartPoint.y * scaleFactor }
        : { x: 0, y: 0 };
      commonProps.fillLinearGradientEndPoint = props.fillLinearGradientEndPoint
        ? { x: props.fillLinearGradientEndPoint.x * scaleFactor, y: props.fillLinearGradientEndPoint.y * scaleFactor }
        : { x: scaleProps.width || 0, y: scaleProps.height || 0 };
      commonProps.fillLinearGradientColorStops = props.fillLinearGradientColorStops;
    }

    if (props.fillRadialGradientColorStops) {
      commonProps.fillRadialGradientStartPoint = props.fillRadialGradientStartPoint
        ? { x: props.fillRadialGradientStartPoint.x * scaleFactor, y: props.fillRadialGradientStartPoint.y * scaleFactor }
        : { x: 0, y: 0 };
      commonProps.fillRadialGradientEndPoint = props.fillRadialGradientEndPoint
        ? { x: props.fillRadialGradientEndPoint.x * scaleFactor, y: props.fillRadialGradientEndPoint.y * scaleFactor }
        : { x: 0, y: 0 };
      commonProps.fillRadialGradientStartRadius = props.fillRadialGradientStartRadius || 0;
      commonProps.fillRadialGradientEndRadius = props.fillRadialGradientEndRadius 
        ? props.fillRadialGradientEndRadius * scaleFactor 
        : 100;
      commonProps.fillRadialGradientColorStops = props.fillRadialGradientColorStops;
    }

    switch (component) {
      case "Rect":
        return <Rect key={`shape-${i}`} {...commonProps} />;
      case "Circle":
        return <Circle key={`shape-${i}`} {...commonProps} />;
      case "Ellipse":
        return <Ellipse key={`shape-${i}`} {...commonProps} />;
      case "Line":
        return (
          <Line
            key={`shape-${i}`}
            points={props.points?.map((p: number) => p * scaleFactor) || []}
            stroke={props.stroke}
            strokeWidth={scaleProps.strokeWidth}
            tension={props.tension}
            lineCap={props.lineCap}
            dash={props.dash?.map((d: number) => d * scaleFactor)}
            shadowColor="rgba(0,0,0,0.15)"
            shadowBlur={1}
          />
        );
      default:
        return null;
    }
  };

  // Render elements
  const renderElements = () => {
    if (!variant.elements) return null;

    return variant.elements
      .filter((el: any) => el.element_type === "shape")
      .map((el: any, i: number) => renderShape(el, i));
  };

  // Render text elements - title and subtitle
  const renderText = () => {
    const title = variant.slide_title;
    const subtitle = variant.subtitle;
    const texts = [];

    if (title && title.text) {
      const props = title.properties || {};
      texts.push(
        <Text
          key="title"
          x={(props.x || 0) * scaleFactor}
          y={(props.y || 0) * scaleFactor}
          width={(props.width || width) * scaleFactor}
          height={(props.height || 60) * scaleFactor}
          text={title.text.substring(0, 20) + (title.text.length > 20 ? "..." : "")} // Truncate for preview
          fontSize={(props.fontSize || 24) * scaleFactor}
          fontFamily={props.fontFamily || "Inter"}
          fill={props.fill || "#000"}
          align={props.align || "center"}
          verticalAlign="middle"
          fontStyle={props.fontWeight === "700" || props.fontWeight === "800" ? "bold" : "normal"}
          shadowColor="rgba(0,0,0,0.2)"
          shadowBlur={0.5}
        />
      );
    }

    if (subtitle && subtitle.text) {
      const props = subtitle.properties || {};
      texts.push(
        <Text
          key="subtitle"
          x={(props.x || 0) * scaleFactor}
          y={(props.y || 0) * scaleFactor}
          width={(props.width || width) * scaleFactor}
          height={(props.height || 40) * scaleFactor}
          text={subtitle.text.substring(0, 30) + (subtitle.text.length > 30 ? "..." : "")}
          fontSize={(props.fontSize || 16) * scaleFactor}
          fontFamily={props.fontFamily || "Inter"}
          fill={props.fill || "#666"}
          align={props.align || "center"}
          verticalAlign="middle"
          fontStyle="italic"
          shadowColor="rgba(0,0,0,0.15)"
          shadowBlur={0.5}
        />
      );
    }

    return texts;
  };

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 2,
        cursor: "pointer",
        transition: "all 0.2s ease",
        overflow: "hidden",
        bgcolor: "#fff",
        boxShadow: isSelected 
          ? "0 3px 12px rgba(123,74,226,0.2)" 
          : "0 1px 4px rgba(0,0,0,0.06)",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: isSelected 
            ? "0 5px 16px rgba(123,74,226,0.25)" 
            : "0 2px 8px rgba(0,0,0,0.1)",
        },
      }}
      onClick={onClick}
    >
      <Stage 
        width={width} 
        height={height}
        onClick={onClick}
        onTap={onClick}
      >
        <Layer>
          {renderBackground()}
          {renderElements()}
          {renderText()}
        </Layer>
      </Stage>
      <Box sx={{ px: 1.5, pt: 0.75, pb: 1.5 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            textAlign: "center", 
            display: "block",
            fontWeight: 500,
            color: "#666",
            fontSize: 12,
            lineHeight: 1.1,
          }}
        >
          {variant.name || `Layout ${index + 1}`}
        </Typography>
        {isSelected && (
          <Chip
            label="Active"
            size="small"
            sx={{
              mt: 0.25,
              bgcolor: "#7B4AE2",
              color: "#fff",
              fontSize: 10,
              fontWeight: 600,
              height: 16,
              "& .MuiChip-label": { px: 0.75, py: 0 },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default LayoutVariantPreview;