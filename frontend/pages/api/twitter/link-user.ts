import { NextApiRequest, NextApiResponse } from "next";
import { getLoginSession } from "lib/auth";
import prisma from "lib/prisma";
import { User } from "@prisma/client";

export default async function linkUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST" && req.method !== "DELETE") {
      res.status(400).json({ error: "Wrong method! Only POST or DELETE" });
      return;
    }
    const session = await getLoginSession(req);

    if (!session) {
      res.status(400).json({ error: "Missing session" });
      return;
    }

    if (req.method === "POST") {
      if (!req.body) {
        res.status(400).json({ error: "Missing request body" });
        return;
      }

      const { twitterUsername }: User = JSON.parse(req.body);

      if (!twitterUsername) {
        res.status(400).json({ error: "Missing twitterUsername" });
        return;
      }

      try {
        await prisma.user.update({
          where: { email: session.email },
          data: { twitterUsername: twitterUsername },
        });

        res.status(200).json({ status: "Link Twitter success" });
      } catch (e) {
        res.status(500).json({ e });
      }
    }

    if (req.method === "DELETE") {
      try {
        await prisma.user.update({
          where: { email: session.email },
          data: { twitterUsername: null },
        });

        res.status(200).json({ status: "Unlink Twitter success" });
      } catch (e) {
        res.status(500).json({ e });
      }
    }
  } catch (e) {
    res.status(500).json({ e });
  }
}
