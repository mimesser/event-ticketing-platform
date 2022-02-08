import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import CssBaseline from "@mui/material/CssBaseline";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import PaymentsIcon from "@mui/icons-material/Payments";
import TwitterIcon from "@mui/icons-material/Twitter";
import Typography from "@mui/material/Typography";
import { useUser } from "lib/hooks";
import Layout from "components/Layout";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "styles/pages/Dashboard.module.scss";

function Dashboard() {
  const { query } = useRouter();
  const firstTimeUser = query.userExists === "false";
  const user = useUser({
    redirectTo: firstTimeUser ? false : "/dashboard",
    redirectIfFound: true,
  });
  const [open, setOpen] = useState(firstTimeUser ? true : false);
  const [firstModal, setFirstModal] = useState(true);
  const [secondModal, setSecondModal] = useState(false);
  const [thirdModal, setThirdModal] = useState(false);
  const [fourthModal, setFourthModal] = useState(false);
  const [followBtnText, setFollowBtnText] = useState("Follow all");
  const [followBtnStyle, setFollowBtnStyle] = useState(true);

  const modalClose = () => {
    setOpen(false);
  };

  const continueToSecond = () => {
    setFirstModal(false);
    setSecondModal(true);
  };

  const continueToThird = () => {
    setSecondModal(false);
    setThirdModal(true);
  };

  const continueToFourth = () => {
    setThirdModal(false);
    setFourthModal(true);
  };

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
                          onClick={continueToSecond}
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
                  {secondModal && (
                    <div className={styles.modal_body}>
                      <Typography id={styles.h5} variant="h4">
                        Buy Crypto With Fiat
                      </Typography>
                      <Box className={styles.paymentOptButtonBox}>
                        <Typography id={styles.body1} variant="body1">
                          Choose one of the available options
                        </Typography>
                        <Button
                          id={styles.paymentOptButton}
                          onClick={continueToThird}
                          type="submit"
                          color="primary"
                          size="large"
                          variant="outlined"
                          startIcon={<PaymentsIcon />}
                        >
                          Ramp
                        </Button>
                        <Button
                          id={styles.paymentOptButton}
                          onClick={continueToThird}
                          type="submit"
                          color="primary"
                          size="large"
                          variant="outlined"
                          startIcon={<AccountBalanceWalletIcon />}
                        >
                          MoonPay
                        </Button>
                      </Box>
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
          <CssBaseline />
        </>
      )}
    </Layout>
  );
}

export default Dashboard;
