import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import Layout from "components/Layout"; // Layout wrapper
import { useUser } from "lib/hooks";
import { Magic } from "magic-sdk";
import Image from "next/image"; // Images
import Router from "next/router";
import LoadingButton from "@mui/lab/LoadingButton";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "styles/pages/Home.module.scss";

// Setup project details
const tokenName: string = process.env.NEXT_PUBLIC_TOKEN_NAME ?? "Token Name";
const heading: string = process.env.NEXT_PUBLIC_HEADING ?? "Some heading";
const description: string =
  process.env.NEXT_PUBLIC_DESCRIPTION ?? "Some description";

export default function Home() {
  const isMobile = useMediaQuery("(max-width:599px)");
  const user = useUser({ redirectTo: "/dashboard", redirectIfFound: true });

  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useCallback(() => {
    if (user !== undefined) setLoading(false);
  }, [user]);

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

    const magic = new Magic(
      process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY ?? ""
    );

    try {
      const didToken = await magic.auth.loginWithMagicLink({ email });
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

  return (
    <Layout>
      <>
        {(loading === false || user === null) && (
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
              <Image
                src="/logo.png"
                alt="Logo"
                width={60}
                height={60}
                priority
              />
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
    </Layout>
  );
}
