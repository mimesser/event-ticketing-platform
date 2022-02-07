import AppBar from "@mui/material/AppBar";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Backdrop from "@mui/material/Backdrop";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import MaterialLink from "@mui/material/Link";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useUser } from "lib/hooks";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "styles/pages/Dashboard.module.scss";

const pages = [
  {
    link: "/profile",
    title: "Profile",
    icon: AccountBoxIcon,
  },
];

function Dashboard() {
  const { query } = useRouter();
  const firstTimeUser = query.userExists === "false";
  const user = useUser({
    redirectTo: firstTimeUser ? false : "/dashboard",
    redirectIfFound: true,
  });
  const [open, setOpen] = useState(firstTimeUser ? true : false);

  const [anchorElNotification, setAnchorElNotification] =
    React.useState<HTMLButtonElement | null>(null);
  const handleOpenNotification = (event: any) => {
    setAnchorElNotification(event.currentTarget);
  };
  const handleCloseNotification = () => {
    setAnchorElNotification(null);
  };

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  async function modalClose() {
    setOpen(false);
  }

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

  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <>
      <Toolbar />
      <List>
        {pages.map((page, index) => (
          <ListItem button key={index} style={{ margin: "10px 0" }}>
            <ListItemIcon>
              <page.icon />
            </ListItemIcon>
            <Link href={page.link}>{page.title}</Link>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <React.Fragment>
      {user && (
        <>
          <Modal
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
            closeAfterTransition
            onClose={modalClose}
            open={open}
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
          >
            <Fade in={open}>
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

                  <h2>Signup</h2>
                  <div className={styles.modal_body}>
                    <form id={styles.modal_form}>
                      <TextField
                        variant="outlined"
                        label="Username"
                        placeholder="dystopian"
                      />
                      <Box>
                        <Button
                          id={styles.signup_buttons}
                          // disabled for now
                          href={true as any}
                          type="submit"
                          color="primary"
                          size="large"
                          variant="outlined"
                        >
                          Continue
                        </Button>
                      </Box>
                    </form>
                  </div>
                </div>
              </Box>
            </Fade>
          </Modal>
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={{
              bgcolor: "#FFFFFF",
              boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.2)",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            style={{
              filter: open ? "blur(2px)" : "none",
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
                      color: "#000000",
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
                      color: "#000000",
                    }}
                    onClick={handleOpenUserMenu}
                  >
                    <AccountCircle />
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
                  >
                    <MenuItem onClick={handleCloseUserMenu}>
                      <MaterialLink
                        href="/api/logout"
                        underline="none"
                        sx={{ color: "black" }}
                      >
                        Logout
                      </MaterialLink>
                    </MenuItem>
                  </Menu>
                </Box>
              </Toolbar>
            </Container>
          </AppBar>
          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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
                  boxSizing: "border-box",
                  width: drawerWidth,
                },
              }}
            >
              {drawer}
            </Drawer>
            <Drawer
              PaperProps={{
                sx: { bgcolor: "#f7f8fa", borderRight: 0 },
              }}
              variant="permanent"
              sx={{
                display: { xs: "none", md: "flex" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                },
              }}
            >
              {drawer}
            </Drawer>
          </Box>
        </>
      )}
    </React.Fragment>
  );
}

export default Dashboard;
