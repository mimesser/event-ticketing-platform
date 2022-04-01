import { getLoginSession } from "lib/auth";
import { supabase } from "lib/supabase";
import { NextApiResponse, NextApiRequest } from "next";

export default async function supabaseNotifications(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getLoginSession(req);
  const userId: any = await prisma.user.findUnique({
    where: { email: session.email },
    select: { id: true },
  });
  let notifications = [];
  if (userId) {
    const { data, error } = (await supabase
      .from("notifications")
      .select("*")
      .eq("userId", `${userId.id}`)) as any;
    if (!error && data) notifications = data;
  }
  res.status(200).json({ notifications });
}
