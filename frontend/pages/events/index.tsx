import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Menu,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import moment from "moment";

import Layout from "components/Layout";
import EventDetailsMenu from "components/events/EventDetailsMenu";
import EventCellHorz from "components/events/EventCellHorz";

import Colors from "lib/colors";
import { useEventsFilter, useForceUpdate } from "lib/hooks";
import { EventDetails, EventDetailsOption } from "lib/types";
import EventsGrid from "components/events/EventsGrid";
import { useUserInfo } from "lib/user-context";

function Events() {
  const router = useRouter();
  const { user } = useUserInfo();
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { loading, events } = useEventsFilter("going");

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // event details menu
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const showMenu = (e: HTMLElement) => setAnchorEl(e);
  const closeMenu = () => setAnchorEl(null);
  const [selEventId, selectEvent] = useState<number>(-1);
  const forceUpdate = useForceUpdate();
  const onDeleteEvent = () => {
    const index = events.findIndex((e: EventDetails) => e.id === selEventId);
    if (index != -1) {
      events.splice(index, 1);
      forceUpdate();
    }
  };

  const horzCellOptions: EventDetailsOption = {
    showDetailsMenu: true,
    showMenu: showMenu,
    onDetails: (event: EventDetails) => {
      selectEvent(event.id);
    },
  };

  // discover events
  const modes = ["Top", "Local", "This week", "Following"];
  const [mode, setMode] = useState(0);
  const [foundEvents, setDiscoveredEvents] = useState<EventDetails[]>([]);
  const [finding, setEventsFinding] = useState<boolean>(false);

  useEffect(() => {
    const discoverEvents = async (mode: number) => {
      if (!user) return [];
      if (mode === 2) {
        setEventsFinding(true);
        const startNextWeek = moment().add(1, "weeks").startOf("isoWeek");
        // this week
        fetch("/api/event/get-events", {
          method: "POST",
          body: JSON.stringify({
            filter: "going",
            endTime: startNextWeek.format("YYYY-MM-DD") + " 00:00:00",
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            setDiscoveredEvents(data.events);
            setEventsFinding(false);
          });
      } else {
        setDiscoveredEvents([]);
      }
    };
    discoverEvents(mode);
  }, [mode, user]);

  const Loading = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress size={30} />
    </div>
  );
  // menu
  if (!mounted) {
    return null;
  }

  return (
    <Layout>
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
        <>
          {/* your events */}
          {user && !loading && events.length ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                borderRadius: "10px",
                marginTop: "20px",
                marginLeft: "2.5%",
                marginRight: "2.5%",
                paddingLeft: "16px",
                paddingRight: "16px",
                backgroundColor: Colors[resolvedTheme].eventItem_bg,
                color: Colors[resolvedTheme].primary,
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: Colors[resolvedTheme].tab_divider,
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  border: "none",
                  justifyContent: "space-between",
                  marginTop: "16px",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  sx={{
                    color: Colors[resolvedTheme]?.primary,
                    backgroundColor: Colors[resolvedTheme].eventItem_bg,
                    textAlign: "left",
                    fontWeight: 900,
                  }}
                >
                  Your Events
                </Typography>
                <Button
                  variant="text"
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                  onClick={() => {
                    router.push("/events/going");
                  }}
                >
                  See All
                </Button>
              </div>
              {
                /* Event List */
                <>
                  <EventDetailsMenu
                    events={events}
                    anchorElMenu={anchorEl}
                    closeMenu={closeMenu}
                    selEventId={selEventId}
                    onDeleteEvent={onDeleteEvent}
                  />
                  <MenuList
                    sx={{
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: Colors[resolvedTheme].tab_divider,
                      borderRadius: "16px",
                      marginBottom: "8px",
                    }}
                  >
                    {events.map((event: EventDetails, index: number) => (
                      <div
                        style={{
                          display: "flex",
                          flexGrow: 1,
                          flexDirection: "column",
                        }}
                        key={index}
                      >
                        {index ? (
                          <Divider
                            sx={{
                              margin: "0px 10px",
                              padding: "0px",
                              borderColor: Colors[resolvedTheme].divider,
                              width: "calc(100% - 220px)",
                              alignSelf: "flex-end",
                            }}
                          />
                        ) : (
                          <></>
                        )}
                        <EventCellHorz
                          layout={"horizontal"}
                          event={event}
                          options={horzCellOptions}
                        />
                      </div>
                    ))}
                  </MenuList>
                </>
              }
            </div>
          ) : (
            <></>
          )}
          {/* discover events */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              borderRadius: "10px",
              marginTop: "20px",
              marginLeft: "2.5%",
              marginRight: "2.5%",
              paddingLeft: "16px",
              paddingRight: "16px",
              backgroundColor: Colors[resolvedTheme].eventItem_bg,
              color: Colors[resolvedTheme].primary,
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: Colors[resolvedTheme].tab_divider,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                border: "none",
                marginTop: "16px",
                gap: "8px",
              }}
            >
              <Typography
                gutterBottom
                variant="h5"
                sx={{
                  color: Colors[resolvedTheme]?.primary,
                  backgroundColor: Colors[resolvedTheme].eventItem_bg,
                  textAlign: "left",
                  fontWeight: 900,
                }}
              >
                Discover Events
              </Typography>
            </div>
            {/* discover event modes */}
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                flexDirection: "row",
                gap: "16px",
              }}
            >
              {modes.map((strMode, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    setEventsFinding(false);
                    setMode(index);
                  }}
                  sx={{
                    color:
                      mode === index
                        ? Colors[resolvedTheme].active_btn_color
                        : Colors[resolvedTheme].primary,
                    backgroundColor:
                      mode === index
                        ? Colors[resolvedTheme].active_btn_back
                        : Colors[resolvedTheme].eventDetailsBtn_bg,
                    borderRadius: "16px",
                    fontWeight: 600,
                    ":hover": {
                      backgroundColor:
                        mode === index
                          ? Colors[resolvedTheme].active_btn_hover
                          : Colors[resolvedTheme].eventDetailsBtn_hover,
                    },
                    textTransform: "none",
                  }}
                >
                  {strMode}
                </Button>
              ))}
            </div>
            {/* list of discovered events */}
            <div style={{ marginTop: "16px" }}>
              {finding || !foundEvents ? (
                <Loading />
              ) : foundEvents.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CalendarMonthRoundedIcon
                    color="primary"
                    sx={{
                      width: "96px",
                      height: "auto",
                    }}
                  />
                  <Typography
                    sx={{
                      color: Colors[resolvedTheme]?.secondary,
                    }}
                    variant="body1"
                  >
                    No events found.
                  </Typography>
                </div>
              ) : (
                <EventsGrid events={foundEvents} />
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

export default Events;
