import { getLoginSession } from "lib/auth";
import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function updateBalance(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getLoginSession(req);

  if (!session) {
    res.status(400).json({ error: "Missing session" });
    return;
  }

  if (!req.body) {
    res.status(400).json({ error: "Missing request body" });
    return;
  }

  const { balance } = JSON.parse(req.body);

  if (!balance) {
    res.status(400).json({
      error: "Missing balance in request body",
    });
    return;
  }

  try {
    await prisma.user.update({
      where: {
        walletAddress: session.publicAddress,
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
