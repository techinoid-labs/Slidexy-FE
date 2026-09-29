/**
 * Template catalogue.
 *
 * The 50 catalogue entries are registered here. Each is a data manifest built
 * from the shared block library, so adding one does not add components.
 */

import type { SlideTemplate } from "../types";
import { businessCorporate } from "./01-business-corporate";
import { startupPitch } from "./02-startup-pitch";
import { investorDeck } from "./03-investor-deck";

export const TEMPLATES: SlideTemplate[] = [businessCorporate, startupPitch, investorDeck];

export const TEMPLATES_BY_ID: Record<string, SlideTemplate> = Object.fromEntries(
  TEMPLATES.map((t) => [t.id, t])
);

export function getTemplate(id: string): SlideTemplate | undefined {
  return TEMPLATES_BY_ID[id];
}

/** Catalogue metadata for the template picker, without pulling slide data. */
export interface TemplateSummary {
  id: string;
  number: number;
  name: string;
  category: string;
  description: string;
  slideCount: number;
  accent: string;
  bg: string;
  mode: "light" | "dark";
}

export function templateSummaries(): TemplateSummary[] {
  return TEMPLATES.map((t) => ({
    id: t.id,
    number: t.number,
    name: t.name,
    category: t.category,
    description: t.description,
    slideCount: t.slides.length,
    accent: t.theme.palette.accent,
    bg: t.theme.palette.bg,
    mode: t.theme.mode,
  })).sort((a, b) => a.number - b.number);
}
