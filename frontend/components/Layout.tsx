import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Toolbar from "@mui/material/Toolbar";
import React, { ReactElement } from "react";
import Meta from "components/Meta"; // Components: Meta
import Header from "components/Header"; // Components: Header
import Footer from "components/Footer"; // Components: Footer
import { useRouter } from "next/router";
import { useUserInfo } from "lib/user-context";
import { useState } from "react";

export default function Layout({
  onboarding,
  children,
}: {
  onboarding?: boolean;
  children: ReactElement | ReactElement[];
}) {
  const { loading } = useUserInfo();
  const router = useRouter();
  const [eventFooter] = useState(
    router.asPath.includes("/events") ? true : false
  );

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
              margin: eventFooter
                ? { xs: "0 10%", md: "auto", sm: "0 0 0 340px" }
                : { xs: "auto", md: "0 10%", sm: "0 10%" },
              flexGrow: 1,
            }}
          >
            <Toolbar />
            {children}
          </Box>
          {!eventFooter && (
            <>
              <Footer />
            </>
          )}
        </div>
      )}
    </>
  );
}
