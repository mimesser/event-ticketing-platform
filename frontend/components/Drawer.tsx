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
import Drawer from "@mui/material/Drawer";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
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
import RoomIcon from "@mui/icons-material/Room";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarViewMonth from "@mui/icons-material/CalendarViewMonth";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import GroupSharpIcon from "@mui/icons-material/GroupSharp";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LanguageIcon from "@mui/icons-material/Language";
import LockIcon from "@mui/icons-material/Lock";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import WarningIcon from "@mui/icons-material/Warning";
import useMediaQuery from "@mui/material/useMediaQuery";

import Avatar from "components/Avatar";
import IOSSwitch from "components/IOSSwitch";
import Colors from "lib/colors";
import { useNewEvent } from "lib/event-context";
import { magic } from "lib/magic";
import { useUserInfo } from "lib/user-context";
import {
  shortenAddress,
  eventTime,
  roundUpTime,
  roundUpTimePlus3,
  getTimezoneByLocation,
  tzAbbreviation,
  getLocationString,
  getLocalTimezone,
} from "lib/utils";
import Image from "next/image";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import React, { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import GoogleMapReact, { Maps, Props } from "google-map-react";
import LocationSelector from "components/LocationSelector";
import MapMarker from "./MapMarker";
import styles from "styles/components/Drawer.module.scss";
import MapStyle from "lib/mapstyle";
import { styled } from "@mui/material/styles";
import AvatarEditor from "react-avatar-editor";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ImpishDrawer({
  variant,
  drawerOpen,
  onClose,
}: {
  variant: "permanent" | "temporary";
  drawerOpen: boolean;
  onClose: any;
}) {
  const { resolvedTheme } = useTheme();
  const {
    timezone,
    eventLocation,
    cover,
    eventName,
    eventDescription,
    setEventLocation,
    setEventName,
    setEventDescription,
    setStartDateAndTime,
    setEndDateAndTime,
    setEventPrivacy,
    setEventInvitable,
    setTimezone,
    setCover,
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
  const [invitable, setInvitable] = React.useState(true);
  const [showEndDate, setShowEndDate] = React.useState(false);
  const [eventDetails, setEventDetails] = React.useState(false);
  const [eventStep, setEventStep] = React.useState(0);
  const [startDate, setStartDate] = React.useState<any>(null);
  const [endDate, setEndDate] = React.useState<any>(null);
  const [goToRoute, setGoToRoute] = React.useState("");
  const [startTime, setStartTime] = React.useState(roundUpTime());
  const [endTime, setEndTime] = React.useState(roundUpTimePlus3());
  const [openStart, setOpenStart] = React.useState(false);
  const [openEnd, setOpenEnd] = React.useState(false);
  const [times] = React.useState(eventTime() || []);
  const [discardModal, showDiscardModal] = React.useState(false);
  const [locationSearchModal, showLocationSearchModal] = React.useState(false);
  const discardModalClose = () => {
    showDiscardModal(false);
  };
  const [anchorElPrivacy, setAnchorElPrivacy] = React.useState(null);
  const [signingInEvents, setSigningInEvents] = React.useState(false);
  const warningText =
    "You have unsaved changes - are you sure you wish to leave this page?";

  const drawerWidth = events ? 340 : 240;

  // TODO: review needed
  const changed = React.useCallback(() => {
    return (
      startDate !== null ||
      endDate !== null ||
      startTime !== roundUpTime() ||
      endTime !== roundUpTimePlus3() ||
      eventName !== "" ||
      eventDescription !== "" ||
      eventLocation !== {}
    );
  }, [
    startDate,
    endDate,
    startTime,
    endTime,
    eventName,
    eventLocation,
    eventDescription,
  ]);

  const handleBrowseAway = React.useCallback(() => {
    if (!eventDetails) return;
    if (discardModal) return;

    if (changed()) {
      if (window.confirm(warningText)) return;
      router.events.emit("routeChangeError");
      throw "routeChange aborted.";
    }

    return;
  }, [discardModal, eventDetails, router.events, changed]);

  // prompt the user if they try and leave with unsaved changes
  React.useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!eventDetails) return;
      if (discardModal) return;

      if (changed()) {
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        // Chrome requires returnValue to be set
        e.returnValue = warningText;
      }

      return;
    };

    window.addEventListener("beforeunload", handleWindowClose);
    router.events.on("routeChangeStart", handleBrowseAway);

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      router.events.off("routeChangeStart", handleBrowseAway);
    };
  }, [discardModal, eventDetails, handleBrowseAway, router.events, changed]);

  // event time functions
  const getStartDate = () => {
    const sDate = startDate || new Date();
    sDate.setHours(0, 0, 0, 0);
    return sDate;
  };
  const getEndtDate = () => {
    const eDate = endDate || new Date();
    eDate.setHours(0, 0, 0, 0);
    return eDate;
  };

  const availableStartTimes = () => {
    let result: any = [];
    times.forEach((time: any) => {
      if (
        !showEndDate ||
        validEventTime(getStartDate(), time, getEndtDate(), endTime)
      )
        result.push(time);
    });
    return result;
  };
  const availableEndTimes = () => {
    let result: any = [];
    times.forEach((time: any) => {
      if (validEventTime(getStartDate(), startTime, getEndtDate(), time))
        result.push(time);
    });
    return result;
  };

  const adjustEndDate = () => {
    const sDate = getStartDate();
    const sTime = moment("1900-01-01 " + startTime);
    sDate.setHours(sTime.hours(), sTime.minutes());
    const tDate = new Date(sDate.getTime() + 3 * 60 * 60 * 1000);
    setEndDate(tDate);
    setEndTime(moment(tDate).format("h:mm A"));
  };
  const validEventTime = (sDate: any, sTime: any, tDate: any, tTime: any) => {
    sDate = sDate || new Date();
    sTime = moment("1900-01-01 " + sTime);
    sDate.setHours(sTime.hours(), sTime.minutes(), 0, 0);

    tDate = tDate || new Date();
    tTime = moment("1900-01-01 " + tTime);
    tDate.setHours(tTime.hours(), tTime.minutes(), 0, 0);

    return sDate < tDate;
  };

  // event info update
  React.useEffect(() => {
    setStartDateAndTime(startDate || new Date(), startTime);
  }, [setStartDateAndTime, startDate, startTime]);
  React.useEffect(() => {
    setEndDateAndTime(showEndDate, endDate || new Date(), endTime);
  }, [showEndDate, endDate, endTime, setEndDateAndTime]);
  React.useEffect(() => {
    setEventPrivacy(privacy);
  }, [privacy, setEventPrivacy]);
  React.useEffect(() => {
    setEventInvitable(invitable);
  }, [invitable, setEventInvitable]);

  React.useEffect(() => {
    if (router.isReady) {
      const query = router.query;
      if (query.createEvent) {
        if (query.createEvent === "true") {
          setEventDetails(true);
          setEventStep(0);
        }
      } else {
        setEventDetails(false);
      }
    }
  }, [router.isReady, router.query, router.pathname]);

  const openPrivacy = Boolean(anchorElPrivacy);
  const handlePrivacyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrivacy(event.target.value);
    handleCloseEventPrivacy();
  };

  const CHARACTER_LIMIT = 99;

  // page navigation
  const discard = (route: string) => {
    setGoToRoute(route);

    if (changed()) {
      showDiscardModal(true);
    } else {
      leavePage();
    }
  };

  const handleBack = () => {
    if (eventStep > 0) {
      setEventStep(eventStep - 1);
    } else {
      router.events.off("routeChangeStart", handleBrowseAway);
      router.push({ pathname: "/events/create" });
    }
  };

  const handleNext = () => {
    if (eventStep < 3) setEventStep(eventStep + 1);
  };

  const goHome = () => {
    if (changed()) {
      setGoToRoute("/");
      showDiscardModal(true);
    } else {
      router.push({
        pathname: "/",
      });
    }
  };

  const leavePage = async () => {
    await router.push({
      pathname: goToRoute,
    });

    showDiscardModal(false);
    setStartTime(roundUpTime());
    setEndTime(roundUpTimePlus3());
    setStartDate(null);
    setEndDate(null);
    setShowEndDate(false);
    setPrivacy("Privacy");
    setInvitable(true);

    setSearchLocation("");
    setLocationInput("");
    setMapCenter({ lat: 0, lng: 0 });
    setMapZoom(1);
    setLocationName("");
    setEditLocation({ hasLocation: false, location: { lat: 0, lng: 0 } });
    setZooming(false);

    setEventName("");
    setEventLocation({
      hasLocation: false,
      location: {
        lat: 0,
        lng: 0,
      },
      name: "",
    });
    setEventDescription("");
  };

  const stayOnPage = () => {
    showDiscardModal(false);
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
  const breadcrumbs = [
    <BreadcrumLink
      onClick={() => discard("/events")}
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
      onClick={() => discard("/events/create")}
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

  const handleClickEventPrivacy = (event: any) => {
    setAnchorElPrivacy(event.currentTarget);
  };
  const handleCloseEventPrivacy = () => {
    setAnchorElPrivacy(null);
  };
  // location search textfield
  const [locationInput, setLocationInput] = React.useState<string>("");
  const locationPopoverWidth = drawerWidth - 40;
  const onSelectLocation = (place: any) => {
    const name = place.hasLocation === undefined ? place.name : eventLocation;
    setEventLocation({
      name: name,
      location: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
      hasLocation: place.hasLocation === undefined ? true : place.hasLocation,
    });
    setLocationInput(name);
  };
  // time zone
  React.useEffect(() => {
    if (!(eventLocation.hasLocation === true)) return;
    getTimezoneByLocation(
      eventLocation.location.lat,
      eventLocation.location.lng
    ).then((tz) => {
      if (tz?.status === "ZERO_RESULTS") setTimezone(getLocalTimezone);
      else
        setTimezone({
          name: tz.timeZoneName,
          abbr: tzAbbreviation(tz.timeZoneName),
        });
    });
  }, [eventLocation, setTimezone]);
  // for google map integration
  const [mapCenter, setMapCenter] = React.useState({ lat: 0, lng: 0 });
  const [mapZoom, setMapZoom] = React.useState(1);

  // search modal
  const [editLocation, setEditLocation] = React.useState<any>({});
  const [locationName, setLocationName] = React.useState<string>("");
  const maxZoom = 14;
  const [isZooming, setZooming] = React.useState(false);

  React.useEffect(() => {
    if (!isZooming) return;
    // experimental
    if (mapZoom < maxZoom) setTimeout(() => setMapZoom(mapZoom + 1), 200);
    else setZooming(false);
  }, [mapZoom, setZooming, isZooming]);

  const searchModalPopoverWidth = isMobile ? 330 : 516;
  const [searchLocation, setSearchLocation] = React.useState("");
  const searchModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: Colors[resolvedTheme]?.header_bg,
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    padding: "0px",
  };

  const onSelectSearchPlace = (place: any) => {
    const name = place.name;
    setSearchLocation(name);
    setLocationName(name);

    const newLocation = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    setEditLocation({
      name: name,
      location: newLocation,
      hasLocation: place.hasLocation === undefined ? true : place.hasLocation,
    });

    setMapCenter(newLocation);
    setZooming(true);
  };
  const openSearchModal = function (e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    const location = eventLocation?.hasLocation
      ? eventLocation.location
      : { lat: 0, lng: 0 };

    setEditLocation({
      ...editLocation,
      hasLocation: eventLocation.hasLocation,
      location,
    });
    setMapCenter(location);
    setMapZoom(eventLocation?.hasLocation ? maxZoom : 1);
    setSearchLocation("");
    setLocationName(eventLocation?.name || "");
    showLocationSearchModal(true);
    showUserLocation(false);
  };
  const closeSearchModal = () => showLocationSearchModal(false);
  const [showError, setErrorFlag] = React.useState<boolean>(true);

  const locationError = React.useCallback(() => {
    return !(editLocation.hasLocation === true);
  }, [editLocation])();

  const locationNameError = React.useCallback(() => {
    return locationName === "";
  }, [locationName])();

  const validationError = React.useCallback(
    () => locationError || locationNameError,
    [locationError, locationNameError]
  )();

  const onSearchModalSave = () => {
    if (!validationError) {
      setEventLocation({ ...editLocation, name: locationName });
      setLocationInput(locationName);
      showLocationSearchModal(false);
    }
  };

  // user location sharing
  const [currentLocation, setCurrentLocation] = React.useState<any>({
    isSet: false,
    loc: { lat: 0, lng: 0 },
  });
  const [userLocation, showUserLocation] = React.useState<boolean>(false);
  const handleLocationError = (flag: boolean) => {
    if (!flag) window.alert("The browser does not support geolocation");
    else window.alert("Error occured getting user location");
  };
  const shareUserLocation = () => {
    if (!currentLocation.isSet) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setCurrentLocation({
              isSet: true,
              loc: pos,
            });
            setMapCenter(pos);
            showUserLocation(true);
            setZooming(true);
          },
          () => {
            console.log("getting location error");
            handleLocationError(true);
          }
        );
      } else {
        console.log("not supported by browser");
        handleLocationError(false);
      }
    }
  };

  // upload cover photo
  const Input = styled("input")({
    display: "none",
  });
  const [coverPhotoPath, setCoverPhotoPath] = React.useState<string>("");
  const onSelectCoverPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCoverPhotoPath(url);
      setCover({
        url: url,
        pos: {
          x: 0.5,
          y: 0.5,
        },
      });
    }
  };
  const onDeleteCoverPhoto = () => {
    setCoverPhotoPath("");
    setCover({
      url: "",
    });
  };
  const onCoverPhotoMove = (pos: { x: number; y: number }) => {
    setCover({
      ...cover,
      pos: pos,
    });
  };

  return (
    <Drawer
      variant={variant}
      open={drawerOpen}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        "& .MuiDrawer-paper": {
          backgroundColor: !events
            ? Colors[resolvedTheme].drawer_bg
            : Colors[resolvedTheme].event_drawer_bg,
          boxSizing: "border-box",
          boxShadow: !events ? "none" : "0px 0px 5px rgb(0 0 0 / 20%)",
          borderRight: !events ? "none" : Colors[resolvedTheme].border,
          width: drawerWidth,
          minHeight: "100vh",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          height: "100%",
        }}
      >
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
                    input: {
                      color: Colors[resolvedTheme].primary,
                    },
                    label: {
                      color: Colors[resolvedTheme].secondary,
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: Colors[resolvedTheme].input_border,
                      },
                      "&:hover fieldset": {
                        borderColor: (theme: any) => theme.palette.primary.main,
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
            style={{
              backgroundColor: Colors[resolvedTheme].header_bg,
            }}
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
        {/* Search Location Modal */}
        <Modal
          open={locationSearchModal}
          closeAfterTransition
          onClose={closeSearchModal}
        >
          <Box sx={searchModalStyle}>
            <div style={{ padding: "10px 0px" }}>
              <Typography
                style={{
                  textAlign: "center",
                  fontFamily: "sans-serif",
                  fontSize: "20px",
                  fontWeight: 550,
                  textTransform: "none",
                  padding: "20px 0px",
                }}
              >
                Find a location
              </Typography>
              <IconButton
                onClick={closeSearchModal}
                sx={{
                  backgroundColor: Colors[resolvedTheme].icon_bg,
                  position: "absolute",
                  right: "8px",
                  top: "24px",
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
            </div>
            <Divider
              sx={{
                borderColor: Colors[resolvedTheme].tab_divider,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "10px 15px",
                gap: "10px",
              }}
            >
              <Typography
                style={{
                  color: Colors[resolvedTheme].secondary,
                  fontSize: "14px",
                  padding: "5px",
                }}
              >
                Search by city, neighborhood, or place name to move the map.
              </Typography>
              <LocationSelector
                onSelectPlace={onSelectSearchPlace}
                textProps={{
                  fullWidth: true,
                  placeholder: "Search",
                  variant: "standard",
                  sx: {
                    input: {
                      color: Colors[resolvedTheme].primary,
                    },
                    bgcolor: Colors[resolvedTheme].search_bg,
                    borderRadius: "20px",
                    padding: "5px 2px",
                  },
                  value: searchLocation,
                }}
                PaperProps={{
                  sx: {
                    width: searchModalPopoverWidth + "px",
                    maxHeight: "calc(100% - 236px)",
                    borderRadius: (theme: any) => theme.shape.borderRadius,
                    boxShadow: Colors[resolvedTheme].account_menu_shadow,
                    bgcolor: Colors[resolvedTheme].header_bg,
                    color: Colors[resolvedTheme].primary,
                    overflow: "auto",
                  },
                }}
                handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchLocation(e.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{
                          color: Colors[resolvedTheme].primary,
                          marginLeft: 1,
                        }}
                      />
                    </InputAdornment>
                  ),
                  disableUnderline: true,
                }}
              />

              <div
                className={styles.mapContainer}
                style={
                  showError && locationError
                    ? {
                        border:
                          "3px solid " + Colors[resolvedTheme].input_error,
                        transition: "0.5s",
                      }
                    : {}
                }
              >
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API || "",
                  }}
                  center={mapCenter}
                  zoom={mapZoom}
                  options={(maps: Maps) => ({
                    clickableIcons: false,
                    fullscreenControl: false,
                    keyboardShortcuts: false,
                    styles: MapStyle[resolvedTheme],
                    minZoomOverride: true,
                    minZoom: 1,
                    zoomControlOptions: {
                      position: maps.ControlPosition.TOP_LEFT,
                    },
                  })}
                  onClick={({ lat, lng }) => {
                    setEditLocation({
                      ...editLocation,
                      location: { lat, lng },
                      hasLocation: true,
                    });
                  }}
                  onChange={({ zoom }) => {
                    setMapZoom(zoom);
                  }}
                >
                  {editLocation?.hasLocation && (
                    <MapMarker
                      lat={
                        editLocation?.location?.lat !== undefined
                          ? editLocation.location.lat
                          : 0
                      }
                      lng={
                        editLocation?.location?.lng !== undefined
                          ? editLocation.location.lng
                          : 0
                      }
                    >
                      <RoomIcon
                        style={{
                          color: "red",
                        }}
                      />
                    </MapMarker>
                  )}
                  {currentLocation.isSet && userLocation && (
                    <MapMarker
                      lat={currentLocation.loc.lat}
                      lng={currentLocation.loc.lng}
                    >
                      <CircleIcon color="primary" sx={{ fontSize: "small" }} />
                    </MapMarker>
                  )}
                </GoogleMapReact>
                <IconButton
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "10px",
                    backgroundColor: Colors[resolvedTheme].mylocation_bg,
                    borderRadius: "10px",
                  }}
                  onClick={shareUserLocation}
                >
                  <MyLocationOutlinedIcon
                    color={
                      !userLocation ? Colors[resolvedTheme].primary : "primary"
                    }
                  />
                </IconButton>
              </div>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LocationOnIcon
                  sx={{
                    color:
                      showError && locationError
                        ? Colors[resolvedTheme].input_error
                        : Colors[resolvedTheme].secondary,
                  }}
                />
                <div
                  style={{
                    color:
                      showError && locationError
                        ? Colors[resolvedTheme].input_error
                        : Colors[resolvedTheme].secondary,
                    fontSize: "14px",
                  }}
                >
                  {editLocation?.hasLocation
                    ? "Location: " + getLocationString(editLocation.location)
                    : "Click on the map to select a specific location."}
                </div>
              </span>
              <TextField
                fullWidth
                label="Location Name"
                variant="outlined"
                sx={{
                  input: { color: Colors[resolvedTheme].primary },
                  fieldset: {
                    transition: "0.6s",
                  },
                }}
                error={showError && locationNameError}
                value={locationName}
                onChange={(e: any) => {
                  setEditLocation({ ...editLocation, name: e.target.value });
                  setLocationName(e.target.value);
                }}
                InputProps={{
                  endAdornment: showError && locationNameError && (
                    <InputAdornment position="end">
                      <WarningIcon
                        style={{
                          color: Colors[resolvedTheme].input_error,
                          borderRadius: 5,
                          cursor: "pointer",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              ></TextField>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  padding: "20px 0px",
                }}
              >
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
                  onClick={closeSearchModal}
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
                    backgroundColor: "#1976d2",
                    fontWeight: "600",
                    textTransform: "none",
                  }}
                  onClick={onSearchModalSave}
                  disabled={validationError}
                >
                  Save
                </Button>
              </div>
            </div>
          </Box>
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
                id="drawer_profile_button"
                button
                onClick={() => {
                  router.push("/" + (user.username || user.walletAddress));
                }}
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
                <Avatar
                  avatarImage={user?.avatarImage}
                  walletAddress={user?.walletAddress}
                  size={36}
                />
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
                  {user?.name || shortenAddress(user?.walletAddress)}
                </ListItemText>
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
                      backgroundColor:
                        Colors[resolvedTheme].selected_event_menu,
                    },
                    "&& .Mui-selected": {
                      backgroundColor:
                        Colors[resolvedTheme].selected_event_menu,
                      "&, & .MuiListItemIcon-root": {
                        color: (theme) => theme.palette.primary.main,
                      },
                    },
                    "&& .Mui-selected:hover": {
                      backgroundColor:
                        Colors[resolvedTheme].selected_event_menu,
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
                        onClick={() => discard("/events")}
                        sx={{
                          backgroundColor: Colors[resolvedTheme].icon_bg,
                          marginRight: "8px",
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
                    </Tooltip>

                    <Box
                      component="div"
                      sx={{
                        whiteSpace: "nowrap",
                        mr: !events ? 2 : 0,
                        variant: "h6",
                        display: !events
                          ? { xs: "none", md: "flex" }
                          : {
                              xs: "flex",
                              md: "flex",
                              sm: "flex",
                            },
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
                      sx={{
                        color: Colors[resolvedTheme].secondary,
                      }}
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
                ) : eventStep === 0 ? (
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
                ) : eventStep === 1 ? (
                  <div>
                    <Typography
                      sx={{
                        paddingLeft: "16px",
                        fontSize: "1.6rem",
                        fontWeight: 900,
                        color: Colors[resolvedTheme].primary,
                      }}
                      variant="h6"
                    >
                      Location
                    </Typography>
                    <Typography
                      sx={{
                        paddingLeft: "16px",
                        paddingRight: "12px",
                        marginBottom: 1,
                        fontSize: "1.2rem",
                        fontWeight: 300,
                        color: Colors[resolvedTheme].secondary,
                      }}
                      variant="h6"
                    >
                      Add a physical location for people to join your event.
                    </Typography>
                  </div>
                ) : eventStep === 2 ? (
                  <div>
                    <Typography
                      sx={{
                        paddingLeft: "16px",
                        fontSize: "1.6rem",
                        fontWeight: 900,
                        color: Colors[resolvedTheme].primary,
                      }}
                      variant="h6"
                    >
                      Description
                    </Typography>
                    <Typography
                      sx={{
                        marginBottom: 1,
                        paddingLeft: "16px",
                        paddingRight: "12px",
                        fontWeight: 300,
                        fontSize: "1.2rem",
                        color: Colors[resolvedTheme].secondary,
                      }}
                      variant="h6"
                    >
                      Provide more information about your event so guests know
                      what to expect.
                    </Typography>
                  </div>
                ) : (
                  <div>
                    <Typography
                      sx={{
                        paddingLeft: "16px",
                        fontSize: "1.6rem",
                        fontWeight: 900,
                        color: Colors[resolvedTheme].primary,
                      }}
                      variant="h6"
                    >
                      Additional Details
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        padding: "0px 5px",
                      }}
                    >
                      <Typography
                        sx={{
                          paddingLeft: "16px",
                          marginTop: "auto",
                          fontSize: ".9rem",
                          fontWeight: 400,
                          color: Colors[resolvedTheme].primary,
                          flexGrow: 1,
                        }}
                        variant="caption"
                      >
                        Cover Photo
                      </Typography>

                      <Tooltip
                        title="We recommend using a photo that is 1200 × 628 pixels."
                        placement="top"
                      >
                        <IconButton
                          size="small"
                          sx={{
                            marginBottom: "-5px",
                            marginRight: "10px",
                            color: Colors[resolvedTheme].secondary,
                            ":hover": {
                              backgroundColor: Colors[resolvedTheme].hover,
                            },
                          }}
                        >
                          <InfoRoundedIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                )}
                <List
                  sx={{
                    "&& .Mui-selected": {
                      backgroundColor:
                        Colors[resolvedTheme].selected_event_menu,
                      "&, & .MuiListItemIcon-root": {
                        color: (theme) => theme.palette.primary.main,
                      },
                    },
                    "&& .Mui-selected:hover": {
                      backgroundColor:
                        Colors[resolvedTheme].selected_event_menu,
                    },
                    px: 2,
                    flexGrow: "1",
                  }}
                >
                  {(!eventDetails || !eventStep) && (
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
                      <Avatar
                        avatarImage={user?.avatarImage}
                        walletAddress={user?.walletAddress}
                        size={36}
                      />
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
                  )}
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
                  ) : eventStep === 0 ? (
                    <>
                      <form onSubmit={handleSubmit3(onSubmitCreateEvents)}>
                        <TextField
                          fullWidth
                          label="Event name"
                          variant="outlined"
                          autoComplete="event"
                          autoFocus
                          sx={{
                            input: {
                              color: Colors[resolvedTheme].primary,
                            },
                            label: {
                              color: Colors[resolvedTheme].secondary,
                            },
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
                          inputProps={{
                            maxLength: CHARACTER_LIMIT,
                          }}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEventName(e.target.value)
                          }
                          value={eventName}
                          helperText={`${
                            eventName?.length || 0
                          }/${CHARACTER_LIMIT}`}
                          error={!!errors3?.email}
                        />

                        <Grid
                          sx={{
                            marginBottom: showEndDate ? "12px" : undefined,
                          }}
                          container
                          columnSpacing={{
                            xs: 2.3,
                            sm: 2.3,
                            md: 2.3,
                          }}
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
                                value={getStartDate()}
                                maxDate={getEndtDate()}
                                onChange={(newValue: any) => {
                                  if (
                                    !showEndDate ||
                                    validEventTime(
                                      newValue,
                                      startTime,
                                      endDate,
                                      endTime
                                    )
                                  ) {
                                    setStartDate(newValue);
                                  }
                                }}
                                onClose={() => {
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
                                OpenPickerButtonProps={{
                                  disableRipple: true,
                                }}
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
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
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
                              value={startTime}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onChange={(e) => {
                                if (
                                  !showEndDate ||
                                  validEventTime(
                                    startDate,
                                    e.target.value,
                                    endDate,
                                    endTime
                                  )
                                ) {
                                  setStartTime(e.target.value);
                                }
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
                              {availableStartTimes().map(
                                (time: any, index: any) => (
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
                                )
                              )}
                            </TextField>
                          </Grid>
                        </Grid>

                        {showEndDate ? (
                          <>
                            <Grid
                              container
                              rowSpacing={1}
                              columnSpacing={{
                                xs: 2.3,
                                sm: 2.3,
                                md: 2.3,
                              }}
                            >
                              <Grid item xs={7}>
                                <LocalizationProvider
                                  dateAdapter={AdapterDateFns}
                                >
                                  <DatePicker
                                    desktopModeMediaQuery=""
                                    open={openEnd}
                                    onOpen={() => setOpenEnd(true)}
                                    allowSameDateSelection={true}
                                    label="End Date"
                                    views={["day"]}
                                    value={getEndtDate()}
                                    minDate={getStartDate()}
                                    onChange={(newValue: any) => {
                                      if (
                                        validEventTime(
                                          startDate,
                                          startTime,
                                          newValue,
                                          endTime
                                        )
                                      ) {
                                        setEndDate(newValue);
                                      } else {
                                        adjustEndDate();
                                      }
                                    }}
                                    onClose={() => {
                                      setOpenEnd(false);
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
                                              Colors[resolvedTheme]
                                                .selected_date,
                                          },
                                        },
                                        "&& .Mui-selected:hover": {
                                          backgroundColor: (theme) =>
                                            theme.palette.primary.dark,
                                        },
                                        "&& .MuiPaper-root": {
                                          color:
                                            Colors[resolvedTheme].secondary,
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
                                        bgcolor:
                                          Colors[resolvedTheme].header_bg,
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
                                            color:
                                              Colors[resolvedTheme].primary,
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
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
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
                                  value={endTime}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  onChange={(e) => {
                                    if (
                                      validEventTime(
                                        startDate,
                                        startTime,
                                        endDate,
                                        e.target.value
                                      )
                                    ) {
                                      setEndTime(e.target.value);
                                    }
                                  }}
                                  select
                                  SelectProps={{
                                    MenuProps: {
                                      sx: {
                                        "&& .Mui-selected": {
                                          backgroundColor: "transparent",
                                          borderRadius: (theme) =>
                                            Number(theme.shape.borderRadius) /
                                            2,
                                        },
                                        "&& .Mui-selected:focus": {
                                          backgroundColor: "transparent",
                                        },
                                        "&& .Mui-selected:hover": {
                                          backgroundColor:
                                            Colors[resolvedTheme]
                                              .date_picker_hover,
                                          borderRadius: (theme) =>
                                            Number(theme.shape.borderRadius) /
                                            2,
                                        },
                                        "& .MuiPaper-root": {
                                          bgcolor:
                                            Colors[resolvedTheme].header_bg,
                                          borderRadius: (theme) =>
                                            Number(theme.shape.borderRadius) /
                                            2,
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
                                  {availableEndTimes().map(
                                    (time: any, index: any) => (
                                      <MenuItem
                                        sx={{
                                          "&& .Mui-selected": {
                                            "&, & .MuiMenuItem-root": {
                                              backgroundColor:
                                                Colors[resolvedTheme]
                                                  .time_hover,
                                            },
                                            backgroundColor:
                                              Colors[resolvedTheme].time_hover,
                                          },
                                          "&& .MuiMenu-list": {
                                            paddingTop: 0,
                                          },

                                          bgcolor:
                                            Colors[resolvedTheme].header_bg,
                                          color: Colors[resolvedTheme].primary,
                                          margin: "0 8px",
                                          ":hover": {
                                            backgroundColor:
                                              Colors[resolvedTheme].time_hover,
                                            borderRadius: (theme) =>
                                              Number(theme.shape.borderRadius) /
                                              2,
                                          },
                                        }}
                                        key={index}
                                        value={time}
                                      >
                                        {time}
                                      </MenuItem>
                                    )
                                  )}
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
                              adjustEndDate();
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
                              borderColor: (theme) =>
                                theme.palette.primary.main,
                            },
                            ":focus": {
                              borderColor: (theme) =>
                                theme.palette.primary.main,
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
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                              }}
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
                        {privacy === "Private" && (
                          <FormControlLabel
                            control={
                              <IOSSwitch
                                sx={{ m: 1 }}
                                checked={invitable}
                                onChange={(event) =>
                                  setInvitable(event.target.checked)
                                }
                              />
                            }
                            label={
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <b>Guests Can Invite People</b>
                                <span
                                  style={{
                                    fontSize: 12,
                                  }}
                                >
                                  If this is on, guests can invite people to the
                                  event.
                                </span>
                              </div>
                            }
                            labelPlacement="start"
                            sx={{
                              color: Colors[resolvedTheme].primary,
                              margin: "10px 0",
                              display: "flex",
                              flexDirection: "row-reverse",
                              alignItems: "start",
                              justifyContent: "space-between",
                            }}
                          />
                        )}
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
                                backgroundColor:
                                  Colors[resolvedTheme].time_hover,
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
                                "&": {
                                  color: Colors[resolvedTheme].primary,
                                },
                              }}
                              checked={privacy === "Private"}
                              onChange={handlePrivacyChange}
                              value="Private"
                              name="radio-buttons"
                              inputProps={{
                                "aria-label": "A",
                              }}
                            />
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setPrivacy("Public");
                              setInvitable(true);
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
                                backgroundColor:
                                  Colors[resolvedTheme].time_hover,
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
                                "&": {
                                  color: Colors[resolvedTheme].primary,
                                },
                              }}
                              checked={privacy === "Public"}
                              onChange={handlePrivacyChange}
                              value="Public"
                              name="radio-buttons"
                              inputProps={{
                                "aria-label": "A",
                              }}
                            />
                          </MenuItem>
                        </Menu>
                      </form>
                    </>
                  ) : eventStep === 1 ? (
                    <>
                      <LocationSelector
                        onSelectPlace={onSelectLocation}
                        textProps={{
                          fullWidth: true,
                          label: "Location",
                          variant: "outlined",
                          autoFocus: true,
                          sx: {
                            input: {
                              color: Colors[resolvedTheme].primary,
                            },
                            label: {
                              color: Colors[resolvedTheme].secondary,
                            },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: Colors[resolvedTheme].input_border,
                              },
                              "&:hover fieldset": {
                                borderColor: (theme: any) =>
                                  theme.palette.primary.main,
                              },
                            },
                            marginBottom: "12px",
                          },
                          value: locationInput,
                        }}
                        PaperProps={{
                          sx: {
                            width: locationPopoverWidth + "px",
                            top: "268px !important",
                            maxHeight: "calc(100% - 284px)",
                            borderRadius: (theme: any) =>
                              theme.shape.borderRadius,
                            boxShadow:
                              Colors[resolvedTheme].account_menu_shadow,
                            bgcolor: Colors[resolvedTheme].header_bg,
                            color: Colors[resolvedTheme].primary,
                            overflow: "auto",
                          },
                        }}
                        handleChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setLocationInput(e.target.value);
                          setEventLocation({
                            hasLocation: false,
                            name: e.target.value,
                          });
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <FmdGoodIcon
                                sx={{
                                  backgroundColor:
                                    Colors[resolvedTheme].location_btn_bg,
                                  ":hover": {
                                    backgroundColor:
                                      Colors[resolvedTheme].location_btn_hover,
                                  },
                                }}
                                style={{
                                  padding: 10,
                                  color: Colors[resolvedTheme].primary,
                                  borderRadius: 5,
                                  cursor: "pointer",
                                }}
                                onClick={(e: React.MouseEvent<any, any>) =>
                                  openSearchModal(e)
                                }
                              />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <Tooltip title="Time zone set by the location">
                        <Typography
                          component="span"
                          sx={{
                            alignItems: "center",
                            color: Colors[resolvedTheme].secondary,
                            display: "flex",
                          }}
                        >
                          <LanguageIcon
                            sx={{
                              fontSize: 16,
                              mr: 1,
                            }}
                          />
                          {timezone.name} ({timezone.abbr})
                        </Typography>
                      </Tooltip>
                    </>
                  ) : eventStep === 2 ? (
                    <TextField
                      fullWidth
                      label="Description"
                      variant="outlined"
                      autoFocus
                      multiline
                      rows={4}
                      sx={{
                        textarea: {
                          color: Colors[resolvedTheme].primary,
                        },
                        label: {
                          color: Colors[resolvedTheme].secondary,
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: Colors[resolvedTheme].input_border,
                            borderRadius: "6px",
                          },
                          "&:hover fieldset": {
                            borderColor: (theme) => theme.palette.primary.main,
                          },
                        },
                      }}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEventDescription(e.target.value)
                      }
                      value={eventDescription}
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      {coverPhotoPath !== "" ? (
                        <div
                          style={{
                            position: "relative",
                            cursor: "all-scroll",
                            overflow: "hidden",
                            borderRadius: 5,
                            width: 300,
                            height: 150,
                          }}
                        >
                          <AvatarEditor
                            image={coverPhotoPath}
                            width={300}
                            height={150}
                            border={0}
                            onPositionChange={onCoverPhotoMove}
                          />
                          <DeleteIcon
                            className={styles.avatar_delete}
                            sx={{
                              backgroundColor: "#E3E6EA",
                              ":hover": {
                                backgroundColor: "#DAD9DF",
                              },
                            }}
                            fontSize="small"
                            onClick={onDeleteCoverPhoto}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            background: "transparent",
                            borderStyle: "solid",
                            borderWidth: "1px",
                            borderColor:
                              resolvedTheme === "light"
                                ? Colors[resolvedTheme].photo_btn_group_border
                                : Colors[resolvedTheme].divider,
                            borderRadius: "5px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            padding: "30px 40px",
                            gap: "10px",
                          }}
                        >
                          <label htmlFor="upload-cover-photo">
                            <Input
                              accept="image/*"
                              id="upload-cover-photo"
                              multiple
                              type="file"
                              onChange={onSelectCoverPhoto}
                            />
                            <Button
                              component="span"
                              fullWidth
                              sx={{
                                backgroundColor: Colors[resolvedTheme].photoBtn,
                                color: Colors[resolvedTheme].primary,
                                textTransform: "none",
                                fontWeight: "500",
                                "&:hover": {
                                  backgroundColor:
                                    Colors[resolvedTheme].back_hover,
                                },
                              }}
                              startIcon={<InsertPhotoIcon />}
                            >
                              Upload Cover Photo
                            </Button>
                          </label>
                        </div>
                      )}

                      <Button
                        disableRipple
                        fullWidth
                        startIcon={
                          <SettingsIcon
                            sx={{ marginLeft: 0, marginRight: "6px" }}
                          />
                        }
                        sx={{
                          background: "transparent",
                          borderRadius: (theme) =>
                            Number(theme.shape.borderRadius) / 2,
                          color: Colors[resolvedTheme].primary,
                          justifyContent: "flex-start",
                          fontSize: "16px",
                          textTransform: "none",
                          ":hover": {
                            backgroundColor: Colors[resolvedTheme].hover,
                          },
                        }}
                      >
                        Event Settings
                      </Button>
                    </div>
                  )}
                </List>
              </>
            )}
          </>
        )}
        {eventDetails && (
          <div>
            <Divider
              sx={{
                borderColor: Colors[resolvedTheme].divider,
                marginBottom: 1.5,
              }}
            />
            <div className={styles.stepper}>
              {[-1, 0, 1, 2].map((value: number, index: number) => (
                <Box
                  key={index}
                  sx={{
                    bgcolor: (theme) =>
                      value < eventStep
                        ? theme.palette.primary.main
                        : Colors[resolvedTheme].back_hover,
                  }}
                  className={styles.step}
                />
              ))}
            </div>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                padding: "10px 16px",
              }}
            >
              <Button
                disableElevation
                variant="contained"
                sx={{
                  borderRadius: (theme) => Number(theme.shape.borderRadius) / 2,
                  backgroundColor: Colors[resolvedTheme].tab_divider,
                  flexGrow: "1",
                  color: Colors[resolvedTheme].primary,
                  marginRight: "10px",
                  fontWeight: "600",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: Colors[resolvedTheme].back_hover,
                  },
                }}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                disableElevation
                variant="contained"
                sx={{
                  flexGrow: "12",
                  borderRadius: (theme) => Number(theme.shape.borderRadius) / 2,
                  color: "white",
                  backgroundColor: "#1976d2",
                  fontWeight: "600",
                  textTransform: "none",
                  "&:disabled": {
                    backgroundColor: Colors[resolvedTheme].tab_divider,
                    color: Colors[resolvedTheme].border,
                  },
                }}
                disabled={
                  !(
                    (eventStep === 0 && eventName && privacy !== "Privacy") ||
                    (eventStep === 1 && eventLocation) ||
                    (eventStep == 2 && eventDescription)
                  )
                }
                onClick={handleNext}
              >
                {eventStep < 3 ? "Next" : "Create Event"}
              </Button>
            </Box>
          </div>
        )}
      </div>
    </Drawer>
  );
}
