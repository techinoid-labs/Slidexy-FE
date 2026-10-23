"use client";

import React from "react";
import type { Block } from "../types";
import { useTokens } from "./primitives";
import {
  ChecklistBlockView,
  HeadingBlockView,
  IconBulletsBlockView,
  ParagraphBlockView,
  QuoteBlockView,
} from "./textBlocks";
import {
  ChartBlockView,
  DonutChartBlockView,
  NestedCirclesBlockView,
  ScatterQuadrantBlockView,
  StatCardsBlockView,
  VennBlockView,
} from "./dataBlocks";
import {
  IconGridBlockView,
  PillarsBlockView,
  ProcessFlowBlockView,
  RoadmapPhasesBlockView,
  TimelineBlockView,
} from "./structureBlocks";
import { ComparisonTableBlockView, PricingTableBlockView } from "./tableBlocks";
import {
  BigStatBlockView,
  CalloutBandBlockView,
  MetricRowBlockView,
  NumberedListBlockView,
  SpotlightBlockView,
} from "./visualBlocks";
import {
  ContactFooterBlockView,
  CtaButtonBlockView,
  DeviceMockupBlockView,
  ImageBlockView,
  ImageGridBlockView,
  LogoWallBlockView,
  TeamCardsBlockView,
} from "./mediaBlocks";
import { Iso3dBlockView } from "./isoBlocks";

export * from "./primitives";
export { ICONS } from "./icons";

/**
 * Renders one block. Unknown types render nothing rather than throwing — a
 * template manifest with a typo should degrade, not blank the whole deck.
 */
export const BlockView: React.FC<{ block: Block; slideNumber?: number }> = ({
  block,
  slideNumber,
}) => {
  switch (block.type) {
    case "heading":
      return <HeadingBlockView block={block} slideNumber={slideNumber} />;
    case "paragraph":
      return <ParagraphBlockView block={block} />;
    case "iconBullets":
      return <IconBulletsBlockView block={block} />;
    case "checklist":
      return <ChecklistBlockView block={block} />;
    case "quote":
      return <QuoteBlockView block={block} />;

    case "statCards":
      return <StatCardsBlockView block={block} />;
    case "barChart":
    case "lineChart":
    case "comboChart":
      return <ChartBlockView block={block} />;
    case "donutChart":
      return <DonutChartBlockView block={block} />;
    case "scatterQuadrant":
      return <ScatterQuadrantBlockView block={block} />;
    case "nestedCircles":
      return <NestedCirclesBlockView block={block} />;
    case "venn":
      return <VennBlockView block={block} />;

    case "pillars":
      return <PillarsBlockView block={block} />;
    case "processFlow":
      return <ProcessFlowBlockView block={block} />;
    case "timeline":
      return <TimelineBlockView block={block} />;
    case "roadmapPhases":
      return <RoadmapPhasesBlockView block={block} />;
    case "iconGrid":
      return <IconGridBlockView block={block} />;

    case "comparisonTable":
      return <ComparisonTableBlockView block={block} />;
    case "pricingTable":
      return <PricingTableBlockView block={block} />;

    case "teamCards":
      return <TeamCardsBlockView block={block} />;
    case "logoWall":
      return <LogoWallBlockView block={block} />;
    case "contactFooter":
      return <ContactFooterBlockView block={block} />;
    case "ctaButton":
      return <CtaButtonBlockView block={block} />;

    case "image":
      return <ImageBlockView block={block} />;
    case "imageGrid":
      return <ImageGridBlockView block={block} />;
    case "deviceMockup":
      return <DeviceMockupBlockView block={block} />;

    case "bigStat":
      return <BigStatBlockView block={block} />;
    case "calloutBand":
      return <CalloutBandBlockView block={block} />;
    case "spotlight":
      return <SpotlightBlockView block={block} />;
    case "numberedList":
      return <NumberedListBlockView block={block} />;
    case "metricRow":
      return <MetricRowBlockView block={block} />;

    case "iso3d":
      return <Iso3dBlockView block={block} />;

    case "spacer":
      return <SpacerView size={block.size} />;

    default:
      return null;
  }
};

const SpacerView: React.FC<{ size?: number }> = ({ size }) => {
  const t = useTokens();
  return <div style={{ height: size ?? t.space(4) }} />;
};
