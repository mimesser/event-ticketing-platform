import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import React, { ReactElement } from "react";
import Meta from "components/Meta"; // Components: Meta
import Header from "components/Header"; // Components: Header

export default function Layout({
  onboarding,
  children,
}: {
  onboarding?: boolean;
  children: ReactElement | ReactElement[];
}) {
  const drawerWidth = 240;

  return (
    <div
      style={{
        filter: onboarding ? "blur(2px)" : "none",
        display: "flex",
      }}
    >
      {/* Site meta */}
      <Meta />

      <Header drawerWidth={drawerWidth} />
      {/* Injected child content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </div>
  );
}
