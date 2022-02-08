import AppBar from "@mui/material/AppBar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import MaterialLink from "@mui/material/Link";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Popover from "@mui/material/Popover";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SettingsIcon from "@mui/icons-material/Settings";
import { useUser } from "lib/hooks";
import { shortenAddress } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Identicon from "react-identicons";

export default function Header() {
  const user = useUser({});

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
  const [selectedMenu, setSelectedMenu] = React.useState("");
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
    setSelectedMenu("");
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const drawer = user && (
    <>
      <Toolbar />
      <List>
        <ListItem button style={{ margin: "10px 0" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: 12,
            }}
          >
            <Identicon string={user.publicAddress} size={24} />
            <span style={{ color: "black", height: 16, marginLeft: 5 }}>
              {shortenAddress(user.publicAddress)}
            </span>
          </div>
        </ListItem>
      </List>
    </>
  );

  return (
    <>
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
              >
                <CreditCardIcon />
              </IconButton>
              <IconButton
                size="large"
                sx={{
                  color: "#000000",
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
                {selectedMenu === "" ? (
                  <>
                    <MenuItem onClick={() => setSelectedMenu("settings")}>
                      <ListItemIcon>
                        <SettingsIcon />
                      </ListItemIcon>
                      <span style={{ color: "black" }}>Settings</span>
                    </MenuItem>
                    <MenuItem onClick={handleCloseUserMenu}>
                      <ListItemIcon>
                        <LogoutIcon />
                      </ListItemIcon>
                      <MaterialLink
                        href="/api/logout"
                        underline="none"
                        sx={{ color: "black" }}
                      >
                        Logout
                      </MaterialLink>
                    </MenuItem>
                  </>
                ) : selectedMenu === "settings" ? (
                  <>
                    <MenuItem onClick={handleCloseUserMenu}>
                      <ListItemIcon>
                        <SettingsIcon />
                      </ListItemIcon>
                      <MaterialLink
                        href="/export"
                        underline="none"
                        sx={{ color: "black" }}
                      >
                        Export Private Key
                      </MaterialLink>
                    </MenuItem>
                  </>
                ) : null}
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
            sx: { borderRight: 0 },
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
  );
}
