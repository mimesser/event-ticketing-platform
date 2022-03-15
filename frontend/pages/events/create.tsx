import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import GroupSharpIcon from "@mui/icons-material/GroupSharp";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Layout from "components/Layout";
import Colors from "lib/colors";
import { getLoginSession } from "lib/auth";
import { useTheme } from "next-themes";

function Create() {
  const { resolvedTheme } = useTheme();

  return (
    <Layout>
      <>
        <Box
          component="div"
          style={{
            display: "flex",
            height: "80vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid container width={200} direction="column" alignItems="center">
            <Typography
              gutterBottom
              variant="h6"
              sx={{
                color: Colors[resolvedTheme]?.primary,
                textAlign: "left",
                fontWeight: 900,
                alignSelf: "start",
              }}
            >
              Create Event
            </Typography>
            <IconButton
              sx={{
                ":hover": {
                  borderRadius: "0",
                  padding: "0",
                },
                padding: "0px",
              }}
            >
              <Card
                sx={{
                  p: 3,
                  backgroundColor: Colors[resolvedTheme]?.header_bg,
                  ":hover": {
                    backgroundColor: Colors[resolvedTheme]?.icon_bg,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <IconButton
                    sx={{
                      margin: "auto",
                      backgroundColor: Colors[resolvedTheme]?.icon_bg,
                    }}
                  >
                    <GroupSharpIcon
                      sx={{
                        color: Colors[resolvedTheme]?.primary,
                      }}
                    />
                  </IconButton>
                </Box>
                <IconButton
                  sx={{
                    display: "flex",
                    margin: "auto",
                    ":hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: "center",
                      color: Colors[resolvedTheme]?.primary,
                    }}
                  >
                    In Person
                  </Typography>
                </IconButton>

                <Typography
                  variant="subtitle1"
                  sx={{
                    textAlign: "center",
                    color: Colors[resolvedTheme]?.secondary,
                  }}
                >
                  Get together with people at a specific location
                </Typography>
              </Card>
            </IconButton>
          </Grid>
        </Box>
      </>
    </Layout>
  );
}
export async function getServerSideProps(context: any) {
  const session = await getLoginSession(context.req);

  if (session) {
    return {
      props: {},
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: `/events`,
      },
    };
  }
}

export default Create;
