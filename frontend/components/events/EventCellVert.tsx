import React from "react";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";

import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import Image from "next/image";

import moment from "moment";
import Colors from "lib/colors";
import { EventDetails, EventDetailsOption } from "lib/types";
import { formatTimeString } from "lib/utils";

export default function EventCellVert({
  layout,
  event,
  options,
  showShareArrow = false,
  onShare = null,
}: {
  layout: "vertical" | "horizontal";
  event: EventDetails;
  options: EventDetailsOption;
  showShareArrow?: boolean;
  onShare?: any;
}) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
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
        marginLeft: "8px",
        marginRight: "8px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 0,
          padding: "0px",
          border: "none",
          ":hover": {
            borderRadius: "15px",
            background: Colors[resolvedTheme].eventItem_hover,
            "& > .div_cover_photo": {
              background: "rgba(228, 230, 234,0.6)",
            },
          },
          alignItems: "flex-start",
          width: "100%",
        }}
        onClick={() => viewEvent(event.id)}
      >
        {/* Cover Photo */}
        <Box
          component="div"
          className="div_cover_photo"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "15px",
            borderBottomLeftRadius: "0px",
            borderBottomRightRadius: "0px",
            overflow: "hidden",
            background: Colors[resolvedTheme].no_cover_photo_bg,
            width: "100%",
            aspectRatio: "16/9",
          }}
        >
          {event.coverPhoto?.url ? (
            <img
              src={event.coverPhoto?.url}
              alt="Cover photo"
              style={{
                width: "100%",
                aspectRatio: "16/9",
              }}
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
            marginTop: "16px",
            paddingBottom: showShareArrow ? "10px" : "50px",
            overflowWrap: "break-word",
            width: "100%",
            gap: "8px",
          }}
        >
          <span style={{ fontWeight: 600, marginLeft: "15px", height: "30px" }}>
            {formatTimeString(event.startTime)}
          </span>
          <Tooltip
            title={
              <React.Fragment>
                <Typography sx={{ margin: "5px", height: "30px" }}>
                  <b>{event.title}</b>
                </Typography>
              </React.Fragment>
            }
          >
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: 20,
                marginLeft: "15px",
                width: "fit-content",
                ":hover": {
                  textDecoration: "underline",
                },
                height: "30px",
              }}
              variant="body1"
            >
              {event.title}
            </Typography>
          </Tooltip>

          <span style={{ fontWeight: 500, marginLeft: "15px", height: "30px" }}>
            {event.location?.hasLocation ? event.location.name : ""}
          </span>

          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              marginLeft: "15px",
              height: "30px",
            }}
          >{`${event.count} ${isEventGoing(event) ? "Going" : "Went"}`}</span>
        </div>
        {/* Share Event Button */}
        {showShareArrow && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onShare && onShare(e.currentTarget);
            }}
            sx={{
              backgroundColor: Colors[resolvedTheme].icon_bg,
              padding: "4px",
              ":hover": {
                background: Colors[resolvedTheme].close_hover,
              },
              alignSelf: "flex-end",
              marginBottom: "16px",
              marginRight: "8px",
              transform: "scaleX(-1)",
            }}
          >
            <ReplyOutlinedIcon
              sx={{
                color: Colors[resolvedTheme].secondary,
              }}
            />
          </IconButton>
        )}
      </Box>
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
