import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EmailIcon from "@mui/icons-material/Email";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import Avatar from "boring-avatars";
import Colors from "lib/colors";
import { shortenAddress } from "lib/utils";
import Image from "next/image";
import { useTheme } from "next-themes";
import styles from "styles/components/Preview.module.scss";

export default function Preview({
  eventName,
  host,
  avatar,
  address,
  eventDay,
  eventPeriod,
  view,
}: {
  eventName: any;
  host: any;
  avatar: any;
  address: any;
  eventDay: any;
  eventPeriod: any;
  view: any;
}) {
  const { resolvedTheme } = useTheme();
  return (
    <div
      className={styles.preview}
      style={{
        border: Colors[resolvedTheme].border,
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
            <span style={{ color: Colors[resolvedTheme].secondary }}>
              Event Name
            </span>
          )}
        </div>
        <span
          style={{
            marginTop: "5px",
            color: Colors[resolvedTheme].secondary,
          }}
        >
          Location
        </span>
        <div
          className={
            view === "Desktop" ? styles.desktop_info : styles.mobile_info
          }
          style={{
            backgroundColor: Colors[resolvedTheme].drawer_bg,
          }}
        >
          <div className={styles.row}>
            <div className={styles.avatar}>
              {avatar ? (
                <Image src={avatar} width={24} height={24} alt="Avatar" />
              ) : (
                <Avatar
                  size={24}
                  name={address}
                  variant="pixel"
                  colors={[
                    "#ffad08",
                    "#edd75a",
                    "#73b06f",
                    "#0c8f8f",
                    "#405059",
                  ]}
                />
              )}
            </div>
            <span>
              <b>{host || shortenAddress(address)}</b>
              &nbsp;invited you
            </span>
          </div>
          <div className={styles.row}>
            <div
              className={styles.status_item}
              style={{ backgroundColor: Colors[resolvedTheme].header_bg }}
            >
              <CheckCircleOutlineIcon />
              Going
            </div>
            <div
              className={styles.status_item}
              style={{ backgroundColor: Colors[resolvedTheme].header_bg }}
            >
              <HelpOutlineIcon />
              Maybe
            </div>
            <div
              className={styles.status_item}
              style={{ backgroundColor: Colors[resolvedTheme].header_bg }}
            >
              <HighlightOffIcon />
              Can&apos;t Go
            </div>
            <div
              className={styles.status_item}
              style={{ backgroundColor: Colors[resolvedTheme].header_bg }}
            >
              <EmailIcon />
              Invite
            </div>
          </div>
        </div>
      </div>

      <div
        className={
          view === "Desktop" ? styles.desktop_lower : styles.mobile_lower
        }
        style={{
          backgroundColor: Colors[resolvedTheme].drawer_bg,
        }}
      >
        <div
          className={styles.event_details}
          style={{
            backgroundColor: Colors[resolvedTheme].header_bg,
          }}
        >
          <span>Details</span>
          <div className={styles.event_host}>
            <PeopleAltIcon />1 person going, including{" "}
            {host || shortenAddress(address)}
          </div>
          <div className={styles.avatar} style={{ marginLeft: 30 }}>
            {avatar ? (
              <Image src={avatar} width={24} height={24} alt="Avatar" />
            ) : (
              <Avatar
                size={24}
                name={address}
                variant="pixel"
                colors={["#ffad08", "#edd75a", "#73b06f", "#0c8f8f", "#405059"]}
              />
            )}
          </div>
          <span>No details yet</span>
        </div>
        <div
          className={styles.guest_list}
          style={{
            backgroundColor: Colors[resolvedTheme].header_bg,
          }}
        >
          <div className={styles.between}>
            <span>Guest List</span>
            <span>See All</span>
          </div>
          <div className={styles.between} style={{ margin: "0 30px" }}>
            <div className={styles.col}>
              <span>1</span>
              <span>GOING</span>
            </div>
            <div className={styles.col}>
              <span>0</span>
              <span>MAYBE</span>
            </div>
            <div className={styles.col}>
              <span>1</span>
              <span>INVITED</span>
            </div>
          </div>
          <div
            className={styles.divider}
            style={{ backgroundColor: Colors[resolvedTheme].hover }}
          />
          <div className={styles.row}>
            <div className={styles.avatar} style={{ width: 36, height: 36 }}>
              {avatar ? (
                <Image src={avatar} width={36} height={36} alt="Avatar" />
              ) : (
                <Avatar
                  size={36}
                  name={address}
                  variant="pixel"
                  colors={[
                    "#ffad08",
                    "#edd75a",
                    "#73b06f",
                    "#0c8f8f",
                    "#405059",
                  ]}
                />
              )}
            </div>
            <div className={styles.col} style={{ alignItems: "start" }}>
              <span>{host || shortenAddress(address)}</span>
              <span>Host</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
