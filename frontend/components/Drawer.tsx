import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import Avatar from "components/Avatar";
import EventSetup from "components/EventSetup";
import Colors from "lib/colors";
import { useUserInfo } from "lib/user-context";
import { shortenAddress } from "lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import React from "react";

export default function ImpishDrawer({
  variant,
  drawerOpen,
  onClose,
}: {
  variant: "permanent" | "temporary";
  drawerOpen: boolean;
  onClose: any;
}) {
  const { resolvedTheme } = useTheme();
  const { user } = useUserInfo();
  const router = useRouter();
  const [events] = React.useState(
    router.asPath.includes("/events") ? true : false
  );
  const drawerWidth = events ? 340 : 240;
  const [drawerShow, showDrawer] = React.useState<boolean>(drawerOpen);
  React.useEffect(() => {
    showDrawer(drawerOpen);
  }, [drawerOpen, showDrawer]);

  return (
    <Drawer
      variant={variant}
      open={drawerShow}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        "& .MuiDrawer-paper": {
          backgroundColor: !events
            ? Colors[resolvedTheme].drawer_bg
            : Colors[resolvedTheme].event_drawer_bg,
          boxSizing: "border-box",
          boxShadow: !events ? "none" : "0px 0px 5px rgb(0 0 0 / 20%)",
          borderRight: !events ? "none" : Colors[resolvedTheme].border,
          width: drawerWidth,
          minHeight: "100vh",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {!events ? (
          <>
            <Toolbar sx={{ display: "flex" }} />
            <List
              sx={{
                "&& .Mui-selected": {
                  "&, & .MuiListItemText-root": {
                    color: (theme) => theme.palette.primary.main,
                  },
                  backgroundColor: Colors[resolvedTheme].selected_drawer_menu,
                },
                px: 2,
              }}
            >
              {user && (
                <ListItem
                  id="drawer_profile_button"
                  button
                  onClick={() => {
                    router.push("/" + (user.username || user.walletAddress));
                  }}
                  sx={{
                    borderRadius: (theme) => theme.shape.borderRadius,
                    ":hover": {
                      backgroundColor: Colors[resolvedTheme].hover,
                    },
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
                  <Avatar
                    avatarImage={user?.avatarImage}
                    walletAddress={user?.walletAddress}
                    size={36}
                  />
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
                    {user?.name || shortenAddress(user?.walletAddress)}
                  </ListItemText>
                </ListItem>
              )}

              <Link href="/events" passHref>
                <ListItem
                  id="go_events_homepage"
                  button
                  sx={{
                    borderRadius: (theme) => theme.shape.borderRadius,
                    ":hover": {
                      backgroundColor: Colors[resolvedTheme].hover,
                    },
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
          </>
        ) : (
          <EventSetup />
        )}
      </div>
    </Drawer>
  );
}
