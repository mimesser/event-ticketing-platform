import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AppBar from "@mui/material/AppBar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Container from "@mui/material/Container";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Divider from "@mui/material/Divider";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import LoadingButton from "@mui/lab/LoadingButton";
import LockIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Modal from "@mui/material/Modal";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import NightlightIcon from "@mui/icons-material/Nightlight";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Popover from "@mui/material/Popover";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import SettingsIcon from "@mui/icons-material/Settings";
import Snackbar from "@mui/material/Snackbar";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import TwitterIcon from "@mui/icons-material/Twitter";
import useMediaQuery from "@mui/material/useMediaQuery";
import Avatar from "components/Avatar";
import Drawer from "components/Drawer";
import { differenceInCalendarDays, formatDistance } from "date-fns";
import Colors from "lib/colors";
import { fetchPublicUser } from "lib/hooks";
import { useUserInfo } from "lib/user-context";
import { magic } from "lib/magic";
import {
  isTest,
  mockTestTwitterUsername,
  shortenAddress,
  shortenText,
} from "lib/utils";
import { useNotifications } from "lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "styles/components/Header.module.scss";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Header({
  urlWithSignature,
}: {
  urlWithSignature: string;
}) {
  var dateUTC = new Date(
    new Date().getTime() + new Date().getTimezoneOffset() * 60000
  );

  const { theme, resolvedTheme, setTheme } = useTheme();
  const { user } = useUserInfo();
  const isMobile = useMediaQuery("(max-width:899px)");
  const router = useRouter();

  const [events] = useState(router.asPath.includes("/events") ? true : false);
  const [showCreateEvent] = React.useState(
    router.pathname === "/events/create" ? true : false
  );

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

  const drawerWidth = events ? 340 : 240;

  const [anchorElNotification, setAnchorElNotification] =
    React.useState<HTMLButtonElement | null>(null);
  const handleOpenNotification = (event: any) => {
    setAnchorElNotification(event.currentTarget);
  };
  const handleCloseNotification = () => {
    setAnchorElNotification(null);
  };
  const [buyOpen, setBuyOpen] = useState(false);
  const [moonPayModal, setMoonPayModal] = useState(false);

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [selectedMenu, setSelectedMenu] = React.useState("");
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
    setSelectedMenu("");
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const [logoutModal, setLogoutModal] = useState(false);
  const [twitterModal, setTwitterModal] = useState(false);
  const [privacyModal, setPrivacyModal] = useState(false);
  const [showWalletAddress, setShowWalletAddress] = useState(
    user?.showWalletAddress
  );

  const [successSnackShow, setSuccessSnackShow] = useState(false);
  const [errorSnackShow, setErrorSnackShow] = useState(false);

  async function handleShowWalletAddress() {
    try {
      const res = await fetch("/api/show-wallet", {
        method: "POST",
      });

      if (res.status === 200) {
        setShowWalletAddress(!showWalletAddress);
        setSuccessSnackShow(true);
      } else {
        setErrorSnackShow(true);
      }
    } catch (error) {
      setErrorSnackShow(true);
    }
  }

  const buyModal = () => {
    setBuyOpen(true);
    setMoonPayModal(true);
  };

  const modalClose = () => {
    setBuyOpen(false);
    setMoonPayModal(false);
  };

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

  const [signingIn, setSigningIn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit: any = async ({ email }: { email: any }) => {
    setSigningIn(true);

    try {
      const userExists = (
        await (
          await fetch("/api/signup", {
            method: "POST",
            body: JSON.stringify({
              email,
            }),
          })
        ).json()
      ).user
        ? true
        : false;

      const redirectURI = `${window.location.origin}/callback${router.asPath}/${email}/${userExists}`;

      const didToken = await magic?.auth.loginWithMagicLink({
        email,
        redirectURI,
      });

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + didToken,
        },
        body: JSON.stringify({ email }),
      });

      if (res.status === 200) {
        // redirect
        router.reload();
        setSigningIn(false);
      } else {
        // display an error
        setSigningIn(false);
      }
    } catch (error) {
      setSigningIn(false);
    }
  };

  const [darkMode, setDarkMode] = React.useState(theme);
  const changeDarkMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const mode = event.target.value;
    setDarkMode(mode);
    setTheme(mode);
  };

  return (
    <>
      {/* Buy crypto modal */}
      <Modal
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        onClose={modalClose}
        open={buyOpen}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
      >
        <Box sx={modalStyle}>
          <div className={styles.modal_box}>
            <IconButton
              id="header_crypto_modal_close"
              aria-label="close"
              onClick={modalClose}
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
            {moonPayModal && (
              <div style={{ height: "60vh", margin: "12px" }}>
                <iframe
                  allow="accelerometer; autoplay; camera; gyroscope; payment"
                  frameBorder="0"
                  height="100%"
                  id="moonPayFrame"
                  src={urlWithSignature}
                  width="100%"
                >
                  <p>Your browser does not support iframes.</p>
                </iframe>
              </div>
            )}
          </div>
        </Box>
      </Modal>
      {/* Log out modal */}
      <Modal
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        onClose={() => {
          setLogoutModal(false);
        }}
        open={logoutModal}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
      >
        <Box sx={modalStyle}>
          <div className={styles.modal_box}>
            <div className={styles.modal_body}>
              <Image
                src={"/logo-" + resolvedTheme + ".png"}
                width={isMobile ? 45 : 90}
                height={isMobile ? 45 : 90}
                alt={`Impish icon`}
              />
              <Typography
                id={styles.h5}
                variant="h4"
                sx={{
                  marginBottom: "-2rem",
                }}
              >
                Log out of Impish?
              </Typography>
              <Box className={styles.linkSocialButtons}>
                <Typography id={styles.body1} variant="body1">
                  You can always log back in at any time.
                </Typography>
                <Button
                  id={styles.logoutButton}
                  onClick={async () => {
                    await fetch("/api/logout");
                    router.reload();
                  }}
                  type="submit"
                  size="large"
                  variant="outlined"
                >
                  Log out
                </Button>
                <Button
                  onClick={() => {
                    setLogoutModal(false);
                  }}
                  id={styles.cancelButton}
                  type="submit"
                  color="primary"
                  size="large"
                  variant="outlined"
                  sx={{
                    color: Colors[resolvedTheme].primary,
                    borderColor: Colors[resolvedTheme].cancel_border,
                  }}
                >
                  Cancel
                </Button>
              </Box>
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
              id="header_twitter_modal_close"
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
                    id={styles.twtButton}
                    type="submit"
                    size="large"
                    variant="outlined"
                    sx={{
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
      {/* Privacy modal */}
      <Modal
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        onClose={() => {
          setPrivacyModal(false);
        }}
        open={privacyModal}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
      >
        <Box sx={modalStyle}>
          <div className={styles.modal_box}>
            <IconButton
              aria-label="close"
              onClick={() => {
                setPrivacyModal(false);
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
            <div className={styles.modal_body}>
              <Typography id={styles.h5} variant="h5">
                Privacy
              </Typography>
              <Box className={styles.linkSocialButtons}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showWalletAddress}
                        onChange={() => {
                          handleShowWalletAddress();
                        }}
                        sx={{
                          "&& .MuiSwitch-switchBase:hover": {
                            backgroundColor: Colors[resolvedTheme].hover,
                          },
                        }}
                      />
                    }
                    label="Show Wallet Address"
                  />
                </FormGroup>
              </Box>
            </div>
          </div>
        </Box>
      </Modal>

      <Snackbar
        open={successSnackShow}
        autoHideDuration={1000}
        onClose={() => setSuccessSnackShow(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Privacy settings updated!
        </Alert>
      </Snackbar>
      <Snackbar
        open={errorSnackShow}
        autoHideDuration={1000}
        onClose={() => setErrorSnackShow(false)}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          Error updating privacy settings!
        </Alert>
      </Snackbar>
      <AppBar
        position="fixed"
        sx={
          !showCreateEvent
            ? {
                bgcolor: Colors[resolvedTheme].header_bg,
                borderBottom: Colors[resolvedTheme].border,
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }
            : {
                bgcolor: Colors[resolvedTheme].drawer_bg,
                boxShadow: "none",
              }
        }
      >
        <Container maxWidth={false}>
          <Toolbar disableGutters>
            <Box
              component="div"
              sx={{
                whiteSpace: "nowrap",
                mr: 0,
                variant: "h6",
                display:
                  !events && router.asPath === "/"
                    ? { xs: "none", md: "flex" }
                    : { xs: "flex", md: "flex", sm: "flex" },
                ":hover": {
                  borderRadius: (theme) => Number(theme.shape.borderRadius) * 2,
                  background: Colors[resolvedTheme].hover,
                },
              }}
            >
              <IconButton edge="start" size="small">
                <Link href="/">
                  <a>
                    <Image
                      src={"/icons/impish.svg"}
                      width={45}
                      height={32}
                      alt={`Impish icon`}
                    />
                  </a>
                </Link>
              </IconButton>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
              }}
            >
              <IconButton
                size="large"
                onClick={handleDrawerToggle}
                sx={{
                  color: (theme) =>
                    mobileOpen
                      ? theme.palette.primary.main
                      : Colors[resolvedTheme].primary,
                  ":hover": {
                    backgroundColor: Colors[resolvedTheme].hover,
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: !events
                  ? { xs: "none", md: "flex" }
                  : { xs: "none", md: "flex", sm: "flex" },
              }}
            ></Box>
            {user ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Notifications">
                  <IconButton
                    id="notifications_menu"
                    size="large"
                    onClick={handleOpenNotification}
                    sx={{
                      color: (theme) =>
                        anchorElNotification
                          ? theme.palette.primary.main
                          : Colors[resolvedTheme].primary,
                      ":hover": {
                        backgroundColor: Colors[resolvedTheme].hover,
                      },
                    }}
                  >
                    <Badge
                      badgeContent={totalUnread}
                      invisible={totalUnread == 0}
                      color="error"
                    >
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>

                <Tooltip title="Buy Crypto">
                  <IconButton
                    size="large"
                    sx={{
                      color: (theme) =>
                        buyOpen
                          ? theme.palette.primary.main
                          : Colors[resolvedTheme].primary,
                      ":hover": {
                        backgroundColor: Colors[resolvedTheme].hover,
                      },
                    }}
                    onClick={buyModal}
                  >
                    <CreditCardIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Account">
                  <IconButton
                    size="large"
                    sx={{
                      color: (theme) =>
                        anchorElUser
                          ? theme.palette.primary.main
                          : Colors[resolvedTheme].primary,
                      ":hover": {
                        backgroundColor: Colors[resolvedTheme].hover,
                      },
                    }}
                    onClick={handleOpenUserMenu}
                  >
                    <AccountCircleIcon />
                  </IconButton>
                </Tooltip>

                <Popover
                  open={Boolean(anchorElNotification)}
                  anchorEl={anchorElNotification}
                  onClose={handleCloseNotification}
                  sx={{
                    mt: "45px",
                  }}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  PaperProps={{
                    sx: {
                      borderRadius: (theme) => theme.shape.borderRadius,
                      width: 330,
                      bgcolor: Colors[resolvedTheme].header_bg,
                      color: Colors[resolvedTheme].primary,
                    },
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
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
                  <Divider
                    sx={{ borderBottom: Colors[resolvedTheme].border }}
                  />
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

                                    notificationType === "Matic" && buyModal();
                                  }}
                                  sx={{
                                    ...(!isRead && {
                                      backgroundColor:
                                        Colors[resolvedTheme]
                                          .selected_notification,
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
                                      backgroundColor:
                                        Colors[resolvedTheme].hover,
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
                                          { addSuffix: true }
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
                            differenceInCalendarDays(
                              new Date(createdAt),
                              dateUTC
                            ) < -1 ||
                            isRead
                          ) {
                            return (
                              <MenuItem
                                onClick={() => {
                                  goToFollower(followerUserId);
                                  markNotificationAsRead([id]);

                                  notificationType === "Twitter" &&
                                    setTwitterModal(true);

                                  notificationType === "Matic" && buyModal();
                                }}
                                sx={{
                                  ...(!isRead && {
                                    backgroundColor:
                                      Colors[resolvedTheme]
                                        .selected_notification,
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
                                    backgroundColor:
                                      Colors[resolvedTheme].hover,
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
                                          color:
                                            Colors[resolvedTheme].secondary,
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
                                        { addSuffix: true }
                                      )}
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
                  <Divider
                    sx={{ borderBottom: Colors[resolvedTheme].border }}
                  />
                  <Box sx={{ p: 1 }}>
                    <Button
                      sx={{
                        borderRadius: (theme) => theme.shape.borderRadius,
                        textTransform: "none",
                      }}
                      fullWidth
                    >
                      View All
                    </Button>
                  </Box>
                </Popover>
                {selectedMenu === "" ? (
                  <Menu
                    sx={{ mt: "45px" }}
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    PaperProps={{
                      sx: {
                        borderRadius: (theme) => theme.shape.borderRadius,
                        width: 250,
                        bgcolor: Colors[resolvedTheme].header_bg,
                        color: Colors[resolvedTheme].primary,
                        boxShadow: Colors[resolvedTheme].account_menu_shadow,
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        router.push(
                          "/" + (user.username || user.walletAddress)
                        );
                      }}
                      sx={{
                        margin: "10px",
                        padding: "5px",
                        borderRadius: "10px",
                        ":hover": {
                          backgroundColor: Colors[resolvedTheme].hover,
                        },
                      }}
                    >
                      <ListItemIcon
                        style={{ borderRadius: "50%", overflow: "hidden" }}
                      >
                        <Avatar
                          avatarImage={user?.avatarImage}
                          walletAddress={user?.walletAddress}
                          size={48}
                        />
                      </ListItemIcon>
                      <div style={{ marginLeft: "15px" }}>
                        <div style={{ color: Colors[resolvedTheme].primary }}>
                          {shortenText(user.name, 18) ||
                            shortenAddress(user.walletAddress)}
                        </div>
                        <div
                          style={{ color: Colors[resolvedTheme].secondary }}
                        >{`See your profile`}</div>
                      </div>
                    </MenuItem>

                    <Divider
                      sx={{
                        borderColor: Colors[resolvedTheme].divider,
                        margin: "5px 16px",
                      }}
                    />

                    <MenuItem
                      id="settings_menu"
                      onClick={() => setSelectedMenu("settings")}
                      className={styles.menu_items}
                      sx={{
                        ":hover": {
                          backgroundColor: Colors[resolvedTheme].hover,
                        },
                      }}
                    >
                      <ListItemIcon>
                        <SettingsIcon
                          sx={{ color: Colors[resolvedTheme].primary }}
                        />
                      </ListItemIcon>
                      <span>{`Settings & privacy`}</span>
                      <ArrowForwardIosIcon style={{ marginLeft: "12%" }} />
                    </MenuItem>
                    <MenuItem
                      id="display_menu_item"
                      onClick={() => setSelectedMenu("display")}
                      className={styles.menu_items}
                      sx={{
                        ":hover": {
                          backgroundColor: Colors[resolvedTheme].hover,
                        },
                      }}
                    >
                      <ListItemIcon>
                        <NightlightIcon
                          sx={{ color: Colors[resolvedTheme].primary }}
                        />
                      </ListItemIcon>
                      <span>Display</span>
                      <ArrowForwardIosIcon style={{ marginLeft: "49%" }} />
                    </MenuItem>
                    <MenuItem
                      id="open_logout_modal"
                      onClick={() => {
                        handleCloseUserMenu();
                        setLogoutModal(true);
                      }}
                      className={styles.menu_items}
                      sx={{
                        ":hover": {
                          backgroundColor: Colors[resolvedTheme].hover,
                        },
                      }}
                    >
                      <ListItemIcon>
                        <LogoutIcon
                          sx={{ color: Colors[resolvedTheme].primary }}
                        />
                      </ListItemIcon>
                      <div>Log Out</div>
                    </MenuItem>
                  </Menu>
                ) : selectedMenu === "settings" ? (
                  <Menu
                    sx={{ mt: "45px" }}
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    PaperProps={{
                      sx: {
                        borderRadius: (theme) => theme.shape.borderRadius,
                        width: 250,
                        bgcolor: Colors[resolvedTheme].header_bg,
                        color: Colors[resolvedTheme].primary,
                        boxShadow: Colors[resolvedTheme].account_menu_shadow,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        marginBottom: "5px",
                      }}
                    >
                      <IconButton
                        onClick={() => {
                          setSelectedMenu("");
                        }}
                        sx={{
                          color: Colors[resolvedTheme].primary,
                          margin: "0 5px",
                          alignContent: "center",
                          ":hover": {
                            backgroundColor: Colors[resolvedTheme].hover,
                          },
                        }}
                      >
                        <ArrowBackIosIcon sx={{ marginLeft: "5px" }} />
                      </IconButton>
                      {`Settings & privacy`}
                    </Typography>
                    <MenuItem
                      onClick={handleCloseUserMenu}
                      className={styles.menu_items}
                      sx={{
                        ":hover": {
                          backgroundColor: Colors[resolvedTheme].hover,
                        },
                      }}
                    >
                      <ListItemIcon>
                        <SettingsIcon
                          sx={{ color: Colors[resolvedTheme].primary }}
                        />
                      </ListItemIcon>
                      <Link href="https://reveal.magic.link/impish">
                        <a target="_blank" rel="noreferrer">
                          Export Private Key
                        </a>
                      </Link>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleCloseUserMenu();
                        setPrivacyModal(true);
                      }}
                      className={styles.menu_items}
                      sx={{
                        ":hover": {
                          backgroundColor: Colors[resolvedTheme].hover,
                        },
                      }}
                    >
                      <ListItemIcon>
                        <LockIcon
                          sx={{ color: Colors[resolvedTheme].primary }}
                        />
                      </ListItemIcon>
                      Privacy
                    </MenuItem>
                    <MenuItem
                      id="link_twitter_button"
                      onClick={() => {
                        handleCloseUserMenu();
                        setTwitterModal(true);
                      }}
                      className={styles.menu_items}
                      sx={{
                        color: "rgb(29, 161, 242)",
                        ":hover": {
                          backgroundColor: Colors[resolvedTheme].hover,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: "inherit" }}>
                        <TwitterIcon style={{ marginRight: "5px" }} />
                      </ListItemIcon>

                      <div>
                        {!user.twitterUsername ? (
                          "Link Twitter"
                        ) : (
                          <div style={{ color: "red" }}>Unlink Twitter</div>
                        )}
                      </div>
                    </MenuItem>
                  </Menu>
                ) : selectedMenu === "display" ? (
                  <Menu
                    sx={{ mt: "45px" }}
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    PaperProps={{
                      sx: {
                        borderRadius: (theme) => theme.shape.borderRadius,
                        width: 250,
                        bgcolor: Colors[resolvedTheme].header_bg,
                        color: Colors[resolvedTheme].primary,
                        boxShadow: Colors[resolvedTheme].account_menu_shadow,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        marginBottom: "5px",
                      }}
                    >
                      <IconButton
                        onClick={() => {
                          setSelectedMenu("");
                        }}
                        sx={{
                          color: Colors[resolvedTheme].primary,
                          margin: "0 5px",
                          alignContent: "center",
                          ":hover": {
                            backgroundColor: Colors[resolvedTheme].hover,
                          },
                        }}
                      >
                        <ArrowBackIosIcon sx={{ marginLeft: "5px" }} />
                      </IconButton>
                      Display
                    </Typography>
                    <FormControl style={{ padding: "6px 16px" }}>
                      <FormLabel
                        id="dark-mode-group"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          color: Colors[resolvedTheme].primary,
                        }}
                      >
                        <NightlightIcon />
                        <Typography
                          style={{ marginLeft: 7, fontWeight: "bold" }}
                        >
                          Dark Mode
                        </Typography>
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby="dark-mode-group"
                        name="darkMode"
                        value={darkMode}
                        onChange={changeDarkMode}
                        style={{ marginTop: 10, marginLeft: 10, width: 180 }}
                      >
                        <FormControlLabel
                          id="system_mode"
                          value="system"
                          control={
                            <Radio
                              style={{ padding: 3 }}
                              sx={{
                                "&": { color: Colors[resolvedTheme].primary },
                              }}
                            />
                          }
                          label="System"
                          labelPlacement="start"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        />
                        <FormControlLabel
                          id="light_mode"
                          value="light"
                          control={
                            <Radio
                              style={{ padding: 3 }}
                              sx={{
                                "&": { color: Colors[resolvedTheme].primary },
                              }}
                            />
                          }
                          label="Off"
                          labelPlacement="start"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        />
                        <FormControlLabel
                          id="dark_mode"
                          value="dark"
                          control={
                            <Radio
                              style={{ padding: 3 }}
                              sx={{
                                "&": { color: Colors[resolvedTheme].primary },
                              }}
                            />
                          }
                          label="On"
                          labelPlacement="start"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Menu>
                ) : null}
              </Box>
            ) : (
              <Box sx={{ flexGrow: 0 }}>
                <div>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={styles.login_items}
                  >
                    <TextField
                      label="Email address"
                      variant="outlined"
                      autoComplete="email"
                      autoFocus
                      {...register("email", {
                        required: "Required field",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                          message: "Invalid email address",
                        },
                      })}
                      error={!!errors?.email}
                      helperText={errors?.email ? errors.email.message : null}
                      size="small"
                      sx={(theme) => ({
                        "&& .MuiFormHelperText-root": {
                          fontSize: "0.60rem",
                          position: "absolute",
                          marginTop: "38px",
                          [theme.breakpoints.down("md")]: {
                            marginTop: "36px",
                          },
                        },
                        input: { color: Colors[resolvedTheme].primary },
                        label: { color: Colors[resolvedTheme].secondary },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: Colors[resolvedTheme].input_border,
                          },
                          "&:hover fieldset": {
                            borderColor: (theme) => theme.palette.primary.main,
                          },
                        },
                      })}
                    />
                    <LoadingButton
                      loading={signingIn}
                      sx={(theme) => ({
                        [theme.breakpoints.down("md")]: {
                          height: "36px",
                          fontSize: "10px",
                          padding: "8px 5px",
                        },
                      })}
                      type="submit"
                      size="large"
                      variant="contained"
                    >
                      Log in / Sign up
                    </LoadingButton>
                  </form>
                </div>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          drawerOpen={mobileOpen}
          onClose={handleDrawerToggle}
        />
      </Box>
    </>
  );
}
