import { Button, Typography } from "@mui/material";
import Colors from "lib/colors";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";

export default function InvitesView() {
  const { resolvedTheme } = useTheme();
  const route = useRouter();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100% - 64px)",
      }}
    >
      <Typography
        component="span"
        sx={{
          fontSize: "1rem",
          color: Colors[resolvedTheme].secondary,
        }}
      >
        Events you&apos;ve been sent invites to will appear here.
      </Typography>
      <Button
        variant="contained"
        sx={{
          textTransform: "none",
          fontWeight: 600,
        }}
        onClick={() => {
          route.push("/events/");
        }}
      >
        Discover New Events
      </Button>
    </div>
  );
}
