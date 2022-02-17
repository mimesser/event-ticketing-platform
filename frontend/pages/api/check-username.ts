import { User } from "@prisma/client";
import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function checkUsername(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username }: User = JSON.parse(req.body);

  if (!username) {
    res.status(400).json({ error: "username is required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
      select: { username: true },
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error });
  }
}
