import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Radio,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import GetAppOutlinedIcon from "@mui/icons-material/GetAppOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useTheme } from "next-themes";
import { useRouter } from "next/router";

import { createEvent } from "ics";
import moment from "moment";
import copy from "copy-to-clipboard";
import fileDownload from "js-file-download";
import { stringify } from "csv-stringify/sync";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "styles/components/Events.module.scss";

import Colors from "lib/colors";
import { useEventsFilter } from "lib/hooks";
import { EventDetails } from "lib/types";
import { groupEventsByMonth } from "lib/utils";
import { useUserInfo } from "lib/user-context";

import EventCell from "components/EventCell";

export default function FilteredEventsList({
  filter,
  showDetailsMenu,
  title,
  groupEvents = true,
  layout = "vertical",
}: {
  filter: string;
  showDetailsMenu: boolean;
  title: string;
  groupEvents?: boolean;
  layout?: "vertical" | "horizontal";
}) {
  const router = useRouter();
  const { user } = useUserInfo();
  const { resolvedTheme } = useTheme();
  const { loading, events } = useEventsFilter(filter);
  const eventsGroup = groupEvents ? groupEventsByMonth(events) : events;

  const [anchorElMenu, setAnchorElMenu] = React.useState<HTMLElement | null>(
    null
  );
  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  const [hostOnly, showHostOnly] = React.useState<boolean>(false);

  // copy event link
  const [eventLink, setEventLink] = React.useState<string>("");
  const getEventLink = (id: number) => {
    if (process.env.NODE_ENV === "production")
      return `https://impish.fun/${id}`;
    return `http://localhost:3000/events/${id}`;
  };
  const getEventLinkString = (id: number) => {
    return `impish.fun/${id}`;
  };
  const onCopyEventLink = () => {
    if (!showDetailsMenu) return;
    copy(getEventLink(selEventId));
    showSnackBar(true);
  };
  const [snackBar, showSnackBar] = React.useState<boolean>(false);

  // export event
  const [selEventId, selectEvent] = React.useState<number>(-1);
  const [exportEventDialog, showExportEventDialog] =
    React.useState<boolean>(false);

  const exportEvent = (e: EventDetails) => {
    const startTime = moment(e.startTime);
    let event: any = {
      start: [
        startTime.get("year") || 0,
        startTime.get("month") + 1 || 0,
        startTime.get("day") || 0,
        startTime.get("hour") || 0,
        startTime.get("minute") || 0,
      ],
      title: e.title,
      description: e.description,
      url: getEventLink(e.id),
    };
    const endTime = e.endTime ? moment(e.endTime) : startTime;
    if (!e.endTime) {
      endTime.set("hour", 23);
      endTime.set("minute", 30);
    }
    event = {
      ...event,
      end: [
        endTime.get("year") || 0,
        endTime.get("month") + 1 || 0,
        endTime.get("day") || 0,
        endTime.get("hour") || 0,
        endTime.get("minute") || 0,
      ],
    };

    const loc = e.location;
    if (loc.hasLocation)
      event = {
        ...event,
        location: loc?.name,
        geo: {
          lat: loc?.location?.lat,
          lon: loc?.location?.lng,
        },
      };
    const { value, error } = createEvent(event);
    if (error) {
      console.log("Error exporting events");
    } else {
      fileDownload(value?.toString() || "", `e${Date.now()}.ics`);
    }
  };

  // export guest list
  const onExportGuestList = async () => {
    const { guests } = await (
      await fetch("/api/event/get-guests", {
        method: "POST",
        body: JSON.stringify({ eventId: selEventId }),
      })
    ).json();
    const guestList = stringify(guests, {
      columns: ["name", "username", "status"],
      quoted: true,
    });
    const header = "Name, Username, Status";
    fileDownload(header + "\n" + guestList, "GuestList.csv");
  };

  // cancel event
  const [cancelEventDialog, showCancelEventDialog] =
    React.useState<boolean>(false);
  const [cancelDelete, setCancelDelete] = React.useState<boolean>(false); // false for cancel, true for delete
  const [isRemovingEvent, setRemovingEvent] = React.useState<boolean>(false);

  const onCancelEvent = () => {
    setCancelDelete(false);
    showCancelEventDialog(true);
  };

  const cancelEvent = (eventId: number) => {
    console.log("cancel event: ", eventId);
  };

  const deleteEvent = async (eventId: number) => {
    const res = await fetch("/api/event/delete-event", {
      method: "DELETE",
      body: JSON.stringify({ eventId }),
    });
    if (res.status !== 200) {
      console.log("request failed");
      return false;
    }
    return true;
  };

  // carousel
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 1600 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 1600, min: 1200 },
      items: 2,
    },
    tablet: {
      breakpoint: { max: 1200, min: 800 },
      items: 1,
    },
  };
  const itemWidth = 400;
  const item3 = useMediaQuery(`(min-width:${itemWidth * 4}px)`);
  const item2 = useMediaQuery(`(min-width:${itemWidth * 3}px)`);
  const items = item3 ? 3 : item2 ? 2 : 1;
  console.log("items: ", items);
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
          {/* Event Item Menu */}
          {showDetailsMenu && (
            <>
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
                    <span>{eventLink}</span>
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
                  onClick={() => showExportEventDialog(true)}
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
                      onClick={onExportGuestList}
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
                      onClick={onCancelEvent}
                    >
                      <ListItemIcon>
                        <CloseOutlinedIcon
                          sx={{ color: Colors[resolvedTheme].primary }}
                        />
                      </ListItemIcon>
                      <ListItemText>Cancel Event</ListItemText>
                    </MenuItem>
                  </div>
                )}
              </Menu>
              {/* Link Copied Notification */}
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
              {/* Export Event Dialog */}
              <Dialog
                open={exportEventDialog}
                PaperProps={{
                  sx: {
                    minWidth: "480px",
                    borderRadius: "10px",
                    backgroundColor: Colors[resolvedTheme]?.header_bg,
                  },
                }}
              >
                {/* header */}
                <DialogTitle
                  sx={{
                    textAlign: "center",
                    color: Colors[resolvedTheme].primary,
                  }}
                >
                  Export Event
                  <IconButton
                    onClick={() => showExportEventDialog(false)}
                    sx={{
                      backgroundColor: Colors[resolvedTheme].icon_bg,
                      position: "absolute",
                      right: "16px",
                      top: "12px",
                      padding: "4px",
                      ":hover": {
                        background: Colors[resolvedTheme].close_hover,
                      },
                    }}
                  >
                    <CloseIcon
                      sx={{
                        color: Colors[resolvedTheme].secondary,
                      }}
                    />
                  </IconButton>
                </DialogTitle>
                <DialogContent
                  sx={{
                    padding: "10px 16px",
                    borderTop: "1px solid " + Colors[resolvedTheme].tab_divider,
                    color: Colors[resolvedTheme].primary,
                    ".MuiDialogTitle-root + &": {
                      paddingTop: "10px",
                    },
                  }}
                >
                  <Radio checked={true} />
                  <span style={{ fontWeight: 500 }}>Add to Calendar</span>
                </DialogContent>
                <DialogActions sx={{ padding: "10px 16px" }}>
                  <Button
                    disableElevation
                    sx={{
                      borderRadius: (theme) =>
                        Number(theme.shape.borderRadius) / 2,
                      fontWeight: 600,
                      marginRight: "10px",
                      textTransform: "none",
                      ":hover": {
                        background: Colors[resolvedTheme].cancel_hover,
                      },
                    }}
                    onClick={() => showExportEventDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    disableElevation
                    color="primary"
                    variant="contained"
                    sx={{
                      borderRadius: (theme) =>
                        Number(theme.shape.borderRadius) / 2,
                      color: "white",
                      fontWeight: "600",
                      textTransform: "none",
                    }}
                    onClick={() => {
                      const selEvent = events.find((e) => e.id === selEventId);
                      if (selEvent != null) exportEvent(selEvent);
                      showExportEventDialog(false);
                    }}
                  >
                    Export
                  </Button>
                </DialogActions>
              </Dialog>
              {/* Cancel Event Dialog */}
              <Dialog
                open={cancelEventDialog}
                PaperProps={{
                  sx: {
                    minWidth: "480px",
                    borderRadius: "10px",
                    backgroundColor: Colors[resolvedTheme]?.header_bg,
                    padding: "8px",
                  },
                }}
              >
                {/* header */}
                <DialogTitle
                  sx={{
                    textAlign: "center",
                    color: Colors[resolvedTheme].primary,
                    fontWeight: 700,
                    fontSize: "1.2rem",
                  }}
                >
                  Cancel or Delete Event
                  <IconButton
                    onClick={() => showCancelEventDialog(false)}
                    sx={{
                      backgroundColor: Colors[resolvedTheme].icon_bg,
                      position: "absolute",
                      right: "16px",
                      top: "12px",
                      padding: "4px",
                      ":hover": {
                        background: Colors[resolvedTheme].close_hover,
                      },
                    }}
                  >
                    <CloseIcon
                      sx={{
                        color: Colors[resolvedTheme].secondary,
                      }}
                    />
                  </IconButton>
                </DialogTitle>
                <DialogContent
                  sx={{
                    padding: "10px 0px 10px 8px",
                    borderTop: "1px solid " + Colors[resolvedTheme].tab_divider,
                    color: Colors[resolvedTheme].primary,
                  }}
                >
                  <List>
                    <ListItem
                      sx={{
                        margin: "8px 0px",
                        justifyContent: "space-around",
                        ":hover": {
                          borderRadius: (theme) =>
                            Number(theme.shape.borderRadius) / 2,
                          backgroundColor: Colors[resolvedTheme].time_hover,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "start",
                        }}
                      >
                        <ListItemText
                          disableTypography
                          style={{
                            color: Colors[resolvedTheme].primary,
                            fontWeight: 600,
                            fontSize: "1.1rem",
                          }}
                        >
                          Cancel Event
                        </ListItemText>
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "0.9rem",
                            color: Colors[resolvedTheme].secondary,
                          }}
                        >
                          If you cancel your event, guests will be notified.
                          You&apos;ll be able to access the event page but
                          won&apos;t be able to edit the event
                        </Typography>
                      </Box>
                      <Radio
                        sx={{
                          ":hover": {
                            backgroundColor: "transparent",
                          },
                          "&": {
                            color: Colors[resolvedTheme].primary,
                          },
                        }}
                        checked={!cancelDelete}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          if (e.target.checked) setCancelDelete(false);
                        }}
                        name="radio-buttons"
                        inputProps={{
                          "aria-label": "A",
                        }}
                      />
                    </ListItem>
                    <ListItem
                      sx={{
                        margin: "8px 0px",
                        justifyContent: "space-around",
                        ":hover": {
                          borderRadius: (theme) =>
                            Number(theme.shape.borderRadius) / 2,
                          backgroundColor: Colors[resolvedTheme].time_hover,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "start",
                        }}
                      >
                        <ListItemText
                          disableTypography
                          style={{
                            color: Colors[resolvedTheme].primary,
                            fontWeight: 600,
                            fontSize: "1.1rem",
                          }}
                        >
                          Delete Event
                        </ListItemText>
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "0.9rem",
                            color: Colors[resolvedTheme].secondary,
                          }}
                        >
                          If you delete your event you won&apos;t be able to
                          access it again. If you&apos;ll want to come back to
                          it, you can cancel your event instead.
                        </Typography>
                      </Box>
                      <Radio
                        sx={{
                          ":hover": {
                            backgroundColor: "transparent",
                          },
                          "&": {
                            color: Colors[resolvedTheme].primary,
                          },
                        }}
                        checked={cancelDelete}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          if (e.target.checked) setCancelDelete(true);
                        }}
                        name="radio-buttons"
                        inputProps={{
                          "aria-label": "A",
                        }}
                      />
                    </ListItem>
                  </List>
                </DialogContent>
                <DialogActions sx={{ padding: "10px 16px" }}>
                  <Button
                    disableElevation
                    sx={{
                      borderRadius: (theme) =>
                        Number(theme.shape.borderRadius) / 2,
                      fontWeight: 600,
                      marginRight: "10px",
                      textTransform: "none",
                      ":hover": {
                        background: Colors[resolvedTheme].cancel_hover,
                      },
                    }}
                    onClick={() => showCancelEventDialog(false)}
                  >
                    Close
                  </Button>
                  <Button
                    disableElevation
                    color="primary"
                    disabled={isRemovingEvent}
                    variant="contained"
                    sx={{
                      borderRadius: (theme) =>
                        Number(theme.shape.borderRadius) / 2,
                      color: "white",
                      fontWeight: "600",
                      textTransform: "none",
                    }}
                    onClick={async () => {
                      if (cancelDelete) {
                        setRemovingEvent(true);
                        const bSuccess = await deleteEvent(selEventId);
                        setRemovingEvent(false);
                        if (bSuccess) {
                          handleCloseMenu();
                          const index = events.findIndex(
                            (e: EventDetails) => e.id === selEventId
                          );
                          if (index != -1) events.splice(index, 1);
                        }
                      } else cancelEvent(selEventId);
                      showCancelEventDialog(false);
                    }}
                  >
                    {isRemovingEvent && (
                      <CircularProgress
                        color="inherit"
                        size="1.2rem"
                        variant="indeterminate"
                        sx={{
                          marginRight: "10px",
                        }}
                      />
                    )}
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
            </>
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "20px",
                overflow: "auto",
                width: "100%",
              }}
            >
              {eventsGroup.map(({ monthName, events, dayStr }, index) => (
                <MenuList
                  sx={{
                    display: "flex",
                    flexDirection: layout === "vertical" ? "column" : "row",
                    flexGrow: 1,
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
                        showDetailsMenu={showDetailsMenu}
                        showMenu={setAnchorElMenu}
                        onDetails={(e: EventDetails) => {
                          selectEvent(e.id);
                          showHostOnly(user?.id === event.hostId);
                          setEventLink(getEventLinkString(event.id));
                        }}
                      />
                    </div>
                  ))}
                </MenuList>
              ))}
            </div>
          ) : (
            <div className={styles.carousel_container}>
              <div
                style={{ display: "block", width: `${items * itemWidth}px` }}
              >
                <Carousel
                  swipeable={false}
                  autoPlay={false}
                  shouldResetAutoplay={false}
                  containerClass="carousel-container"
                  responsive={responsive}
                  slidesToSlide={1}
                  arrows={true}
                  showDots={false}
                  itemClass={styles.carousel_item}
                  renderButtonGroupOutside={true}
                >
                  {events.map((event: EventDetails, index: number) => (
                    <React.Fragment key={index}>
                      <EventCell
                        layout="vertical"
                        event={event}
                        showDetailsMenu={showDetailsMenu}
                        showMenu={setAnchorElMenu}
                        onDetails={(e: EventDetails) => {
                          selectEvent(e.id);
                          showHostOnly(user?.id === event.hostId);
                          setEventLink(getEventLinkString(event.id));
                        }}
                      />
                    </React.Fragment>
                  ))}
                </Carousel>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
