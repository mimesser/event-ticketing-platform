import {
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  InputAdornment,
  Modal,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import {
  CheckCircle,
  CircleOutlined,
  Close,
  Search,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import React from "react";

import Avatar from "components/Avatar";
import Colors from "lib/colors";
import { useFollowers } from "lib/hooks";
import { shortenAddress } from "lib/utils";

export default function InviteModal({ onClose }: { onClose?: () => any }) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { followers } = useFollowers();

  const [filter, setFilter] = React.useState("");
  const [invited, setInvited] = React.useState<any>({});

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxWidth: "640px",
    bgcolor: Colors[resolvedTheme]?.header_bg,
    borderRadius: "25px",
    boxShadow: 24,
    p: 4,
  };

  const filterUpdate = (text: string) => {
    setFilter(text);
  };

  return (
    <Modal
      BackdropProps={{
        timeout: 500,
      }}
      closeAfterTransition
      onClose={onClose}
      open={true}
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
    >
      <Box sx={modalStyle}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 -32px",
          }}
        >
          <div
            style={{
              margin: "-12px 0px 12px 0px",
            }}
          >
            <b>Invite</b>
            <IconButton
              aria-label="close"
              onClick={onClose}
              style={{
                position: "absolute",
                right: 10,
                top: 10,
              }}
              size="small"
              sx={{
                ":hover": {
                  backgroundColor: Colors[resolvedTheme].hover,
                },
              }}
            >
              <Close
                sx={{
                  color: Colors[resolvedTheme]?.primary,
                }}
              />
            </IconButton>
          </div>
          <Divider
            sx={{
              width: "100%",
              borderBottom: Colors[resolvedTheme].border,
            }}
          />
          <div
            style={{
              width: "calc(100% - 20px)",
              height: "60vh",
              margin: "10px",
            }}
          >
            <TextField
              fullWidth
              placeholder="Search for people by name, username, or email address"
              variant="standard"
              sx={{
                input: {
                  color: Colors[resolvedTheme].primary,
                },
                bgcolor: Colors[resolvedTheme].search_bg,
                borderRadius: "20px",
                padding: "5px 2px",
                marginBottom: "10px",
              }}
              value={filter}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                filterUpdate(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search
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
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div style={{ width: 150 }}>
                {filter && (
                  <ListItem
                    button
                    sx={{
                      borderRadius: "10px",
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
                    selected
                  >
                    <ListItemText>Search Results</ListItemText>
                  </ListItem>
                )}
                <ListItem
                  button
                  sx={{
                    borderRadius: "10px",
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
                  onClick={() => filterUpdate("")}
                  selected={filter === ""}
                >
                  <ListItemText>All Followers</ListItemText>
                </ListItem>
              </div>
              <div style={{ flex: 1 }}>
                {followers.length > 0 && (
                  <Typography
                    sx={{
                      borderRadius: "5px",
                      color: (theme: any) => theme.palette.primary.main,
                      cursor: "pointer",
                      padding: "10px",
                      textAlign: "center",
                      ":hover": {
                        backgroundColor: Colors[resolvedTheme].hover,
                      },
                    }}
                    onClick={() => {
                      let newCheckState: any = {};
                      followers.forEach((follower) => {
                        newCheckState[follower.id] = true;
                      });
                      setInvited(newCheckState);
                    }}
                  >
                    Select all
                  </Typography>
                )}
                {followers.map((follower, index) => {
                  if (
                    (follower.name && follower.name.includes(filter)) ||
                    (follower.username && follower.username.includes(filter)) ||
                    (follower.email && follower.email.includes(filter))
                  )
                    return (
                      <ListItem
                        key={index}
                        button
                        sx={{
                          borderRadius: "10px",
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
                        onClick={() =>
                          setInvited({
                            ...invited,
                            [follower.id]: !invited[follower.id],
                          })
                        }
                      >
                        <Avatar
                          avatarImage={follower.avatarImage}
                          walletAddress={follower.walletAddress}
                          size={36}
                        />
                        <ListItemText
                          disableTypography
                          style={{
                            marginLeft: "6%",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textAlign: "left",
                            textOverflow: "ellipsis",
                            color: Colors[resolvedTheme].primary,
                          }}
                          sx={{
                            ":hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {follower.name
                            ? follower.name
                            : follower.username
                            ? `@${follower.username}`
                            : shortenAddress(follower.walletAddress)}
                        </ListItemText>
                        <Checkbox
                          checked={invited[follower.id]}
                          icon={
                            <CircleOutlined
                              sx={{ color: Colors[resolvedTheme].primary }}
                            />
                          }
                          checkedIcon={<CheckCircle />}
                        />
                      </ListItem>
                    );
                  return null;
                })}
              </div>
            </div>
          </div>
          <Divider
            sx={{
              width: "100%",
              borderBottom: Colors[resolvedTheme].border,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              width: "100%",
              margin: "20px 40px -10px 0",
            }}
          >
            <Button
              disableElevation
              sx={{
                borderRadius: (theme) => Number(theme.shape.borderRadius) / 2,
                fontWeight: 600,
                marginRight: "10px",
                textTransform: "none",
                ":hover": {
                  background: Colors[resolvedTheme].cancel_hover,
                },
              }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              disableElevation
              color="primary"
              variant="contained"
              sx={{
                borderRadius: (theme) => Number(theme.shape.borderRadius) / 2,
                color: "white",
                fontWeight: "600",
                textTransform: "none",
              }}
              onClick={onClose}
            >
              Send invites
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
