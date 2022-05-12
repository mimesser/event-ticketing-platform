import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!req.body) {
      res.status(400).json({ error: "Missing request body" });
      return;
    }

    const { email } = JSON.parse(req.body);

    if (!email) {
      res.status(400).json({ error: "Missing email in request body" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { email: true },
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error });
  }
}
