import { useEffect } from "react";
import Router from "next/router";
import useSWR from "swr";

const fetcher = (url: any) =>
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      return { user: data?.user || null };
    });

export function useUser({ redirectTo, redirectIfFound }: any = {}) {
  const { data, error } = useSWR("/api/user", fetcher);
  const user = data?.user;
  const finished = Boolean(data);
  const hasUser = Boolean(user);

  useEffect(() => {
    if (!redirectTo || !finished) return;

    if (!hasUser) {
      Router.push("/");
    }

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      Router.push(redirectTo, "/");
    }
  }, [redirectTo, redirectIfFound, finished, hasUser, user]);

  return error ? null : user;
}
