import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Layout from "components/Layout";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "components/Avatar";
import { useRouter } from "next/router";
import { getLoginSession } from "lib/auth";
import Colors from "lib/colors";
import { fetchPublicUser } from "lib/hooks";
import prisma from "lib/prisma";
import { useUserInfo } from "lib/user-context";
import { shortenAddress } from "lib/utils";
import React from "react";
import styles from "styles/pages/View.module.scss";
import { useTheme } from "next-themes";

function View({ data, query }: { data: any; query: any }) {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const { username } = router.query;
  const currentUser = useUserInfo();
  const [user, setUser] = React.useState<any>(null);

  const [unfollowModal, setUnFollowModal] = React.useState({
    id: "false",
    username: "",
    walletAddress: "",
  });

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
          router.replace(
            {
              pathname: "/[username]/[view]",
              query: { username: username, view: props.label.toLowerCase() },
            },
            undefined,
            { shallow: true }
          );
          event.preventDefault();
        }}
        {...props}
      />
    );
  }

  async function unfollowUser(id: string) {
    try {
      const res = await fetch("/api/follow", {
        method: "DELETE",
        body: JSON.stringify({
          follow: [id],
        }),
      });

      if (res.status === 200) {
        const removeIndex = currentUser.user.following.findIndex(
          (m: any) => m.followersId === id
        );
        currentUser.user.following.splice(removeIndex, 1);
        setUnFollowModal({ id: "false", username: "", walletAddress: "" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function followUser(id: string) {
    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        body: JSON.stringify({
          follow: [id],
        }),
      });

      if (res.status === 200) {
        currentUser.user.following.push({
          followersId: id,
          followingId: currentUser.user.id,
        });
        setUnFollowModal({ id: "false", username: "", walletAddress: "" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 320,
    bgcolor: Colors[resolvedTheme]?.header_bg,
    borderRadius: "25px",
    boxShadow: 24,
    p: 4,
  };

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
                  color: Colors[resolvedTheme].primary,
                  ":hover": {
                    backgroundColor: Colors[resolvedTheme].hover,
                  },
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
                  <div
                    className={styles.username}
                    style={{ color: Colors[resolvedTheme].secondary }}
                  >{`@${user.username}`}</div>
                )}

                {!user.username && (
                  <div
                    className={styles.address}
                    style={{ color: Colors[resolvedTheme].secondary }}
                  >
                    {shortenAddress(user.walletAddress)}
                  </div>
                )}
              </div>
            </Grid>
          </Grid>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: Colors[resolvedTheme].tab_divider,
              width: "100%",
            }}
          >
            <Tabs
              sx={{
                "&& .MuiTab-root": {
                  color: Colors[resolvedTheme].secondary,
                  ":hover": {
                    backgroundColor: Colors[resolvedTheme].tab_hover,
                  },
                },
                "&& .Mui-selected": {
                  "&, & .MuiListItemText-root": {
                    color: Colors[resolvedTheme].primary,
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
              <LinkTab id="followers_tab" label="Followers" disableRipple />
              <LinkTab id="following_tab" label="Following" disableRipple />
            </Tabs>
          </Box>
          <Box>
            <TabPanel value={value} index={0}>
              {data?.followers.length === 0 && (
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
                      sx={{ color: Colors[resolvedTheme].secondary }}
                    >
                      When someone follows them, they’ll be listed here.
                    </Typography>
                  </Grid>
                </Box>
              )}
              {data?.followers.length !== 0 && (
                <Box sx={{ p: 4, pt: 0 }}>
                  <List className={styles.followList}>
                    {data?.followers.map(
                      ({
                        id,
                        avatarImage,
                        name,
                        username,
                        walletAddress,
                      }: any) => {
                        return (
                          <div key={id}>
                            <ListItem
                              id={styles.followItem}
                              disablePadding
                              sx={{
                                ":hover": {
                                  backgroundColor: Colors[resolvedTheme].hover,
                                },
                              }}
                            >
                              <ListItemButton
                                onClick={() =>
                                  router.push(
                                    `/${username ? username : walletAddress}`
                                  )
                                }
                              >
                                <Avatar
                                  avatarImage={avatarImage}
                                  walletAddress={user?.walletAddress}
                                  size={50}
                                  id={styles.profilePhoto}
                                />
                                <div className={styles.followItemDetails}>
                                  {name && <p>{name}</p>}
                                  {name && username && (
                                    <a
                                      style={{
                                        color: Colors[resolvedTheme].secondary,
                                      }}
                                    >{` @${username}`}</a>
                                  )}
                                  {!name && username && (
                                    <p
                                      style={{
                                        color: Colors[resolvedTheme].secondary,
                                      }}
                                    >{` @${username}`}</p>
                                  )}
                                  {!username && !name && (
                                    <p
                                      style={{
                                        color: Colors[resolvedTheme].secondary,
                                      }}
                                    >
                                      {shortenAddress(walletAddress)}
                                    </p>
                                  )}
                                  {!username && name && (
                                    <a
                                      style={{
                                        color: Colors[resolvedTheme].secondary,
                                      }}
                                    >
                                      {shortenAddress(walletAddress)}
                                    </a>
                                  )}
                                </div>
                                <div className={styles.follow_button}>
                                  {id !== currentUser.user?.id && (
                                    <>
                                      {!currentUser.user?.following
                                        .map((m: any) => m.followersId)
                                        .find((x: any) => x === id) && (
                                        <Button
                                          onClick={(e) => {
                                            followUser(id);
                                            e.stopPropagation();
                                          }}
                                          variant={"contained"}
                                          sx={(theme) => ({
                                            ":hover": {
                                              backgroundColor: "black",
                                            },
                                            backgroundColor:
                                              Colors[resolvedTheme].follow_btn,
                                            borderColor: "black",
                                            borderRadius:
                                              theme.shape.borderRadius,
                                            margin: theme.spacing(1),
                                            fontFamily: "sans-serif",
                                            fontSize: "16px",
                                            fontWeight: 550,
                                            textTransform: "none",
                                          })}
                                        >
                                          Follow
                                        </Button>
                                      )}

                                      {currentUser.user?.following
                                        .map((m: any) => m.followersId)
                                        .find((x: any) => x === id) && (
                                        <Button
                                          onClick={(e) => {
                                            setUnFollowModal({
                                              id: id,
                                              username: username,
                                              walletAddress: walletAddress,
                                            });
                                            e.stopPropagation();
                                          }}
                                          variant={"outlined"}
                                          sx={(theme) => ({
                                            width: "6.5em",
                                            color:
                                              Colors[resolvedTheme].primary,
                                            backgroundColor: "inherit",
                                            borderColor:
                                              Colors[resolvedTheme].primary,
                                            borderRadius:
                                              theme.shape.borderRadius,
                                            margin: theme.spacing(1),
                                            fontFamily: "sans-serif",
                                            fontSize: "16px",
                                            fontWeight: 550,
                                            textTransform: "none",
                                            transitionDuration: "unset",
                                            ":hover": {
                                              borderColor: "red",
                                            },
                                            ":hover span": {
                                              display: "none",
                                            },
                                            ":hover:before": {
                                              color: "red",
                                              content: "'Unfollow'",
                                            },
                                          })}
                                        >
                                          <span>Following</span>
                                        </Button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </ListItemButton>
                            </ListItem>
                          </div>
                        );
                      }
                    )}
                  </List>
                </Box>
              )}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {data?.following.length === 0 && (
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
                      sx={{ color: Colors[resolvedTheme].secondary }}
                    >
                      When they do, they’ll be listed here.
                    </Typography>
                  </Grid>
                </Box>
              )}
              {data?.following.length !== 0 && (
                <Box sx={{ p: 4, pt: 0 }}>
                  <List className={styles.followList}>
                    {data?.following.map(
                      ({
                        id,
                        avatarImage,
                        name,
                        username,
                        walletAddress,
                      }: any) => {
                        return (
                          <div key={id}>
                            <ListItem
                              id={styles.followItem}
                              disablePadding
                              sx={{
                                ":hover": {
                                  backgroundColor: Colors[resolvedTheme].hover,
                                },
                              }}
                            >
                              <ListItemButton
                                onClick={() =>
                                  router.push(
                                    `/${username ? username : walletAddress}`
                                  )
                                }
                              >
                                <Avatar
                                  avatarImage={avatarImage}
                                  walletAddress={user?.walletAddress}
                                  size={50}
                                  id={styles.profilePhoto}
                                />
                                <div className={styles.followItemDetails}>
                                  {name && <p>{name}</p>}
                                  {name && username && (
                                    <a
                                      style={{
                                        color: Colors[resolvedTheme].secondary,
                                      }}
                                    >{` @${username}`}</a>
                                  )}
                                  {!name && username && (
                                    <p
                                      style={{
                                        color: Colors[resolvedTheme].secondary,
                                      }}
                                    >{` @${username}`}</p>
                                  )}
                                  {!username && !name && (
                                    <p
                                      style={{
                                        color: Colors[resolvedTheme].secondary,
                                      }}
                                    >
                                      {shortenAddress(walletAddress)}
                                    </p>
                                  )}
                                  {!username && name && (
                                    <a
                                      style={{
                                        color: Colors[resolvedTheme].secondary,
                                      }}
                                    >
                                      {shortenAddress(walletAddress)}
                                    </a>
                                  )}
                                </div>
                                <div className={styles.follow_button}>
                                  {id !== currentUser.user?.id && (
                                    <>
                                      {!currentUser.user?.following
                                        .map((m: any) => m.followersId)
                                        .find((x: any) => x === id) && (
                                        <Button
                                          onClick={(e) => {
                                            followUser(id);
                                            e.stopPropagation();
                                          }}
                                          variant={"contained"}
                                          sx={(theme) => ({
                                            ":hover": {
                                              backgroundColor: "black",
                                            },
                                            backgroundColor:
                                              Colors[resolvedTheme].follow_btn,
                                            borderColor: "black",
                                            borderRadius:
                                              theme.shape.borderRadius,
                                            margin: theme.spacing(1),
                                            fontFamily: "sans-serif",
                                            fontSize: "16px",
                                            fontWeight: 550,
                                            textTransform: "none",
                                          })}
                                        >
                                          Follow
                                        </Button>
                                      )}

                                      {currentUser.user?.following
                                        .map((m: any) => m.followersId)
                                        .find((x: any) => x === id) && (
                                        <Button
                                          onClick={(e) => {
                                            setUnFollowModal({
                                              id: id,
                                              username: username,
                                              walletAddress: walletAddress,
                                            });
                                            e.stopPropagation();
                                          }}
                                          variant={"outlined"}
                                          sx={(theme) => ({
                                            width: "6.5em",
                                            color:
                                              Colors[resolvedTheme].primary,
                                            backgroundColor: "inherit",
                                            borderColor:
                                              Colors[resolvedTheme].primary,
                                            borderRadius:
                                              theme.shape.borderRadius,
                                            margin: theme.spacing(1),
                                            fontFamily: "sans-serif",
                                            fontSize: "16px",
                                            fontWeight: 550,
                                            textTransform: "none",
                                            transitionDuration: "unset",
                                            ":hover": {
                                              borderColor: "red",
                                            },
                                            ":hover span": {
                                              display: "none",
                                            },
                                            ":hover:before": {
                                              color: "red",
                                              content: "'Unfollow'",
                                            },
                                          })}
                                        >
                                          <span>Following</span>
                                        </Button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </ListItemButton>
                            </ListItem>
                          </div>
                        );
                      }
                    )}
                  </List>
                </Box>
              )}
            </TabPanel>
          </Box>

          {/* unfollow Modal */}
          <Modal
            BackdropProps={{
              timeout: 500,
            }}
            closeAfterTransition
            onClose={() => {
              setUnFollowModal({
                id: "false",
                username: "",
                walletAddress: "",
              });
            }}
            open={unfollowModal.id !== "false" ? true : false}
          >
            <Box sx={modalStyle}>
              <Grid container direction="column">
                <Typography
                  gutterBottom
                  sx={{
                    fontFamily: "sans-serif",
                    fontSize: "18px",
                    fontWeight: 550,
                    textTransform: "none",
                  }}
                  variant="body1"
                >
                  Unfollow
                  {unfollowModal.username
                    ? ` @${unfollowModal.username}`
                    : ` ${shortenAddress(unfollowModal.walletAddress)}`}
                  ?
                </Typography>
                <Typography sx={{ marginBottom: "12px" }} variant="body1">
                  Their activities will no longer show up in your home timeline.
                  You can still view their profile.
                </Typography>

                <Button
                  onClick={() => {
                    unfollowUser(unfollowModal.id);
                  }}
                  size="large"
                  color="inherit"
                  variant="contained"
                  sx={(theme) => ({
                    ":hover": {
                      backgroundColor: "rgb(39, 44, 48)",
                    },

                    backgroundColor: "black",
                    borderRadius: theme.shape.borderRadius,
                    margin: theme.spacing(1),
                  })}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontFamily: "sans-serif",
                      fontSize: "16px",
                      fontWeight: 550,
                      textTransform: "none",
                    }}
                  >
                    Unfollow
                  </Typography>
                </Button>
                <Button
                  size="large"
                  variant="outlined"
                  onClick={() => {
                    setUnFollowModal({
                      id: "false",
                      username: "",
                      walletAddress: "",
                    });
                  }}
                  sx={(theme) => ({
                    color: Colors[resolvedTheme].primary,
                    borderRadius: theme.shape.borderRadius,
                    margin: theme.spacing(1),
                    borderColor: Colors[resolvedTheme].cancel_border,
                  })}
                  color="primary"
                >
                  <Typography
                    sx={{
                      fontFamily: "sans-serif",
                      fontSize: "16px",
                      fontWeight: 550,
                      textTransform: "none",
                    }}
                  >
                    Cancel
                  </Typography>
                </Button>
              </Grid>
            </Box>
          </Modal>
        </Box>
      )}
    </Layout>
  );
}

export default View;

export async function getServerSideProps(context: any) {
  const currentUser = context.params.username;
  const query = context.query;
  const session = await getLoginSession(context.req);

  if (query.view === "followers" || query.view === "following") {
    if (session) {
      let followers: any[] = [];
      let following: any[] = [];

      try {
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ username: currentUser }, { walletAddress: currentUser }],
          },
          select: { id: true, followers: true, following: true },
        });

        const followersIds = user?.followers.map((m: any) => m.followingId);

        followers = await prisma.user.findMany({
          where: {
            id: {
              in: followersIds,
            },
          },
          select: {
            id: true,
            avatarImage: true,
            name: true,
            username: true,
            walletAddress: true,
          },
        });

        followers.filter((m) => {
          if (m.username && !m.showWalletAddress) {
            m.walletAddress = null;
          }
        });

        const followingIds = user?.following.map((m: any) => m.followersId);

        following = await prisma.user.findMany({
          where: {
            id: {
              in: followingIds,
            },
          },
          select: {
            id: true,
            avatarImage: true,
            name: true,
            username: true,
            walletAddress: true,
          },
        });

        following.filter((m) => {
          if (m.username && !m.showWalletAddress) {
            m.walletAddress = null;
          }
        });
      } catch (e) {
        console.log("error fetching tweet following info ", e);
        followers = [];
        following = [];
      }

      return {
        props: {
          data: {
            followers,
            following,
          },
          query: context.query,
        },
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
    return { notFound: true };
  }
}
