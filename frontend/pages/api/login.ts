import { User } from "@prisma/client";
import { setLoginSession } from "lib/auth";
import { magic } from "lib/magicAdmin";
import prisma from "lib/prisma";
import { isTest } from "lib/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    const didToken = req.headers.authorization?.substring(7) || "";

    const metadata = !isTest
      ? await magic.users.getMetadataByToken(didToken)
      : {
          issuer: "did:ethr:0x1e9FF803fFA22209A10A087cc8361d4aa3528c45",
          publicAddress: "0x1e9FF803fFA22209A10A087cc8361d4aa3528c45",
          email: "test+success@magic.link" as any,
        };

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

      const firstTime = await prisma.user.findUnique({
        where: { email: metadata.email },
        select: { email: true },
      });

      await prisma.user.upsert({
        where: {
          email: metadata.email,
        },
        create: dbInfo,
        update: {},
      });

      if (!firstTime) {
        const userId = await prisma.user.findUnique({
          where: { email: metadata.email },
          select: { id: true },
        });

        if (userId) {
          await prisma.user.update({
            where: {
              email: metadata.email,
            },
            data: {
              username: `imp${userId.id}`,
            },
          });
        }
      }

      res.status(200).json({ status: "login success" });
    } catch (e) {
      console.log(e);

      res.status(500).json({ e });
    }
  } catch (e) {
    console.log(e);

    res.status(500).json({ e });
  }
}
