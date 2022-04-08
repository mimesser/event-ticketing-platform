import React from "react";
import { Popover, TextField } from "@mui/material";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import useGoogleMap from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import Colors from "lib/colors";
import { useTheme } from "next-themes";
import styles from "styles/components/Drawer.module.scss";
import { useNewEvent } from "lib/event-context";
import Image from "next/image";

export default function LocationSelector({
  textProps,
  InputProps,
  saveChanges,
  editMode,
  onSelectPlace,
  handleChange,
  popOverWidth,
}: {
  textProps: any;
  InputProps: any;
  saveChanges: any;
  editMode: boolean;
  onSelectPlace: (place: any) => any;
  handleChange?: any;
  popOverWidth: number;
}) {
  const { resolvedTheme } = useTheme();
  const { eventLocation, setEventLocation, setTimezone } = useNewEvent();
  const { placePredictions, getPlacePredictions, placesService } = useGoogleMap(
    {
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API,
    }
  );
  const debounceTime = 500;
  const [predictTimer, setPredictTimer] = React.useState<NodeJS.Timeout | null>(
    null
  );
  const [places, setPlaces] = React.useState<any[]>([]);
  const locSearchRef = React.useRef<HTMLElement | null>(null);
  const [locationAnchor, setLocationAnchor] =
    React.useState<HTMLElement | null>(null);
  const locationSearchUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (predictTimer) {
      clearTimeout(predictTimer);
    }

    let timerID = setTimeout(
      (search) => {
        if (search)
          setPlaces([
            {
              name: search,
              icon: "/icons/marker.png",
              geometry: {
                location: {
                  lat: () => 40,
                  lng: () => -75,
                },
              },
              hasLocation: false,
            },
          ]);
        else setPlaces([]);
        getPlacePredictions({ input: search });
      },
      debounceTime,
      event.target.value
    );
    setPredictTimer(timerID);

    if (!editMode) saveChanges("eventLocation")(event);

    setEventLocation({
      ...eventLocation,
      name: event.target.value,
      hasLocation: false,
    });
  };
  React.useEffect(() => {
    placePredictions.map((place) => {
      placesService?.getDetails(
        {
          placeId: place.place_id,
        },
        (placeDetails: any) => {
          if (placeDetails) setPlaces((places) => [placeDetails, ...places]);
        }
      );
    });
  }, [placePredictions, placesService]);
  React.useEffect(() => {
    if (places && places.length > 0) {
      setLocationAnchor(locSearchRef?.current);
    } else setLocationAnchor(null);
  }, [places, setLocationAnchor, locSearchRef]);
  const handleCloseLocationPopover = () => {
    setLocationAnchor(null);
  };
  const locationPopoverOpen = Boolean(locationAnchor);
  const selectPlace = (place: any) => {
    handleCloseLocationPopover();

    onSelectPlace(place);
  };
  return (
    <div>
      <TextField
        {...textProps}
        onClick={() => {
          if (places && places.length > 0) {
            setLocationAnchor(locSearchRef?.current);
          }
        }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (handleChange) handleChange(e);
          locationSearchUpdate(e);
        }}
        onKeyPress={(e) => {
          if (e.code === "Enter" && places.length > 0) {
            selectPlace(places[places.length - 1]);
          }
        }}
        InputProps={{
          ...InputProps,
          ref: locSearchRef,
        }}
      />
      <Popover
        open={locationPopoverOpen}
        anchorEl={locationAnchor}
        anchorOrigin={{
          horizontal: "left",
          vertical: "bottom",
        }}
        onClose={handleCloseLocationPopover}
        disableAutoFocus
        PaperProps={{
          sx: {
            width: popOverWidth + "px",
            borderRadius: (theme) => theme.shape.borderRadius,
            boxShadow: Colors[resolvedTheme].account_menu_shadow,
            bgcolor: Colors[resolvedTheme].header_bg,
            color: Colors[resolvedTheme].primary,
            overflow: "hidden",
          },
        }}
      >
        <MenuList sx={{ paddingTop: 0, paddingBottom: 0 }}>
          {places.map((place: any, index: any) => (
            <MenuItem
              key={index}
              sx={{
                ":hover": {
                  backgroundColor: Colors[resolvedTheme].hover,
                },
                borderRadius: "0.5rem",
              }}
              onClick={() => {
                selectPlace(place);
              }}
            >
              <div className={styles.place}>
                <div style={{ margin: "0 6px 0 0" }}>
                  <Image
                    src={place.icon}
                    alt="Loc"
                    width={32}
                    height={32}
                    layout="fixed"
                  />
                </div>
                <div className={styles.place_info}>
                  <span
                    className={styles.two_line_span}
                    style={{ fontWeight: "bold" }}
                  >
                    {place.name}
                  </span>
                  <span
                    className={styles.two_line_span}
                    style={{
                      color: Colors[resolvedTheme].secondary,
                    }}
                  >
                    {place.formatted_address}
                  </span>
                </div>
              </div>
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </div>
  );
}
