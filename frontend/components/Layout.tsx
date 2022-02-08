import React, { ReactElement } from "react";
import Meta from "components/Meta"; // Components: Meta
import Header from "components/Header"; // Components: Header

export default function Layout({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  return (
    <React.Fragment>
      {/* Site meta */}
      <Meta />

      <Header />
      {/* Injected child content */}
      <div>{children}</div>

    </React.Fragment>
  );
}
