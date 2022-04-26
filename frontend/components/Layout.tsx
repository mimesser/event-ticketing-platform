import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Toolbar from "@mui/material/Toolbar";
import React, { ReactElement } from "react";
import Meta from "components/Meta"; // Components: Meta
import Header from "components/Header"; // Components: Header
import Footer from "components/Footer"; // Components: Footer
import { useRouter } from "next/router";
import { useUserInfo } from "lib/user-context";
import { useCallback, useEffect, useState } from "react";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ethers } from "ethers";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TwitterIcon from "@mui/icons-material/Twitter";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { useLocalStorage } from "lib/hooks";
import Colors from "lib/colors";
import { magic } from "lib/magic";
import styles from "styles/components/Layout.module.scss";
import { isTest } from "lib/utils";

export default function Layout({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  const { resolvedTheme } = useTheme();

  const { user, loading } = useUserInfo();
  const router = useRouter();
  const [eventFooter] = useState(
    router.asPath.includes("/events") ? true : false
  );

  const [data, setData] = useState<any>();
  const [selectedFrenz, setSelectedFrenz] = useState([] as any);
  const [followBtnText, setFollowBtnText] = useState("Follow all");
  const [followBtnStyle, setFollowBtnStyle] = useState(false);
  const [signupFlow, setSignupFlow] = useState(false);
  const { userExists } = router.query;

  const [findFrens, setFindFrens] = useLocalStorage(
    `${user?.id}/open-twitter-modal`
  );

  const [signupFlowKey, setSignupFlowKey] = useLocalStorage(
    `${user?.email}/open-signup-flow`
  );

  useEffect(() => {
    const firstTimeUser = userExists === "false" && !isTest;
    setSignupFlow(firstTimeUser || Boolean(signupFlowKey));
  }, [userExists, signupFlowKey]);
  const [welcomeModal, setWelcomeModal] = useState(true); // Welcome modal
  const [moonPayModal, setMoonPayModal] = useState(false); // buy crypto on moonpay modal
  const [twitterModal, setTwitterModal] = useState(false); // Find frens on Twitter modal
  const [twitterButton, setTwitterButton] = useState(false);

  const [urlWithSignature, setUrlWithSignature] = useState("");
  React.useEffect(() => {
    if (user && !loading) {
      fetch("/api/moonpay-url")
        .then((r) => r.json())
        .then((data) => {
          setUrlWithSignature(data.urlWithSignature);
        });
    }
  }, [user, loading]);

  const modalClose = () => {
    if (findFrens) {
      setFindFrens(null);
    }
    if (signupFlowKey) {
      setSignupFlowKey(null);
    }
    // Create user signup notifications
    fetch("/api/signup-notifications", {
      method: "POST",
    });

    setSignupFlow(false);
    setWelcomeModal(false);
    setMoonPayModal(false);
  };

  // Buy crypto modal to find frens on Twitter modal
  const continueToTwitter = () => {
    setMoonPayModal(false);
    setTwitterModal(true);
  };

  // MoonPay modal to to buy crypto
  const continueToMoonPayModal = () => {
    setWelcomeModal(false);
    setMoonPayModal(true);
    getUsersBalance();
  };

  // Update user nativeAssetBalance
  const updateBalance = useCallback(async () => {
    const provider = new ethers.providers.Web3Provider(
      magic?.rpcProvider as any
    );

    const balance = await provider.getBalance(user.walletAddress);

    if (balance && balance.toString() !== user.nativeAssetBalance) {
      try {
        await fetch("/api/update-balance", {
          method: "POST",
          body: JSON.stringify({
            balance: balance.toString(),
          }),
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [user?.nativeAssetBalance, user?.walletAddress]);

  useEffect(() => {
    if (user) {
      updateBalance();
    }
  }, [signupFlow, user, updateBalance]);

  useEffect(() => {
    if (findFrens && user?.twitterUsername) {
      fetch("/api/twitter/friend-list")
        .then((res) => res.json())
        .then((data) => {
          setData(data);
        });
    }
  }, [findFrens, user?.twitterUsername]);

  useEffect(() => {
    if (data?.matchedFrenz.length === selectedFrenz.length) {
      setFollowBtnText("Follow none");
      setFollowBtnStyle(false);
    } else {
      setFollowBtnText("Follow all");
      setFollowBtnStyle(true);
    }
  }, [selectedFrenz, data]);

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

  //check users balance after moonplay load and show twitter button upon change in account balance
  const getUsersBalance = async () => {
    const provider = new ethers.providers.Web3Provider(
      magic?.rpcProvider as any
    );

    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();
    const balance = await provider.getBalance(userAddress);
    let timer = setInterval(async () => {
      const currentUserAddress = await signer.getAddress();
      const currentUserBalance = await provider.getBalance(currentUserAddress);
      if (currentUserBalance.gt(balance)) {
        updateBalance();
        setTwitterButton(true);
        clearInterval(timer);
      }
    }, 250);
  };

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

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            width: "100vw",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={120} />
        </div>
      ) : (
        <div
          style={{
            filter: user && signupFlow ? "blur(2px)" : "none",
            display: "flex",
            height: "100vh",
          }}
        >
          {/* Site meta */}
          <Meta />

          <Header urlWithSignature={urlWithSignature} />
          {/* Injected child content */}
          <Box
            component="main"
            sx={{
              padding: "0 20px",
              flexGrow: 1,
            }}
          >
            <Toolbar />
            {children}
          </Box>
          {!eventFooter && (
            <>
              <Footer />
            </>
          )}
        </div>
      )}

      {/* firsttimer sigup modal */}
      {user && signupFlow && (
        <>
          <Modal
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
            closeAfterTransition
            onClose={modalClose}
            open={signupFlow}
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
          >
            <Fade in={signupFlow}>
              <Box sx={modalStyle}>
                <div className={styles.modal_box}>
                  <IconButton
                    aria-label="close"
                    onClick={modalClose}
                    className={styles.close_button}
                    sx={{
                      ":hover": {
                        backgroundColor: Colors[resolvedTheme].hover,
                      },
                    }}
                  >
                    <CloseIcon
                      sx={{
                        color: Colors[resolvedTheme].primary,
                      }}
                    />
                  </IconButton>
                  {/* Welcome modal */}
                  {welcomeModal && (
                    <div className={styles.modal_body}>
                      <Typography id={styles.h5} variant="h5">
                        Welcome to Impish
                      </Typography>
                      <Typography variant="h6">
                        {"Let's"} get started!
                      </Typography>
                      <Box>
                        <Button
                          id={styles.continueButtons}
                          onClick={continueToMoonPayModal}
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
                  {/* MoonPay modal */}
                  {moonPayModal && (
                    <div
                      className={styles.modal_body}
                      style={{ height: "60vh", margin: "12px" }}
                    >
                      <iframe
                        allow="accelerometer; autoplay; camera; gyroscope; payment"
                        frameBorder="0"
                        height="100%"
                        id="moonPayFrame"
                        src={urlWithSignature}
                        width="100%"
                      >
                        <p>Your browser does not support iframes.</p>
                      </iframe>
                      {twitterButton && (
                        <Box>
                          <Button
                            id={styles.continueButtons}
                            onClick={continueToTwitter}
                            type="submit"
                            size="large"
                            variant="contained"
                            endIcon={<ArrowRightIcon />}
                          >
                            Continue
                          </Button>
                        </Box>
                      )}
                    </div>
                  )}
                  {/* Twitter modal */}
                  {twitterModal && (
                    <div className={styles.modal_body}>
                      <Typography id={styles.h5} variant="h5">
                        Find frens you follow on Twitter
                      </Typography>
                      <Typography id={styles.body1} variant="body1">
                        To get the most of your Web3 adventure, connect with
                        frens on Twitter.
                      </Typography>
                      <Box className={styles.linkSocialButtons}>
                        <Button
                          onClick={() => {
                            localStorage.setItem(
                              `${user.id}/open-twitter-modal`,
                              "true"
                            );
                            signIn("twitter");
                          }}
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
                </div>
              </Box>
            </Fade>
          </Modal>
        </>
      )}

      {/* Twitter find frens modal */}
      <Modal
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        onClose={modalClose}
        open={Boolean(findFrens)}
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
              sx={{
                ":hover": {
                  backgroundColor: Colors[resolvedTheme]?.hover,
                },
              }}
            >
              <CloseIcon
                sx={{
                  color: Colors[resolvedTheme]?.primary,
                }}
              />
            </IconButton>
            {loading && <CircularProgress />}
            {!user?.twitterUsername && (
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
                    onClick={() => {
                      localStorage.setItem(
                        `${user.id}/open-twitter-modal`,
                        "true"
                      );
                      signIn("twitter");
                    }}
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
            {user?.twitterUsername && (
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
                      {followBtnStyle ? (
                        <Button
                          id={styles.followAllBtn}
                          onClick={followAll}
                          type="submit"
                          color="primary"
                          size="large"
                          variant="contained"
                          sx={{
                            ":hover": {
                              backgroundColor: "black",
                            },
                            backgroundColor: Colors[resolvedTheme].follow_btn,
                            borderColor: "black",
                            fontFamily: "sans-serif",
                            fontSize: "16px",
                            fontWeight: 550,
                            textTransform: "none",
                          }}
                        >
                          {followBtnText}
                        </Button>
                      ) : (
                        <Button
                          id={styles.unfollowAllBtn}
                          onClick={followAll}
                          type="submit"
                          color="primary"
                          size="large"
                          variant="outlined"
                          sx={{
                            color: Colors[resolvedTheme].primary,
                            backgroundColor: "inherit",
                            borderColor: Colors[resolvedTheme].primary,
                            fontFamily: "sans-serif",
                            fontSize: "16px",
                            fontWeight: 550,
                            textTransform: "none",
                            transitionDuration: "unset",
                            ":hover": {
                              color: "red",
                              borderColor: "red",
                            },
                          }}
                        >
                          {followBtnText}
                        </Button>
                      )}
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
                                      bgcolor:
                                        Colors[resolvedTheme]
                                          .selected_event_menu,
                                    }),
                                    ":hover": {
                                      backgroundColor:
                                        Colors[resolvedTheme]
                                          .selected_event_menu,
                                    },
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
    </>
  );
}
