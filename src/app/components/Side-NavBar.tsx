"use client";

import React from "react";
import Image from "next/image";
import { Box, Tooltip, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Home", icon: "/images/template-icon.svg" },
  { label: "Dashboard", icon: "/images/text-icon.svg" },
  { label: "Files", icon: "/images/picture-icon.svg" },
  { label: "AI", icon: "/images/nav-icon.svg" },
];

import TemplatePanel from "./Template";

import TextEditorPanel from "./TextEditor";
import MediaPanel from "./Media";
import ShapesPanel from "./Shapes";
// Re-export with correct prop types for linter
// (No change needed if default export is used, but ensure import is not type-mismatched)

type PanelType = null | "template" | "text" | "media" | "shapes";

interface SideNavBarProps {
  showTemplatePanel: boolean;
  setShowTemplatePanel: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideNavBar: React.FC<SideNavBarProps> = ({ showTemplatePanel, setShowTemplatePanel }) => {
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const [openPanel, setOpenPanel] = React.useState<PanelType>(null);
  const sidebarHeight = '100vh';
  return (
    <Box sx={{ position: 'relative', display: 'flex' }}>
      <Box
        sx={{
          width: 80,
          height: sidebarHeight,
          bgcolor: '#fff',
          borderRight: '1px solid #E0E0E0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 3,
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2.5,
            width: '100%',
          }}
        >
          {navItems.map((item, idx) => (
            <Tooltip key={item.label} title={item.label} placement="right" arrow>
              <IconButton
                onClick={() => {
                  setSelectedIdx(idx);
                  if (idx === 0) {
                    setOpenPanel((prev) => prev === "template" ? null : "template");
                  } else if (idx === 1) {
                    setOpenPanel((prev) => prev === "text" ? null : "text");
                  } else if (idx === 2) {
                    setOpenPanel((prev) => prev === "media" ? null : "media");
                  } else if (idx === 3) {
                    setOpenPanel((prev) => prev === "shapes" ? null : "shapes");
                  } else {
                    setOpenPanel(null);
                  }
                }}
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  color: selectedIdx === idx ? '#4A00E0' : '#18181B',
                  transition: 'color 0.2s',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#4A00E0',
                  },
                }}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={35}
                  height={35}
                  style={{ width: 35, height: 35 }}
                />
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </Box>
      {openPanel === "template" && (
        <TemplatePanel
          sidebarHeight={sidebarHeight}
          onClose={() => setOpenPanel(null)}
        />
      )}
      {openPanel === "text" && (
        <TextEditorPanel
          sidebarHeight={sidebarHeight}
          onClose={() => setOpenPanel(null)}
        />
      )}
      {openPanel === "media" && (
        <MediaPanel
          sidebarHeight={sidebarHeight}
          onClose={() => setOpenPanel(null)}
        />
      )}
      {openPanel === "shapes" && (
        <ShapesPanel
          sidebarHeight={sidebarHeight}
          onClose={() => setOpenPanel(null)}
        />
      )}
    </Box>
  );
};

export default SideNavBar;
