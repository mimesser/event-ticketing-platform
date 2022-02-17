import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";

export default async function linkUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, twitterUsername }: User = JSON.parse(req.body);

  if (!email) {
    res.status(400).json({ error: "Missing email" });
    return;
  }

  try {
    await prisma.user.update({
      where: { email: email },
      data: { twitterUsername: twitterUsername },
    });

    res.status(200).json({ status: "update success" });
  } catch (e) {
    res.status(500).json({ e });
  }
}
