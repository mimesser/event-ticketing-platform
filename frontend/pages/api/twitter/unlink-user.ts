import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";

export default async function unlinkUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email }: User = JSON.parse(req.body);

  if (!email) {
    res.status(400).json({ error: "Missing email" });
    return;
  }

  try {
    await prisma.user.update({
      where: { email: email },
      data: { twitterUsername: null },
    });

    res.status(200).json({ status: "delete twitterUsername success" });
  } catch (e) {
    res.status(500).json({ e });
  }
}
