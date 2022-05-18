import { Box, IconButton } from "@mui/material";
import { DesktopMac, PhoneIphone } from "@mui/icons-material";
import React from "react";
import moment from "moment";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";

import Preview from "components/EventPreview";
import Layout from "components/Layout";
import LoadingScene from "components/LoadingScene";
import Colors from "lib/colors";
import { useNewEvent } from "lib/event-context";
import { useUserInfo } from "lib/user-context";
import { extractDateAndTime, getLocalTimezone } from "lib/utils";
import { useEvent } from "lib/hooks";

function EditEvent() {
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  const eventId: number = parseInt((router.query.eventId as string) ?? "-1");

  const [previewMode, setPreviewMode] = React.useState("Desktop");

  const { user, loading: loadingUser } = useUserInfo();
  const [loading, setLoading] = React.useState<boolean>(false);
  const {
    eventName,
    eventLocation,
    timezone,
    eventDescription,
    eventStartDate,
    eventEndDate,
    privacy,
    invitable,
    cover,
    setEventId,
    setEventName,
    setEventLocation,
    setTimezone,
    setEventDescription,
    setStartDateAndTime,
    setEndDateAndTime,
    setEventPrivacy,
    setEventInvitable,
    setCover,
    setShowGuestList,
    setCoHosts,
  } = useNewEvent();

  const [eventDay, setEventDay] = React.useState<any>();
  const [eventPeriod, setEventPeriod] = React.useState<any>();

  const DESKTOP_DATE_FORMAT = "dddd, MMMM DD, YYYY";
  const DESKTOP_DATE_SEPARATOR = " AT ";
  const MOBILE_DATE_FORMAT = "MMM DD, YYYY";
  const MOBILE_DATE_SEPARATOR = ", ";

  React.useEffect(() => {
    const loadEventContext = async () => {
      if (eventId <= 0 || loadingUser) return;
      setLoading(true);
      const { event: e } = await (
        await fetch("/api/event/event-by-id", {
          method: "POST",
          body: JSON.stringify({
            eventId,
          }),
        })
      ).json();

      if (!e || !(user && user?.id === e?.hostId)) {
        router.push("/events/");
        setLoading(false);
        return;
      }

      setEventId(e?.id);
      setEventName(e?.title);
      if (e?.location) setEventLocation(JSON.parse(e?.location));
      setEventDescription(e?.description);
      const [startDate, startTime] = extractDateAndTime(e?.startTime);
      setStartDateAndTime(startDate, startTime);
      if (e?.endTime) {
        const [endDate, endTime] = extractDateAndTime(e?.endTime);
        setEndDateAndTime(true, endDate, endTime);
      }
      setEventPrivacy(e?.privacySetting);
      setEventInvitable(e?.invitable);
      if (e?.coverPhoto) setCover(JSON.parse(e?.coverPhoto));
      setShowGuestList(e?.showGuestList);
      setCoHosts(e?.coHosts);
      setLoading(false);
    };

    loadEventContext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, loadingUser]);

  React.useEffect(() => {
    const getDateFormat = () => {
      if (previewMode === "Mobile") return MOBILE_DATE_FORMAT;
      return DESKTOP_DATE_FORMAT;
    };
    const getDateSeparator = () => {
      if (previewMode === "Mobile") return MOBILE_DATE_SEPARATOR;
      return DESKTOP_DATE_SEPARATOR;
    };

    const sDate = moment(eventStartDate);
    setEventDay(sDate.date());
    let period =
      sDate.format(getDateFormat()) +
      getDateSeparator() +
      sDate.format("h:mm A");
    if (eventEndDate) {
      period += " - ";

      const tDate = moment(eventEndDate);
      if (!sDate.isSame(tDate, "day")) {
        period += tDate.format(getDateFormat()) + getDateSeparator();
      }
      period += tDate.format("h:mm A");
    }
    setEventPeriod(period);
  }, [eventStartDate, eventEndDate, previewMode]);

  React.useEffect(() => {
    if (router.isReady) {
      setTimezone(getLocalTimezone());
      setEventLocation({});
    }
  }, [router.isReady, setEventLocation, setTimezone]);

  return (
    <>
      {loadingUser || loading ? (
        <LoadingScene width={"100%"} height={"calc(100vh - 64px)"} />
      ) : (
        <Layout>
          <Box
            component="div"
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "20px 0",
              maxHeight: "calc(100% - 104px)",
            }}
          >
            <div
              style={{
                background: Colors[resolvedTheme]?.header_bg,
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
                border: Colors[resolvedTheme]?.border,
                padding: "15px",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                maxWidth: previewMode === "Desktop" ? "900px" : "500px",
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  marginBottom: "10px",
                  marginTop: "-5px",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontWeight: 500 }}>{previewMode} Preview</span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <IconButton
                    onClick={() => setPreviewMode("Desktop")}
                    sx={{
                      color: (theme) =>
                        previewMode === "Desktop"
                          ? theme.palette.primary.main
                          : Colors[resolvedTheme]?.primary,
                      marginRight: "-5px",
                      ":hover": {
                        backgroundColor: Colors[resolvedTheme]?.hover,
                      },
                    }}
                  >
                    <DesktopMac />
                  </IconButton>
                  <IconButton
                    onClick={() => setPreviewMode("Mobile")}
                    sx={{
                      color: (theme) =>
                        previewMode === "Mobile"
                          ? theme.palette.primary.main
                          : Colors[resolvedTheme]?.primary,
                      ":hover": {
                        backgroundColor: Colors[resolvedTheme]?.hover,
                      },
                    }}
                  >
                    <PhoneIphone />
                  </IconButton>
                </div>
              </div>

              <Preview
                eventName={eventName}
                eventLocation={eventLocation}
                timezone={timezone}
                eventDescription={eventDescription}
                host={
                  user?.name || user?.username
                    ? `@${user?.username}`
                    : undefined
                }
                avatar={user?.avatarImage}
                address={user?.walletAddress}
                eventDay={eventDay}
                eventPeriod={eventPeriod}
                privacy={privacy}
                invitable={invitable}
                cover={cover}
                view={previewMode}
              />
            </div>
          </Box>
        </Layout>
      )}
    </>
  );
}

export default EditEvent;
