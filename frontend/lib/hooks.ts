import { useEffect, useMemo, useState } from "react";
import Router from "next/router";
import { useUserInfo } from "./user-context";
import { isBrowser } from "./utils";
import { EventDetails } from "./types";

interface RedirectInfo {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

export function useUser({ redirectTo, redirectIfFound }: RedirectInfo = {}) {
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
      (redirectTo && redirectIfFound && hasUser && !loading)
    ) {
      Router.push(redirectTo, "/");
    }
  }, [redirectTo, redirectIfFound, loading, hasUser, user]);

  return { user, loading };
}

export async function fetchPublicUser(username: string | number) {
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

export function useEvent(eventId: number) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isNaN(eventId) || eventId === null) return;

    setLoading(true);
    fetch("/api/event/event-by-id", {
      method: "POST",
      body: JSON.stringify({
        eventId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (!data.event) {
          Router.push("/events");
          return;
        }
        setEvent(data.event);
      });
  }, [eventId]);

  return { event, loading };
}

export function useEventsFilter(filter: string) {
  const [events, setEvents] = useState<EventDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
    fetch("/api/get-events", {
      method: "POST",
      body: JSON.stringify({ filter: "going" }),
    })
      .then((response) => response.json())
      .then((data) => {
        setEvents(data.events);
        setLoading(false);
      });
  }, [filter]);
  return { loading, events };
}

export function useFollowers() {
  const [followers, setFollowers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
    fetch("/api/get-followers", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        setFollowers(data.followers);
        setLoading(false);
      });
  }, []);
  return { loading, followers };
}
