import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function checkUsername(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!req.body) {
      res.status(400).json({ error: "Missing request body" });
      return;
    }

    const { username } = JSON.parse(req.body);

    if (!username) {
      res.status(400).json({ error: "Missing username in request body" });
      return;
    }

    const users = await prisma.user.findMany({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: { username: true },
    });

    res.status(200).json({ user: users.length > 0 ? users[0] : null });
  } catch (error) {
    res.status(500).json({ error });
  }
}
