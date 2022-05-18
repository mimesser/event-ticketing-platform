import { CircularProgress } from "@mui/material";

export default function LoadingScene({
  size = 120,
  width = "100vw",
  height = "100vh",
}: {
  size?: number;
  height?: string;
  width?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        width,
        height,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress size={size} />
    </div>
  );
}
