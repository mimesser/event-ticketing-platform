import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TwitterIcon from "@mui/icons-material/Twitter";
import Typography from "@mui/material/Typography";
import { useUser } from "lib/hooks";
import Layout from "components/Layout";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { moonPaySrc } from "lib/moon-pay";
import { magic } from "lib/magic";
import styles from "styles/pages/Dashboard.module.scss";

function Dashboard() {
  const { query } = useRouter();
  const firstTimeUser = query.userExists === "false";
  const user = useUser({
    redirectTo: firstTimeUser ? false : "/dashboard",
    redirectIfFound: true,
  });
  const [open, setOpen] = useState(firstTimeUser ? true : false);
  const [firstModal, setFirstModal] = useState(true); // Welcome modal
  const [moonPayModal, setMoonPayModal] = useState(false); // buy  crypto on moonpay modal
  const [thirdModal, setThirdModal] = useState(false); // Find frens on Twitter modal
  const [fourthModal, setFourthModal] = useState(false); // Follow frens on Twitter modal
  const [followBtnText, setFollowBtnText] = useState("Follow all");
  const [followBtnStyle, setFollowBtnStyle] = useState(true);
  const [twitterButton, setTwitterButton] = useState(false);

  const modalClose = () => {
    setOpen(false);
    setFirstModal(false);
    setMoonPayModal(false);
  };

  // Buy crypto modal to find frens on Twitter modal
  const continueToThird = () => {
    setMoonPayModal(false);
    setThirdModal(true);
    setMoonPayModal(false);
  };

  // MoonPay modal to to buy crypto
  const continueToMoonPayModal = () => {
    setFirstModal(false);
    setMoonPayModal(true);
    getUsersBalance();
  };

  //check users balance after moonplay load and show twitter button upon change in account balance
  const getUsersBalance = async () => {
    const provider = new ethers.providers.Web3Provider(
      magic.rpcProvider as any
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

  // Find frens on Twitter modal to follow frens on Twitter modal
  const continueToFourth = () => {
    setThirdModal(false);
    setFourthModal(true);
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
    <Layout onboarding={open}>
      {user && (
        <>
          <Modal
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
            closeAfterTransition
            onClose={modalClose}
            open={open}
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
          >
            <Fade in={open}>
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
                  {firstModal && (
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
                            onClick={continueToThird}
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

                  {thirdModal && (
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
                          onClick={continueToFourth}
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
                  {fourthModal && (
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
                        <ul>
                          <li>Lorem ipsum</li>
                          <li>Dolor sit amet</li>
                          <li>Lorem ipsum</li>
                          <li>Dolor sit amet</li>
                        </ul>
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
            </Fade>
          </Modal>
        </>
      )}
    </Layout>
  );
}

export default Dashboard;
