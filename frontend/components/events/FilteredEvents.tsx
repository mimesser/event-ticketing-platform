import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "next-themes";

import { createEvents } from "ics";
import fileDownload from "js-file-download";

import Colors from "lib/colors";
import { useEventsFilter, useForceUpdate } from "lib/hooks";
import { EventDetails, EventDetailsOption } from "lib/types";
import { eventObjectFromDetails, groupEventsByMonth } from "lib/utils";

import LoadingScene from "components/LoadingScene";
import VerticalEventsView from "./VerticalEventsView";
import EventsCarousel from "./EventsCarousel";
import EventDetailsMenu from "./EventDetailsMenu";

export default function FilteredEventsList({
  filter,
  showDetailsMenu,
  title,
  layout = "vertical",
  showExportButton = false,
}: {
  filter: string;
  showDetailsMenu: boolean;
  title: string;
  layout?: "vertical" | "horizontal";
  showExportButton?: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const { loading, events } = useEventsFilter(filter);

  const isMobile = useMediaQuery("(max-width:899px)");

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const showMenu = (e: HTMLElement) => setAnchorEl(e);
  const closeMenu = () => setAnchorEl(null);
  const [selectedEvent, selectEvent] = React.useState<any>(null);
  const forceUpdate = useForceUpdate();
  const onDeleteEvent = () => {
    if (!selectedEvent) return;
    const index = events.findIndex(
      (e: EventDetails) => e.id === selectedEvent?.id
    );
    if (index != -1) {
      events.splice(index, 1);
      forceUpdate();
    }
  };

  // TODO
  // const { user } = useUserInfo();
  // const [hostOnly, setHostOnly] = React.useState<boolean>(true);

  // event cell options
  const cellOptions: EventDetailsOption = {
    showDetailsMenu: showDetailsMenu,
    showMenu: showMenu,
    onDetails: (event: EventDetails) => {
      selectEvent(event);
    },
  };

  // export events
  const onExportEvents = () => {
    const eventList: any[] = [];
    events.forEach((e) => {
      eventList.push(eventObjectFromDetails(e));
    });
    const { value, error } = createEvents(eventList);
    if (error) {
      console.log("Error exporting events");
    } else {
      fileDownload(value?.toString() || "", `e${Date.now()}.ics`);
    }
  };

  return (
    <>
      {loading || !events ? (
        <LoadingScene width={"100%"} height={"calc(100% - 64px)"} />
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
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginTop: "16px",
            marginLeft: "15%",
            marginRight: "1.5%",
          }}
        >
          {showDetailsMenu && (
            <EventDetailsMenu
              anchorElMenu={anchorEl}
              closeMenu={closeMenu}
              event={selectedEvent}
              onDeleteEvent={onDeleteEvent}
            />
          )}
          {showExportButton && (
            <Button
              variant="contained"
              sx={{ textTransform: "none", alignSelf: "flex-end" }}
              onClick={onExportEvents}
            >
              Add To Calendar
            </Button>
          )}
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
            <div
              style={{
                width: !isMobile
                  ? "calc((100vw - 380px) * 0.835)"
                  : "calc((100vw - 40px) * 0.835)",
              }}
            >
              <EventsCarousel events={events} options={cellOptions} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
