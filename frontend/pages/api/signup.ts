import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = JSON.parse(req.body);

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { email: true },
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error });
  }
}
