"use client";

import React from "react";
import Image from "next/image";
import { Box, Tooltip, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import MobileTemplatePanel from "../Template-Panel-Mobile";
// import TextEditorPanel from "../TextEditor";
import TextEditor from "./TextEditor";
import MediaPanel from "../Media";
import ShapesPanel from "../../editor/Shapes";
import MobileTextEditor from "../Text-Editor-Mobile";
import MobileShapes from "../Shapes-Mobile";
import MobileMedia from "../Media-Mobile";

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

  // console.log(selectedIdx);
  const [openPanel, setOpenPanel] = React.useState<PanelType>(null);
  const sidebarHeight = "88.5vh";
  return (
    <Box sx={{ position: "relative", display: "flex" }}>
      <Box
        sx={{
          width: "100%",
          height: 80,
          bgcolor: "#fff",
          borderTop: "1px solid #E0E0E0",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          py: 2,
          zIndex: 1,
          boxSizing: "border-box",
          position: "fixed",
          bottom: 0,
          left: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: -1,
            width: "auto",
            borderRadius: 1,
            bgcolor: "#F6F6F6",
          }}
        >
          {navItems.map((item, idx) => (
            <Tooltip key={item.label} title={item.label} placement="top" arrow>
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
                  color: selectedIdx === idx && openPanel ? "#4A00E0" : "#18181B",
                  backgroundColor: selectedIdx === idx && openPanel ? "rgba(142, 45, 226, 0.1)" : "transparent",
                  transition: "color 0.2s, background-color 0.2s",
                  "&:hover": {
                    backgroundColor: "rgba(142, 45, 226, 0.08)",
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
      {openPanel === "template" && (
        <MobileTemplatePanel
          sidebarHeight={sidebarHeight}
          onClose={() => setOpenPanel(null)}
        />
      )}
      {openPanel === "text" && (
        <MobileTextEditor
          sidebarHeight={sidebarHeight}
          onClose={() => setOpenPanel(null)}
        />
      )}
      {openPanel === "media" && (
        <MobileMedia
          sidebarHeight={sidebarHeight}
          onClose={() => setOpenPanel(null)}
        />
      )}
      {openPanel === "shapes" && (
        <MobileShapes
          sidebarHeight={sidebarHeight}
          onClose={() => setOpenPanel(null)}
        />
      )}
    </Box>
  );
};

export default SideNavBar;
