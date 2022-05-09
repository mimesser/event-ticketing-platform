import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Radio,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import GetAppOutlinedIcon from "@mui/icons-material/GetAppOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import { useTheme } from "next-themes";

import { createEvent } from "ics";
import moment from "moment";
import copy from "copy-to-clipboard";
import fileDownload from "js-file-download";
import { stringify } from "csv-stringify/sync";

import Colors from "lib/colors";
import { useEventsFilter } from "lib/hooks";
import { EventDetails, EventDetailsOption } from "lib/types";
import { groupEventsByMonth } from "lib/utils";
import { useUserInfo } from "lib/user-context";

import VerticalEventsView from "./VerticalEventsView";
import EventDetailsMenu from "./EventDetailsMenu";

export default function HostingEvents() {
  const { resolvedTheme } = useTheme();
  const { loading: loadingGoingEvents, events: goingEvents } =
    useEventsFilter("going");
  const { loading: loadingPastEvents, events: pastEvents } =
    useEventsFilter("past");
  const loading =
    loadingGoingEvents || loadingPastEvents || !pastEvents || !goingEvents;
  const [mode, setMode] = React.useState(0); // 0 for going events, 1 for past events
  const events = mode === 0 ? goingEvents : pastEvents;
  const showDetailsMenu: boolean = mode === 0 ? true : false;

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const showMenu = (e: HTMLElement) => setAnchorEl(e);
  const closeMenu = () => setAnchorEl(null);
  const [selEventId, selectEvent] = React.useState<number>(-1);
  const onDeleteEvent = () => {
    const index = events.findIndex((e: EventDetails) => e.id === selEventId);
    if (index != -1) events.splice(index, 1);
  };
  // TODO
  // const { user } = useUserInfo();
  // const [hostOnly, setHostOnly] = React.useState<boolean>(true);

  // event cell options
  const cellOptions: EventDetailsOption = {
    showDetailsMenu: showDetailsMenu,
    showMenu: showMenu,
    onDetails: (event: EventDetails) => {
      selectEvent(event.id);
    },
  };

  // modes
  const modes = ["Upcoming", "Past"];

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "calc(100% - 64px)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={120} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "inherit",
            marginLeft: "15%",
            maxWidth: "75%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              borderRadius: "10px",
              padding: "8px 16px",
              marginTop: "16px",
              marginBottom: "16px",
              backgroundColor: Colors[resolvedTheme].eventItem_bg,
              color: Colors[resolvedTheme].primary,
              boxShadow:
                "0 2px 4px rgb(0 0 0 / 10%), 0 2px 4px rgb(0 0 0 / 10%)",
            }}
          >
            <Typography
              gutterBottom
              variant="h5"
              sx={{
                color: Colors[resolvedTheme]?.primary,
                textAlign: "left",
                fontWeight: 900,
                margin: "16px 8px",
                gap: "16px",
              }}
            >
              Your Hosted Events
            </Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                margin: "0px 0px 8px 8px",
              }}
            >
              {modes.map((strMode, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    setMode(index);
                  }}
                  sx={{
                    color:
                      mode === index
                        ? "rgb(25, 118, 210, 0.8)"
                        : Colors[resolvedTheme].primary,
                    backgroundColor:
                      mode === index
                        ? "rgb(231, 243, 255)"
                        : Colors[resolvedTheme].eventDetailsBtn_bg,
                    borderRadius: "16px",
                    fontWeight: 600,
                    ":hover": {
                      backgroundColor:
                        mode === index
                          ? "rgba(25, 118, 210, 0.2)"
                          : Colors[resolvedTheme].eventDetailsBtn_hover,
                    },
                  }}
                >
                  {strMode}
                </Button>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              overflow: "auto",
              width: "100%",
              alignItems: "flex-start",
            }}
          >
            {events.length === 0 ? (
              <Box sx={{ p: 4 }}>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography
                    sx={{
                      color: Colors[resolvedTheme]?.secondary,
                    }}
                    variant="body1"
                  >
                    No events found.
                  </Typography>
                </Grid>
              </Box>
            ) : (
              <>
                <EventDetailsMenu
                  events={events}
                  anchorElMenu={anchorEl}
                  closeMenu={closeMenu}
                  selEventId={selEventId}
                  onDeleteEvent={onDeleteEvent}
                />

                <VerticalEventsView events={events} options={cellOptions} />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
