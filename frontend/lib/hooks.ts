import { useEffect, useMemo, useState } from "react";
import Router from "next/router";
import { useUserInfo } from "./user-context";
import { isBrowser } from "./utils";

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

export async function fetchPublicUser(username: any) {
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

export function useLocalStorage(key: string) {
  const [state, setState] = useState<string | null>(
    useMemo(() => (isBrowser ? localStorage.getItem(key) : null), [key])
  );

  const setValue = useMemo(
    () => (value: string | null) => {
      if (!isBrowser) {
        throw new Error("Local storage is available only in browser");
      }

      if (value == null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }

      setState(value);
    },
    [key, setState]
  );

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    setState(localStorage.getItem(key));

    const listener = () => {
      setValue(localStorage.getItem(key));
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, [key, setValue]);

  return [state, setValue] as const;
}
