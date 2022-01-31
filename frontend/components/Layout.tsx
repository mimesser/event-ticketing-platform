import Meta from "components/Meta"; // Components: Meta
import Footer from "components/Footer"; // Components: Footer
import type { ReactElement } from "react"; // Types
import styles from "styles/components/Layout.module.scss"; // Component styles

export default function Layout({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  return (
    // Layout wrapper
    <div className={styles.layout}>
      {/* Site meta */}
      <Meta />

      {/* Injected child content */}
      <div className={styles.layout__content}>{children}</div>

      {/* Global footer */}
      <Footer />
    </div>
  );
}
