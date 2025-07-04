"use client";
import React, { useState } from "react";
import SideNavBar from "../components/Side-NavBar";
import UpperNavBar from "../components/Upper-NavBar";
import ThemePanel from "../components/Theme";
import CentralEditor from "../components/CentralEditor";
import SlideEditor from "./SlideEditor";
const Page = () => {
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#FBFAFF",
        maxWidth: "100%",
        maxHeight: "100%",
      }}
    >
      <UpperNavBar />
      <div className="" style={{ display: "flex", flex: 1 }}>
        <SideNavBar
          showTemplatePanel={showTemplatePanel}
          setShowTemplatePanel={setShowTemplatePanel}
        />
        <main
          style={{
            flexGrow: 1,
            padding: 16,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <CentralEditor templatePanelOpen={showTemplatePanel} /> */}
          {/* <App /> */}
          <SlideEditor />
        </main>
        {/* <ThemePanel /> */}
      </div>
    </div>
  );
};

export default Page;
