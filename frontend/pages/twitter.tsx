import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TwitterIcon from "@mui/icons-material/Twitter";
import Typography from "@mui/material/Typography";
import Layout from "components/Layout";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { useUser } from "lib/hooks";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Router from "next/router";
import { useEffect, useState } from "react";
import styles from "styles/pages/Twitter.module.scss";

export default function Twitter() {
  const { data: session, status }: any = useSession();
  const [data, setData] = useState<any>();
  const { user } = useUser({ redirectTo: "/twitter", redirectIfFound: true });
  const [handleTwitterModal, setHandleTwitterModal] = useState(true);
  const [selectedFrenz, setSelectedFrenz] = useState([] as any);
  const [followBtnText, setFollowBtnText] = useState("Follow all");
  const [followBtnStyle, setFollowBtnStyle] = useState(true);

  useEffect(() => {
    async function linkUser() {
      if (session && user && !data) {
        const email = user.email;
        const twitterUsername = session.twitterProfile.screen_name;

        try {
          await fetch("/api/twitter/link-user", {
            method: "POST",
            body: JSON.stringify({
              email,
              twitterUsername,
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
      setFollowBtnText("Unfollow all");
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
    bgcolor: "background.paper",
    borderRadius: "25px",
    boxShadow: 24,
    p: 4,
  };

  const continueButton = async () => {
    if (selectedFrenz.length === 0) {
      modalClose();
    } else {
      const email = user.email;

      try {
        await fetch("/api/twitter/follows-friend", {
          method: "POST",
          body: JSON.stringify({
            email,
            selectedFrenz,
          }),
        });
      } catch (error) {
        console.log(error);
      }
      modalClose();
    }
  };

  const modalClose = () => {
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
  return (
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
                  color: "#000000",
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
                    onClick={() => signIn("twitter", { callbackUrl: "/" })}
                    id={styles.twtButton}
                    type="submit"
                    size="large"
                    variant="outlined"
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
                              <ListItem
                                id={styles.frenz}
                                key={id}
                                secondaryAction={
                                  <Checkbox
                                    edge="end"
                                    onChange={selectFrenz(id)}
                                    checked={selectedFrenz.indexOf(id) !== -1}
                                  />
                                }
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
                    color="primary"
                    size="large"
                    variant="outlined"
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
  );
}
