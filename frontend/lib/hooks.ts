import { useEffect } from "react";
import Router from "next/router";
import { useUserInfo } from "./user-context";

export function useUser({ redirectTo, redirectIfFound }: any = {}) {
  const { user, loading } = useUserInfo();
  const hasUser = Boolean(user);

  useEffect(() => {
    if (!redirectTo && !loading) return;

    if (!hasUser && !loading) {
      Router.push("/");
    }

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser && !loading) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser && !loading)
    ) {
      Router.push(redirectTo, "/");
    }
  }, [redirectTo, redirectIfFound, loading, hasUser, user]);

  return { user, loading };
}

export async function fetchPublicUser(username: string) {
  const user =
    (
      await (
        await fetch("/api/public-user", {
          method: "POST",
          body: JSON.stringify({
            username,
          }),
        })
      ).json()
    ).user ?? null;
  return user;
}
