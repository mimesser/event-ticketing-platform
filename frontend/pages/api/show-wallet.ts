import { getLoginSession } from "lib/auth";
import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function showWallet(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getLoginSession(req);

    if (!session) {
      res.status(400).json({ error: "Missing session" });
      return;
    }

    const userShowWalletAddress = await prisma.user.findUnique({
      where: { email: session.email },
      select: { email: true, showWalletAddress: true },
    });

    await prisma.user.update({
      where: {
        email: session.email,
      },
      data: {
        showWalletAddress: !userShowWalletAddress?.showWalletAddress,
      },
    });

    res.status(200).json({ status: "update showWalletAddress success" });
  } catch (error) {
    res.status(500).json({ error });
  }
}
