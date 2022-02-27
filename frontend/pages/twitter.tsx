import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TwitterIcon from "@mui/icons-material/Twitter";
import Typography from "@mui/material/Typography";
import Layout from "components/Layout";
import { useUser } from "lib/hooks";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Router from "next/router";
import { useEffect, useState } from "react";
import styles from "styles/pages/Twitter.module.scss";

export default function Twitter() {
  const { data: session, status }: any = useSession();
  const [data, setData] = useState<any>();
  const { user } = useUser({ redirectTo: "/" });

  useEffect(() => {
    async function linkUser() {
      if (session && user) {
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

    linkUser();
  }, [session, user]);

  const [followBtnText, setFollowBtnText] = useState("Follow all");
  const [followBtnStyle, setFollowBtnStyle] = useState(true);
  const [handleTwitterModal, setHandleTwitterModal] = useState(true);
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

  const modalClose = () => {
    setHandleTwitterModal(false);
    Router.push("/", undefined, { shallow: true });
  };

  // Twitter modal, Follow all button function
  const followAll = () => {
    if (followBtnText === "Follow all") {
      setFollowBtnText("Unfollow all");
      setFollowBtnStyle(false);
    } else {
      setFollowBtnText("Follow all");
      setFollowBtnStyle(true);
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
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
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
                  {data ? (
                    <div className={styles.matchedFrenz}>
                      {data.matchedFrenz.map(
                        ({ id, name, screen_name, profile_image_url }: any) => {
                          return (
                            <div id={styles.frenz} key={id}>
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
                                <a
                                  href={`https://twitter.com/${screen_name}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {"@" + screen_name}
                                </a>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  <Button
                    id={styles.continueButtons}
                    onClick={modalClose}
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
