"use client";

import React from "react";
import Image from "next/image";
import { Box, Tooltip, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import TemplatePanel from "../Template";
// import TextEditorPanel from "../TextEditor";
import TextEditor from "./TextEditor";
import MediaPanel from "../Media";
import ShapesPanel from "../../editor/Shapes";

type PanelType = null | "template" | "text" | "media" | "shapes";

interface SideNavBarProps {
  showTemplatePanel: boolean;
  setShowTemplatePanel: React.Dispatch<React.SetStateAction<boolean>>;
}

const navItems = [
  { label: "Themes", icon: "/images/template-icon.svg" },
  { label: "Text", icon: "/images/text-icon.svg" },
  { label: "Images", icon: "/images/picture-icon.svg" },
  { label: "Shapes", icon: "/images/nav-icon.svg" },
];

const SideNavBar = ({
  showTemplatePanel,
  setShowTemplatePanel,
}: SideNavBarProps) => {
  const [selectedIdx, setSelectedIdx] = React.useState(0);

  console.log(selectedIdx);
  const [openPanel, setOpenPanel] = React.useState<PanelType>(null);
  const sidebarHeight = "88.5vh";
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
                onClick={() => {
                  setSelectedIdx(idx);
                  if (idx === 0) {
                    setOpenPanel((prev) =>
                      prev === "template" ? null : "template"
                    );
                  } else if (idx === 1) {
                    setOpenPanel((prev) => (prev === "text" ? null : "text"));
                  } else if (idx === 2) {
                    setOpenPanel((prev) => (prev === "media" ? null : "media"));
                  } else if (idx === 3) {
                    setOpenPanel((prev) =>
                      prev === "shapes" ? null : "shapes"
                    );
                  } else {
                    setOpenPanel(null);
                  }
                }}
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
      </Box>
      {/* {openPanel === "template" && ( */}
      <TemplatePanel
        sidebarHeight={sidebarHeight}
        onClose={() => setOpenPanel(null)}
        isOpen={openPanel === "template"}
      />
      {/* )} */}
      {openPanel === "text" && (
        <TextEditor
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
