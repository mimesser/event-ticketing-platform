import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";
import Colors from "lib/colors";
import { magic } from "lib/magic";
import { useUserInfo } from "lib/user-context";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { useState } from "react";
import styles from "styles/components/Footer.module.scss"; // Component styles

export default function Footer() {
  const isMobile = useMediaQuery("(max-width:599px)");
  const { resolvedTheme } = useTheme();

  const { user } = useUserInfo();
  const router = useRouter();
  const [signInfollowModal, setSignInFollowModal] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit: any = async ({ email }: { email: any }) => {
    setSigningIn(true);

    try {
      const userExists = (
        await (
          await fetch("/api/signup", {
            method: "POST",
            body: JSON.stringify({
              email,
            }),
          })
        ).json()
      ).user
        ? true
        : false;

      const redirectURI = `${window.location.origin}/callback${router.asPath}/${email}/${userExists}`;

      const didToken = await magic?.auth.loginWithMagicLink({
        email,
        redirectURI,
      });

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + didToken,
        },
        body: JSON.stringify({ email }),
      });

      if (res.status === 200) {
        // Create user signup notifications
        if (!userExists) {
          await fetch("/api/signup-notifications", {
            method: "POST",
            body: JSON.stringify({
              email,
            }),
          });
        }

        // redirect
        router.reload();
        setSigningIn(false);
      } else {
        // display an error
        setSigningIn(false);
      }
    } catch (error) {
      setSigningIn(false);
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 320,
    bgcolor: "white",
    borderRadius: "25px",
    boxShadow: 24,
    p: 4,
  };

  return !user ? (
    <>
      {/* signInModal */}
      <Modal
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        onClose={() => {
          setSignInFollowModal(false);
        }}
        open={signInfollowModal}
      >
        <Box sx={modalStyle}>
          <Grid container justifyContent="center" direction="column">
            <div className={styles.modal_img}>
              <Image
                src={"/logo-" + resolvedTheme + ".png"}
                width={isMobile ? 45 : 90}
                height={isMobile ? 45 : 90}
                alt={`Impish icon`}
              />
            </div>
            <Typography
              gutterBottom
              sx={{
                textAlign: "center",
                marginBottom: "13px",
                color: "black",
                fontFamily: "sans-serif",
                fontSize: "18px",
                fontWeight: 550,
                textTransform: "none",
              }}
              variant="body1"
            >
              Connect on Impish
            </Typography>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={styles.login_items}
            >
              <TextField
                fullWidth
                label="Email address"
                variant="outlined"
                autoComplete="email"
                autoFocus
                {...register("email", {
                  required: "Required field",
                  pattern: {
                    value:
                      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                    message: "Invalid email address",
                  },
                })}
                error={!!errors?.email}
                helperText={errors?.email ? errors.email.message : null}
                size="small"
              />
              <LoadingButton
                sx={{ marginTop: "13px" }}
                fullWidth
                loading={signingIn}
                type="submit"
                size="large"
                variant="contained"
              >
                Log in / Sign up
              </LoadingButton>
            </form>
          </Grid>
        </Box>
      </Modal>
      <div
        className={styles.footer}
        style={{
          backgroundColor: Colors[resolvedTheme].header_bg,
          borderTop:
            resolvedTheme === "light" ? Colors[resolvedTheme].border : "none",
          boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className={styles.title}>Connect on Impish</div>
        <Button
          size="large"
          variant="contained"
          onClick={() => setSignInFollowModal(true)}
        >
          Log in / Sign up
        </Button>
      </div>
    </>
  ) : null;
}
