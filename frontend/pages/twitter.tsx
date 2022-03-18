import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TwitterIcon from "@mui/icons-material/Twitter";
import Typography from "@mui/material/Typography";
import Layout from "components/Layout";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Colors from "lib/colors";
import { useUser } from "lib/hooks";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Router from "next/router";
import { useEffect, useState } from "react";
import styles from "styles/pages/Twitter.module.scss";
import { useTheme } from "next-themes";

export default function Twitter() {
  const { resolvedTheme } = useTheme();
  const { data: session, status }: any = useSession();
  const [data, setData] = useState<any>();
  const { user } = useUser({
    redirectTo: "/",
    redirectIfFound: false,
  });
  const [handleTwitterModal, setHandleTwitterModal] = useState(true);
  const [selectedFrenz, setSelectedFrenz] = useState([] as any);
  const [followBtnText, setFollowBtnText] = useState("Follow all");
  const [followBtnStyle, setFollowBtnStyle] = useState(false);

  useEffect(() => {
    async function linkUser() {
      if (session && user && !data) {
        try {
          await fetch("/api/twitter/link-user", {
            method: "POST",
            body: JSON.stringify({
              twitterUsername: session.twitterProfile.screen_name,
            }),
          });
        } catch (error) {
          console.log(error);
        }

        try {
          await fetch("/api/twitter/friend-list")
            .then((res) => res.json())
            .then((data) => {
              setData(data);
            });
        } catch (error) {
          console.log(error);
        }
      }
    }

    if (data?.matchedFrenz.length === selectedFrenz.length) {
      setFollowBtnText("Follow none");
      setFollowBtnStyle(false);
    } else {
      setFollowBtnText("Follow all");
      setFollowBtnStyle(true);
    }

    linkUser();
  }, [session, user, data, selectedFrenz]);

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

  const continueButton = async () => {
    if (selectedFrenz.length === 0) {
      modalClose();
    } else {
      try {
        await fetch("/api/twitter/follow", {
          method: "POST",
          body: JSON.stringify({
            follow: selectedFrenz,
          }),
        });
      } catch (error) {
        console.log(error);
      }
      modalClose();
    }
  };

  const modalClose = () => {
    // Create user signup notifications
    fetch("/api/signup-notifications", {
      method: "POST",
    });

    setHandleTwitterModal(false);
    Router.push("/", undefined, { shallow: true });
  };

  // Twitter modal, Select frenz function
  const selectFrenz = (value: any) => () => {
    const currentIndex = selectedFrenz.indexOf(value);
    const newChecked = [...selectedFrenz];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedFrenz(newChecked);
  };

  // Twitter modal, Follow all button function
  const followAll = () => {
    if (followBtnStyle) {
      setSelectedFrenz(
        data.matchedFrenz.map(({ id }: any) => {
          return id;
        })
      );
    } else {
      setSelectedFrenz([]);
    }
  };
  return user ? (
    <Layout>
      <Modal
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        onClose={modalClose}
        open={handleTwitterModal}
        aria-labelledby="twitter-modal-title"
        aria-describedby="twitter-modal-description"
        style={{ overflow: "auto" }}
      >
        <Box sx={modalStyle}>
          <div className={styles.modal_box}>
            <IconButton
              aria-label="close"
              onClick={modalClose}
              className={styles.close_button}
            >
              <CloseIcon
                sx={{
                  color: Colors[resolvedTheme]?.primary,
                }}
              />
            </IconButton>
            {status === "loading" && <CircularProgress />}
            {status === "unauthenticated" && (
              <div className={styles.modal_body}>
                <Typography id={styles.h5} variant="h5">
                  Find frens you follow on Twitter
                </Typography>
                <Typography id={styles.body1} variant="body1">
                  To get the most of your Web3 adventure, connect with frens on
                  Twitter.
                </Typography>
                <Box className={styles.linkSocialButtons}>
                  <Button
                    onClick={() =>
                      signIn("twitter", { callbackUrl: "/twitter" })
                    }
                    id={styles.twtButton}
                    type="submit"
                    size="large"
                    variant="outlined"
                    sx={{
                      backgroundColor: "rgb(29, 161, 242)",
                      ":hover": {
                        backgroundColor: "rgb(26, 140, 216)",
                      },
                    }}
                    startIcon={<TwitterIcon />}
                  >
                    Find frens I follow
                  </Button>
                </Box>
              </div>
            )}
            {status === "authenticated" && (
              <div className={styles.modal_body}>
                <Typography id={styles.h5} variant="h5">
                  Frens you follow on Twitter
                </Typography>
                <Typography id={styles.body1} variant="body1">
                  Follow their Web3 journey on Impish
                </Typography>
                <Box className={styles.linkSocialButtons}>
                  {!data && <CircularProgress />}
                  {data?.matchedFrenz.length > 0 && (
                    <>
                      <Button
                        id={
                          followBtnStyle
                            ? styles.followAllBtn
                            : styles.unfollowAllBtn
                        }
                        onClick={followAll}
                        type="submit"
                        color="primary"
                        size="large"
                        variant="outlined"
                      >
                        {followBtnText}
                      </Button>
                      <List className={styles.matchedFrenz}>
                        {data.matchedFrenz.map(
                          ({
                            id,
                            name,
                            screen_name,
                            profile_image_url,
                          }: any) => {
                            return (
                              <div key={id}>
                                <ListItem
                                  id={styles.frenz}
                                  sx={{
                                    ...(selectedFrenz.indexOf(id) !== -1 && {
                                      bgcolor: "action.selected",
                                    }),
                                  }}
                                  disablePadding
                                >
                                  <ListItemButton
                                    role={undefined}
                                    onClick={selectFrenz(id)}
                                  >
                                    <div id={styles.profilePhoto}>
                                      <Image
                                        id={styles.profilePhoto}
                                        src={profile_image_url}
                                        alt={screen_name}
                                        width={50}
                                        height={50}
                                      />
                                    </div>

                                    <div className={styles.frenzBody}>
                                      <p>{name}</p>
                                      <a>{"@" + screen_name}</a>
                                    </div>
                                  </ListItemButton>
                                </ListItem>
                                <Divider />
                              </div>
                            );
                          }
                        )}
                      </List>
                    </>
                  )}
                  {data?.matchedFrenz.length === 0 && "No one to follow"}
                  <Button
                    id={styles.continueButtons}
                    onClick={continueButton}
                    type="submit"
                    size="large"
                    variant="contained"
                    endIcon={<ArrowRightIcon />}
                  >
                    Continue
                  </Button>
                </Box>
              </div>
            )}
          </div>
        </Box>
      </Modal>
    </Layout>
  ) : null;
}
