import React from "react";
import { Divider, MenuItem, MenuList, Typography } from "@mui/material";
import { useTheme } from "next-themes";

import Colors from "lib/colors";
import { EventDetails, EventDetailsOption } from "lib/types";
import { groupEventsByMonth } from "lib/utils";

import EventCell from "components/events/EventCellHorz";

export default function GroupedEvents({
  events,
  options,
}: {
  events: EventDetails[];
  options: EventDetailsOption;
}) {
  const { resolvedTheme } = useTheme();
  const eventsGroup = groupEventsByMonth(events);

  return (
    <>
      {
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
            width: "100%",
          }}
        >
          {eventsGroup.map(({ monthName, events, dayStr }, index) => (
            <MenuList
              sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                width: "100%",
                borderRadius: "10px",
                marginTop: "20px",
                backgroundColor: Colors[resolvedTheme].eventItem_bg,
                color: Colors[resolvedTheme].primary,
                boxShadow:
                  "0 2px 4px rgb(0 0 0 / 10%), 0 2px 4px rgb(0 0 0 / 10%)",
              }}
              key={index}
            >
              {
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
                      alignSelf: "flex-start",
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
                        alignSelf: "flex-start",
                      }}
                    >
                      {dayStr}
                    </Typography>
                  ) : (
                    <></>
                  )}
                </MenuItem>
              }
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
                      }}
                    />
                  ) : (
                    <></>
                  )}
                  <EventCell
                    layout={"horizontal"}
                    event={event}
                    options={options}
                  />
                </div>
              ))}
            </MenuList>
          ))}
        </div>
      }
    </>
  );
}
