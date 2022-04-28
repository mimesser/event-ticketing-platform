import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/router";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import GetAppOutlinedIcon from "@mui/icons-material/GetAppOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Colors from "lib/colors";
import { useEventsFilter } from "lib/hooks";
import { EventDetails } from "lib/types";
import { groupEventsByMonth } from "lib/utils";
import { useUserInfo } from "lib/user-context";

export default function GoingEvents() {
  const { user } = useUserInfo();
  const { resolvedTheme } = useTheme();
  const { loading, events } = useEventsFilter("going");
  const groupedEvents = groupEventsByMonth(events);
  const router = useRouter();

  if (user === null) {
    router.push("/");
  }

  const viewEvent = (eventId: number) => {
    router.push("/events/" + eventId);
  };
  const [anchorElMenu, setAnchorElMenu] = React.useState<HTMLElement | null>(
    null
  );
  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  const [hostOnly, showHostOnly] = React.useState<boolean>(false);
  const [eventLink, setEventLink] = React.useState<string>("");

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
            onClose={handleCloseMenu}
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
                <span>
                  <Link
                    href={"https://" + eventLink}
                    color="inherit"
                    underline="none"
                  >
                    {eventLink}
                  </Link>
                </span>
                <span
                  style={{
                    color: Colors[resolvedTheme].secondary,
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Your guests can use this link to join
                </span>
              </div>
            </MenuItem>
            <MenuItem
              sx={{
                ":hover": {
                  backgroundColor: Colors[resolvedTheme].hover,
                  borderRadius: "5px",
                },
              }}
            >
              <ListItemIcon>
                <GetAppOutlinedIcon
                  sx={{ color: Colors[resolvedTheme].primary }}
                />
              </ListItemIcon>
              <ListItemText>Add to Calendar</ListItemText>
            </MenuItem>
            {hostOnly && (
              <div>
                <MenuItem
                  sx={{
                    ":hover": {
                      backgroundColor: Colors[resolvedTheme].hover,
                      borderRadius: "5px",
                    },
                  }}
                >
                  <ListItemIcon>
                    <PersonOutlineOutlinedIcon
                      sx={{ color: Colors[resolvedTheme].primary }}
                    />
                  </ListItemIcon>
                  <ListItemText>Export guest list</ListItemText>
                </MenuItem>
                <MenuItem
                  sx={{
                    ":hover": {
                      backgroundColor: Colors[resolvedTheme].hover,
                      borderRadius: "5px",
                    },
                  }}
                >
                  <ListItemIcon>
                    <CloseOutlinedIcon
                      sx={{ color: Colors[resolvedTheme].primary }}
                    />
                  </ListItemIcon>
                  <ListItemText>Delete Event</ListItemText>
                </MenuItem>
              </div>
            )}
          </Menu>
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
                          onClick={(e) => {
                            showHostOnly(user?.id === event.hostId);
                            setEventLink("impish.fun/" + event.id);
                            e.stopPropagation();
                            setAnchorElMenu(e.currentTarget);
                          }}
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
