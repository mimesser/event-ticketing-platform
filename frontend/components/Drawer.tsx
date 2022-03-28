/* eslint-disable react-hooks/exhaustive-deps */
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import LoadingButton from "@mui/lab/LoadingButton";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import BreadcrumLink from "@mui/material/Link";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarViewMonth from "@mui/icons-material/CalendarViewMonth";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import GroupSharpIcon from "@mui/icons-material/GroupSharp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LockIcon from "@mui/icons-material/Lock";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import useMediaQuery from "@mui/material/useMediaQuery";
import Avatar from "boring-avatars";
import moment from "moment";
import Colors from "lib/colors";
import { useNewEvent } from "lib/event-context";
import { magic } from "lib/magic";
import { useUserInfo } from "lib/user-context";
import {
  shortenAddress,
  eventTime,
  roundUpTime,
  roundUpTimePlus3,
} from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import React from "react";
import { useForm } from "react-hook-form";
import styles from "styles/components/Drawer.module.scss";

export default function Drawer() {
  const { resolvedTheme } = useTheme();
  const {
    setEventName,
    setHost,
    setAvatar,
    setAddress,
    setStartDateAndTime,
    setEndDateAndTime,
  } = useNewEvent();
  const { user } = useUserInfo();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:599px)");
  const [showCreateEvent] = React.useState(
    router.pathname === "/events/create" ? true : false
  );
  const [events] = React.useState(
    router.asPath.includes("/events") ? true : false
  );
  const [open, setOpen] = React.useState(
    router.pathname === "/events/[username]" ? true : false
  );
  const [signInEventsModal, setSignInEventsModal] = React.useState(false);
  const [privacy, setPrivacy] = React.useState("Privacy");
  const [showEndDate, setShowEndDate] = React.useState(false);
  const [eventDetails, setEventDetails] = React.useState(false);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [goToRoute, setGoToRoute] = React.useState("");
  const [startTime, setStartTime] = React.useState(roundUpTime());
  const [endTime, setEndTime] = React.useState(roundUpTimePlus3());
  const [values, setValues] = React.useState({
    eventName: "",
  });
  const [openStart, setOpenStart] = React.useState(false);
  const [openEnd, setOpenEnd] = React.useState(false);
  const [times] = React.useState(eventTime() || []);
  const [discardModal, showDiscardModal] = React.useState(false);
  const discardModalClose = () => {
    showDiscardModal(false);
  };
  const [anchorElPrivacy, setAnchorElPrivacy] = React.useState(null);
  const [signingInEvents, setSigningInEvents] = React.useState(false);

  // prompt the user if they try and leave with unsaved changes
  React.useEffect(() => {
    const warningText =
      "You have unsaved changes - are you sure you wish to leave this page?";

    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!eventDetails) return;
      if (discardModal) return;

      if (
        startDate !== null ||
        endDate !== null ||
        startTime !== roundUpTime() ||
        endTime !== roundUpTimePlus3() ||
        values.eventName !== ""
      ) {
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        // Chrome requires returnValue to be set
        e.returnValue = warningText;
      }

      return;
    };

    const handleBrowseAway = () => {
      if (!eventDetails) return;
      if (discardModal) return;

      if (
        startDate !== null ||
        endDate !== null ||
        startTime !== roundUpTime() ||
        endTime !== roundUpTimePlus3() ||
        values.eventName !== ""
      ) {
        if (window.confirm(warningText)) return;
        router.events.emit("routeChangeError");
        throw "routeChange aborted.";
      }

      return;
    };

    window.addEventListener("beforeunload", handleWindowClose);
    router.events.on("routeChangeStart", handleBrowseAway);

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      router.events.off("routeChangeStart", handleBrowseAway);
    };
  }, [
    discardModal,
    endDate,
    endTime,
    eventDetails,
    router.events,
    startDate,
    startTime,
    values.eventName,
  ]);

  React.useEffect(() => {
    setEventName(values.eventName);
  }, [values]);
  React.useEffect(() => {
    setHost(user?.name);
    setAvatar(user?.avatarImage);
    setAddress(user?.walletAddress);
  }, [user]);
  React.useEffect(() => {
    setStartDateAndTime(startDate || new Date(), startTime);
  }, [startDate, startTime]);
  React.useEffect(() => {
    setEndDateAndTime(showEndDate, endDate || new Date(), endTime);
  }, [showEndDate, endDate, endTime]);

  React.useEffect(() => {
    if (router.isReady) {
      const query = router.query;
      if (query.createEvent || router.pathname === "/events/create") {
        if (query.createEvent === "true") {
          setEventDetails(true);
        }
      }
    }
  }, [router.isReady, router.query, router.pathname]);

  const openPrivacy = Boolean(anchorElPrivacy);
  const CHARACTER_LIMIT = 99;

  const discard = () => {
    if (
      startDate !== null ||
      endDate !== null ||
      startTime !== roundUpTime() ||
      endTime !== roundUpTimePlus3() ||
      values.eventName !== ""
    ) {
      setGoToRoute("/events");
      showDiscardModal(true);
    } else {
      router.push({
        pathname: "/events",
      });
    }
  };

  const goHome = () => {
    if (
      startDate !== null ||
      endDate !== null ||
      startTime !== roundUpTime() ||
      endTime !== roundUpTimePlus3() ||
      values.eventName !== ""
    ) {
      setGoToRoute("/");
      showDiscardModal(true);
    } else {
      router.push({
        pathname: "/",
      });
    }
  };
  const leavePage = () => {
    router.push({
      pathname: goToRoute,
    });
  };

  const stayOnPage = () => {
    showDiscardModal(false);
  };

  const breadcrumbs = [
    <BreadcrumLink
      onClick={discard}
      key="1"
      sx={{
        cursor: "pointer",
        fontSize: "0.8rem",
        color: Colors[resolvedTheme].secondary,
      }}
      underline="hover"
    >
      Event
    </BreadcrumLink>,
    <BreadcrumLink
      onClick={discard}
      key="2"
      sx={{
        cursor: "pointer",
        color: Colors[resolvedTheme].secondary,
        fontSize: "0.8rem",
      }}
      underline="hover"
    >
      Create Event
    </BreadcrumLink>,
  ];
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 320,
    bgcolor: Colors[resolvedTheme]?.header_bg,
    borderRadius: "25px",
    boxShadow: 24,
    p: 4,
  };

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm();
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    formState: { errors: errors3 },
  } = useForm();
  const onSubmitEvents: any = async ({ email }: { email: any }) => {
    setSigningInEvents(true);

    try {
      const userExists = (
        await (
          await fetch("/api/signup", {
            method: "POST",
            body: JSON.stringify({
              email,
            }),
          })
        ).json()
      ).user
        ? true
        : false;

      const redirectURI = `${window.location.origin}/callback${router.asPath}/${email}/${userExists}`;

      const didToken = await magic?.auth.loginWithMagicLink({
        email,
        redirectURI,
      });

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + didToken,
        },
        body: JSON.stringify({ email }),
      });

      if (res.status === 200) {
        // redirect
        router.reload();
        setSigningInEvents(false);
      } else {
        // display an error
        setSigningInEvents(false);
      }
    } catch (error) {
      setSigningInEvents(false);
    }
  };
  const onSubmitCreateEvents: any = async ({ email }: { email: any }) => {};

  const handlePrivacyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrivacy(event.target.value);
    handleCloseEventPrivacy();
  };
  const handleClick = () => {
    router.push({
      pathname: "/events/[username]",
      query: { username: user.username || user.walletAddress },
    });
    setOpen(!open);
  };
  const createEvent = () => {
    if (user) {
      router.push({
        pathname: "/events/create",
      });
    } else {
      setSignInEventsModal(true);
    }
  };
  const handleEventNameChange = (eventName: any) => (event: any) => {
    setValues({ ...values, [eventName]: event.target.value });
  };
  const handleClickEventPrivacy = (event: any) => {
    setAnchorElPrivacy(event.currentTarget);
  };
  const handleCloseEventPrivacy = () => {
    setAnchorElPrivacy(null);
  };

  return (
    <>
      {/*  Events signIn Modal */}
      <Modal
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        onClose={() => {
          setSignInEventsModal(false);
        }}
        open={signInEventsModal}
      >
        <Box sx={modalStyle}>
          <Grid container justifyContent="center" direction="column">
            <div className={styles.modal_img}>
              <Image
                src={"/logo-" + resolvedTheme + ".png"}
                width={isMobile ? 45 : 90}
                height={isMobile ? 45 : 90}
                alt={`Impish icon`}
              />
            </div>
            <Typography
              gutterBottom
              sx={{
                textAlign: "center",
                marginBottom: "13px",
                fontFamily: "sans-serif",
                fontSize: "18px",
                fontWeight: 550,
                textTransform: "none",
              }}
              variant="body1"
            >
              Create events on Impish
            </Typography>
            <form
              onSubmit={handleSubmit2(onSubmitEvents)}
              className={styles.login_items_events}
            >
              <TextField
                fullWidth
                label="Email address"
                variant="outlined"
                autoComplete="email"
                autoFocus
                {...register2("email", {
                  required: "Required field",
                  pattern: {
                    value:
                      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                    message: "Invalid email address",
                  },
                })}
                error={!!errors2?.email}
                helperText={errors2?.email ? errors2.email.message : null}
                size="small"
                sx={{
                  input: { color: Colors[resolvedTheme].primary },
                  label: { color: Colors[resolvedTheme].secondary },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: Colors[resolvedTheme].input_border,
                    },
                    "&:hover fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                  },
                }}
              />
              <LoadingButton
                sx={{ marginTop: "13px" }}
                fullWidth
                loading={signingInEvents}
                type="submit"
                size="large"
                variant="contained"
              >
                Log in / Sign up
              </LoadingButton>
            </form>
          </Grid>
        </Box>
      </Modal>
      {/* Leave page modal */}
      <Modal
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        onClose={discardModalClose}
        open={discardModal}
      >
        <div
          className={styles.discard_modal}
          style={{ backgroundColor: Colors[resolvedTheme].header_bg }}
        >
          <span className={styles.title}>Leave Page?</span>
          <span className={styles.content}>
            Are you sure you want to leave? Your changes will be lost if you
            leave this page.
          </span>
          <span className={styles.discard} onClick={leavePage}>
            Leave
          </span>
          <span className={styles.cancel} onClick={stayOnPage}>
            Stay
          </span>
        </div>
      </Modal>
      <Toolbar sx={{ display: showCreateEvent ? "none" : "flex" }} />
      {!events ? (
        <List
          sx={{
            "&& .Mui-selected": {
              "&, & .MuiListItemText-root": {
                color: (theme) => theme.palette.primary.main,
              },
              backgroundColor: Colors[resolvedTheme].selected_drawer_menu,
            },
            px: 2,
          }}
        >
          {user && (
            <ListItem
              button
              sx={{
                borderRadius: (theme) => theme.shape.borderRadius,
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
              selected={router.pathname === "/[username]"}
            >
              <div className={styles.account}>
                {user.avatarImage ? (
                  <Image
                    src={user.avatarImage}
                    width={36}
                    height={36}
                    alt="Avatar"
                  />
                ) : (
                  <Avatar
                    size={36}
                    name={user.walletAddress}
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
              <Link
                href={`/${encodeURIComponent(
                  user.username || user.walletAddress
                )}`}
                passHref
              >
                <ListItemText
                  disableTypography
                  style={{
                    height: 16,
                    marginLeft: "6%",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textAlign: "left",
                    textOverflow: "ellipsis",
                    width: 16,
                    color: Colors[resolvedTheme].primary,
                  }}
                >
                  {user.name || shortenAddress(user.walletAddress)}
                </ListItemText>
              </Link>
            </ListItem>
          )}

          <Link href="/events" passHref>
            <ListItem
              button
              sx={{
                borderRadius: (theme) => theme.shape.borderRadius,
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
              selected={router.pathname === "/events"}
            >
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <CalendarMonthIcon
                  fontSize="large"
                  sx={{
                    color: Colors[resolvedTheme].primary,
                    width: 32,
                    height: 32,
                  }}
                />
              </ListItemIcon>

              <ListItemText
                disableTypography
                style={{
                  height: 16,
                  marginLeft: "6%",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textAlign: "left",
                  textOverflow: "ellipsis",
                  width: 16,
                  color: Colors[resolvedTheme].primary,
                }}
              >
                Events
              </ListItemText>
            </ListItem>
          </Link>
        </List>
      ) : (
        // Events drawer menu
        <>
          {!showCreateEvent ? (
            <>
              <Typography
                sx={{
                  paddingLeft: "16px",
                  fontSize: "1.8rem",
                  marginTop: "12px",
                  fontWeight: 900,
                  color: Colors[resolvedTheme].primary,
                }}
                variant="h6"
              >
                Events
              </Typography>

              <List
                sx={{
                  "&& .MuiListItemButton-root:hover": {
                    backgroundColor: Colors[resolvedTheme].selected_event_menu,
                  },
                  "&& .Mui-selected": {
                    backgroundColor: Colors[resolvedTheme].selected_event_menu,
                    "&, & .MuiListItemIcon-root": {
                      color: (theme) => theme.palette.primary.main,
                    },
                  },
                  "&& .Mui-selected:hover": {
                    backgroundColor: Colors[resolvedTheme].selected_event_menu,
                  },
                  px: 2,
                }}
              >
                <Link href="/events" passHref>
                  <ListItemButton
                    sx={{
                      borderRadius: (theme) => theme.shape.borderRadius,
                    }}
                    style={{
                      margin: "0px 0",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      padding: "12px",
                    }}
                    selected={router.pathname === "/events"}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: "auto",
                      }}
                    >
                      <CalendarViewMonth
                        fontSize="large"
                        sx={{
                          color: (theme) =>
                            router.pathname === "/events"
                              ? theme.palette.primary.main
                              : Colors[resolvedTheme].primary,
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      sx={{
                        height: 16,
                        marginLeft: "6%",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textAlign: "left",
                        textOverflow: "ellipsis",
                        width: 16,
                        color: Colors[resolvedTheme].primary,
                      }}
                    >
                      Home
                    </ListItemText>
                  </ListItemButton>
                </Link>
                {user && (
                  <>
                    <ListItemButton
                      onClick={handleClick}
                      sx={{
                        borderRadius: (theme) => theme.shape.borderRadius,
                      }}
                      style={{
                        margin: "0px 0",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: "12px",
                      }}
                      selected={router.pathname === "/events/[username]"}
                    >
                      <ListItemIcon sx={{ minWidth: "auto" }}>
                        <AccountCircleIcon
                          fontSize="large"
                          sx={{
                            color: (theme) =>
                              router.pathname === "/events/[username]"
                                ? theme.palette.primary.main
                                : Colors[resolvedTheme].primary,
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        disableTypography
                        sx={{
                          height: 16,
                          marginLeft: "6%",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textAlign: "left",
                          textOverflow: "ellipsis",
                          width: 16,
                          color: Colors[resolvedTheme].primary,
                        }}
                      >
                        Your Events
                      </ListItemText>
                      {open ? (
                        <ExpandLess
                          sx={{
                            color: Colors[resolvedTheme].primary,
                          }}
                        />
                      ) : (
                        <ExpandMore
                          sx={{
                            color: Colors[resolvedTheme].primary,
                          }}
                        />
                      )}
                    </ListItemButton>

                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }}>
                          <ListItemText>No events</ListItemText>
                        </ListItemButton>
                      </List>
                    </Collapse>
                  </>
                )}
                <Box sx={{ marginTop: "12px " }}>
                  <Button
                    fullWidth
                    onClick={createEvent}
                    sx={{
                      textTransform: "none",
                      color: Colors[resolvedTheme].primary.main,
                    }}
                    type="submit"
                    size="medium"
                    variant="contained"
                    startIcon={<AddOutlinedIcon />}
                  >
                    Create new event
                  </Button>
                </Box>

                <Divider
                  sx={{
                    borderColor: Colors[resolvedTheme].divider,
                    marginTop: "12px",
                  }}
                />
              </List>
            </>
          ) : (
            <>
              <Box
                component="nav"
                sx={{
                  px: 2,
                  py: 1,
                  boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
                  borderBottom: Colors[resolvedTheme].border,
                }}
              >
                <Grid
                  container
                  direction="row"
                  justifyContent="start"
                  alignItems="center"
                >
                  <Tooltip title="close">
                    <IconButton
                      onClick={discard}
                      sx={{
                        backgroundColor: Colors[resolvedTheme].icon_bg,
                        marginRight: "8px",
                        ":hover": {
                          background: Colors[resolvedTheme].close_hover,
                        },
                      }}
                    >
                      <CloseIcon
                        sx={{ color: Colors[resolvedTheme].secondary }}
                      />
                    </IconButton>
                  </Tooltip>

                  <Box
                    component="div"
                    sx={{
                      whiteSpace: "nowrap",
                      mr: !events ? 2 : 0,
                      variant: "h6",
                      display: !events
                        ? { xs: "none", md: "flex" }
                        : { xs: "flex", md: "flex", sm: "flex" },
                      ":hover": {
                        borderRadius: (theme) =>
                          Number(theme.shape.borderRadius) * 2,
                        background: Colors[resolvedTheme].hover,
                      },
                    }}
                  >
                    <IconButton onClick={goHome} edge="start" size="small">
                      <a>
                        <Image
                          src={"/icons/impish.svg"}
                          width={45}
                          height={32}
                          alt={`Impish icon`}
                        />
                      </a>
                    </IconButton>
                  </Box>
                </Grid>
              </Box>

              <Breadcrumbs
                sx={{ px: 2, marginTop: "12px" }}
                separator={
                  <NavigateNextIcon
                    sx={{ color: Colors[resolvedTheme].secondary }}
                    fontSize="small"
                  />
                }
                aria-label="breadcrumb"
              >
                {breadcrumbs}
              </Breadcrumbs>
              {!eventDetails ? (
                <Typography
                  sx={{
                    paddingLeft: "16px",
                    fontSize: "1.6rem",
                    fontWeight: 900,
                    color: Colors[resolvedTheme].primary,
                  }}
                  variant="h6"
                >
                  Create Event
                </Typography>
              ) : (
                <Typography
                  sx={{
                    paddingLeft: "16px",
                    fontSize: "1.6rem",
                    fontWeight: 900,
                    color: Colors[resolvedTheme].primary,
                  }}
                  variant="h6"
                >
                  Event Details
                </Typography>
              )}

              <List
                sx={{
                  "&& .Mui-selected": {
                    backgroundColor: Colors[resolvedTheme].selected_event_menu,
                    "&, & .MuiListItemIcon-root": {
                      color: (theme) => theme.palette.primary.main,
                    },
                  },
                  "&& .Mui-selected:hover": {
                    backgroundColor: Colors[resolvedTheme].selected_event_menu,
                  },
                  px: 2,
                }}
              >
                <ListItemButton
                  disableRipple
                  sx={{
                    borderRadius: (theme) => theme.shape.borderRadius,
                    ":hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                  style={{
                    margin: "0px 0",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: "12px",
                    cursor: "default",
                  }}
                >
                  <div className={styles.account}>
                    {user.avatarImage ? (
                      <Image
                        src={user.avatarImage}
                        width={36}
                        height={36}
                        alt="Avatar"
                      />
                    ) : (
                      <Avatar
                        size={36}
                        name={user.walletAddress}
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
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                      marginLeft: "5%",
                    }}
                  >
                    <ListItemText
                      disableTypography
                      style={{
                        height: 16,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textAlign: "left",
                        textOverflow: "ellipsis",
                        width: "130px",
                        color: Colors[resolvedTheme].primary,
                      }}
                    >
                      {user.name || shortenAddress(user.walletAddress)}
                    </ListItemText>
                    <Typography
                      variant="subtitle1"
                      component="span"
                      sx={{
                        fontSize: "0.6rem",
                        color: Colors[resolvedTheme].secondary,
                      }}
                    >
                      Host - Your Profile
                    </Typography>
                  </Box>
                </ListItemButton>
                {!eventDetails ? (
                  <ListItemButton
                    sx={{
                      borderRadius: (theme) => theme.shape.borderRadius,
                    }}
                    disableRipple
                    style={{
                      margin: "0px 0",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      padding: "12px",
                      cursor: "default",
                    }}
                    selected={router.pathname === "/events/create"}
                  >
                    <ListItemIcon sx={{ minWidth: "auto" }}>
                      <GroupSharpIcon
                        fontSize="large"
                        sx={{
                          color: (theme) =>
                            router.pathname === "/events/create"
                              ? theme.palette.primary.main
                              : Colors[resolvedTheme].primary,
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      sx={{
                        height: 16,
                        marginLeft: "6%",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textAlign: "left",
                        textOverflow: "ellipsis",
                        width: 16,
                        color: Colors[resolvedTheme].primary,
                      }}
                    >
                      Create Events
                    </ListItemText>
                  </ListItemButton>
                ) : (
                  <>
                    <form onSubmit={handleSubmit3(onSubmitCreateEvents)}>
                      <TextField
                        fullWidth
                        label="Event name"
                        variant="outlined"
                        autoComplete="event"
                        autoFocus
                        sx={{
                          input: { color: Colors[resolvedTheme].primary },
                          label: { color: Colors[resolvedTheme].secondary },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: Colors[resolvedTheme].input_border,
                            },
                            "&:hover fieldset": {
                              borderColor: (theme) =>
                                theme.palette.primary.main,
                            },
                          },

                          marginBottom: "12px",
                        }}
                        FormHelperTextProps={{
                          sx: {
                            position: "absolute",
                            right: "3%",
                            color: Colors[resolvedTheme].secondary,
                          },
                        }}
                        inputProps={{ maxLength: CHARACTER_LIMIT }}
                        onChange={handleEventNameChange("eventName")}
                        helperText={`${values.eventName.length}/${CHARACTER_LIMIT}`}
                        error={!!errors3?.email}
                      />

                      <Grid
                        sx={{ marginBottom: showEndDate ? "12px" : undefined }}
                        container
                        columnSpacing={{ xs: 2.3, sm: 2.3, md: 2.3 }}
                      >
                        <Grid item xs={7}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              desktopModeMediaQuery=""
                              open={openStart}
                              onOpen={() => setOpenStart(true)}
                              allowSameDateSelection={true}
                              disablePast
                              label="Start Date"
                              views={["day"]}
                              value={startDate || undefined}
                              onChange={(newValue: any) => {
                                setStartDate(newValue);
                                setOpenStart(false);
                              }}
                              PopperProps={{
                                disablePortal: true,
                              }}
                              PaperProps={{
                                sx: {
                                  border: Colors[resolvedTheme].border,
                                  borderRadius: (theme) =>
                                    Number(theme.shape.borderRadius) / 2,
                                  "&& .Mui-selected": {
                                    backgroundColor: (theme) =>
                                      theme.palette.primary.main,
                                    "&, & .MuiList-root": {
                                      color:
                                        Colors[resolvedTheme].selected_date,
                                    },
                                  },
                                  "&& .Mui-selected:hover": {
                                    backgroundColor: (theme) =>
                                      theme.palette.primary.dark,
                                  },
                                  "& .MuiPaper-root": {
                                    color: Colors[resolvedTheme].secondary,
                                  },
                                  "&& .MuiPickersDay-today": {
                                    borderColor: Colors[resolvedTheme].primary,
                                  },
                                  svg: {
                                    color: Colors[resolvedTheme].primary,
                                  },
                                  button: {
                                    color:
                                      Colors[resolvedTheme]
                                        .date_picker_button_color,
                                    backgroundColor: "transparent",
                                    ":hover": {
                                      backgroundColor:
                                        Colors[resolvedTheme].hover,
                                      color:
                                        Colors[resolvedTheme]
                                          .date_picker_button_color,
                                    },
                                    ":disabled": {
                                      color: Colors[resolvedTheme].secondary,
                                    },
                                  },
                                  span: {
                                    color: Colors[resolvedTheme].primary,
                                  },
                                  bgcolor: Colors[resolvedTheme].header_bg,
                                  color: Colors[resolvedTheme].primary,
                                },
                              }}
                              inputFormat="MMM d, Y"
                              InputAdornmentProps={{
                                position: "start",
                              }}
                              OpenPickerButtonProps={{ disableRipple: true }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  onClick={(e) => setOpenStart(true)}
                                  sx={{
                                    input: {
                                      color: Colors[resolvedTheme].primary,
                                    },
                                    label: {
                                      color: Colors[resolvedTheme].secondary,
                                    },
                                    "& .MuiOutlinedInput-root": {
                                      "& fieldset": {
                                        borderColor:
                                          Colors[resolvedTheme].input_border,
                                      },
                                      "&:hover fieldset": {
                                        borderColor: (theme) =>
                                          theme.palette.primary.main,
                                      },

                                      "& svg": {
                                        color: Colors[resolvedTheme].primary,
                                      },
                                      "&:hover button": {
                                        backgroundColor: "transparent",
                                      },
                                    },
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                  error={!!errors3?.start_date}
                                  helperText={null}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>

                        <Grid item xs={5}>
                          <TextField
                            label="Start Time"
                            defaultValue={startTime}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={(e) => {
                              setStartTime(e.target.value);
                            }}
                            select
                            SelectProps={{
                              MenuProps: {
                                sx: {
                                  "&& .Mui-selected": {
                                    backgroundColor: "transparent",
                                    borderRadius: (theme) =>
                                      Number(theme.shape.borderRadius) / 2,
                                  },
                                  "&& .Mui-selected:focus": {
                                    backgroundColor: "transparent",
                                  },
                                  "&& .Mui-selected:hover": {
                                    backgroundColor:
                                      Colors[resolvedTheme].date_picker_hover,
                                    borderRadius: (theme) =>
                                      Number(theme.shape.borderRadius) / 2,
                                  },
                                  "& .MuiPaper-root": {
                                    bgcolor: Colors[resolvedTheme].header_bg,
                                    borderRadius: (theme) =>
                                      Number(theme.shape.borderRadius) / 2,
                                  },
                                  padding: 0,
                                  height: "400px",
                                  top: "7%",
                                  "&& .MuiMenu-list": {
                                    paddingTop: 0.5,
                                    paddingBottom: 0.5,
                                    bgcolor: Colors[resolvedTheme].header_bg,
                                  },
                                },
                                anchorOrigin: {
                                  vertical: "top",
                                  horizontal: "center",
                                },
                                transformOrigin: {
                                  vertical: "top",
                                  horizontal: "center",
                                },
                              },
                              IconComponent: () => null,
                            }}
                            sx={{
                              width: 117,
                              input: {
                                color: Colors[resolvedTheme].primary,
                              },
                              label: {
                                color: Colors[resolvedTheme].secondary,
                              },

                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor:
                                    Colors[resolvedTheme].input_border,
                                },
                                "&:hover fieldset": {
                                  borderColor: (theme) =>
                                    theme.palette.primary.main,
                                },

                                "& .MuiSelect-select": {
                                  color: Colors[resolvedTheme].primary,
                                },
                              },
                            }}
                            error={!!errors3?.start_time}
                            helperText={null}
                          >
                            {times.map((time: any, index: any) => (
                              <MenuItem
                                sx={{
                                  "&& .Mui-selected": {
                                    "&, & .MuiMenuItem-root": {
                                      backgroundColor:
                                        Colors[resolvedTheme].time_hover,
                                    },
                                    backgroundColor:
                                      Colors[resolvedTheme].time_hover,
                                  },
                                  "&& .MuiMenu-list": {
                                    paddingTop: 0,
                                  },

                                  bgcolor: Colors[resolvedTheme].header_bg,
                                  color: Colors[resolvedTheme].primary,
                                  margin: "0 8px",
                                  ":hover": {
                                    backgroundColor:
                                      Colors[resolvedTheme].time_hover,
                                    borderRadius: (theme) =>
                                      Number(theme.shape.borderRadius) / 2,
                                  },
                                }}
                                key={index}
                                value={time}
                              >
                                {time}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      </Grid>

                      {showEndDate ? (
                        <>
                          <Grid
                            container
                            rowSpacing={1}
                            columnSpacing={{ xs: 2.3, sm: 2.3, md: 2.3 }}
                          >
                            <Grid item xs={7}>
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  desktopModeMediaQuery=""
                                  open={openEnd}
                                  onOpen={() => setOpenEnd(true)}
                                  disablePast
                                  label="End Date"
                                  views={["day"]}
                                  allowSameDateSelection={true}
                                  value={endDate || undefined}
                                  onChange={(newValue: any) => {
                                    setEndDate(newValue);
                                    setOpenEnd(false);
                                  }}
                                  PopperProps={{ disablePortal: true }}
                                  PaperProps={{
                                    sx: {
                                      border: Colors[resolvedTheme].border,
                                      borderRadius: (theme) =>
                                        Number(theme.shape.borderRadius) / 2,
                                      "&& .Mui-selected": {
                                        backgroundColor: (theme) =>
                                          theme.palette.primary.main,
                                        "&, & .MuiList-root": {
                                          color:
                                            Colors[resolvedTheme].selected_date,
                                        },
                                      },
                                      "&& .Mui-selected:hover": {
                                        backgroundColor: (theme) =>
                                          theme.palette.primary.dark,
                                      },
                                      "&& .MuiPaper-root": {
                                        color: Colors[resolvedTheme].secondary,
                                      },
                                      "&& .MuiPickersDay-today": {
                                        borderColor:
                                          Colors[resolvedTheme].primary,
                                      },
                                      svg: {
                                        color: Colors[resolvedTheme].primary,
                                      },
                                      button: {
                                        color:
                                          Colors[resolvedTheme]
                                            .date_picker_button_color,
                                        backgroundColor: "transparent",
                                        ":hover": {
                                          backgroundColor:
                                            Colors[resolvedTheme].hover,
                                          color:
                                            Colors[resolvedTheme]
                                              .date_picker_button_color,
                                        },
                                        ":disabled": {
                                          color:
                                            Colors[resolvedTheme].secondary,
                                        },
                                      },
                                      span: {
                                        color: Colors[resolvedTheme].primary,
                                      },
                                      bgcolor: Colors[resolvedTheme].header_bg,
                                      color: Colors[resolvedTheme].primary,
                                    },
                                  }}
                                  inputFormat="MMM d, Y"
                                  InputAdornmentProps={{
                                    position: "start",
                                  }}
                                  OpenPickerButtonProps={{
                                    disableRipple: true,
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      sx={{
                                        input: {
                                          color: Colors[resolvedTheme].primary,
                                        },
                                        label: {
                                          color:
                                            Colors[resolvedTheme].secondary,
                                        },

                                        "& .MuiOutlinedInput-root": {
                                          "& fieldset": {
                                            borderColor:
                                              Colors[resolvedTheme]
                                                .input_border,
                                          },
                                          "&:hover fieldset": {
                                            borderColor: (theme) =>
                                              theme.palette.primary.main,
                                          },
                                          "& svg": {
                                            color:
                                              Colors[resolvedTheme].primary,
                                          },
                                          "&:hover button": {
                                            backgroundColor: "transparent",
                                          },
                                        },
                                      }}
                                      InputLabelProps={{ shrink: true }}
                                      {...params}
                                      error={!!errors3?.start_date}
                                      helperText={null}
                                      onClick={(e) => {
                                        setOpenEnd(true);
                                      }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            </Grid>

                            <Grid item xs={5}>
                              <TextField
                                label="End Time"
                                defaultValue={endTime}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={(e) => {
                                  setEndTime(e.target.value);
                                }}
                                select
                                SelectProps={{
                                  MenuProps: {
                                    sx: {
                                      "&& .Mui-selected": {
                                        backgroundColor: "transparent",
                                        borderRadius: (theme) =>
                                          Number(theme.shape.borderRadius) / 2,
                                      },
                                      "&& .Mui-selected:focus": {
                                        backgroundColor: "transparent",
                                      },
                                      "&& .Mui-selected:hover": {
                                        backgroundColor:
                                          Colors[resolvedTheme]
                                            .date_picker_hover,
                                        borderRadius: (theme) =>
                                          Number(theme.shape.borderRadius) / 2,
                                      },
                                      "& .MuiPaper-root": {
                                        bgcolor:
                                          Colors[resolvedTheme].header_bg,
                                        borderRadius: (theme) =>
                                          Number(theme.shape.borderRadius) / 2,
                                      },
                                      padding: 0,
                                      height: "400px",
                                      top: "7%",
                                      "&& .MuiMenu-list": {
                                        paddingTop: 0.5,
                                        paddingBottom: 0.5,
                                        bgcolor:
                                          Colors[resolvedTheme].header_bg,
                                      },
                                    },
                                    anchorOrigin: {
                                      vertical: "top",
                                      horizontal: "center",
                                    },
                                    transformOrigin: {
                                      vertical: "top",
                                      horizontal: "center",
                                    },
                                  },
                                  IconComponent: () => null,
                                }}
                                sx={{
                                  width: 117,
                                  input: {
                                    color: Colors[resolvedTheme].primary,
                                  },
                                  label: {
                                    color: Colors[resolvedTheme].secondary,
                                  },
                                  "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                      borderColor:
                                        Colors[resolvedTheme].input_border,
                                    },
                                    "&:hover fieldset": {
                                      borderColor: (theme) =>
                                        theme.palette.primary.main,
                                    },
                                    "& .MuiSelect-select": {
                                      color: Colors[resolvedTheme].primary,
                                    },
                                  },
                                }}
                                error={!!errors3?.start_time}
                                helperText={null}
                              >
                                {times.map((time: any, index: any) => (
                                  <MenuItem
                                    sx={{
                                      "&& .Mui-selected": {
                                        "&, & .MuiMenuItem-root": {
                                          backgroundColor:
                                            Colors[resolvedTheme].time_hover,
                                        },
                                        backgroundColor:
                                          Colors[resolvedTheme].time_hover,
                                      },
                                      "&& .MuiMenu-list": {
                                        paddingTop: 0,
                                      },

                                      bgcolor: Colors[resolvedTheme].header_bg,
                                      color: Colors[resolvedTheme].primary,
                                      margin: "0 8px",
                                      ":hover": {
                                        backgroundColor:
                                          Colors[resolvedTheme].time_hover,
                                        borderRadius: (theme) =>
                                          Number(theme.shape.borderRadius) / 2,
                                      },
                                    }}
                                    key={index}
                                    value={time}
                                  >
                                    {time}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                          </Grid>
                          <IconButton
                            onClick={() => {
                              setShowEndDate(false);
                            }}
                            sx={{
                              ":hover": {
                                color: (theme) => theme.palette.primary.main,
                                textDecoration: "underline",
                                backgroundColor: "transparent",
                              },
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 550,
                                color: (theme) => theme.palette.primary.main,
                                fontSize: "0.8rem",
                              }}
                              variant="subtitle1"
                            >
                              - End Date and Time
                            </Typography>
                          </IconButton>
                        </>
                      ) : (
                        <IconButton
                          onClick={() => {
                            setShowEndDate(true);
                          }}
                          sx={{
                            ":hover": {
                              color: (theme) => theme.palette.primary.main,
                              backgroundColor: "transparent",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.8rem",
                              fontWeight: 550,
                              color: (theme) => theme.palette.primary.main,
                            }}
                            variant="subtitle1"
                          >
                            + End Date and Time
                          </Typography>
                        </IconButton>
                      )}
                      <Button
                        disableRipple
                        fullWidth
                        sx={{
                          height: "56px",
                          border: openPrivacy
                            ? `1px solid ${Colors[resolvedTheme].active_privacy_border}`
                            : `1px solid ${Colors[resolvedTheme].privacy_border}`,
                          textTransform: "none",
                          color: Colors[resolvedTheme].primary,
                          padding: "8.5px 14px",
                          justifyContent: "start",
                          ":hover": {
                            backgroundColor: "transparent",
                            borderColor: (theme) => theme.palette.primary.main,
                          },
                          ":focus": {
                            borderColor: (theme) => theme.palette.primary.main,
                          },
                        }}
                        aria-controls={
                          openPrivacy ? "demo-positioned-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={openPrivacy ? "true" : undefined}
                        onClick={handleClickEventPrivacy}
                        startIcon={
                          <>
                            {privacy == "Privacy" && (
                              <LockIcon
                                sx={{
                                  margin: 1,
                                  color: Colors[resolvedTheme].primary,
                                }}
                              />
                            )}
                            {privacy == "Private" && (
                              <LockIcon
                                sx={{
                                  margin: 1,
                                  color: Colors[resolvedTheme].primary,
                                }}
                              />
                            )}
                            {privacy == "Public" && (
                              <PublicRoundedIcon
                                sx={{
                                  margin: 1,
                                  color: Colors[resolvedTheme].primary,
                                }}
                              />
                            )}
                            {privacy == "Followers" && (
                              <GroupSharpIcon
                                sx={{
                                  margin: 1,
                                  color: Colors[resolvedTheme].primary,
                                }}
                              />
                            )}
                          </>
                        }
                        endIcon={
                          <KeyboardArrowDownIcon
                            sx={{
                              position: "absolute",
                              right: "7%",
                              top: "31%",
                              color: Colors[resolvedTheme].primary,
                            }}
                          />
                        }
                      >
                        {privacy == "Privacy" ? (
                          <>Privacy</>
                        ) : (
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.7rem",
                                textAlign: "left",
                                color: (theme) =>
                                  openPrivacy
                                    ? theme.palette.primary.main
                                    : "undefined",
                              }}
                              component="span"
                            >
                              Privacy
                            </Typography>
                            <Typography
                              sx={{
                                color: Colors[resolvedTheme].primary,
                              }}
                            >
                              {privacy}
                            </Typography>
                          </Box>
                        )}
                      </Button>
                      <Menu
                        sx={{ mt: "5px" }}
                        id="demo-positioned-menu"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchorElPrivacy}
                        open={openPrivacy}
                        transitionDuration={0}
                        onClose={handleCloseEventPrivacy}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                        PaperProps={{
                          sx: {
                            border: Colors[resolvedTheme].border,
                            borderRadius: (theme) =>
                              Number(theme.shape.borderRadius) / 2,
                            width: 304,
                            boxShadow: "0px 0px 5px rgb(0 0 0 / 20%)",
                            bgcolor: Colors[resolvedTheme].header_bg,
                            color: Colors[resolvedTheme].primary,
                          },
                        }}
                      >
                        <MenuItem
                          disableRipple
                          sx={{
                            display: "flex",
                            justifyContent: "start",
                            ":hover": {
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              textAlign: "left",
                              fontSize: "0.8rem",
                              color: Colors[resolvedTheme].primary,
                            }}
                            variant="subtitle1"
                          >
                            Choose who can see and join this event.
                            <br />
                            You will be able to invite people later.
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setPrivacy("Private");
                            handleCloseEventPrivacy();
                          }}
                          disableRipple
                          sx={{
                            px: 0,
                            margin: "0 8px",

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
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: "auto",
                                alignItems: "center",
                              }}
                            >
                              <LockIcon
                                sx={{
                                  display: "flex",
                                  color: Colors[resolvedTheme].primary,
                                }}
                                fontSize="small"
                              />
                            </ListItemIcon>
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
                                }}
                              >
                                Private
                              </ListItemText>
                              <Typography
                                variant="subtitle1"
                                component="span"
                                sx={{
                                  fontSize: "0.8rem",
                                  color: Colors[resolvedTheme].secondary,
                                }}
                              >
                                Only people who are invited
                              </Typography>
                            </Box>
                          </Box>

                          <Radio
                            sx={{
                              ":hover": {
                                backgroundColor: "transparent",
                              },
                              "&": { color: Colors[resolvedTheme].primary },
                            }}
                            checked={privacy === "Private"}
                            onChange={handlePrivacyChange}
                            value="Private"
                            name="radio-buttons"
                            inputProps={{ "aria-label": "A" }}
                          />
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setPrivacy("Public");
                            handleCloseEventPrivacy();
                          }}
                          disableRipple
                          sx={{
                            px: 0,
                            margin: "0 8px",

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
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: "auto",
                                alignItems: "center",
                              }}
                            >
                              <PublicRoundedIcon
                                sx={{
                                  display: "flex",
                                  color: Colors[resolvedTheme].primary,
                                }}
                                fontSize="small"
                              />
                            </ListItemIcon>
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
                                }}
                              >
                                Public
                              </ListItemText>
                              <Typography
                                variant="subtitle1"
                                component="span"
                                sx={{
                                  fontSize: "0.8rem",
                                  color: Colors[resolvedTheme].secondary,
                                }}
                              >
                                Anyone on or off Impish
                              </Typography>
                            </Box>
                          </Box>

                          <Radio
                            sx={{
                              marginLeft: "17px",
                              ":hover": {
                                backgroundColor: "transparent",
                              },
                              "&": { color: Colors[resolvedTheme].primary },
                            }}
                            checked={privacy === "Public"}
                            onChange={handlePrivacyChange}
                            value="Public"
                            name="radio-buttons"
                            inputProps={{ "aria-label": "A" }}
                          />
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setPrivacy("Followers");
                            handleCloseEventPrivacy();
                          }}
                          disableRipple
                          sx={{
                            px: 0,
                            margin: "0 8px",

                            justifyContent: "space-around",
                            ":hover": {
                              borderRadius: (theme) =>
                                Number(theme.shape.borderRadius) / 2,
                              backgroundColor: Colors[resolvedTheme].time_hover,
                            },
                          }}
                        >
                          <Box sx={{ display: "flex" }}>
                            <ListItemIcon
                              sx={{
                                minWidth: "auto",
                                alignItems: "center",
                              }}
                            >
                              <GroupSharpIcon
                                sx={{
                                  display: "flex",
                                  color: Colors[resolvedTheme].primary,
                                }}
                                fontSize="small"
                              />
                            </ListItemIcon>
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
                                }}
                              >
                                Followers
                              </ListItemText>
                              <Typography
                                variant="subtitle1"
                                component="span"
                                sx={{
                                  fontSize: "0.8rem",
                                  color: Colors[resolvedTheme].secondary,
                                }}
                              >
                                Your followers on Impish
                              </Typography>
                            </Box>
                          </Box>

                          <Radio
                            sx={{
                              marginLeft: "17px",
                              ":hover": {
                                backgroundColor: "transparent",
                              },
                              "&": { color: Colors[resolvedTheme].primary },
                            }}
                            checked={privacy === "Followers"}
                            onChange={handlePrivacyChange}
                            value="Followers"
                            name="radio-buttons"
                            inputProps={{ "aria-label": "A" }}
                          />
                        </MenuItem>
                      </Menu>
                    </form>
                  </>
                )}
              </List>
            </>
          )}
        </>
      )}
    </>
  );
}
