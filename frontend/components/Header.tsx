import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AppBar from "@mui/material/AppBar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarViewMonth from "@mui/icons-material/CalendarViewMonth";
import CloseIcon from "@mui/icons-material/Close";
import Container from "@mui/material/Container";
import Collapse from "@mui/material/Collapse";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Divider from "@mui/material/Divider";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import Drawer from "@mui/material/Drawer";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
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
import Avatar from "boring-avatars";
import { formatDistanceToNow, differenceInCalendarDays } from "date-fns";
import Colors from "lib/colors";
import { useUserInfo } from "lib/user-context";
import { moonPaySrc } from "lib/moon-pay";
import { magic } from "lib/magic";
import { shortenAddress, shortenText } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import React, { useState, useReducer } from "react";
import { useForm } from "react-hook-form";
import styles from "styles/components/Header.module.scss";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Header() {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const { theme, resolvedTheme, setTheme } = useTheme();

  const { user } = useUserInfo();
  const isMobile = useMediaQuery("(max-width:599px)");
  const router = useRouter();
  const [events] = useState(router.asPath.includes("/events") ? true : false);

  const totalUnread = user?.notifications.filter(
    (item: any) => !item.isRead
  ).length;

  const drawerWidth = 240;

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
  const [open, setOpen] = React.useState(false);

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

  const handleClick = () => {
    setOpen(!open);
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
    if (showWalletAddress) {
      setShowWalletAddress(false);
      try {
        const res = await fetch("/api/show-wallet", {
          method: "POST",
          body: JSON.stringify({
            email: user.email,
            showWalletAddress: false,
          }),
        });
        if (res.status === 200) {
          setSuccessSnackShow(true);
        } else {
          setErrorSnackShow(true);
        }
      } catch (error) {
        setErrorSnackShow(true);
        console.log(error);
      }
    }
    if (!showWalletAddress) {
      setShowWalletAddress(true);
      try {
        const res = await fetch("/api/show-wallet", {
          method: "POST",
          body: JSON.stringify({
            email: user.email,
            showWalletAddress: true,
          }),
        });
        if (res.status === 200) {
          setSuccessSnackShow(true);
        } else {
          setErrorSnackShow(true);
        }
      } catch (error) {
        setErrorSnackShow(true);
        console.log(error);
      }
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

  const markNotificationAsRead = async () => {
    const ids = user.notifications
      .filter((m: any) => !m.isRead)
      .map((m: any) => m.id);

    const res = await fetch("/api/notifications", {
      method: "DELETE",
      body: JSON.stringify({
        id: ids,
      }),
    });

    if (res.status === 200) {
      user.notifications.map((m: any) => (m.isRead = true));
      forceUpdate();
    }
  };

  const drawer = user && (
    <>
      <Toolbar />
      {!events ? (
        <List
          sx={{
            "&& .Mui-selected": {
              "&, & .MuiListItemText-root": {
                color: (theme) => theme.palette.primary.main,
              },
            },
            px: 2,
          }}
        >
          <ListItem
            button
            sx={{
              borderRadius: (theme) => theme.shape.borderRadius,
            }}
            style={{
              margin: "0px 0",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: "12px",
            }}
            selected={router.pathname === "/[username]"}
          >
            <div className={styles.account}>
              {user.avatarImage ? (
                <Image
                  src={user.avatarImage}
                  width={32}
                  height={32}
                  alt="Avatar"
                />
              ) : (
                <Avatar
                  size={32}
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
            <Link
              href={`/${encodeURIComponent(
                user.username || user.walletAddress
              )}`}
              passHref
            >
              <ListItemText
                disableTypography
                style={{
                  height: 16,
                  marginLeft: "6%",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textAlign: "left",
                  textOverflow: "ellipsis",
                  width: 16,
                  color: Colors[resolvedTheme].primary,
                }}
              >
                {user.name || shortenAddress(user.walletAddress)}
              </ListItemText>
            </Link>
          </ListItem>
          <Link href="/events" passHref>
            <ListItem
              button
              sx={{
                borderRadius: (theme) => theme.shape.borderRadius,
              }}
              style={{
                margin: "0px 0",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "12px",
              }}
              selected={router.pathname === "/events"}
            >
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <CalendarMonthIcon
                  fontSize="large"
                  sx={{
                    color: Colors[resolvedTheme].primary,
                    width: 32,
                    height: 32,
                  }}
                />
              </ListItemIcon>

              <ListItemText
                disableTypography
                style={{
                  height: 16,
                  marginLeft: "6%",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textAlign: "left",
                  textOverflow: "ellipsis",
                  width: 16,
                  color: Colors[resolvedTheme].primary,
                }}
              >
                Events
              </ListItemText>
            </ListItem>
          </Link>
        </List>
      ) : (
        // Events drawer menu
        <>
          <Typography
            sx={{
              paddingLeft: "16px",
              fontSize: "1.8rem",
              marginTop: "12px",
              fontWeight: 900,
            }}
            variant="h6"
          >
            Events
          </Typography>

          <List
            sx={{
              "&& .Mui-selected": {
                "&, & .MuiListItemIcon-root": {
                  color: (theme) => theme.palette.primary.main,
                },
                "&, & .MuiListItemText-root": {
                  color: (theme) => theme.palette.primary.main,
                },
              },
              "&& .Mui-selected:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
              px: 2,
            }}
          >
            <Link href="/events" passHref>
              <ListItemButton
                sx={{
                  borderRadius: (theme) => theme.shape.borderRadius,
                }}
                style={{
                  margin: "0px 0",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "12px",
                }}
                selected={router.pathname === "/events"}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "auto",
                  }}
                >
                  <CalendarViewMonth
                    fontSize="large"
                    sx={{
                      color: (theme) =>
                        router.pathname === "/events"
                          ? theme.palette.primary.main
                          : Colors[resolvedTheme].primary,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  style={{
                    height: 16,
                    marginLeft: "6%",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textAlign: "left",
                    textOverflow: "ellipsis",
                    width: 16,
                    color: Colors[resolvedTheme].primary,
                  }}
                >
                  Home
                </ListItemText>
              </ListItemButton>
            </Link>
            <Link
              href={{
                pathname: `/events/[username]`,
                query: { username: user.username || user.walletAddress },
              }}
              passHref
            >
              <ListItemButton
                onClick={handleClick}
                sx={{
                  borderRadius: (theme) => theme.shape.borderRadius,
                }}
                style={{
                  margin: "0px 0",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "12px",
                }}
                selected={router.pathname === "/events/[username]"}
              >
                <ListItemIcon sx={{ minWidth: "auto" }}>
                  <AccountCircleIcon
                    fontSize="large"
                    sx={{
                      color: (theme) =>
                        router.pathname === "/events/[username]"
                          ? theme.palette.primary.main
                          : Colors[resolvedTheme].primary,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  style={{
                    height: 16,
                    marginLeft: "6%",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textAlign: "left",
                    textOverflow: "ellipsis",
                    width: 16,
                    color: Colors[resolvedTheme].primary,
                  }}
                >
                  Your Events
                </ListItemText>
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </Link>

            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemText>No events</ListItemText>
                </ListItemButton>
              </List>
            </Collapse>

            <Box sx={{ marginTop: "12px " }}>
              <Button
                fullWidth
                sx={{
                  textTransform: "none",
                  color: Colors[resolvedTheme].primary.main,
                }}
                type="submit"
                size="medium"
                variant="contained"
                startIcon={<AddOutlinedIcon />}
              >
                Create new event
              </Button>
            </Box>
            <Divider sx={{ marginTop: "12px" }} />
          </List>
        </>
      )}
    </>
  );

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 320,
    bgcolor: "background.paper",
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
        // Create user signup notifications
        if (!userExists) {
          await fetch("/api/signup-notifications", {
            method: "POST",
            body: JSON.stringify({
              email,
            }),
          });
        }

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
              aria-label="close"
              onClick={modalClose}
              className={styles.close_button}
            >
              <CloseIcon
                sx={{
                  color: "#000000",
                }}
              />
            </IconButton>
            {moonPayModal && (
              <div style={{ height: "60vh" }}>
                <iframe
                  allow="accelerometer; autoplay; camera; gyroscope; payment"
                  frameBorder="0"
                  height="100%"
                  id="moonPayFrame"
                  src={moonPaySrc(user.walletAddress, user.email)}
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
                <Link
                  href={{
                    pathname: "/api/logout",
                    query: { route: router.asPath },
                  }}
                  passHref
                >
                  <Button
                    id={styles.logoutButton}
                    type="submit"
                    color="primary"
                    size="large"
                    variant="outlined"
                  >
                    Log out
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    setLogoutModal(false);
                  }}
                  id={styles.cancelButton}
                  type="submit"
                  color="primary"
                  size="large"
                  variant="outlined"
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
              aria-label="close"
              onClick={() => {
                setTwitterModal(false);
              }}
              className={styles.close_button}
            >
              <CloseIcon
                sx={{
                  color: "#000000",
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
                    onClick={() =>
                      signIn("twitter", { callbackUrl: "/twitter" })
                    }
                    id={styles.twtButton}
                    type="submit"
                    size="large"
                    variant="outlined"
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
                    color="primary"
                    size="large"
                    variant="outlined"
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
            >
              <CloseIcon
                sx={{
                  color: "#000000",
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
        sx={{
          bgcolor: Colors[resolvedTheme].header_bg,
          boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth={false}>
          <Toolbar disableGutters>
            <Box
              component="div"
              sx={{
                whiteSpace: "nowrap",
                mr: 2,
                variant: "h6",
                display: !events
                  ? { xs: "none", md: "flex" }
                  : { xs: "none", md: "flex", sm: "flex" },
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
                display: !events
                  ? { xs: "flex", md: "none" }
                  : { xs: "flex", md: "none", sm: "none" },
              }}
            >
              <IconButton
                size="large"
                onClick={handleDrawerToggle}
                sx={{
                  color: "#000000",
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
                    size="large"
                    onClick={handleOpenNotification}
                    sx={{
                      color: (theme) =>
                        anchorElNotification
                          ? theme.palette.primary.main
                          : Colors[resolvedTheme].primary,
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
                            color="primary"
                            onClick={markNotificationAsRead}
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
                  <Divider />
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
                      {user.notifications.map(
                        ({
                          id,
                          title,
                          description,
                          isRead,
                          createdAt,
                          avatarImage,
                          notificationType,
                        }: any) => {
                          if (
                            differenceInCalendarDays(
                              new Date(),
                              new Date(createdAt)
                            ) <= 1
                          ) {
                            return (
                              <MenuItem
                                sx={{
                                  ...(!isRead && {
                                    bgcolor: "action.selected",
                                  }),
                                  py: 1.5,
                                  px: 2.5,
                                  mt: "1px",
                                  display: "flex",
                                  alignItems: "center",
                                  color: Colors[resolvedTheme].secondary,
                                }}
                                key={id}
                              >
                                <ListItemText
                                  primary={shortenText(description)}
                                  secondary={
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        mt: 0.5,
                                        display: "flex",
                                        alignItems: "center",
                                        color: Colors[resolvedTheme].primary,
                                      }}
                                    >
                                      <AccessTimeIcon
                                        sx={{ mr: 0.5, width: 16, height: 16 }}
                                      />
                                      {formatDistanceToNow(
                                        new Date(createdAt),
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
                    {user.notifications.map(
                      ({
                        id,
                        title,
                        description,
                        isRead,
                        createdAt,
                        avatarImage,
                        notificationType,
                      }: any) => {
                        if (
                          differenceInCalendarDays(
                            new Date(),
                            new Date(createdAt)
                          ) > 1
                        ) {
                          return (
                            <MenuItem
                              sx={{
                                py: 1.5,
                                px: 2.5,
                                mt: "1px",
                                ...(!isRead && {
                                  bgcolor: "action.selected",
                                }),
                              }}
                              key={id}
                            >
                              <ListItemText
                                primary={shortenText(description)}
                                secondary={
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      mt: 0.5,
                                      display: "flex",
                                      alignItems: "center",
                                      color: Colors[resolvedTheme].primary,
                                    }}
                                  >
                                    <AccessTimeIcon
                                      sx={{ mr: 0.5, width: 16, height: 16 }}
                                    />
                                    {formatDistanceToNow(new Date(createdAt), {
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
                  <Divider />
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
                      }}
                      className={styles.profile_item}
                    >
                      <ListItemIcon
                        style={{ borderRadius: "50%", overflow: "hidden" }}
                      >
                        {user.avatarImage ? (
                          <Image
                            src={user.avatarImage}
                            width={48}
                            height={48}
                            alt="Avatar"
                          />
                        ) : (
                          <Avatar
                            size={48}
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
                    <MenuItem
                      divider
                      sx={{
                        padding: "0px",
                        margin: "5px 16px",
                      }}
                    ></MenuItem>
                    <MenuItem onClick={() => setSelectedMenu("settings")}>
                      <ListItemIcon>
                        <SettingsIcon
                          sx={{ color: Colors[resolvedTheme].primary }}
                        />
                      </ListItemIcon>
                      <span>{`Settings & privacy`}</span>
                      <ArrowForwardIosIcon style={{ marginLeft: "15%" }} />
                    </MenuItem>
                    <MenuItem onClick={() => setSelectedMenu("display")}>
                      <ListItemIcon>
                        <NightlightIcon
                          sx={{ color: Colors[resolvedTheme].primary }}
                        />
                      </ListItemIcon>
                      <span>Display</span>
                      <ArrowForwardIosIcon style={{ marginLeft: "49%" }} />
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleCloseUserMenu();
                        setLogoutModal(true);
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
                          marginLeft: "5px",
                          alignContent: "center",
                        }}
                      >
                        <ArrowBackIosIcon sx={{ marginLeft: "5px" }} />
                      </IconButton>
                      {`Settings & privacy`}
                    </Typography>
                    <MenuItem onClick={handleCloseUserMenu}>
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
                    >
                      <ListItemIcon>
                        <LockIcon
                          sx={{ color: Colors[resolvedTheme].primary }}
                        />
                      </ListItemIcon>
                      Privacy
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleCloseUserMenu();
                        setTwitterModal(true);
                      }}
                      sx={{ color: "rgb(29, 161, 242)" }}
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
                          marginLeft: "5px",
                          alignContent: "center",
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
                          value="system"
                          control={<Radio style={{ padding: 3 }} />}
                          label="System"
                          labelPlacement="start"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        />
                        <FormControlLabel
                          value="light"
                          control={<Radio style={{ padding: 3 }} />}
                          label="Off"
                          labelPlacement="start"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        />
                        <FormControlLabel
                          value="dark"
                          control={<Radio style={{ padding: 3 }} />}
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
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: !events
              ? { xs: "flex", md: "none" }
              : { xs: "flex", md: "none", sm: "none" },
            "& .MuiDrawer-paper": {
              backgroundColor: !events
                ? Colors[resolvedTheme].drawer_bg
                : Colors[resolvedTheme].event_drawer_bg,
              boxSizing: "border-box",
              boxShadow: !events ? "none" : "0px 0px 5px rgb(0 0 0 / 20%)",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: !events
              ? { xs: "none", md: "flex" }
              : { xs: "none", md: "flex", sm: "flex" },
            "& .MuiDrawer-paper": {
              backgroundColor: !events
                ? Colors[resolvedTheme].drawer_bg
                : Colors[resolvedTheme].event_drawer_bg,
              boxSizing: "border-box",
              boxShadow: !events ? "none" : "0px 0px 5px rgb(0 0 0 / 20%)",
              border: "none",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
}
