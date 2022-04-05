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
import { shortenAddress } from "lib/utils";
import { useTheme } from "next-themes";
import styles from "styles/components/Preview.module.scss";

export default function Preview({
  eventName,
  eventLocation,
  host,
  avatar,
  address,
  eventDay,
  eventPeriod,
  privacy,
  invitable,
  view,
}: {
  eventName: any;
  eventLocation: any;
  host: any;
  avatar: any;
  address: any;
  eventDay: any;
  eventPeriod: any;
  privacy: any;
  invitable: any;
  view: any;
}) {
  const { resolvedTheme } = useTheme();
  return (
    <div
      className={styles.preview}
      style={{
        border: Colors[resolvedTheme].preview_border,
      }}
    >
      <div className={styles.upper}>
        <div className={styles.calendar_top}></div>
        <div
          className={styles.calendar_bottom}
          style={{
            background: Colors[resolvedTheme].drawer_bg,
          }}
        >
          {eventDay}
        </div>
        <span className={styles.period}>{eventPeriod}</span>
        <div className={styles.name}>
          {eventName ? (
            <span>{eventName}</span>
          ) : (
            <span style={{ color: Colors[resolvedTheme].privacy_border }}>
              Event name
            </span>
          )}
        </div>
        <span
          style={{
            marginTop: "5px",
            color: Colors[resolvedTheme].privacy_border,
          }}
        >
          {eventLocation?.name || "Location"}
        </span>
        <div
          className={
            view === "Desktop" ? styles.desktop_info : styles.mobile_info
          }
          style={{
            backgroundColor:
              privacy === "Public" ? "unset" : Colors[resolvedTheme].drawer_bg,
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
          backgroundColor: Colors[resolvedTheme].drawer_bg,
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
                style={{ color: Colors[resolvedTheme].secondary }}
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
            {eventLocation && (
              <div className={styles.event_host}>
                <FmdGoodIcon
                  style={{ color: Colors[resolvedTheme].secondary }}
                />
                <b>{eventLocation.name}</b>
              </div>
            )}
            {privacy === "Private" && (
              <div className={styles.event_host}>
                <LockIcon style={{ color: Colors[resolvedTheme].secondary }} />
                <span>Private &bull; Only people who are invited</span>
              </div>
            )}
            {privacy === "Public" && (
              <div className={styles.event_host}>
                <PublicIcon
                  style={{ color: Colors[resolvedTheme].secondary }}
                />
                <span>Public &bull; Anyone on or off Impish</span>
              </div>
            )}
            <span
              style={{ fontSize: 12, color: Colors[resolvedTheme].secondary }}
            >
              No details yet
            </span>
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
          {eventLocation && (
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
                center={{
                  lat: eventLocation?.geometry?.location?.lat(),
                  lng: eventLocation?.geometry?.location?.lng(),
                }}
                options={{
                  draggable: false,
                  fullscreenControl: false,
                  keyboardShortcuts: false,
                  streetViewControl: false,
                  zoomControl: false,
                }}
                zoom={14}
              >
                <MapMarker
                  lat={eventLocation?.geometry?.location?.lat()}
                  lng={eventLocation?.geometry?.location?.lng()}
                >
                  <RoomIcon
                    style={{
                      color: "red",
                    }}
                  />
                </MapMarker>
              </GoogleMapReact>
              <span>{eventLocation?.name}</span>
            </div>
          )}
          <div
            className={styles.guest_list}
            style={{
              backgroundColor: Colors[resolvedTheme].header_bg,
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
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
              style={{ backgroundColor: Colors[resolvedTheme].hover }}
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
