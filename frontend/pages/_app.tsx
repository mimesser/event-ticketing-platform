import "styles/global.scss"; // Global styles
import StateProvider from "state"; // Global state provider
import type { AppProps } from "next/app"; // Types
import { SessionProvider } from "next-auth/react"; // Session provider from NextAuth
import { ThemeProvider } from "next-themes";
import EventProvider from "lib/event-context";
import UserProvider from "lib/user-context";
import React from "react";

// Export application‚
export default function MerkleAirdropStarter({
  Component,
  pageProps,
}: AppProps) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);
  return (
    // Wrap application in session provider
    <SessionProvider session={pageProps.session}>
      {/* Wrap application in global state provider */}
      <StateProvider>
        <UserProvider>
          <ThemeProvider>
            <EventProvider>
              <Component {...pageProps} />
            </EventProvider>
          </ThemeProvider>
        </UserProvider>
      </StateProvider>
    </SessionProvider>
  );
}
