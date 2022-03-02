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
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
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
import { formatDistanceToNow, set, sub } from "date-fns";
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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "styles/components/Header.module.scss";

// mock data for notifications

const notData: { read: boolean; notification: string; createdAt: Date }[] = [
  {
    read: true,
    notification: "this is the first notification available",
    createdAt: set(new Date(), { hours: 1, minutes: 30 }),
  },
  {
    read: true,
    notification: "this is the second notification available",
    createdAt: sub(new Date(), { hours: 4, minutes: 30 }),
  },
  {
    read: false,
    notification:
      "this is the third notification available but longer so i can test responsiveness",
    createdAt: sub(new Date(), { hours: 5, minutes: 30 }),
  },
  {
    read: false,
    notification: "this is the fourth notification available",
    createdAt: sub(new Date(), { days: 1, hours: 3, minutes: 30 }),
  },
  {
    read: false,
    notification: "this is the fifth notification available",
    createdAt: sub(new Date(), { days: 2, hours: 3, minutes: 30 }),
  },
];

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Header() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const { user } = useUserInfo();
  const isMobile = useMediaQuery("(max-width:599px)");
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(true);
  const [notifications, setNotifications] =
    useState<{ read: boolean; notification: string; createdAt: Date }[]>(
      notData
    );
  const totalUnRead = notifications.filter((item) => item.read === true).length;

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
  const markNotificationAsRead = () => {
    setNotificationCount(false);
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: false,
      }))
    );
  };
  const drawer = user && (
    <>
      <Toolbar />
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
            margin: "10px 0",
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
                colors={["#ffad08", "#edd75a", "#73b06f", "#0c8f8f", "#405059"]}
              />
            )}
          </div>
          <Link
            href={`/${encodeURIComponent(user.username || user.walletAddress)}`}
            passHref
          >
            <ListItemText
              disableTypography
              style={{
                height: 16,
                marginLeft: "1%",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textAlign: "center",
                textOverflow: "ellipsis",
                width: 16,
                color: Colors[resolvedTheme].primary,
              }}
            >
              {user.name || shortenAddress(user.walletAddress)}
            </ListItemText>
          </Link>
        </ListItem>
      </List>
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
      const email = user.email;

      try {
        await fetch("/api/twitter/unlink-user", {
          method: "POST",
          body: JSON.stringify({
            email,
          }),
        });
      } catch (error) {
        console.log(error);
      }

      signOut();
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
      const didToken = await magic?.auth.loginWithMagicLink({ email });
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
                src="/logo.png"
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
                <Link href="/api/logout" passHref>
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
          boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.2)",
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
                display: { xs: "none", md: "flex" },
              }}
            >
              <Link href="/">
                <a>
                  <Image
                    src="/logo.png"
                    width={45}
                    height={45}
                    alt={`Impish icon`}
                  />
                </a>
              </Link>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
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
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            ></Box>
            {user ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Notifications">
                  <IconButton
                    size="large"
                    onClick={handleOpenNotification}
                    sx={{
                      color: Colors[resolvedTheme].primary,
                    }}
                  >
                    <Badge
                      badgeContent={totalUnRead}
                      invisible={totalUnRead == 0}
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
                      color: Colors[resolvedTheme].primary,
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
                      color: Colors[resolvedTheme].primary,
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
                          sx={{ color: "text.secondary" }}
                        >
                          You have {totalUnRead} unread messages
                        </Typography>
                      </Box>
                      {totalUnRead > 0 && (
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
                        }}
                      >
                        New
                      </ListSubheader>
                    }
                  >
                    <MenuList>
                      {notifications.slice(0, 2).map((data, i) => (
                        <MenuItem
                          sx={{
                            py: 1.5,
                            px: 2.5,
                            mt: "1px",
                            ...(notificationCount && {
                              bgcolor: "action.selected",
                            }),
                          }}
                          key={i}
                        >
                          <ListItemText
                            primary={shortenText(data?.notification)}
                            secondary={
                              <Typography
                                variant="caption"
                                sx={{
                                  mt: 0.5,
                                  display: "flex",
                                  alignItems: "center",
                                  color: "text.disabled",
                                }}
                              >
                                <AccessTimeIcon
                                  sx={{ mr: 0.5, width: 16, height: 16 }}
                                />
                                {formatDistanceToNow(
                                  new Date(data?.createdAt),
                                  { addSuffix: true }
                                )}
                              </Typography>
                            }
                          />
                        </MenuItem>
                      ))}
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
                        }}
                      >
                        BEFORE THAT
                      </ListSubheader>
                    }
                  >
                    <MenuList>
                      {notifications.slice(2, 5).map((data, i) => (
                        <MenuItem
                          sx={{
                            py: 1.5,
                            px: 2.5,
                            mt: "1px",
                          }}
                          key={i}
                        >
                          <ListItemText
                            primary={shortenText(data?.notification)}
                            secondary={
                              <Typography
                                variant="caption"
                                sx={{
                                  mt: 0.5,
                                  display: "flex",
                                  alignItems: "center",
                                  color: "text.disabled",
                                }}
                              >
                                <AccessTimeIcon
                                  sx={{ mr: 0.5, width: 16, height: 16 }}
                                />
                                {formatDistanceToNow(
                                  new Date(data?.createdAt),
                                  { addSuffix: true }
                                )}
                              </Typography>
                            }
                          />
                        </MenuItem>
                      ))}
                    </MenuList>
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
                      },
                    }}
                  >
                    <MenuItem onClick={() => setSelectedMenu("settings")}>
                      <ListItemIcon>
                        <SettingsIcon sx={{ color: "black" }} />
                      </ListItemIcon>
                      <span
                        style={{ color: "black" }}
                      >{`Settings & privacy`}</span>
                      <ArrowForwardIosIcon style={{ marginLeft: "15%" }} />
                    </MenuItem>
                    <MenuItem onClick={() => setSelectedMenu("display")}>
                      <ListItemIcon>
                        <NightlightIcon sx={{ color: "black" }} />
                      </ListItemIcon>
                      <span style={{ color: "black" }}>Display</span>
                      <ArrowForwardIosIcon style={{ marginLeft: "49%" }} />
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleCloseUserMenu();
                        setLogoutModal(true);
                      }}
                    >
                      <ListItemIcon>
                        <LogoutIcon sx={{ color: "black" }} />
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
                          color: "#000000",
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
                        <SettingsIcon sx={{ color: "black" }} />
                      </ListItemIcon>
                      <Link href="/export">Export Private Key</Link>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleCloseUserMenu();
                        setPrivacyModal(true);
                      }}
                    >
                      <ListItemIcon>
                        <LockIcon sx={{ color: "black" }} />
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
                          color: "#000000",
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
                          color: "black",
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
                      color="primary"
                      size="large"
                      variant="outlined"
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
            display: { xs: "flex", md: "none" },
            "& .MuiDrawer-paper": {
              backgroundColor: Colors[resolvedTheme].drawer_bg,
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "flex" },
            "& .MuiDrawer-paper": {
              backgroundColor: Colors[resolvedTheme].drawer_bg,
              boxSizing: "border-box",
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
