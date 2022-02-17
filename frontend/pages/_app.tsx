import "styles/global.scss"; // Global styles
import StateProvider from "state"; // Global state provider
import type { AppProps } from "next/app"; // Types
import { SessionProvider } from "next-auth/react"; // Session provider from NextAuth

// Export application‚
export default function MerkleAirdropStarter({
  Component,
  pageProps,
}: AppProps) {
  return (
    // Wrap application in session provider
    <SessionProvider session={pageProps.session}>
      {/* Wrap application in global state provider */}
      <StateProvider>
        <Component {...pageProps} />
      </StateProvider>
    </SessionProvider>
  );
}
