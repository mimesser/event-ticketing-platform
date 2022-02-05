import AppBar from "@mui/material/AppBar";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Backdrop from "@mui/material/Backdrop";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
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
    link: "/",
    title: "Home",
  },
  {
    link: "/profile",
    title: "Profile",
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

  const [anchorElNav, setAnchorElNav] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElNotification, setAnchorElNotification] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenNotification = (event: any) => {
    setAnchorElNotification(event.currentTarget);
  };
  const handleCloseNotification = () => {
    setAnchorElNotification(null);
  };

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
                          // disabled, to enable modal close
                          href={true as any}
                          onClick={modalClose}
                          color="inherit"
                          type="submit"
                          size="large"
                          variant="outlined"
                        >
                          Not Now
                        </Button>
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
          <AppBar
            position="fixed"
            sx={{ bgcolor: "#FFFFFF" }}
            style={{
              filter: open ? "blur(2px)" : "none",
            }}
          >
            <Container maxWidth="xl">
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
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    sx={{
                      color: "#000000",
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: "block", md: "none" },
                    }}
                  >
                    {pages.map((page, index) => (
                      <MenuItem key={index} onClick={handleCloseNavMenu}>
                        <Link href={page.link}>{page.title}</Link>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
                <Box
                  component="div"
                  sx={{
                    whitespace: "nowrap",
                    variant: "h6",
                    flexGrow: 1,
                    display: { xs: "flex", md: "none" },
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
        </>
      )}
    </React.Fragment>
  );
}

export default Dashboard;
