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
  return (
    <div
      style={{
        filter: onboarding ? "blur(2px)" : "none",
      }}
    >
      {/* Site meta */}
      <Meta />

      <Header />
      {/* Injected child content */}
      <div>{children}</div>
    </div>
  );
}
