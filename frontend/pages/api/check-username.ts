import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function checkUsername(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username } = JSON.parse(req.body);

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { username: true },
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error });
  }
}
