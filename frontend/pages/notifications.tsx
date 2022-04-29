import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TwitterIcon from "@mui/icons-material/Twitter";
import Typography from "@mui/material/Typography";
import Colors from "lib/colors";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { fetchPublicUser, useUser } from "lib/hooks";
import Layout from "components/Layout";
import { useRouter } from "next/router";
import { signIn, signOut } from "next-auth/react";
import React, { useState } from "react";
import {
  Divider,
  Grid,
  List,
  ListItemText,
  ListSubheader,
  MenuItem,
  MenuList,
  Tooltip,
} from "@mui/material";
import { useTheme } from "next-themes";
import Avatar from "components/Avatar";
import { differenceInCalendarDays, formatDistance } from "date-fns";
import { useNotifications } from "lib/supabase";
import { isTest, mockTestTwitterUsername, shortenAddress } from "lib/utils";
import styles from "styles/pages/Notifications.module.scss";

function Notifications() {
  const { resolvedTheme } = useTheme();
  const { user } = useUser({
    redirectTo: "/",
  });

  var dateUTC = new Date(
    new Date().getTime() + new Date().getTimezoneOffset() * 60000
  );

  const router = useRouter();

  const { notifications } = useNotifications(user);
  const totalUnread = notifications?.filter((item: any) => !item.isRead).length;
  const newNotificationsLength = notifications?.filter(
    (m: any) =>
      differenceInCalendarDays(new Date(m.createdAt), dateUTC) >= -1 &&
      !m.isRead
  ).length;
  const earlierNotificationsLength = notifications?.filter(
    (m: any) =>
      differenceInCalendarDays(new Date(m.createdAt), dateUTC) < -1 || m.isRead
  ).length;

  const [buyOpen, setBuyOpen] = useState(false);
  const [twitterModal, setTwitterModal] = useState(false);

  const markNotificationAsRead = (notificationIds: Array<any>) => {
    fetch("/api/notifications", {
      method: "DELETE",
      body: JSON.stringify({
        notifications: notificationIds,
      }),
    });
  };

  const goToFollower = (followerUserId: number) => {
    if (followerUserId === null) {
      return;
    } else {
      fetchPublicUser(followerUserId).then((followerUser) => {
        if (followerUser !== null && followerUser.username) {
          router.push("/" + followerUser.username.toLowerCase());
        } else {
          router.push("/" + followerUser.walletAddress);
        }
      });
    }
  };

  async function unlinkUser() {
    if (user) {
      try {
        const res = await fetch("/api/twitter/link-user", {
          method: "DELETE",
        });

        if (res.status === 200) {
          signOut();
        }
      } catch (error) {
        console.log(error);
      }
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

  return user && notifications ? (
    <>
      {/* Buy crypto modal */}
      <Modal
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        onClose={() => {
          setBuyOpen(false);
        }}
        open={buyOpen}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
      >
        <Box sx={modalStyle}>
          <div className={styles.modal_box}>
            <IconButton
              id="notifications_crypto_modal_close"
              aria-label="close"
              onClick={() => {
                setBuyOpen(false);
              }}
              className={styles.close_button}
              sx={{
                ":hover": {
                  backgroundColor: Colors[resolvedTheme].hover,
                },
              }}
            >
              <CloseIcon
                sx={{
                  color: Colors[resolvedTheme].primary,
                }}
              />
            </IconButton>
            <div style={{ height: "60vh", margin: "12px" }}>
              <iframe
                allow="accelerometer; autoplay; camera; gyroscope; payment"
                frameBorder="0"
                height="100%"
                id="moonPayFrame"
                src={user?.moonpayUrl}
                width="100%"
              >
                <p>Your browser does not support iframes.</p>
              </iframe>
            </div>
          </div>
        </Box>
      </Modal>
      {/* Twitter modal */}
      <Modal
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        onClose={() => {
          setTwitterModal(false);
        }}
        open={twitterModal}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
      >
        <Box sx={modalStyle}>
          <div className={styles.modal_box}>
            <IconButton
              id="notifications_twitter_modal_close"
              aria-label="close"
              onClick={() => {
                setTwitterModal(false);
              }}
              className={styles.close_button}
              sx={{
                ":hover": {
                  backgroundColor: Colors[resolvedTheme].hover,
                },
              }}
            >
              <CloseIcon
                sx={{
                  color: Colors[resolvedTheme].primary,
                }}
              />
            </IconButton>
            {!user?.twitterUsername && (
              <div className={styles.modal_body}>
                <Typography id={styles.h5} variant="h5">
                  Find frens you follow on Twitter
                </Typography>
                <Typography id={styles.body1} variant="body1">
                  To get the most of your Web3 adventure, connect with frens on
                  Twitter.
                </Typography>
                <Box className={styles.linkSocialButtons}>
                  <Button
                    onClick={() => {
                      if (!isTest) {
                        localStorage.setItem(
                          `${user.id}/open-twitter-modal`,
                          "true"
                        );
                        signIn("twitter");
                      } else {
                        fetch("/api/twitter/link-user", {
                          method: "POST",
                          body: JSON.stringify({
                            twitterUsername: mockTestTwitterUsername,
                          }),
                        });
                      }
                    }}
                    id="twt_link_unlink_btn"
                    type="submit"
                    size="large"
                    variant="outlined"
                    sx={{
                      color: "white",
                      textTransform: "none",
                      backgroundColor: "rgb(29, 161, 242)",
                      ":hover": {
                        backgroundColor: "rgb(26, 140, 216)",
                      },
                    }}
                    startIcon={<TwitterIcon />}
                  >
                    Find frens I follow
                  </Button>
                </Box>
              </div>
            )}
            {user?.twitterUsername && (
              <div className={styles.modal_body}>
                <Typography id={styles.h5} variant="h5">
                  Unlink Twitter
                </Typography>
                <Typography id={styles.body1} variant="body1">
                  Are you sure you want to unlink Twitter from Impish?
                </Typography>
                <Box>
                  <Button
                    id="twt_link_unlink_btn"
                    sx={{ textTransform: "none", marginTop: "20px" }}
                    onClick={() => unlinkUser()}
                    type="submit"
                    size="large"
                    variant="contained"
                  >
                    Unlink
                  </Button>
                </Box>
              </div>
            )}
          </div>
        </Box>
      </Modal>

      <Layout>
        <Box sx={{ justifyContent: "center", display: "flex" }}>
          <Box
            sx={{
              width: 600,
              bgcolor: Colors[resolvedTheme].header_bg,
              color: Colors[resolvedTheme].primary,
              borderRadius: (theme) => theme.shape.borderRadius,
              mt: 1,
              mb: 1,
            }}
          >
            <Box sx={{ flexGrow: 1, p: 3 }}>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, margin: 0 }}
                  >
                    Notifications
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: Colors[resolvedTheme].secondary }}
                  >
                    You have {totalUnread} unread messages
                  </Typography>
                </Box>
                {totalUnread > 0 && (
                  <Tooltip title="Mark all as read">
                    <IconButton
                      id="mark_notification_as_read"
                      color="primary"
                      onClick={() => {
                        markNotificationAsRead(
                          notifications
                            .filter((m: any) => m.isRead === false)
                            .map((m: any) => m.id)
                        );
                      }}
                      size="large"
                    >
                      <DoneAllIcon
                        color="primary"
                        sx={{
                          fontSize: 18,
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                )}
              </Grid>
            </Box>
            <Divider sx={{ borderBottom: Colors[resolvedTheme].border }} />
            {newNotificationsLength !== 0 && (
              <List
                disablePadding
                subheader={
                  <ListSubheader
                    disableSticky
                    sx={{
                      py: 1,
                      px: 2.5,
                      typography: "overline",
                      fontWeight: 600,
                      color: Colors[resolvedTheme].primary,
                    }}
                  >
                    New
                  </ListSubheader>
                }
              >
                <MenuList>
                  {notifications?.map(
                    ({
                      id,
                      title,
                      description,
                      isRead,
                      createdAt,
                      avatarImage,
                      notificationType,
                      followerUserId,
                    }: any) => {
                      if (
                        differenceInCalendarDays(
                          new Date(createdAt),
                          dateUTC
                        ) >= -1 &&
                        !isRead
                      ) {
                        return (
                          <MenuItem
                            onClick={() => {
                              goToFollower(followerUserId);
                              markNotificationAsRead([id]);

                              notificationType === "Twitter" &&
                                setTwitterModal(true);

                              notificationType === "Matic" && setBuyOpen(true);
                            }}
                            sx={{
                              ...(!isRead && {
                                backgroundColor:
                                  Colors[resolvedTheme].selected_notification,
                              }),
                              borderRadius: "0.75rem",
                              py: 1.5,
                              px: 2.5,
                              mt: "5px",
                              ml: "5px",
                              mx: "5px",
                              display: "flex",
                              alignItems: "center",
                              color: Colors[resolvedTheme].primary,
                              ":hover": {
                                backgroundColor: Colors[resolvedTheme].hover,
                              },
                            }}
                            key={id}
                          >
                            <Avatar
                              avatarImage={avatarImage}
                              walletAddress={title}
                              size={40}
                              rounded={false}
                              style={{
                                marginRight: 20,
                              }}
                            />
                            <ListItemText
                              primary={
                                <Typography
                                  whiteSpace="normal"
                                  sx={{
                                    width: "240px",
                                    overflowWrap: "break-word",
                                  }}
                                >
                                  {title && (
                                    <b>
                                      {shortenAddress(title as string)}
                                      &nbsp;
                                    </b>
                                  )}
                                  {description}
                                </Typography>
                              }
                              secondary={
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontWeight: 550,
                                    mt: 0.5,
                                    display: "flex",
                                    alignItems: "center",
                                    color: (theme) =>
                                      theme.palette.primary.main,
                                  }}
                                >
                                  <AccessTimeIcon
                                    sx={{
                                      mr: 0.5,
                                      width: 16,
                                      height: 16,
                                    }}
                                  />
                                  {formatDistance(
                                    new Date(createdAt),
                                    dateUTC,
                                    {
                                      addSuffix: true,
                                    }
                                  )}
                                </Typography>
                              }
                            />
                          </MenuItem>
                        );
                      }
                    }
                  )}
                </MenuList>
              </List>
            )}
            {earlierNotificationsLength !== 0 && (
              <List
                disablePadding
                subheader={
                  <ListSubheader
                    disableSticky
                    sx={{
                      py: 1,
                      px: 2.5,
                      typography: "overline",
                      fontWeight: 600,
                      color: Colors[resolvedTheme].primary,
                    }}
                  >
                    EARLIER
                  </ListSubheader>
                }
              >
                {notifications?.map(
                  ({
                    id,
                    title,
                    description,
                    isRead,
                    createdAt,
                    avatarImage,
                    notificationType,
                    followerUserId,
                  }: any) => {
                    if (
                      differenceInCalendarDays(new Date(createdAt), dateUTC) <
                        -1 ||
                      isRead
                    ) {
                      return (
                        <MenuItem
                          onClick={() => {
                            goToFollower(followerUserId);
                            markNotificationAsRead([id]);

                            notificationType === "Twitter" &&
                              setTwitterModal(true);

                            notificationType === "Matic" && setBuyOpen(true);
                          }}
                          sx={{
                            ...(!isRead && {
                              backgroundColor:
                                Colors[resolvedTheme].selected_notification,
                            }),
                            borderRadius: "0.75rem",
                            py: 1.5,
                            px: 2.5,
                            mb: 0.5,
                            mt: "5px",
                            ml: "5px",
                            mx: "5px",
                            display: "flex",
                            alignItems: "center",
                            color: Colors[resolvedTheme].primary,
                            ":hover": {
                              backgroundColor: Colors[resolvedTheme].hover,
                            },
                          }}
                          key={id}
                        >
                          <Avatar
                            avatarImage={avatarImage}
                            walletAddress={title}
                            size={40}
                            rounded={false}
                            style={{
                              marginRight: 20,
                            }}
                          />
                          <ListItemText
                            primary={
                              <Typography
                                whiteSpace="normal"
                                sx={{
                                  width: "240px",
                                  overflowWrap: "break-word",
                                  ...(isRead && {
                                    color: Colors[resolvedTheme].secondary,
                                  }),
                                }}
                              >
                                {title && (
                                  <b>
                                    {shortenAddress(title as string)}
                                    &nbsp;
                                  </b>
                                )}
                                {description}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 550,
                                  mt: 0.5,
                                  display: "flex",
                                  alignItems: "center",
                                  color: (theme) => theme.palette.primary.main,
                                }}
                              >
                                <AccessTimeIcon
                                  sx={{
                                    mr: 0.5,
                                    width: 16,
                                    height: 16,
                                  }}
                                />
                                {formatDistance(new Date(createdAt), dateUTC, {
                                  addSuffix: true,
                                })}
                              </Typography>
                            }
                          />
                        </MenuItem>
                      );
                    }
                  }
                )}
              </List>
            )}
          </Box>
        </Box>
      </Layout>
    </>
  ) : null;
}

export default Notifications;
