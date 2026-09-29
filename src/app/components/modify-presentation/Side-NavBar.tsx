"use client";

import React, { useEffect, useRef } from "react";
import { Box, Tooltip } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import TemplatePanel from "../Template";
import TextEditor from "./TextEditor";
import MediaPanel from "../Media";
import Shapes from "../Shapes";
import LayoutSwitcherPanel from "./LayoutSwitcherPanel";
import { SHELL } from "./shellTheme";

// ── MUI Icons ──────────────────────────────────────────────────────────────
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import ViewQuiltOutlinedIcon from "@mui/icons-material/ViewQuiltOutlined";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";

type PanelType = null | "template" | "text" | "media" | "shapes" | "layouts";

interface SideNavBarProps {
  showTemplatePanel: boolean;
  setShowTemplatePanel: React.Dispatch<React.SetStateAction<boolean>>;
}

const NAV_ITEMS: {
  label: string;
  panel: PanelType;
  Icon: React.ElementType;
}[] = [
  { label: "Themes",  panel: "template", Icon: PaletteOutlinedIcon  },
  { label: "Layouts", panel: "layouts",  Icon: ViewQuiltOutlinedIcon },
  { label: "Text",    panel: "text",     Icon: TextFieldsIcon        },
  { label: "Images",  panel: "media",    Icon: ImageOutlinedIcon     },
  { label: "Shapes",  panel: "shapes",   Icon: CategoryOutlinedIcon  },
];

const ACCENT = SHELL.accent;

const SideNavBar = ({ showTemplatePanel, setShowTemplatePanel }: SideNavBarProps) => {
  const [openPanel, setOpenPanel] = React.useState<PanelType>(null);
  const panelRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const sidebarHeight = "100vh";

  // Close panel when clicking outside sidebar + open panel
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      let insidePanel = false;
      Object.values(panelRefs.current).forEach((ref) => {
        if (ref?.contains(target)) insidePanel = true;
      });
      if (insidePanel) return;
      if (target.closest("[data-panel-trigger]")) return;

      setOpenPanel(null);
    };

    const timeout = setTimeout(() => {
      document.addEventListener("mousedown", handleGlobalClick);
    }, 100);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousedown", handleGlobalClick);
    };
  }, []);

  const toggle = (panel: PanelType) =>
    setOpenPanel((prev) => (prev === panel ? null : panel));

  const registerPanelRef = (type: string, ref: HTMLDivElement | null) => {
    panelRefs.current[type] = ref;
  };

  return (
    <Box sx={{ position: "relative", display: "flex", zIndex: 50 }}>
      {/* ── Rail ────────────────────────────────────────────────────── */}
      <Box
        sx={{
          width: 56,
          height: sidebarHeight,
          background: SHELL.bg,
          borderRight: `1px solid ${SHELL.border}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 1.25,
          pb: 1.5,
          gap: 0,
          flexShrink: 0,
          boxShadow: "2px 0 16px rgba(74, 0, 224, 0.04)",
        }}
      >
        {/* Brand mark */}
        <Box
          sx={{
            width: 26,
            height: 26,
            borderRadius: "7px",
            background: ACCENT,
            mb: 1.75,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Box sx={{ width: 11, height: 11, borderRadius: "3px", background: "rgba(255,255,255,0.9)", transform: "rotate(15deg)" }} />
        </Box>

        {/* Nav items — icon-only, tooltip on hover */}
        {NAV_ITEMS.map(({ label, panel, Icon }) => {
          const isActive = openPanel === panel;
          return (
            <Tooltip key={label} title={label} placement="right" arrow>
              <Box
                data-panel-trigger={panel}
                onClick={() => toggle(panel)}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  position: "relative",
                  mb: 0.5,
                  transition: "background 0.18s ease, transform 0.12s ease",
                  background: isActive ? SHELL.accentBg : "transparent",
                  "&:hover": {
                    background: isActive ? SHELL.accentBgHover : SHELL.surfaceHover,
                    transform: "scale(1.05)",
                  },
                  "&:active": { transform: "scale(0.95)" },
                  "&::before": isActive ? {
                    content: '""',
                    position: "absolute",
                    left: -8,
                    top: "22%",
                    height: "56%",
                    width: 3,
                    background: ACCENT,
                    borderRadius: "0 3px 3px 0",
                  } : {},
                }}
              >
                <Icon sx={{ fontSize: 18, color: isActive ? ACCENT : SHELL.textMuted, transition: "color 0.18s ease" }} />
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      {/* ── Sliding panels ─────────────────────────────────────────── */}
      <AnimatePresence>
        {openPanel === "template" && (
          <motion.div key="template" initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -16, opacity: 0 }} transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.8 }} style={{ display: "flex" }}>
            <TemplatePanel sidebarHeight={sidebarHeight} onClose={() => setOpenPanel(null)} ref={(el: HTMLDivElement | null) => registerPanelRef("template", el)} />
          </motion.div>
        )}
        {openPanel === "text" && (
          <motion.div key="text" initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -16, opacity: 0 }} transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.8 }} style={{ display: "flex" }}>
            <TextEditor sidebarHeight={sidebarHeight} onClose={() => setOpenPanel(null)} ref={(el: HTMLDivElement | null) => registerPanelRef("text", el)} />
          </motion.div>
        )}
        {openPanel === "media" && (
          <motion.div key="media" initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -16, opacity: 0 }} transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.8 }} style={{ display: "flex" }}>
            <MediaPanel sidebarHeight={sidebarHeight} onClose={() => setOpenPanel(null)} ref={(el: HTMLDivElement | null) => registerPanelRef("media", el)} />
          </motion.div>
        )}
        {openPanel === "shapes" && (
          <motion.div key="shapes" initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -16, opacity: 0 }} transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.8 }} style={{ display: "flex" }}>
            <Shapes sidebarHeight={sidebarHeight} onClose={() => setOpenPanel(null)} ref={(el: HTMLDivElement | null) => registerPanelRef("shapes", el)} />
          </motion.div>
        )}
        {openPanel === "layouts" && (
          <motion.div key="layouts" initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -16, opacity: 0 }} transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.8 }} style={{ display: "flex" }}>
            <LayoutSwitcherPanel sidebarHeight={sidebarHeight} onClose={() => setOpenPanel(null)} ref={(el: HTMLDivElement | null) => registerPanelRef("layouts", el)} />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default SideNavBar;
