import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import GroupSharpIcon from "@mui/icons-material/GroupSharp";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Layout from "components/Layout";
import Colors from "lib/colors";
import { useRouter } from "next/router";
import { getLoginSession } from "lib/auth";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import DesktopMacIcon from "@mui/icons-material/DesktopMac";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import Preview from "components/EventPreview";
import { useNewEvent } from "lib/event-context";
import { useUserInfo } from "lib/user-context";
import moment from "moment";

function Create() {
  const router = useRouter();
  const [eventCreate, setEventCreate] = useState(false);
  const { resolvedTheme } = useTheme();

  const { user } = useUserInfo();
  const { eventName, startDate, endDate } = useNewEvent();
  const [eventDay, setEventDay] = useState<any>();
  const [eventPeriod, setEventPeriod] = useState<any>();
  useEffect(() => {
    const sDate = moment(startDate);
    setEventDay(sDate.date());
    let period =
      sDate.format("dddd, MMMM DD, YYYY") + " AT " + sDate.format("h:mm A");
    if (endDate) {
      period += " - ";

      const tDate = moment(endDate);
      if (!sDate.isSame(tDate, "day")) {
        period += tDate.format("dddd, MMMM DD, YYYY") + " AT ";
      }
      period += tDate.format("h:mm A");
    }
    var zone = new Date()
      .toLocaleTimeString("en-us", { timeZoneName: "short" })
      .split(" ")[2];
    period += " " + zone;
    setEventPeriod(period);
  }, [startDate, endDate]);

  const createEvent = () => {
    setEventCreate(true);
    router.push({
      pathname: "/events/create",
      query: { createEvent: true },
    });
  };

  useEffect(() => {
    if (router.isReady) {
      const query = router.query;
      if (query.createEvent) {
        if (query.createEvent === "true") {
          setEventCreate(true);
        }
      }
    }
  }, [router.isReady, router.query]);

  const [previewMode, setPreviewMode] = useState("Desktop");

  return (
    <Layout>
      <>
        {!eventCreate ? (
          <Box
            component="div"
            style={{
              display: "flex",
              height: "80vh",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Grid container width={200} direction="column" alignItems="center">
              <Typography
                gutterBottom
                variant="h6"
                sx={{
                  color: Colors[resolvedTheme]?.primary,
                  textAlign: "left",
                  fontWeight: 900,
                  alignSelf: "start",
                }}
              >
                Create Event
              </Typography>
              <IconButton
                onClick={createEvent}
                sx={{
                  ":hover": {
                    borderRadius: "0",
                    padding: "0",
                  },
                  padding: "0px",
                }}
              >
                <Card
                  sx={{
                    p: 3,
                    backgroundColor: Colors[resolvedTheme]?.header_bg,
                    ":hover": {
                      backgroundColor: Colors[resolvedTheme]?.icon_bg,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <IconButton
                      disableRipple
                      sx={{
                        margin: "auto",
                        backgroundColor: Colors[resolvedTheme]?.icon_bg,
                        ":hover": {
                          backgroundColor: Colors[resolvedTheme]?.icon_bg,
                        },
                      }}
                    >
                      <GroupSharpIcon
                        sx={{
                          color: Colors[resolvedTheme]?.primary,
                        }}
                      />
                    </IconButton>
                  </Box>
                  <IconButton
                    disableRipple
                    sx={{
                      display: "flex",
                      margin: "auto",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        textAlign: "center",
                        color: Colors[resolvedTheme]?.primary,
                      }}
                    >
                      In Person
                    </Typography>
                  </IconButton>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      textAlign: "center",
                      color: Colors[resolvedTheme]?.secondary,
                    }}
                  >
                    Get together with people at a specific location
                  </Typography>
                </Card>
              </IconButton>
            </Grid>
          </Box>
        ) : (
          <Box
            component="div"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: Colors[resolvedTheme].header_bg,
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
                border: Colors[resolvedTheme].border,
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
                          : Colors[resolvedTheme].primary,
                      marginRight: "-5px",
                      ":hover": {
                        backgroundColor: Colors[resolvedTheme].hover,
                      },
                    }}
                  >
                    <DesktopMacIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => setPreviewMode("Mobile")}
                    sx={{
                      color: (theme) =>
                        previewMode === "Mobile"
                          ? theme.palette.primary.main
                          : Colors[resolvedTheme].primary,
                      ":hover": {
                        backgroundColor: Colors[resolvedTheme].hover,
                      },
                    }}
                  >
                    <PhoneIphoneIcon />
                  </IconButton>
                </div>
              </div>

              <Preview
                eventName={eventName}
                host={user?.name}
                avatar={user?.avatarImage}
                address={user?.walletAddress}
                eventDay={eventDay}
                eventPeriod={eventPeriod}
                view={previewMode}
              />
            </div>
          </Box>
        )}
      </>
    </Layout>
  );
}
export async function getServerSideProps(context: any) {
  const session = await getLoginSession(context.req);

  if (session) {
    return {
      props: {},
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: `/events`,
      },
    };
  }
}

export default Create;
