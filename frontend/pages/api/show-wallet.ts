import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function showWallet(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, showWalletAddress } = JSON.parse(req.body);

  try {
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        showWalletAddress: showWalletAddress,
      },
    });

    res.status(200).json({ status: "update showWalletAddress success" });
  } catch (error) {
    res.status(500).json({ error });
  }
}
