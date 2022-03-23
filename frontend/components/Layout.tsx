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
import Colors from "lib/colors";
import { magic } from "lib/magic";
import { moonPaySrc } from "lib/moon-pay";
import styles from "styles/components/Layout.module.scss";

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

  const [signupFlow, setSignupFlow] = useState(false);
  const { userExists } = router.query;
  useEffect(() => {
    const firstTimeUser = userExists === "false";
    setSignupFlow(firstTimeUser);
  }, [userExists]);
  const [welcomeModal, setWelcomeModal] = useState(true); // Welcome modal
  const [moonPayModal, setMoonPayModal] = useState(false); // buy crypto on moonpay modal
  const [twitterModal, setTwitterModal] = useState(false); // Find frens on Twitter modal
  const [twitterButton, setTwitterButton] = useState(false);

  const modalClose = () => {
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

    if (balance) {
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
  }, [user?.walletAddress]);

  useEffect(() => {
    if (user) {
      updateBalance();
    }
  }, [signupFlow, user, updateBalance]);

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

          <Header />
          {/* Injected child content */}
          <Box
            component="main"
            sx={{
              margin: eventFooter
                ? { xs: "0 10%", md: "auto", sm: "0 0 0 340px" }
                : { xs: "auto", md: "0 10%", sm: "0 10%" },
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
                        src={moonPaySrc(user.walletAddress, user.email)}
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
                </div>
              </Box>
            </Fade>
          </Modal>
        </>
      )}
    </>
  );
}
