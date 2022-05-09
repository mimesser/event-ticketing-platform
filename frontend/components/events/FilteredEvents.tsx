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
import EventsCarousel from "./EventsCarousel";
import EventDetailsMenu from "./EventDetailsMenu";

export default function FilteredEventsList({
  filter,
  showDetailsMenu,
  title,
  layout = "vertical",
}: {
  filter: string;
  showDetailsMenu: boolean;
  title: string;
  layout?: "vertical" | "horizontal";
}) {
  const { resolvedTheme } = useTheme();
  const { loading, events } = useEventsFilter(filter);

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
  return (
    <>
      {loading || !events ? (
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
      ) : events.length === 0 ? (
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
        <div
          style={
            layout === "vertical"
              ? {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginLeft: "15%",
                  maxWidth: "75%",
                }
              : {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginLeft: "10%",
                }
          }
        >
          <EventDetailsMenu
            events={events}
            anchorElMenu={anchorEl}
            closeMenu={closeMenu}
            selEventId={selEventId}
            onDeleteEvent={onDeleteEvent}
          />
          <div>
            <Typography
              gutterBottom
              variant="h6"
              sx={{
                color: Colors[resolvedTheme]?.primary,
                textAlign: "left",
                fontWeight: 900,
                marginTop: "16px",
                marginBottom: "0px",
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                color: Colors[resolvedTheme]?.secondary,
              }}
              variant="body2"
            >
              {events.length === 0
                ? "No events"
                : events.length === 1
                ? "1 Event"
                : events.length + " Events"}
            </Typography>
          </div>

          {layout === "vertical" ? (
            <VerticalEventsView events={events} options={cellOptions} />
          ) : (
            <EventsCarousel events={events} options={cellOptions} />
          )}
        </div>
      )}
    </>
  );
}
