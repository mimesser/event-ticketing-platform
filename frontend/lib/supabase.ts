import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_KEY as string
);

export const useNotifications = (user: any) => {
  const [notifications, setNotifications] = useState(user?.notifications);

  useEffect(() => {
    if (!user) {
      return () => {
        return { notifications: [] };
      };
    }

    fetchMessages(user?.id, setNotifications);

    const notificationsListener = supabase
      .from("Notifications")
      .on("*", () => fetchMessages(user?.id, setNotifications))
      .subscribe();
    return () => {
      notificationsListener.unsubscribe();
    };
  }, [user?.id, user]);

  return { notifications };
};

const fetchMessages = async (
  userId: string,
  setNotifications: Function | null
) => {
  try {
    let { body } = await supabase
      .from("Notifications")
      .select(`*`)
      .eq("userId", userId)
      .order("createdAt", { ascending: false });
    if (setNotifications) setNotifications(body as any);
  } catch (error) {
    console.log("error: ", error);
  }
};
