import React from "react";
import { useUser } from "../lib/hooks";

import AppBar from '@mui/material/AppBar';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Popover from '@mui/material/Popover';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const pages = [
  {
    link: '/',
    title: 'Home',
  },
  {
    link: '/dashboard',
    title: 'Dashboard',
  },
  {
    link: '/profile',
    title: 'Profile',
  },
];

function Profile() {
  const user = useUser({ redirectTo: "/dashboard" });

  const [anchorElNav, setAnchorElNav] = React.useState<HTMLButtonElement | null>(null);
  const [anchorElNotification, setAnchorElNotification] = React.useState<HTMLButtonElement | null>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

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
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              Impish
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page, index) => (
                  <MenuItem key={index} onClick={handleCloseNavMenu}>
                    <Link
                      href={page.link}
                      underline="none"
                    >
                      {page.title}
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
            >
              Impish
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page, index) => (
                
                <Button
                  key={index}
                  onClick={handleCloseNavMenu}
                >
                  <Link
                    href={page.link}
                    sx={{ color: 'white', display: 'block' }}
                    underline="none"
                  >
                    {page.title}
                  </Link>
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <IconButton
                size="large"
                color="inherit"
                onClick={handleOpenNotification}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                color="inherit"
                onClick={handleOpenUserMenu}
              >
                <AccountCircle />
              </IconButton>
              <Popover
                open={Boolean(anchorElNotification)}
                anchorEl={anchorElNotification}
                onClose={handleCloseNotification}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <Typography sx={{ p: 2 }}>Notification 1</Typography>
                <Typography sx={{ p: 2 }}>Notification 2</Typography>
                <Typography sx={{ p: 2 }}>Notification 3</Typography>
              </Popover>
              <Menu
                sx={{ mt: '45px' }}
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Link href="/api/logout" underline="none" sx={{ color: 'black' }}>
                    Logout
                  </Link>
                </MenuItem>
              </Menu>

            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container>
        <div>
          <span>{user?.publicAddress}</span>
        </div>
      </Container>
    </React.Fragment>
  );
}

export default Profile;
