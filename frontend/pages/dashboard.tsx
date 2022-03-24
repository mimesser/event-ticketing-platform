import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import TwitterIcon from "@mui/icons-material/Twitter";
import Typography from "@mui/material/Typography";
import Colors from "lib/colors";
import { useUser } from "lib/hooks";
import { moonPaySrc } from "lib/moon-pay";
import Layout from "components/Layout";
import Image from "next/image";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import styles from "styles/pages/Dashboard.module.scss";
import { Tooltip } from "@mui/material";
import { useTheme } from "next-themes";

function Dashboard() {
  const { resolvedTheme } = useTheme();
  const { query } = useRouter();
  const firstTimeUser = query.userExists === "false";
  const { user } = useUser({
    redirectTo: firstTimeUser ? false : "/dashboard",
    redirectIfFound: true,
  });
  const [moonpayModalForBanner, setMoonpayModalForBanner] = useState(false); // buy crypto on moonpay modal for banner
  const [twitterModalForBanner, setTwitterModalForBanner] = useState(false); // Find frens on Twitter modal for banner

  const [twitterBanner, setTwitterBanner] = useState(
    user?.twitterUsername === null ? true : false
  );
  const [buyBanner, setBuyBanner] = useState(
    user?.nativeAssetBalance === "0" || user?.nativeAssetBalance === null
      ? true
      : false
  );

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

  return user ? (
    <>
      {/* Buy crypto modal for banner */}
      <Modal
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        onClose={() => {
          setMoonpayModalForBanner(false);
        }}
        open={moonpayModalForBanner}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
      >
        <Box sx={modalStyle}>
          <div className={styles.modal_box}>
            <IconButton
              aria-label="close"
              onClick={() => {
                setMoonpayModalForBanner(false);
              }}
              className={styles.close_button}
              sx={{
                ":hover": {
                  backgroundColor: Colors[resolvedTheme].hover,
                },
              }}
            >
              <CloseIcon
                sx={{
                  color: Colors[resolvedTheme]?.primary,
                }}
              />
            </IconButton>
            {moonpayModalForBanner && (
              <div style={{ height: "60vh", margin: "12px" }}>
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
              </div>
            )}
          </div>
        </Box>
      </Modal>
      {/* Twitter modal for banner  */}
      <Modal
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        onClose={() => {
          setTwitterModalForBanner(false);
        }}
        open={twitterModalForBanner}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
      >
        <Box sx={modalStyle}>
          <div className={styles.modal_box}>
            <IconButton
              aria-label="close"
              onClick={() => {
                setTwitterModalForBanner(false);
              }}
              className={styles.close_button}
              sx={{
                ":hover": {
                  backgroundColor: Colors[resolvedTheme].hover,
                },
              }}
            >
              <CloseIcon
                sx={{
                  color: Colors[resolvedTheme]?.primary,
                }}
              />
            </IconButton>
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
          </div>
        </Box>
      </Modal>
      <Layout>
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
            <Tooltip title="Purchase MATIC">
              <Button
                color="inherit"
                component="div"
                variant="outlined"
                className={styles.buyBanner}
                sx={{
                  borderRadius: (theme) => theme.shape.borderRadius,
                  textTransform: "none",
                }}
                onClick={(e: any) => {
                  setMoonpayModalForBanner(true);
                  e.stopPropagation();
                }}
              >
                <div className={styles.closeBannerBtn}>
                  <IconButton
                    aria-label="close"
                    onClick={(e: any) => {
                      setBuyBanner(false);
                      e.stopPropagation();
                    }}
                  >
                    <CloseIcon
                      sx={{
                        color: Colors[resolvedTheme].primary,
                      }}
                    />
                  </IconButton>
                </div>
                <Box>
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
                </Box>
              </Button>
            </Tooltip>
          )}
          {twitterBanner && (
            <Tooltip title="Link Twitter">
              <Button
                color="inherit"
                component="div"
                className={styles.twitterBanner}
                variant="outlined"
                sx={{
                  borderRadius: (theme) => theme.shape.borderRadius,
                  textTransform: "none",
                }}
                onClick={(e: any) => {
                  setTwitterModalForBanner(true);
                  e.stopPropagation();
                }}
              >
                <div className={styles.closeBannerBtn}>
                  <IconButton
                    aria-label="close"
                    onClick={(e: any) => {
                      setTwitterBanner(false);
                      e.stopPropagation();
                    }}
                  >
                    <CloseIcon
                      sx={{
                        color: Colors[resolvedTheme].primary,
                      }}
                    />
                  </IconButton>
                </div>
                <Box>
                  <div className={styles.twitterBannerBody}>
                    <Typography id={styles.h6} variant="h6">
                      Link Twitter
                    </Typography>
                    <Typography id={styles.body1} variant="body1">
                      To get the most of your Web3 adventure, connect with frens
                      on Twitter
                    </Typography>
                  </div>
                  <div className={styles.twitterBannerLogo}>
                    <TwitterIcon
                      sx={{ fontSize: "4rem", color: "rgb(29, 161, 242)" }}
                    />
                  </div>
                </Box>
              </Button>
            </Tooltip>
          )}
        </Stack>
      </Layout>
    </>
  ) : null;
}

export async function getServerSideProps(context: any) {
  const query = context.query;
  return {
    props: {
      query,
    },
  };
}

export default Dashboard;
