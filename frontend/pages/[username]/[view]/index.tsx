import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Avatar from "boring-avatars";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Layout from "components/Layout";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { useRouter } from "next/router";
import { getLoginSession } from "lib/auth";
import { fetchPublicUser } from "lib/hooks";
import { useUserInfo } from "lib/user-context";
import { shortenAddress } from "lib/utils";
import React from "react";
import styles from "styles/pages/View.module.scss";

function View() {
  const router = useRouter();
  const { username } = router.query;
  const currentUser = useUserInfo();
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
              {user.followers.length === 0 && (
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
              {user.followers.length !== 0 && (
                <Box sx={{ p: 4, pt: 0 }}>
                  <List className={styles.followList}>
                    {user.followers.map(
                      ({
                        id,
                        avatarImage,
                        name,
                        username,
                        walletAddress,
                      }: any) => {
                        return (
                          <div key={id}>
                            <ListItem id={styles.followItem} disablePadding>
                              <ListItemButton
                                onClick={() =>
                                  router.push(
                                    `/${username ? username : walletAddress}`
                                  )
                                }
                              >
                                <div id={styles.profilePhoto}>
                                  {avatarImage ? (
                                    <Image
                                      id={styles.profilePhoto}
                                      src={avatarImage}
                                      alt={avatarImage}
                                      width={50}
                                      height={50}
                                    />
                                  ) : (
                                    <Avatar
                                      size={50}
                                      name={user.walletAddress}
                                      variant="pixel"
                                      colors={[
                                        "#ffad08",
                                        "#edd75a",
                                        "#73b06f",
                                        "#0c8f8f",
                                        "#405059",
                                      ]}
                                    />
                                  )}
                                </div>
                                <div className={styles.followItemDetails}>
                                  {name && <p>{name}</p>}
                                  {name && username && <a>{` @${username}`}</a>}
                                  {!name && username && (
                                    <p>{` @${username}`}</p>
                                  )}
                                  {!username && (
                                    <p>{shortenAddress(walletAddress)}</p>
                                  )}
                                </div>
                                <div className={styles.follow_button}>
                                  <Button
                                    color="inherit"
                                    sx={(theme) => ({
                                      ":hover": {
                                        backgroundColor: false
                                          ? "inherit"
                                          : "black",
                                      },
                                      backgroundColor: false
                                        ? "white"
                                        : "black",
                                      borderColor: false ? "red" : "black",
                                      borderRadius: theme.shape.borderRadius,
                                      margin: theme.spacing(1),
                                    })}
                                    variant={false ? "outlined" : "contained"}
                                    onClick={() => {
                                      console.log("test");
                                    }}
                                  >
                                    {false ? (
                                      <Typography
                                        sx={{
                                          fontFamily: "sans-serif",
                                          fontSize: "16px",
                                          fontWeight: 550,
                                          textTransform: "none",
                                        }}
                                        variant="body1"
                                      >
                                        {false ? (
                                          <Typography
                                            sx={{
                                              fontFamily: "sans-serif",
                                              fontSize: "16px",
                                              fontWeight: 550,
                                              textTransform: "none",
                                            }}
                                            color="red"
                                            component={"span"}
                                            variant="body1"
                                          >
                                            Unfollow
                                          </Typography>
                                        ) : (
                                          <Typography
                                            sx={{
                                              fontFamily: "sans-serif",
                                              fontSize: "16px",
                                              fontWeight: 550,
                                              textTransform: "none",
                                            }}
                                            component={"span"}
                                            variant="body1"
                                          >
                                            Following
                                          </Typography>
                                        )}
                                      </Typography>
                                    ) : (
                                      <Typography
                                        sx={{
                                          color: "white",
                                          fontFamily: "sans-serif",
                                          fontSize: "16px",
                                          fontWeight: 550,
                                          textTransform: "none",
                                        }}
                                        variant="body1"
                                      >
                                        Follow
                                      </Typography>
                                    )}
                                  </Button>
                                </div>
                              </ListItemButton>
                            </ListItem>
                            <Divider />
                          </div>
                        );
                      }
                    )}
                  </List>
                </Box>
              )}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {user.following.length === 0 && (
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
              {user.following.length !== 0 && (
                <Box sx={{ p: 4, pt: 0 }}>
                  <List className={styles.followList}>
                    {user.following.map(
                      ({
                        id,
                        avatarImage,
                        name,
                        username,
                        walletAddress,
                      }: any) => {
                        return (
                          <div key={id}>
                            <ListItem id={styles.followItem} disablePadding>
                              <ListItemButton
                                onClick={() =>
                                  router.push(
                                    `/${username ? username : walletAddress}`
                                  )
                                }
                              >
                                <div id={styles.profilePhoto}>
                                  {avatarImage ? (
                                    <Image
                                      id={styles.profilePhoto}
                                      src={avatarImage}
                                      alt={avatarImage}
                                      width={50}
                                      height={50}
                                    />
                                  ) : (
                                    <Avatar
                                      size={50}
                                      name={user.walletAddress}
                                      variant="pixel"
                                      colors={[
                                        "#ffad08",
                                        "#edd75a",
                                        "#73b06f",
                                        "#0c8f8f",
                                        "#405059",
                                      ]}
                                    />
                                  )}
                                </div>
                                <div className={styles.followItemDetails}>
                                  {name && <p>{name}</p>}
                                  {name && username && <a>{` @${username}`}</a>}
                                  {!name && username && (
                                    <p>{` @${username}`}</p>
                                  )}
                                  {!username && (
                                    <p>{shortenAddress(walletAddress)}</p>
                                  )}
                                </div>
                                <div className={styles.follow_button}>
                                  <Button
                                    color="inherit"
                                    sx={(theme) => ({
                                      ":hover": {
                                        backgroundColor: false
                                          ? "inherit"
                                          : "black",
                                      },
                                      backgroundColor: false
                                        ? "white"
                                        : "black",
                                      borderColor: false ? "red" : "black",
                                      borderRadius: theme.shape.borderRadius,
                                      margin: theme.spacing(1),
                                    })}
                                    variant={false ? "outlined" : "contained"}
                                  >
                                    {false ? (
                                      <Typography
                                        sx={{
                                          fontFamily: "sans-serif",
                                          fontSize: "16px",
                                          fontWeight: 550,
                                          textTransform: "none",
                                        }}
                                        variant="body1"
                                      >
                                        {false ? (
                                          <Typography
                                            sx={{
                                              fontFamily: "sans-serif",
                                              fontSize: "16px",
                                              fontWeight: 550,
                                              textTransform: "none",
                                            }}
                                            color="red"
                                            component={"span"}
                                            variant="body1"
                                          >
                                            Unfollow
                                          </Typography>
                                        ) : (
                                          <Typography
                                            sx={{
                                              fontFamily: "sans-serif",
                                              fontSize: "16px",
                                              fontWeight: 550,
                                              textTransform: "none",
                                            }}
                                            component={"span"}
                                            variant="body1"
                                          >
                                            Following
                                          </Typography>
                                        )}
                                      </Typography>
                                    ) : (
                                      <Typography
                                        sx={{
                                          color: "white",
                                          fontFamily: "sans-serif",
                                          fontSize: "16px",
                                          fontWeight: 550,
                                          textTransform: "none",
                                        }}
                                        variant="body1"
                                      >
                                        Follow
                                      </Typography>
                                    )}
                                  </Button>
                                </div>
                              </ListItemButton>
                            </ListItem>
                            <Divider />
                          </div>
                        );
                      }
                    )}
                  </List>
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
