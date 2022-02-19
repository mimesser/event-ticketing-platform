import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import TwitterIcon from "@mui/icons-material/Twitter";
import Typography from "@mui/material/Typography";
import { useUser } from "lib/hooks";
import { magic } from "lib/magic";
import { moonPaySrc } from "lib/moon-pay";
import Layout from "components/Layout";
import { ethers } from "ethers";
import Image from "next/image";
import { useRouter } from "next/router";
import { signIn, getSession, useSession } from "next-auth/react";
import React, { useState, useLayoutEffect } from "react";

import styles from "styles/pages/Dashboard.module.scss";

function Dashboard() {
  const { status }: any = useSession();
  const { query } = useRouter();
  const firstTimeUser = query.userExists === "false";
  const user = useUser({
    redirectTo: firstTimeUser ? false : "/dashboard",
    redirectIfFound: true,
  });
  const [signupFlow, setSignupFlow] = useState(firstTimeUser ? true : false);
  const [welcomeModal, setWelcomeModal] = useState(true); // Welcome modal
  const [moonPayModal, setMoonPayModal] = useState(false); // buy  crypto on moonpay modal
  const [twitterModal, setTwitterModal] = useState(false); // Find frens on Twitter modal
  const [twitterButton, setTwitterButton] = useState(false);

  const [twitterBanner, setTwitterBanner] = useState(
    status === "unauthenticated" ? true : false
  );
  const [buyBanner, setBuyBanner] = useState(true);

  useLayoutEffect(() => {
    balanceCheck();
  }, []);

  // Check user's balance for the banner
  async function balanceCheck() {
    const provider = new ethers.providers.Web3Provider(
      magic?.rpcProvider as any
    );

    const balance = await provider.getBalance(user.publicAddress);

    if (balance.toString() === "0") {
      setBuyBanner(true);
    }
  }

  const modalClose = () => {
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
    bgcolor: "background.paper",
    borderRadius: "25px",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Layout onboarding={signupFlow}>
      <Stack
        direction="row"
        mt={4}
        spacing={2}
        className={styles.reminderBanners}
        sx={{
          "@media screen and (max-width: 599px)": {
            flexDirection: "column",
          },
        }}
      >
        {buyBanner && (
          <Button
            color="inherit"
            component="div"
            variant="outlined"
            className={styles.buyBanner}
            sx={{
              borderRadius: (theme) => theme.shape.borderRadius,
              textTransform: "none",
            }}
          >
            <div className={styles.closeBannerBtn}>
              <IconButton
                aria-label="close"
                onClick={() => {
                  setBuyBanner(false);
                }}
              >
                <CloseIcon
                  sx={{
                    color: "#000000",
                  }}
                />
              </IconButton>
            </div>
            <div className={styles.buyBannerBody}>
              <Typography id={styles.h6} variant="h6">
                Purchase MATIC
              </Typography>
              <Typography id={styles.body1} variant="body1">
                Buy crypto with Fiat
              </Typography>
            </div>
            <div className={styles.buyBannerLogo}>
              <Image
                src="/icons/matic.svg"
                alt="Matic"
                width={50}
                height={50}
                priority
              />
            </div>
          </Button>
        )}
        {twitterBanner && (
          <Button
            color="inherit"
            component="div"
            className={styles.twitterBanner}
            variant="outlined"
            sx={{
              borderRadius: (theme) => theme.shape.borderRadius,
              textTransform: "none",
            }}
          >
            <div className={styles.closeBannerBtn}>
              <IconButton
                aria-label="close"
                onClick={() => {
                  setTwitterBanner(false);
                }}
              >
                <CloseIcon
                  sx={{
                    color: "#000000",
                  }}
                />
              </IconButton>
            </div>
            <div className={styles.twitterBannerBody}>
              <Typography id={styles.h6} variant="h6">
                Link Twitter
              </Typography>
              <Typography id={styles.body1} variant="body1">
                To get the most of your Web3 adventure, connect with frens on
                Twitter
              </Typography>
            </div>
            <div className={styles.twitterBannerLogo}>
              <TwitterIcon
                sx={{ fontSize: "4rem", color: "rgb(29, 161, 242)" }}
              />
            </div>
          </Button>
        )}
      </Stack>
      {user && (
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
                  >
                    <CloseIcon
                      sx={{
                        color: "#000000",
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
                  {/* MoonPay modal */}
                  {moonPayModal && (
                    <div
                      className={styles.modal_body}
                      style={{ height: "60vh" }}
                    >
                      <iframe
                        allow="accelerometer; autoplay; camera; gyroscope; payment"
                        frameBorder="0"
                        height="100%"
                        id="moonPayFrame"
                        src={moonPaySrc(user.publicAddress, user.email)}
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
                            color="primary"
                            size="large"
                            variant="outlined"
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
                          onClick={() =>
                            signIn("twitter", { callbackUrl: "/twitter" })
                          }
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
                </div>
              </Box>
            </Fade>
          </Modal>
        </>
      )}
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}

export default Dashboard;
