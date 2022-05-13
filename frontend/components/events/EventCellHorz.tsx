import React from "react";
import { Button, MenuItem, Tooltip, Typography } from "@mui/material";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import Image from "next/image";
import moment from "moment";
import Colors from "lib/colors";
import { EventDetails, EventDetailsOption } from "lib/types";
import { formatTimeString } from "lib/utils";
import { Box } from "@mui/system";

export default function EventCell({
  layout,
  event,
  options,
}: {
  layout: "vertical" | "horizontal";
  event: EventDetails;
  options: EventDetailsOption;
}) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const coverWidth = layout === "horizontal" ? 180 : 380;
  const coverHeight = layout === "horizontal" ? 140 : 200;
  const viewEvent = (eventId: number) => {
    router.push("/events/" + eventId);
  };

  const isEventGoing = (event: EventDetails) => {
    const startTime = moment(event.startTime);
    const now = moment();

    if (now.isBefore(startTime)) return true;
    if (now.isSame(startTime, "day")) {
      if (!event.endTime) return true;
      return now.isBefore(moment(event.endTime));
    }
    return false;
  };

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        borderRadius: "15px",
        backgroundColor: Colors[resolvedTheme].eventItem_bg,
        color: Colors[resolvedTheme].primary,
      }}
    >
      <MenuItem
        sx={{
          display: "flex",
          flexDirection: layout === "vertical" ? "column" : "row",
          flexGrow: layout === "horizontal" ? 1 : 0,
          padding: layout === "horizontal" ? "8px" : "0px",
          border: "none",
          ":hover": {
            borderRadius: "15px",
            background: Colors[resolvedTheme].eventItem_hover,
            "& > .div_cover_photo": {
              background: "rgba(228, 230, 234,0.6)",
            },
          },
          ...(layout === "vertical"
            ? {
                alignItems: "flex-start",
              }
            : {}),
        }}
        onClick={() => viewEvent(event.id)}
      >
        {/* Cover Photo */}
        <Box
          component="div"
          className="div_cover_photo"
          sx={{
            display: "flex",
            padding: "0px",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "15px",
            borderBottomLeftRadius: layout === "horizontal" ? "15px" : "0px",
            borderBottomRightRadius: layout === "horizontal" ? "15px" : "0px",
            overflow: "hidden",
            minWidth: coverWidth,
            minHeight: coverHeight,
            background: Colors[resolvedTheme].no_cover_photo_bg,
          }}
        >
          {event.coverPhoto?.url ? (
            <Image
              src={event.coverPhoto?.url}
              alt="Cover photo"
              width={coverWidth}
              height={coverHeight}
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
        </Box>
        {/* Event Details */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "center",
            marginLeft: "15px",
            marginTop: layout === "vertical" ? "16px" : "0px",
            paddingBottom: layout === "vertical" ? "50px" : "0px",
          }}
        >
          <p style={{ fontWeight: 600, margin: "5px" }}>
            {formatTimeString(event.startTime)}
          </p>
          <Tooltip
            title={
              <React.Fragment>
                <Typography sx={{ margin: "5px" }}>
                  <b>{event.title}</b>
                </Typography>
              </React.Fragment>
            }
          >
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: 20,
                margin: "5px",
                width: "fit-content",
                ":hover": {
                  textDecoration: "underline",
                },
              }}
              variant="body1"
            >
              {event.title}
            </Typography>
          </Tooltip>

          {event.location?.hasLocation ? (
            <p style={{ fontWeight: 500, margin: "5px" }}>
              {event.location.name}
            </p>
          ) : (
            <br />
          )}

          <p style={{ fontSize: 14, fontWeight: 600, margin: "5px" }}>{`${
            event.count
          } ${isEventGoing(event) ? "Going" : "Went"}`}</p>
        </div>
      </MenuItem>
      {options.showDetailsMenu && (
        <Button
          onClick={(e) => {
            options.onDetails(event);
            options.showMenu(e.currentTarget);
          }}
          sx={
            layout === "horizontal"
              ? {
                  position: "absolute",
                  alignItems: "baseline",
                  borderRadius: "5px",
                  padding: "0px",
                  fontSize: 16,
                  background: Colors[resolvedTheme].eventDetailsBtn_bg,
                  color: Colors[resolvedTheme].primary,
                  fontWeight: 900,
                  right: "16px",
                  top: "32px",
                  width: "48px",
                  height: "36px",
                  minWidth: "16px",
                  ":hover": {
                    background: Colors[resolvedTheme].eventDetailsBtn_hover,
                  },
                }
              : {
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  borderRadius: "50%",
                  minWidth: "32px",
                  height: "32px",
                  width: "32px",
                  background: Colors[resolvedTheme].eventDetailsBtn_bg2,
                  color: "white",
                  ":hover": {
                    background: Colors[resolvedTheme].eventDetailsBtn_hover2,
                  },
                }
          }
        >
          ...
        </Button>
      )}
    </div>
  );
}
