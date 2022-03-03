import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Layout from "components/Layout";
import { useRouter } from "next/router";
import { getLoginSession } from "lib/auth";
import { fetchPublicUser } from "lib/hooks";
import { shortenAddress } from "lib/utils";
import React from "react";
import styles from "styles/pages/View.module.scss";

function View() {
  const router = useRouter();
  const { username } = router.query;
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    if (username) {
      fetchPublicUser(username as string).then((fetchedUser) => {
        if (fetchedUser !== null) {
          setUser(fetchedUser);
        } else {
          router.push({
            pathname: "/[username]",
            query: { username: username },
          });
        }
      });
    }
  }, [username, router]);

  const view = router.query.view;
  const [value, setValue] = React.useState(view === "followers" ? 0 : 1);

  const handleChange = (event: any, newValue: React.SetStateAction<number>) => {
    setValue(newValue);
  };
  const [followers, setFollowers] = React.useState(false);
  const [following, setFollowing] = React.useState(false);

  function TabPanel(props: {
    [x: string]: any;
    children: any;
    value: any;
    index: any;
  }) {
    const { children, value, index, ...other } = props;

    return (
      <div {...other}>{value === index && <Box p={3}>{children}</Box>}</div>
    );
  }

  function LinkTab(props: any) {
    return (
      <Tab
        color="black"
        sx={{
          "&& .Mui-selected": {
            "&, & .MuiListItemText-root": {
              color: (theme) => theme.palette.primary.main,
            },
          },
          textTransform: "none",
          color: "black",
        }}
        component="a"
        onClick={(event: any) => {
          event.preventDefault();
        }}
        {...props}
      />
    );
  }

  return (
    <Layout>
      {user && (
        <Box sx={{ p: 4 }}>
          <Grid
            container
            direction="row"
            justifyContent="start"
            alignItems="center"
          >
            <Tooltip title="Back">
              <IconButton
                onClick={() => router.back()}
                size="large"
                sx={{
                  color: "black",
                }}
              >
                <ArrowBackIcon
                  color="inherit"
                  sx={{
                    fontSize: 18,
                  }}
                />
              </IconButton>
            </Tooltip>
            <Grid sx={{ p: 3 }}>
              <div className={styles.user_details}>
                {user.name && <div className={styles.name}>{user.name}</div>}

                {user.username && (
                  <div className={styles.username}>{`@${user.username}`}</div>
                )}

                {!user.username && (
                  <div className={styles.address}>
                    {shortenAddress(user.walletAddress)}
                  </div>
                )}
              </div>
            </Grid>
          </Grid>
          <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
            <Tabs
              sx={{
                "&& .MuiTab-root": {
                  color: "text.secondary",
                },
                "&& .Mui-selected": {
                  "&, & .MuiListItemText-root": {
                    color: "black",
                    fontSize: "16px",
                  },
                },
                "& .MuiTabs-indicator": {
                  display: "flex",
                  height: "3px",
                  justifyContent: "center",
                  backgroundColor: "transparent",
                  "& > span": {
                    maxWidth: 60,
                    width: "100%",
                    backgroundColor: "#1976d2",
                  },
                },
              }}
              centered
              TabIndicatorProps={{ children: <span /> }}
              variant="fullWidth"
              value={value}
              onChange={handleChange}
            >
              <LinkTab label="Followers" />
              <LinkTab label="Following" />
            </Tabs>
          </Box>
          <Box>
            <TabPanel value={value} index={0}>
              {!followers && (
                <Box sx={{ p: 4 }}>
                  <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography variant="h3">
                      {user.username ? (
                        <Typography component={"span"} variant="h3">
                          {`@${user.username}`}
                        </Typography>
                      ) : (
                        <Typography component={"span"} variant="h3">
                          {shortenAddress(user.walletAddress)}
                        </Typography>
                      )}
                      {` doesn’t have any followers`}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary" }}
                    >
                      When someone follows them, they’ll be listed here.
                    </Typography>
                  </Grid>
                </Box>
              )}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {!following && (
                <Box sx={{ p: 4 }}>
                  <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography variant="h3">
                      {user.username ? (
                        <Typography component={"span"} variant="h3">
                          {`@${user.username}`}
                        </Typography>
                      ) : (
                        <Typography component={"span"} variant="h3">
                          {shortenAddress(user.walletAddress)}
                        </Typography>
                      )}
                      {` isn’t following anyone`}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary" }}
                    >
                      When they do, they’ll be listed here.
                    </Typography>
                  </Grid>
                </Box>
              )}
            </TabPanel>
          </Box>
        </Box>
      )}
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  const query = context.query;
  const session = await getLoginSession(context.req);
  if (query.view === "followers" || query.view === "following") {
    if (session) {
      return {
        props: {},
      };
    } else {
      return {
        redirect: {
          permanent: false,
          destination: `/${query.username}`,
        },
      };
    }
  } else {
    return {
      notFound: true,
    };
  }
}

export default View;
