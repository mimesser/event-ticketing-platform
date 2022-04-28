import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import Layout from "components/Layout";
import Colors from "lib/colors";
import { useTheme } from "next-themes";

function Events() {
  const { resolvedTheme } = useTheme();

  return (
    <Layout>
      <Box sx={{ p: 4 }}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            sx={{
              color: Colors[resolvedTheme]?.secondary,
            }}
            variant="body1"
          >
            No events found.
          </Typography>
        </Grid>
      </Box>
    </Layout>
  );
}

export default Events;
