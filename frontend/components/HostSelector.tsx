import {
  FormControlLabel,
  MenuItem,
  MenuList,
  Popover,
  TextField,
} from "@mui/material";
import React from "react";

import Avatar from "components/Avatar";
import IOSSwitch from "components/IOSSwitch";
import Colors from "lib/colors";
import Image from "next/image";
import { useTheme } from "next-themes";
//import styles from "styles/components/HostSelector.module.scss";

export default function HostSelector({
  width,
  onSelectHost,
}: {
  width: number;
  onSelectHost: (host: any) => any;
}) {
  const { resolvedTheme } = useTheme();

  const [hostSearch, setHostSearch] = React.useState("");
  const hostSearchRef = React.useRef<HTMLElement | null>(null);
  const [hostsAnchor, setHostsAnchor] = React.useState<HTMLElement | null>(
    null
  );
  const [hosts, setHosts] = React.useState([]);
  React.useEffect(() => {
    if (hosts && hosts.length > 0) {
      setHostsAnchor(hostSearchRef?.current);
    } else setHostsAnchor(null);
  }, [hosts, setHostsAnchor, hostSearchRef]);

  const handleCloseHostsPopover = () => {
    setHostsAnchor(null);
  };
  const hostsPopoverOpen = Boolean(hostsAnchor);
  const selectHost = (host: any) => {
    handleCloseHostsPopover();
    onSelectHost(host);
  };
  const [showGuest, ShowGuest] = React.useState(true);

  const debounceTime = 500;
  const [searchTimer, setSearchTimer] = React.useState<NodeJS.Timeout | null>(
    null
  );
  const startSearch = (search: string) => {
    setHostSearch(search);

    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    let timerID = setTimeout(() => {
      fetch("/api/get-hosts", {
        method: "POST",
        body: JSON.stringify({
          search,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          setHosts(data.hosts);
        });
    }, debounceTime);
    setSearchTimer(timerID);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        color: Colors[resolvedTheme].primary,
      }}
    >
      <TextField
        fullWidth
        label="Co-hosts"
        placeholder="Add Hosts"
        variant="outlined"
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
              borderColor: (theme: any) => theme.palette.primary.main,
            },
          },
          marginBottom: "12px",
        }}
        InputProps={{
          ref: hostSearchRef,
        }}
        onClick={() => {
          if (hosts && hosts.length > 0) {
            setHostsAnchor(hostSearchRef?.current);
          }
        }}
        value={hostSearch}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          startSearch(e.target.value);
        }}
      />
      <span>Co-hosts can accept or decline once you publish your event.</span>
      <b style={{ marginTop: 30, fontSize: 20 }}>Event Options</b>
      <FormControlLabel
        control={
          <IOSSwitch
            sx={{ m: 1 }}
            checked={showGuest}
            onChange={(event) => ShowGuest(event.target.checked)}
          />
        }
        label={<b>Show Guest List</b>}
        labelPlacement="start"
        sx={{
          color: Colors[resolvedTheme].primary,
          margin: "10px 0",
          display: "flex",
          flexDirection: "row-reverse",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      />
      <Popover
        open={hostsPopoverOpen}
        anchorEl={hostsAnchor}
        anchorOrigin={{
          horizontal: "left",
          vertical: "bottom",
        }}
        onClose={handleCloseHostsPopover}
        disableAutoFocus
        sx={{
          marginTop: "5px",
          maxHeight: "calc(100% - 236px)",
          borderRadius: (theme: any) => theme.shape.borderRadius,
          boxShadow: Colors[resolvedTheme].account_menu_shadow,
          color: Colors[resolvedTheme].primary,
        }}
        PaperProps={{
          sx: { width: 310 },
        }}
      >
        <MenuList sx={{ paddingTop: 0, paddingBottom: 0 }}>
          {hosts?.map((host: any, index: any) => {
            return (
              <MenuItem
                key={index}
                sx={{
                  ":hover": {
                    backgroundColor: Colors[resolvedTheme].hover,
                  },
                  borderRadius: "0.5rem",
                }}
                onClick={() => {
                  selectHost(host);
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 5,
                    gap: 10,
                    width: "100%",
                  }}
                >
                  <Avatar
                    avatarImage={host.avatarImage}
                    walletAddress={host.username || host.name}
                    size={36}
                  />
                  <b
                    style={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                  >
                    {host.name || host.username}
                  </b>
                </div>
              </MenuItem>
            );
          })}
        </MenuList>
      </Popover>
    </div>
  );
}
