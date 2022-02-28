import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Toolbar from "@mui/material/Toolbar";
import React, { ReactElement } from "react";
import Meta from "components/Meta"; // Components: Meta
import Header from "components/Header"; // Components: Header
import Footer from "components/Footer"; // Components: Footer
import { useUserInfo } from "lib/user-context";

export default function Layout({
  onboarding,
  children,
}: {
  onboarding?: boolean;
  children: ReactElement | ReactElement[];
}) {
  const { loading } = useUserInfo();

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            width: "100vw",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={120} />
        </div>
      ) : (
        <div
          style={{
            filter: onboarding ? "blur(2px)" : "none",
            display: "flex",
          }}
        >
          {/* Site meta */}
          <Meta />

          <Header />
          {/* Injected child content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
            }}
          >
            <Toolbar />
            {children}
          </Box>

          <Footer />
        </div>
      )}
    </>
  );
}
