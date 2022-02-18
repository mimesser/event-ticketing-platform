import { User } from "@prisma/client";
import { setLoginSession } from "lib/auth";
import { magic } from "lib/magicAdmin";
import prisma from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const didToken = req.headers.authorization?.substr(7) || "";

  const metadata = await magic.users.getMetadataByToken(didToken);

  if (!metadata?.email || !metadata?.issuer || !metadata?.publicAddress) {
    res
      .status(401)
      .json({ error: "Invalid token, expected metadata not returned" });
    return;
  }

  await setLoginSession(res, metadata);

  try {
    const dbInfo: Partial<User> = {
      email: metadata.email,
      issuer: metadata.issuer,
      walletAddress: metadata.publicAddress,
    };

    await prisma.user.upsert({
      where: {
        email: metadata.email,
      },
      create: dbInfo,
      update: {},
    });
    res.status(200).json({ status: "login success" });
  } catch (e) {
    res.status(500).json({ e });
  }
}
