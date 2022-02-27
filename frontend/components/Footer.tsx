import Button from "@mui/material/Button";
import { useUserInfo } from "lib/user-context";
import { useRouter } from "next/router";
import styles from "styles/components/Footer.module.scss"; // Component styles

export default function Footer() {
  const { user } = useUserInfo();
  const router = useRouter();

  return !user ? (
    <div className={styles.footer}>
      <div className={styles.title}>Connect on Impish</div>
      <Button
        color="primary"
        size="large"
        variant="contained"
        onClick={() => router.push("/")}
      >
        Log in / Sign up
      </Button>
    </div>
  ) : null;
}
