import Layout from "components/Layout"; // Layout wrapper
import Image from "next/image"; // Images
import { TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { Magic } from "magic-sdk";
import Router from "next/router";
import styles from "styles/pages/Login.module.scss";

// Setup project details
const tokenName: string = process.env.NEXT_PUBLIC_TOKEN_NAME ?? "Token Name";
const heading: string = process.env.NEXT_PUBLIC_HEADING ?? "Some heading";
const description: string =
  process.env.NEXT_PUBLIC_DESCRIPTION ?? "Some description";

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit: any = async ({ email }: { email: any }) => {
    const magic = new Magic(
      process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY ?? ""
    );
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
      Router.push("/");
    } else {
      // display an error
    }
  };

  return (
    <Layout>
      <div className={styles.login_page}>
        <div className={styles.info}>
          {/* Project name/logo */}
          <div className={styles.name}>
            <h1>{heading}</h1>
          </div>
          {/* Project description */}
          <p>{description}</p>
        </div>
        <div className={styles.login_container}>
          <div className={styles.login}>
            <div className={styles.login_logo}>
              <Image
                src="/logo.png"
                alt="Logo"
                width={60}
                height={60}
                priority
              />
            </div>
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
                <Button
                  type="submit"
                  color="primary"
                  size="large"
                  variant="outlined"
                >
                  Log in / Sign up
                </Button>
                {/* <button type="submit">Log in / Sign up</button> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
