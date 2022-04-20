import Button from "@mui/material/Button";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EmailIcon from "@mui/icons-material/Email";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import LockIcon from "@mui/icons-material/Lock";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PublicIcon from "@mui/icons-material/Public";
import RoomIcon from "@mui/icons-material/Room";
import Avatar from "components/Avatar";
import Typography from "@mui/material/Typography";
import MapMarker from "components/MapMarker";
import GoogleMapReact from "google-map-react";
import Colors from "lib/colors";
import { shortenAddress, getLocationString } from "lib/utils";
import { useTheme } from "next-themes";
import styles from "styles/components/Preview.module.scss";
import MapStyle from "lib/mapstyle";
import AvatarEditor from "react-avatar-editor";
import Image from "next/image";

export default function Preview({
  eventName,
  eventLocation,
  timezone,
  eventDescription,
  host,
  avatar,
  address,
  eventDay,
  eventPeriod,
  privacy,
  invitable,
  cover,
  view,
}: {
  eventName: any;
  eventLocation: any;
  timezone: any;
  eventDescription: any;
  host: any;
  avatar: any;
  address: any;
  eventDay: any;
  eventPeriod: any;
  privacy: any;
  invitable: any;
  cover: any;
  view: any;
}) {
  const { resolvedTheme } = useTheme();
  return (
    <div
      className={styles.preview}
      style={{
        backgroundColor: Colors[resolvedTheme].drawer_bg,
        border: Colors[resolvedTheme].preview_border,
      }}
    >
      <div
        className={styles.upper}
        style={{
          background: Colors[resolvedTheme].header_bg,
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
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                filter: "blur(20px)",
                opacity: 0.5,
              }}
            >
              <Image src={cover.url} layout="fill" alt="" />
            </div>
            <div
              style={{
                overflow: "hidden",
                zIndex: 10,
              }}
            >
              <AvatarEditor
                image={cover.url}
                width={500}
                height={250}
                border={0}
                position={cover.pos}
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
        <span className={styles.period}>
          {eventPeriod} {timezone.abbr}
        </span>
        <div className={styles.name}>
          {eventName ? (
            <span>{eventName}</span>
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
          {eventLocation?.name ? (
            <span>{eventLocation?.name}</span>
          ) : (
            <span
              style={{
                color: Colors[resolvedTheme].privacy_border,
              }}
            >
              Location
            </span>
          )}
        </div>
        <div
          className={
            view === "Desktop" ? styles.desktop_info : styles.mobile_info
          }
          style={{
            backgroundColor:
              privacy === "Public"
                ? "unset"
                : resolvedTheme === "light"
                ? Colors[resolvedTheme].drawer_bg
                : "#3a3b3c99",
            borderRadius: "8px",
          }}
        >
          {privacy === "Public" ? (
            <Typography
              color="primary"
              fontWeight="bold"
              sx={{
                borderBottom: (theme) =>
                  `solid 3px ${theme.palette.primary.main}`,
                width: "100%",
                paddingBottom: 1,
              }}
            >
              About
            </Typography>
          ) : (
            <div className={styles.row}>
              <Avatar avatarImage={avatar} walletAddress={address} size={32} />
              <span
                className={
                  view === "Desktop"
                    ? styles.desktop_invite
                    : styles.mobile_invite
                }
              >
                <b>{host || shortenAddress(address)}</b>
                <span>invited you</span>
              </span>
            </div>
          )}
          <div className={styles.row}>
            <div
              className={styles.status_item}
              style={{
                backgroundColor: Colors[resolvedTheme].tab_divider,
                fontWeight: 500,
              }}
            >
              <CheckCircleOutlineIcon fontSize="small" />
              Going
            </div>
            {invitable && (
              <div
                className={styles.status_item}
                style={{
                  backgroundColor: Colors[resolvedTheme].tab_divider,
                  fontWeight: 500,
                }}
              >
                <EmailIcon fontSize="small" />
                Invite
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={
          view === "Desktop" ? styles.desktop_lower : styles.mobile_lower
        }
        style={{
          minHeight: "45vh",
        }}
      >
        <div className={styles.event_info}>
          <div
            className={styles.event_details}
            style={{
              backgroundColor: Colors[resolvedTheme].header_bg,
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            <span style={{ fontWeight: "bold" }}>Details</span>
            <div className={styles.event_host}>
              <PeopleAltIcon
                style={{
                  color: Colors[resolvedTheme].secondary,
                }}
              />
              <div>
                1 person
                <span className={styles.mobile_hide}>
                  {" "}
                  going, including {host || shortenAddress(address)}
                </span>
              </div>
            </div>
            <Avatar
              avatarImage={avatar}
              walletAddress={address}
              size={32}
              style={{
                marginLeft: 30,
              }}
            />
            {eventLocation?.name && (
              <div className={styles.event_host}>
                <FmdGoodIcon
                  style={{
                    color: Colors[resolvedTheme].secondary,
                  }}
                />
                <b>{eventLocation?.name}</b>
              </div>
            )}
            {privacy === "Private" && (
              <div className={styles.event_host}>
                <LockIcon
                  style={{
                    color: Colors[resolvedTheme].secondary,
                  }}
                />
                <span>Private &bull; Only people who are invited</span>
              </div>
            )}
            {privacy === "Public" && (
              <div className={styles.event_host}>
                <PublicIcon
                  style={{
                    color: Colors[resolvedTheme].secondary,
                  }}
                />
                <span>Public &bull; Anyone on or off Impish</span>
              </div>
            )}
            {eventDescription ? (
              <span
                style={{
                  fontSize: 15,
                  color: Colors[resolvedTheme].primary,
                  whiteSpace: "pre-line",
                }}
              >
                {eventDescription}
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
          {privacy === "Public" && (
            <div
              className={styles.event_details}
              style={{
                backgroundColor: Colors[resolvedTheme].header_bg,
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
                  avatarImage={avatar}
                  walletAddress={address}
                  size={160}
                  style={{ padding: 10 }}
                />
                <Typography sx={{ pb: 2 }} fontWeight="bold">
                  {host || shortenAddress(address)}
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
                      backgroundColor: Colors[resolvedTheme].tab_divider,
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
                backgroundColor: Colors[resolvedTheme].header_bg,
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API || "",
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
                  <RoomIcon
                    style={{
                      color: "red",
                    }}
                  />
                </MapMarker>
              </GoogleMapReact>
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
            </div>
          )}
          <div
            className={styles.guest_list}
            style={{
              backgroundColor: Colors[resolvedTheme].header_bg,
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
              marginBottom: "12px",
            }}
          >
            <div className={styles.between}>
              <span style={{ fontWeight: "bold" }}>Guest List</span>
              <Typography color="primary" fontWeight={300} fontSize={14}>
                See All
              </Typography>
            </div>
            <div className={styles.between} style={{ margin: "0 30px" }}>
              <div className={styles.col}>
                <span style={{ fontWeight: "bold" }}>1</span>
                <span
                  style={{
                    color: Colors[resolvedTheme].secondary,
                    fontSize: 14,
                  }}
                >
                  GOING
                </span>
              </div>
            </div>
            <div
              className={styles.divider}
              style={{
                backgroundColor: Colors[resolvedTheme].hover,
              }}
            />
            <div className={styles.row}>
              <Avatar avatarImage={avatar} walletAddress={address} size={36} />
              <div className={styles.col} style={{ alignItems: "start" }}>
                <span>{host || shortenAddress(address)}</span>
                <span
                  style={{
                    fontSize: 12,
                    color: Colors[resolvedTheme].secondary,
                  }}
                >
                  Host
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
