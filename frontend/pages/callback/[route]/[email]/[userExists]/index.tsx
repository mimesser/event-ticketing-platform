import CircularProgress from "@mui/material/CircularProgress";
import { magic } from "lib/magic";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";

function Callback() {
  const router = useRouter();
  const [loading] = useState(true);

  useEffect(() => {
    const onCallback = async () => {
      const query = router.query;
      try {
        const didToken = await magic?.auth.loginWithCredential();

        const email = query.email as string;
        const res = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + didToken,
          },
          body: JSON.stringify({ email }),
        });

        if (res.status === 200) {
          if (query) {
            const { route, userExists } = query;

            if (route === "dashboard") {
              // redirect
              Router.push(
                {
                  pathname: `/${route}`,
                  query: { userExists: userExists },
                },
                "/"
              );
            } else {
              Router.push({
                pathname: "/[username]",
                query: {
                  username: route,
                  userExists: userExists,
                },
              });
            }
          }
        } else {
          // throw or handle error
        }
      } catch (error) {}
    };

    if (router.isReady) {
      onCallback();
    }
  }, [router.isReady, router.query]);

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
}

export async function getServerSideProps(context: any) {
  const query = context.query;
  return {
    props: {
      query,
    },
  };
}

export default Callback;
