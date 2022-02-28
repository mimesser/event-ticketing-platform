import CircularProgress from "@mui/material/CircularProgress";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useUser } from "lib/hooks";
import { magic } from "lib/magic";
import Image from "next/image";
import Router from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "styles/pages/Home.module.scss";

// Setup project details
const description: string =
  process.env.NEXT_PUBLIC_DESCRIPTION ?? "Some description";

export default function Home() {
  const isMobile = useMediaQuery("(max-width:599px)");
  const { user, loading } = useUser({
    redirectTo: "/dashboard",
    redirectIfFound: true,
  });

  const [signingIn, setSigningIn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit: any = async ({ email }: { email: any }) => {
    setSigningIn(true);

    const userExists =
      (
        await (
          await fetch("/api/signup", {
            method: "POST",
            body: JSON.stringify({
              email,
            }),
          })
        ).json()
      ).user ?? false;

    try {
      const didToken = await magic?.auth.loginWithMagicLink({ email });
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + didToken,
        },
        body: JSON.stringify({ email }),
      });

      if (res.status === 200) {
        // redirect
        Router.push(
          {
            pathname: "/dashboard",
            query: { userExists: JSON.stringify(userExists) },
          },
          "/"
        );
        setSigningIn(false);
      } else {
        // display an error
        setSigningIn(false);
      }
    } catch (error) {
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <>
      {user === null && (
        <div className={styles.login_page}>
          <div className={styles.info}>
            <Image
              src="/icons/impish.svg"
              width={isMobile ? 125 : 250}
              height={isMobile ? 50 : 100}
              alt={`Impish icon`}
            />
            {isMobile === false && (
              <p className={styles.description}>{description}</p>
            )}
          </div>
          <div className={styles.login}>
            <Image src="/logo.png" alt="Logo" width={60} height={60} priority />
            <h1>Welcome</h1>
            <div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={styles.login_items}
              >
                <TextField
                  id="standard-basic"
                  label="Email address"
                  variant="standard"
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
                />
                <LoadingButton
                  loading={signingIn}
                  type="submit"
                  color="primary"
                  size="large"
                  variant="outlined"
                >
                  Log in / Sign up
                </LoadingButton>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
