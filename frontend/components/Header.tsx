import AppBar from "@mui/material/AppBar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Container from "@mui/material/Container";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Drawer from "@mui/material/Drawer";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Popover from "@mui/material/Popover";
import SettingsIcon from "@mui/icons-material/Settings";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import TwitterIcon from "@mui/icons-material/Twitter";
import useMediaQuery from "@mui/material/useMediaQuery";
import Avatar from "boring-avatars";
import { useUser } from "lib/hooks";
import { moonPaySrc } from "lib/moon-pay";
import { shortenAddress } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "styles/components/Header.module.scss";

export default function Header() {
  const isMobile = useMediaQuery("(max-width:599px)");

  const { data: session }: any = useSession();

  const drawerWidth = 240;

  const user = useUser({});

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
  const [twitterModal, setTwitterModal] = React.useState(false);

  const buyModal = () => {
    setBuyOpen(true);
    setMoonPayModal(true);
  };

  const modalClose = () => {
    setBuyOpen(false);
    setMoonPayModal(false);
  };

  const drawer = user && (
    <>
      <Toolbar />
      <List>
        <ListItem
          button
          style={{
            margin: "10px 0",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "12px",
          }}
        >
          <div className={styles.account}>
            <Avatar
              size={32}
              name={user.publicAddress}
              variant="pixel"
              colors={["#ffad08", "#edd75a", "#73b06f", "#0c8f8f", "#405059"]}
            />
            <div className={styles.edit}>
              <EditIcon style={{ margin: 0 }} />
            </div>
          </div>
          <Link href="/profile" passHref>
            <span style={{ color: "black", height: 16, marginLeft: 15 }}>
              {shortenAddress(user.publicAddress)}
            </span>
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
                  src={moonPaySrc(user.publicAddress, user.email)}
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
            {!session && (
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
            {session && (
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
                    onClick={() => signOut()}
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
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#FFFFFF",
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
            <Box sx={{ flexGrow: 0 }}>
              <IconButton
                size="large"
                sx={{
                  color: "black",
                }}
                onClick={handleOpenNotification}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                sx={{
                  color: "black",
                }}
                onClick={buyModal}
              >
                <CreditCardIcon />
              </IconButton>
              <IconButton
                size="large"
                sx={{
                  color: "black",
                }}
                onClick={handleOpenUserMenu}
              >
                <AccountCircleIcon />
              </IconButton>
              <Popover
                open={Boolean(anchorElNotification)}
                anchorEl={anchorElNotification}
                onClose={handleCloseNotification}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Typography sx={{ p: 2 }}>Notification 1</Typography>
                <Typography sx={{ p: 2 }}>Notification 2</Typography>
                <Typography sx={{ p: 2 }}>Notification 3</Typography>
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
                    style: {
                      width: 250,
                    },
                  }}
                >
                  <MenuItem onClick={() => setSelectedMenu("settings")}>
                    <ListItemIcon>
                      <SettingsIcon sx={{ color: "black" }} />
                    </ListItemIcon>
                    <span style={{ color: "black" }}>Settings</span>
                    <ArrowForwardIosIcon style={{ marginLeft: "47%" }} />
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
                    style: {
                      width: 250,
                    },
                  }}
                >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <SettingsIcon sx={{ color: "black" }} />
                    </ListItemIcon>
                    <Link href="/export">Export Private Key</Link>
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
                      {!session && "Link Twitter"}
                      {session && (
                        <div style={{ color: "red" }}>Unlink Twitter</div>
                      )}
                    </div>
                  </MenuItem>
                </Menu>
              ) : null}
            </Box>
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
              backgroundColor: "#f7f8fa",
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
              backgroundColor: "#f7f8fa",
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
