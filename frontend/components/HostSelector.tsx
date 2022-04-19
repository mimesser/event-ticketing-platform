import {
  FormControlLabel,
  IconButton,
  MenuItem,
  MenuList,
  Popover,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

import Avatar from "components/Avatar";
import IOSSwitch from "components/IOSSwitch";
import Colors from "lib/colors";
import { useTheme } from "next-themes";

export default function HostSelector({
  onUpdate,
}: {
  onUpdate: (hosts: any) => any;
}) {
  const { resolvedTheme } = useTheme();

  const [hostSearch, setHostSearch] = React.useState("");
  const hostSearchRef = React.useRef<HTMLElement | null>(null);
  const [hostsAnchor, setHostsAnchor] = React.useState<HTMLElement | null>(
    null
  );
  const [hosts, setHosts] = React.useState([]);

  const [selected, setSelectedHosts] = React.useState<any[]>([]);
  React.useEffect(() => {
    onUpdate(selected);
  }, [selected, onUpdate]);

  const handleCloseHostsPopover = () => {
    setHostsAnchor(null);
  };
  const hostsPopoverOpen = Boolean(hostsAnchor);
  const selectHost = (host: any) => {
    handleCloseHostsPopover();
    setSelectedHosts([...selected, host]);
  };
  const unselectHost = (host: any) => {
    const filtered = selected.filter((x) => x.id !== host.id);
    setSelectedHosts(filtered);
  };
  const hasCandidate = () => {
    const filtered = hosts.filter(
      (x: any) => selected.find((y) => x.id === y.id) === undefined
    );
    return filtered.length > 0;
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
      if (search) {
        fetch("/api/get-hosts", {
          method: "POST",
          body: JSON.stringify({
            search,
          }),
        })
          .then((r) => r.json())
          .then((data) => {
            const hosts = data.hosts;
            setHosts(hosts);
            setHostsAnchor(hostSearchRef?.current);
          });
      } else {
        setHosts([]);
        setHostsAnchor(null);
      }
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
          setHostsAnchor(hostSearchRef?.current);
        }}
        value={hostSearch}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          startSearch(e.target.value);
        }}
      />
      <span>Co-hosts can accept or decline once you publish your event.</span>
      {selected.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <b style={{ marginLeft: 30 }}>Pending</b>
          <MenuList sx={{ paddingTop: 0, paddingBottom: 0 }}>
            {selected?.map((host: any, index: any) => {
              return (
                <MenuItem
                  key={index}
                  sx={{
                    cursor: "auto",
                    color: Colors[resolvedTheme].primary,
                    ":hover": {
                      bgcolor: "transparent",
                    },
                  }}
                  disableRipple
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
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: 0,
                        flex: 1,
                      }}
                    >
                      <b
                        style={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {host.name}
                      </b>
                      {host.username && (
                        <span
                          style={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }}
                        >
                          @{host.username}
                        </span>
                      )}
                    </div>

                    <IconButton
                      onClick={() => unselectHost(host)}
                      sx={{
                        padding: "8px",
                        ":hover": {
                          background: Colors[resolvedTheme].hover,
                        },
                      }}
                    >
                      <CloseIcon
                        fontSize="small"
                        sx={{
                          backgroundColor: "#8B939D",
                          color: Colors[resolvedTheme].contrast,
                          padding: "3px",
                          borderRadius: "50%",
                        }}
                      />
                    </IconButton>
                  </div>
                </MenuItem>
              );
            })}
          </MenuList>
        </div>
      )}
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
        anchorEl={hasCandidate() ? hostsAnchor : null}
        anchorOrigin={{
          horizontal: "left",
          vertical: "bottom",
        }}
        onClose={handleCloseHostsPopover}
        disableAutoFocus
        sx={{
          marginTop: "5px",
          maxHeight: "calc(100% - 236px)",
          color: Colors[resolvedTheme].primary,
        }}
        PaperProps={{
          sx: {
            width: 310,
            border: Colors[resolvedTheme].border,
            borderRadius: (theme: any) => theme.shape.borderRadius,
            bgcolor: Colors[resolvedTheme].header_bg,
            boxShadow: Colors[resolvedTheme].account_menu_shadow,
          },
        }}
      >
        <MenuList sx={{ paddingTop: 0, paddingBottom: 0 }}>
          {hosts?.map((host: any, index: any) => {
            if (selected.find((x) => x.id === host.id)) return null;
            return (
              <MenuItem
                key={index}
                sx={{
                  ":hover": {
                    backgroundColor: Colors[resolvedTheme].hover,
                  },
                  borderRadius: "0.5rem",
                  color: Colors[resolvedTheme].primary,
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
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: 0,
                      flex: 1,
                    }}
                  >
                    <b
                      style={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {host.name}
                    </b>
                    {host.username && (
                      <span
                        style={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        @{host.username}
                      </span>
                    )}
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
