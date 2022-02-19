import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function checkUsername(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username } = JSON.parse(req.body);

  try {
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
