import React from "react";
import { Grid, Menu, MenuItem, Snackbar } from "@mui/material";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import { useTheme } from "next-themes";
import copy from "copy-to-clipboard";
import { EventDetails } from "lib/types";
import Colors from "lib/colors";
import { getEventLink, getEventLinkString } from "lib/utils";
import EventCellVert from "components/events/EventCellVert";

export default function EventsGrid({ events }: { events: EventDetails[] }) {
  const { resolvedTheme } = useTheme();
  const [selEventId, selectEvent] = React.useState<number>(-1);
  const [anchorElMenu, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const showMenu = (e: HTMLElement) => setAnchorEl(e);
  const closeMenu = () => setAnchorEl(null);
  const onCopyEventLink = () => {
    copy(getEventLink(selEventId));
    showSnackBar(true);
  };
  const [snackBar, showSnackBar] = React.useState<boolean>(false);

  return (
    <>
      <Snackbar
        open={snackBar}
        autoHideDuration={1000}
        onClose={() => showSnackBar(false)}
        message="Link copied"
        ContentProps={{
          sx: {
            fontWeight: 700,
          },
        }}
      />
      <Menu
        anchorEl={anchorElMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        open={Boolean(anchorElMenu)}
        onClose={() => {
          closeMenu();
        }}
        MenuListProps={{ sx: { padding: "0" } }}
        PaperProps={{
          sx: {
            borderRadius: "5px",
            bgcolor: Colors[resolvedTheme].header_bg,
            color: Colors[resolvedTheme].primary,
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
            fontWeight: 600,
            fontSize: "16px",
            padding: "8px",
          },
        }}
      >
        <MenuItem
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "8px",
            ":hover": {
              backgroundColor: Colors[resolvedTheme].hover,
              borderRadius: "5px",
            },
          }}
          onClick={onCopyEventLink}
        >
          <div>
            <LinkOutlinedIcon
              sx={{
                color: Colors[resolvedTheme].primary,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>{getEventLinkString(selEventId)}</span>
            <span
              style={{
                color: Colors[resolvedTheme].secondary,
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Share this link to invite others
            </span>
          </div>
        </MenuItem>
      </Menu>
      <Grid
        container
        spacing={{ xs: 0.5, md: 0.5 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {events.map((event, index) => (
          <Grid
            item
            xs={2}
            sm={4}
            md={4}
            key={index}
            sx={{ marginBottom: "16px" }}
          >
            <EventCellVert
              event={event}
              layout="vertical"
              options={{
                showDetailsMenu: false,
                showMenu: null,
                onDetails: null,
              }}
              showShareArrow
              onShare={(e: any) => {
                selectEvent(event.id);
                showMenu(e);
              }}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
