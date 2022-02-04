import AppBar from "@mui/material/AppBar";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import MaterialLink from "@mui/material/Link";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Popover from "@mui/material/Popover";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { useUser } from "../lib/hooks";

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
  const user = useUser({ redirectTo: "/dashboard", redirectIfFound: true });

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

  return (
    <React.Fragment>
      {user && (
        <>
          <AppBar position="fixed" sx={{ bgcolor: "#FFFFFF" }}>
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
