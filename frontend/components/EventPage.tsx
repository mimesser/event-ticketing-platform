import {
  Backdrop,
  Box,
  Button,
  Divider,
  IconButton,
  ListItem,
  ListItemText,
  Modal,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  Close,
  EditRounded,
  Email,
  FmdGood,
  Lock,
  PeopleAlt,
  Public,
  Room,
} from "@mui/icons-material";
import GoogleMapReact from "google-map-react";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import React from "react";
import AvatarEditor from "react-avatar-editor";

import Avatar from "components/Avatar";
import InviteModal from "components/InviteModal";
import Layout from "components/Layout";
import MapMarker from "components/MapMarker";
import Colors from "lib/colors";
import { useEvent, useUser } from "lib/hooks";
import { shortenAddress, getLocationString, modalStyleUtil } from "lib/utils";
import MapStyle from "lib/mapstyle";
import styles from "styles/components/Preview.module.scss";
import LoadingScene from "./LoadingScene";
import EventDetailsMenu from "./events/EventDetailsMenu";

function Event({ eventId }: { eventId: number }) {
  const { resolvedTheme } = useTheme();
  const isMobile = useMediaQuery("(max-width:599px)");

  const router = useRouter();
  const { user, loading: loadingUser } = useUser();
  const { event, loading } = useEvent(eventId);

  React.useEffect(() => {
    if (
      !loading &&
      !loadingUser &&
      (event === undefined || (!user && event?.privacySetting !== "Public"))
    ) {
      router.push({
        pathname: "/events/",
      });
    }
  }, [user, event, router, loading, loadingUser]);

  const cover = event?.coverPhoto
    ? JSON.parse(event?.coverPhoto)
    : { url: "", pos: {} };
  const eventDay = moment(event?.startTime).date();
  const eventLocation = event?.location
    ? JSON.parse(event?.location)
    : {
        hasLocation: false,
        name: "",
        location: {
          lat: 0,
          lng: 0,
        },
      };

  const getEventTimeStr = () => {
    const sDate = moment(event.startTime);
    return (
      sDate.format("dddd, MMMM DD, YYYY") + " AT " + sDate.format("h:mm A")
    );
  };

  const [fullCover, showFullCover] = React.useState(false);
  const [guestModal, showGuestModal] = React.useState(false);
  const [inviteModal, showInviteModal] = React.useState(false);

  const modalStyle = modalStyleUtil(resolvedTheme);
  const gotoEditPage = () => {
    router.push(`/events/edit/${eventId}`);
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const showMenu = (e: HTMLElement) => setAnchorEl(e);
  const closeMenu = () => setAnchorEl(null);
  const onDeleteEvent = () => {
    router.push("/events/");
  };

  return (
    <>
      {loading || loadingUser ? (
        <LoadingScene />
      ) : !event ? (
        <></>
      ) : (
        <Layout>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              overflow: "initial",
            }}
            className={styles.preview}
          >
            <div
              style={{
                width: "calc(100% + 40px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: Colors[resolvedTheme]?.header_bg,
                margin: "0 -20px",
                position: "relative",
              }}
            >
              {cover.url && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "250px",
                    filter: "blur(20px)",
                    opacity: 0.5,
                  }}
                >
                  <Image src={cover.url} layout="fill" alt="" />
                </div>
              )}
              <div
                style={{
                  maxWidth: "900px",
                  width: "100%",
                }}
              >
                <div
                  className={styles.upper}
                  style={{
                    borderRadius: "10px",
                    gap: "8px",
                  }}
                >
                  {cover.url && (
                    <div
                      className={styles.cover}
                      style={{
                        height: 250,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        margin: "-10px -25px 0 -25px",
                      }}
                    >
                      <div
                        style={{
                          overflow: "hidden",
                          zIndex: 10,
                        }}
                        onClick={() => showFullCover(true)}
                      >
                        <AvatarEditor
                          image={cover.url}
                          width={500}
                          height={250}
                          border={0}
                          position={cover.pos}
                          style={{
                            borderRadius: "10px",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div
                    className={styles.calendar}
                    style={
                      cover.url
                        ? {
                            marginTop: -45,
                            zIndex: 10,
                          }
                        : {}
                    }
                  >
                    <div className={styles.calendar_top}></div>
                    <div
                      className={styles.calendar_bottom}
                      style={{
                        background: Colors[resolvedTheme].drawer_bg,
                        boxShadow:
                          resolvedTheme === "light"
                            ? "0px 0px 5px rgba(0, 0, 0, 0.2)"
                            : "0px 0px 12px rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      {isNaN(eventDay) ? "" : eventDay}
                    </div>
                  </div>
                  <span className={styles.period}>{getEventTimeStr()}</span>

                  <div className={styles.name}>
                    {event.title ? (
                      <span>{event.title}</span>
                    ) : (
                      <span
                        style={{
                          color: Colors[resolvedTheme].privacy_border,
                        }}
                      >
                        Event name
                      </span>
                    )}
                  </div>
                  <div style={{ marginTop: "5px" }}>
                    {eventLocation?.name && <span>{eventLocation?.name}</span>}
                  </div>
                  <Divider
                    sx={{ borderBottom: Colors[resolvedTheme].border }}
                  />
                  <div
                    className={styles.desktop_info}
                    style={{
                      justifyContent: "flex-end",
                      marginTop: "0px",
                      padding: "0px",
                    }}
                  >
                    <div className={styles.row}>
                      <Button
                        sx={{
                          borderRadius: "5px",
                          textTransform: "none",
                          fontSize: "15px",
                          color: Colors[resolvedTheme].primary,
                          backgroundColor: Colors[resolvedTheme].tab_divider,
                          "&:hover": {
                            backgroundColor: Colors[resolvedTheme].back_hover,
                          },
                          fontWeight: 500,
                        }}
                        disableRipple
                        onClick={() => showInviteModal(true)}
                      >
                        <Email
                          fontSize="small"
                          sx={{ marginLeft: "2px", marginRight: "8px" }}
                        />
                        Invite
                      </Button>
                      <Button
                        sx={{
                          borderRadius: "5px",
                          textTransform: "none",
                          fontSize: "15px",
                          color: Colors[resolvedTheme].primary,
                          backgroundColor: Colors[resolvedTheme].tab_divider,
                          "&:hover": {
                            backgroundColor: Colors[resolvedTheme].back_hover,
                          },
                          fontWeight: 500,
                        }}
                        disableRipple
                        onClick={gotoEditPage}
                      >
                        <EditRounded
                          fontSize="small"
                          sx={{ marginLeft: "2px", marginRight: "8px" }}
                        />
                        Edit
                      </Button>
                      <Button
                        sx={{
                          background: Colors[resolvedTheme].tab_divider,
                          "&:hover": {
                            backgroundColor: Colors[resolvedTheme].back_hover,
                          },
                          color: Colors[resolvedTheme].primary,
                          verticalAlign: "middle",
                          fontWeight: 500,
                        }}
                        disableRipple
                        onClick={(e) => {
                          showMenu(e.currentTarget);
                        }}
                      >
                        ...
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                className={
                  isMobile ? styles.mobile_lower : styles.desktop_lower
                }
                style={{
                  minHeight: "45vh",
                  maxWidth: "900px",
                  width: "100%",
                }}
              >
                <div className={styles.event_info}>
                  <div
                    className={styles.event_details}
                    style={{
                      backgroundColor: Colors[resolvedTheme]?.header_bg,
                      boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>Details</span>
                    <Box
                      component="div"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                        cursor: "pointer",
                        ":hover": {
                          backgroundColor: Colors[resolvedTheme].hover,
                        },
                        margin: "0 -15px",
                        padding: "15px",
                      }}
                      onClick={() => showGuestModal(true)}
                    >
                      <div className={styles.event_host}>
                        <PeopleAlt
                          style={{
                            color: Colors[resolvedTheme].secondary,
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          1 person
                          <span
                            className={styles.mobile_hide}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              marginLeft: 4,
                            }}
                          >
                            going, including{" "}
                            {event.name
                              ? event.name
                              : event.username
                              ? `@${event.username}`
                              : shortenAddress(event.walletAddress)}
                          </span>
                        </div>
                      </div>
                      <Avatar
                        avatarImage={event.avatarImage}
                        walletAddress={event.walletAddress}
                        size={32}
                        style={{
                          marginLeft: 30,
                        }}
                      />
                    </Box>

                    <div className={styles.event_host}>
                      <Room
                        style={{
                          color: Colors[resolvedTheme].secondary,
                        }}
                      />
                      Event by
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          ":hover": { textDecoration: "underline" },
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          router.push(
                            "/" + (event.username || event.walletAddress)
                          )
                        }
                      >
                        {event.name
                          ? event.name
                          : event.username
                          ? `@${event.username}`
                          : shortenAddress(event.walletAddress)}
                      </Typography>
                    </div>
                    {eventLocation?.name && (
                      <div className={styles.event_host}>
                        <FmdGood
                          style={{
                            color: Colors[resolvedTheme].secondary,
                          }}
                        />
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            ":hover": { textDecoration: "underline" },
                            cursor: "pointer",
                          }}
                        >
                          {eventLocation?.name}
                        </Typography>
                      </div>
                    )}
                    {event.privacySetting === "Private" && (
                      <div className={styles.event_host}>
                        <Lock
                          style={{
                            color: Colors[resolvedTheme].secondary,
                          }}
                        />
                        <span>Private &bull; Only people who are invited</span>
                      </div>
                    )}
                    {event.privacySetting === "Public" && (
                      <div className={styles.event_host}>
                        <Public
                          style={{
                            color: Colors[resolvedTheme].secondary,
                          }}
                        />
                        <span>Public &bull; Anyone on or off Impish</span>
                      </div>
                    )}
                    {event.description ? (
                      <span
                        style={{
                          fontSize: 15,
                          color: Colors[resolvedTheme].primary,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {event.description}
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: 15,
                          color: Colors[resolvedTheme].secondary,
                          whiteSpace: "pre-line",
                        }}
                      >
                        No details yet
                      </span>
                    )}
                  </div>
                  {event.privacySetting === "Public" && (
                    <div
                      className={styles.event_details}
                      style={{
                        backgroundColor: Colors[resolvedTheme]?.header_bg,
                        boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>Meet Your Host</span>
                      <div
                        className={styles.event_host_info}
                        style={{
                          border: Colors[resolvedTheme].preview_border,
                        }}
                      >
                        <Avatar
                          avatarImage={event.avatarImage}
                          walletAddress={event.walletAddress}
                          size={160}
                          style={{ padding: 10 }}
                        />
                        <Typography sx={{ pb: 2 }} fontWeight="bold">
                          {event.name
                            ? event.name
                            : event.username
                            ? `@${event.username}`
                            : shortenAddress(event.walletAddress)}
                        </Typography>
                        <div
                          className={styles.divider}
                          style={{
                            backgroundColor: Colors[resolvedTheme].hover,
                            width: "calc(100% - 20px)",
                          }}
                        />
                        <Button
                          disableElevation
                          disableRipple
                          variant="contained"
                          sx={{
                            borderRadius: (theme) =>
                              Number(theme.shape.borderRadius) / 2,
                            color: Colors[resolvedTheme].primary,
                            backgroundColor: Colors[resolvedTheme].tab_divider,
                            cursor: "default",
                            "&:hover": {
                              backgroundColor:
                                Colors[resolvedTheme].tab_divider,
                            },
                            fontWeight: "bold",
                            textTransform: "none",
                            m: 1,
                            width: "calc(100% - 20px)",
                          }}
                        >
                          Follow
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.event_info}>
                  {eventLocation?.hasLocation && (
                    <div
                      className={styles.map_info}
                      style={{
                        backgroundColor: Colors[resolvedTheme]?.header_bg,
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <GoogleMapReact
                        bootstrapURLKeys={{
                          key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API || "",
                          libraries: ["places"],
                        }}
                        center={eventLocation?.location}
                        options={{
                          draggable: false,
                          fullscreenControl: false,
                          keyboardShortcuts: false,
                          streetViewControl: false,
                          zoomControl: false,
                          styles: MapStyle[resolvedTheme],
                        }}
                        zoom={14}
                      >
                        <MapMarker
                          lat={eventLocation?.location?.lat}
                          lng={eventLocation?.location?.lng}
                        >
                          <Room
                            style={{
                              color: "red",
                            }}
                          />
                        </MapMarker>
                      </GoogleMapReact>
                      <Box
                        component="div"
                        sx={{
                          borderRadius: "5px",
                          ":hover": {
                            backgroundColor: Colors[resolvedTheme].hover,
                          },
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <span
                          style={{
                            padding: "5px 16px",
                            marginTop: "8px",
                          }}
                        >
                          {eventLocation?.name}
                        </span>
                        <span
                          style={{
                            padding: "0px 16px 5px",
                            marginBottom: "8px",
                            color: Colors[resolvedTheme].secondary,
                            fontSize: 14,
                            fontWeight: 500,
                          }}
                        >
                          {getLocationString(eventLocation?.location)}
                        </span>
                      </Box>
                    </div>
                  )}
                  <div
                    className={styles.guest_list}
                    style={{
                      backgroundColor: Colors[resolvedTheme]?.header_bg,
                      boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
                      marginBottom: "12px",
                    }}
                  >
                    <div className={styles.between}>
                      <span style={{ fontWeight: "bold" }}>Guest List</span>
                      <Typography
                        color="primary"
                        fontWeight={300}
                        fontSize={14}
                        sx={{
                          ":hover": {
                            textDecoration: "underline",
                            cursor: "pointer",
                          },
                        }}
                        onClick={() => showGuestModal(true)}
                      >
                        See All
                      </Typography>
                    </div>
                    <div
                      className={styles.between}
                      style={{ margin: "0 30px" }}
                    >
                      <Box
                        className={styles.col}
                        sx={{
                          ":hover": {
                            backgroundColor: Colors[resolvedTheme].hover,
                          },
                          padding: "5px 15px",
                          cursor: "pointer",
                          borderRadius: "5px",
                        }}
                        onClick={() => showGuestModal(true)}
                      >
                        <span style={{ fontWeight: "bold" }}>1</span>
                        <span
                          style={{
                            color: Colors[resolvedTheme].secondary,
                            fontSize: 14,
                          }}
                        >
                          GOING
                        </span>
                      </Box>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <EventDetailsMenu
            event={event}
            anchorElMenu={anchorEl}
            closeMenu={closeMenu}
            onDeleteEvent={onDeleteEvent}
          />

          {cover.url && (
            <Backdrop
              sx={{
                background: "rgba(61, 64, 51, 0.9)",
                zIndex: (theme) => theme.zIndex.drawer + 1,
                padding: "50px",
                cursor: "pointer",
              }}
              open={fullCover}
              onClick={() => showFullCover(false)}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${cover.url})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 16,
                  top: 16,
                  cursor: "pointer",
                }}
              >
                <IconButton
                  aria-label="close"
                  sx={{
                    backgroundColor: "rgba(61, 64, 51, 0.75)",
                    color: "white",
                    width: "36px",
                    height: "36px",
                  }}
                >
                  <Close />
                </IconButton>
              </div>
            </Backdrop>
          )}

          <Modal
            BackdropProps={{
              timeout: 500,
            }}
            closeAfterTransition
            onClose={() => {
              showGuestModal(false);
            }}
            open={guestModal}
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
          >
            <Box sx={modalStyle}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 -32px",
                }}
              >
                <div
                  style={{
                    margin: "-12px 0px 12px 0px",
                  }}
                >
                  <b>Guests</b>
                  <IconButton
                    aria-label="close"
                    onClick={() => {
                      showGuestModal(false);
                    }}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: 10,
                    }}
                    size="small"
                    sx={{
                      ":hover": {
                        backgroundColor: Colors[resolvedTheme].hover,
                      },
                    }}
                  >
                    <Close
                      sx={{
                        color: Colors[resolvedTheme]?.primary,
                      }}
                    />
                  </IconButton>
                </div>
                <Divider
                  sx={{
                    width: "100%",
                    borderBottom: Colors[resolvedTheme].border,
                  }}
                />
                <div
                  style={{ marginTop: "8px", width: "300px", height: "60vh" }}
                >
                  <ListItem
                    id="drawer_profile_button"
                    button
                    sx={{
                      borderRadius: "10px",
                      ":hover": {
                        backgroundColor: Colors[resolvedTheme].hover,
                      },
                    }}
                    style={{
                      margin: "0px 0",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      padding: "12px",
                    }}
                    onClick={() =>
                      router.push("/" + (event.username || event.walletAddress))
                    }
                  >
                    <Avatar
                      avatarImage={event.avatarImage}
                      walletAddress={event.walletAddress}
                      size={36}
                    />
                    <ListItemText
                      disableTypography
                      style={{
                        marginLeft: "6%",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textAlign: "left",
                        textOverflow: "ellipsis",
                        color: Colors[resolvedTheme].primary,
                      }}
                      sx={{
                        ":hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {event.name
                        ? event.name
                        : event.username
                        ? `@${event.username}`
                        : shortenAddress(event.walletAddress)}
                    </ListItemText>
                  </ListItem>
                </div>
              </div>
            </Box>
          </Modal>

          {inviteModal && (
            <InviteModal onClose={() => showInviteModal(false)} />
          )}
        </Layout>
      )}
    </>
  );
}

export default Event;
