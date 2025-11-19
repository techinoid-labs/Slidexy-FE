"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Box, Tooltip, IconButton, Button, Divider } from "@mui/material";
import { useRouter } from "next/navigation";
import TemplatePanel from "../Template";
import TextEditor from "./TextEditor";
import MediaPanel from "../Media";
import Shapes from "../Shapes";
import { useSlides } from "@/app/context/SlidesContext";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";


type PanelType = null | "template" | "text" | "media" | "shapes";

interface SideNavBarProps {
  showTemplatePanel: boolean;
  setShowTemplatePanel: React.Dispatch<React.SetStateAction<boolean>>;

}

const navItems = [
  { label: "Themes", icon: "/images/template-icon.svg", panel: "template" },
  { label: "Text", icon: "/images/text-icon.svg", panel: "text" },
  { label: "Images", icon: "/images/picture-icon.svg", panel: "media" },
  { label: "Shapes", icon: "/images/nav-icon.svg", panel: "shapes" },
];

const SideNavBar = ({
  showTemplatePanel,
  setShowTemplatePanel,
}: SideNavBarProps) => {
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const [openPanel, setOpenPanel] = React.useState<PanelType>(null);
  const { undo, redo, canUndo, canRedo } = useSlides();
  const panelRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const sidebarHeight = "100vh";
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if clicking inside any open panel
      let clickedInsideAnyPanel = false;
      Object.values(panelRefs.current).forEach((ref) => {
        if (ref && ref.contains(target)) {
          clickedInsideAnyPanel = true;
        }
      });

      // If clicked inside a panel, don't close
      if (clickedInsideAnyPanel) return;

      // If clicked on sidebar buttons, don't close (let the toggle handle it)
      if (target.closest('[data-panel-trigger]')) return;

      // ✅ FIX: Close panels when clicking on canvas or anywhere else
      // Removed the canvas check that was preventing closure
      setOpenPanel(null);
    };

    // Small delay to allow panel to mount
    const timeout = setTimeout(() => {
      document.addEventListener("mousedown", handleGlobalClick);
    }, 100);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousedown", handleGlobalClick);
    };
  }, []);

  // Alternative: If you want to ONLY close when clicking on the canvas/stage area:
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if clicking inside any open panel
      let clickedInsideAnyPanel = false;
      Object.values(panelRefs.current).forEach((ref) => {
        if (ref && ref.contains(target)) {
          clickedInsideAnyPanel = true;
        }
      });

      if (clickedInsideAnyPanel) return;

      // Don't close on sidebar button clicks (let toggle handle it)
      if (target.closest('[data-panel-trigger]')) return;

      // ✅ Close if clicking on canvas OR slide editor area
      const isCanvasClick = target.closest('canvas') || target.tagName === 'CANVAS';
      const isSlideEditorClick = target.closest('[data-slide-editor]'); // Add this attribute to SlideEditor

      if (isCanvasClick || isSlideEditorClick) {
        setOpenPanel(null);
        return;
      }

      // Close on any other outside click
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
  const handlePanelToggle = (idx: number, panelType: PanelType) => {
    setSelectedIdx(idx);
    // Toggle panel: close if already open, open if closed
    setOpenPanel((prev) => (prev === panelType ? null : panelType));
  };
  const registerPanelRef = (type: string, ref: HTMLDivElement | null) => {
    panelRefs.current[type] = ref;
  };
  return (
    <Box sx={{ position: "relative", display: "flex" }}>
      <Box
        sx={{
          width: 80,
          height: sidebarHeight,
          bgcolor: "#fff",
          borderRight: "1px solid #E0E0E0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 3,
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            width: "100%",
          }}
        >
          {navItems.map((item, idx) => (
            <Tooltip
              key={item.label}
              title={item.label}
              placement="right"
              arrow
            >
              <IconButton
                data-panel-trigger={item.panel}
                onClick={() => handlePanelToggle(idx, item.panel as PanelType)}
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  color: selectedIdx === idx ? "#4A00E0" : "#18181B",
                  transition: "color 0.2s",
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: "#4A00E0",
                  },
                }}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={23}
                  height={23}
                />
              </IconButton>
            </Tooltip>
          ))}
        </Box>
        <Divider className="w-full" sx={{ mb: 1 }} />
        <div className="flex flex-col items-center justify-center w-full gap-4">
          <IconButton
            color="primary"
            onClick={undo}
            disabled={!canUndo}
            sx={{
              color: "#222",
              backgroundColor: "#F8F8FA",
              padding: "2px",
              width: 32,
              height: 30,
              mb: 0.2,
            }}
          >
            <UndoIcon sx={{ fontWeight: 200, fontSize: 20 }} />
          </IconButton>
          <IconButton
            color="primary"
            onClick={redo}
            disabled={!canRedo}
            sx={{
              color: "#222",
              backgroundColor: "#F8F8FA",
              padding: "2px",
              width: 32,
              height: 30,
              mb: 0.2,
            }}
          >
            <RedoIcon sx={{ fontWeight: 200, fontSize: 20 }} />
          </IconButton>
        </div>
      </Box>
      {openPanel === "template" && (
        <TemplatePanel
          sidebarHeight={sidebarHeight}
          onClose={() => setOpenPanel(null)}
          ref={(el) => registerPanelRef("template", el)}
        />
      )}

      {openPanel === "text" && (
        <TextEditor
          sidebarHeight={sidebarHeight}
          onClose={() => setOpenPanel(null)}
        ref={(el) => registerPanelRef("text", el)}
        />
      )}

      {openPanel === "media" && (
        <MediaPanel
          sidebarHeight={sidebarHeight}
          onClose={() => setOpenPanel(null)}
          ref={(el) => registerPanelRef("media", el)}
        />
      )}

      {openPanel === "shapes" && (
        <Shapes
          sidebarHeight={sidebarHeight}
          onClose={() => setOpenPanel(null)}
          ref={(el) => registerPanelRef("shapes", el)}
        />
      )}
    </Box>
  );
};

export default SideNavBar;