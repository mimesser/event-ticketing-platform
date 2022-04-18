import React from "react";
import { Popover, TextField } from "@mui/material";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import useGoogleMap from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import Colors from "lib/colors";
import { useTheme } from "next-themes";
import styles from "styles/components/Drawer.module.scss";
import Image from "next/image";

export default function LocationSelector({
  textProps,
  InputProps,
  onSelectPlace,
  handleChange,
  PaperProps,
}: {
  textProps: any;
  InputProps: any;
  onSelectPlace: (place: any) => any;
  handleChange?: any;
  PaperProps: any;
}) {
  const { resolvedTheme } = useTheme();
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
  const [searchStr, setSearchStr] = React.useState<string>("");
  const locationSearchUpdate = (str: string) => {
    setSearchStr(str);
    if (predictTimer) {
      clearTimeout(predictTimer);
    }

    let timerID = setTimeout(() => {
      if (searchStr)
        setPlaces([
          {
            name: searchStr,
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
      getPlacePredictions({ input: searchStr });
    }, debounceTime);
    setPredictTimer(timerID);
  };

  React.useEffect(() => {
    placePredictions.map((place) => {
      placesService?.getDetails(
        { placeId: place.place_id },
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
    setSearchStr(place?.name ? place?.name : "");
    onSelectPlace(place);
  };
  return (
    <div style={{ display: "flex" }}>
      <TextField
        {...textProps}
        onClick={() => {
          if (places && places.length > 0) {
            setLocationAnchor(locSearchRef?.current);
          }
        }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (handleChange) handleChange(e);
          locationSearchUpdate(e.target.value);
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
        PaperProps={PaperProps}
      >
        <MenuList sx={{ paddingTop: 0, paddingBottom: 0 }}>
          {places.map((place: any, index: any) => {
            const isSearchStr = index === places.length - 1;
            return (
              <MenuItem
                key={index}
                sx={{
                  ":hover": {
                    backgroundColor: Colors[resolvedTheme].hover,
                  },
                  borderRadius: "0.5rem",
                }}
                onClick={
                  !isSearchStr
                    ? () => {
                        selectPlace(place);
                      }
                    : () => {
                        locationSearchUpdate(searchStr);
                      }
                }
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
                      {!isSearchStr ? place.name : searchStr}
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
            );
          })}
        </MenuList>
      </Popover>
    </div>
  );
}
