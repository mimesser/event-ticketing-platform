import React from "react";
import {
  Button,
  CircularProgress,
  Divider,
  MenuList,
  MenuItem,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { useTheme } from "next-themes";
import Image from "next/image";
import Colors from "lib/colors";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import { EventDetails } from "lib/types";
import { useEventsFilter } from "lib/hooks";
import { groupEventsByMonth } from "lib/utils";
import { useRouter } from "next/router";

export default function GoingEvents() {
  const { resolvedTheme } = useTheme();
  const { loading, events } = useEventsFilter("going");
  const groupedEvents = groupEventsByMonth(events);
  const router = useRouter();
  const viewEvent = (eventId: number) => {
    router.push("/events/" + eventId);
  };

  const onClickDetails = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  return (
    <>
      {loading || !events ? (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
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
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginLeft: "15%",
            maxWidth: "75%",
          }}
        >
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
              Going
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              overflow: "auto",
              width: "100%",
            }}
          >
            {groupedEvents.map(({ monthName, events, dayStr }, index) => (
              <MenuList
                sx={{
                  width: "100%",
                  borderRadius: "10px",
                  marginTop: "20px",
                  backgroundColor: Colors[resolvedTheme].eventItem_bg,
                  color: Colors[resolvedTheme].primary,
                  boxShadow:
                    "0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%)",
                }}
                key={index}
              >
                <MenuItem
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    border: "none",
                    ":hover": { background: "transparent" },
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
                      alignSelf: "start",
                    }}
                  >
                    {monthName}
                  </Typography>
                  {monthName === "Today" ? (
                    <Typography
                      gutterBottom
                      variant="h5"
                      sx={{
                        color: Colors[resolvedTheme]?.secondary,
                        backgroundColor: Colors[resolvedTheme].eventItem_bg,
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "15px",
                        alignSelf: "start",
                      }}
                    >
                      {dayStr}
                    </Typography>
                  ) : (
                    <></>
                  )}
                </MenuItem>
                {events.map((event: EventDetails, index: number) => (
                  <div key={index}>
                    {index ? (
                      <Divider
                        sx={{
                          margin: "0px 10px",
                          padding: "0px",
                          borderColor: Colors[resolvedTheme].divider,
                        }}
                      />
                    ) : (
                      <div></div>
                    )}
                    <MenuItem
                      key={index}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        padding: "10px",
                        border: "none",
                        ":hover": {
                          backgroundColor:
                            Colors[resolvedTheme].eventItem_hover,
                          borderRadius: "5px",
                        },
                      }}
                      onClick={() => viewEvent(event.id)}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 200,
                          height: 150,
                          borderRadius: 15,
                          overflow: "hidden",
                          background: Colors[resolvedTheme].no_cover_photo_bg,
                        }}
                      >
                        {event.coverPhoto.url ? (
                          <Image
                            src={event.coverPhoto.url}
                            key={index}
                            alt="Cover photo"
                            width={200}
                            height={150}
                          />
                        ) : (
                          <CalendarViewMonthIcon
                            sx={{
                              width: "48px",
                              height: "48px",
                              color: Colors[resolvedTheme]?.primary,
                            }}
                          />
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          marginLeft: 15,
                          flex: 1,
                          gap: "2px",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>
                          {event.startTime}
                        </span>
                        <span style={{ fontWeight: "bold", fontSize: 20 }}>
                          {event.title}
                        </span>

                        {event.location.hasLocation ? (
                          <span style={{ fontWeight: 500 }}>
                            {event.location.name}
                          </span>
                        ) : (
                          <br />
                        )}

                        <span
                          style={{ fontSize: 14, fontWeight: 600 }}
                        >{`${event.going} Going`}</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          onClick={(e) => onClickDetails(e)}
                          sx={{
                            alignItems: "baseline",
                            background:
                              Colors[resolvedTheme].eventDetailsBtn_bg,
                            borderRadius: "5px",
                            padding: "0px",
                            fontSize: 16,
                            color: Colors[resolvedTheme].primary,
                            fontWeight: 900,
                            position: "inherit",
                            margin: "16px",
                            width: "48px",
                            height: "36px",
                            minWidth: "32px",
                            bottom: "20px",
                          }}
                        >
                          ...
                        </Button>
                      </div>
                    </MenuItem>
                  </div>
                ))}
              </MenuList>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
