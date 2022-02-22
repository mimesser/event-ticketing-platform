import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function updateBalance(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { walletAddress, balance } = JSON.parse(req.body);

  try {
    await prisma.user.update({
      where: {
        walletAddress: walletAddress,
      },
      data: {
        nativeAssetBalance: balance,
      },
    });

    res.status(200).json({ status: "update balance success" });
  } catch (error) {
    res.status(500).json({ error });
  }
}
