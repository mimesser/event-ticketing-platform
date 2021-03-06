import { Prisma } from "@prisma/client";
import { ethers } from "ethers";
import { getLoginSession } from "lib/auth";
import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function publicUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getLoginSession(req);

    if (!req.body) {
      res.status(400).json({ error: "Missing request body" });
      return;
    }

    const { username } = JSON.parse(req.body);

    if (!username) {
      res.status(400).json({
        error: "Missing username in request body",
      });
      return;
    }

    let whereCondition: Prisma.UserWhereInput;
    if (typeof username === "number") {
      whereCondition = {
        id: {
          equals: username,
        },
      };
    } else if (
      ethers.utils.isAddress(username) &&
      typeof username !== "number"
    ) {
      whereCondition = {
        walletAddress: {
          equals: username,
          mode: "insensitive",
        },
      };
    } else {
      whereCondition = {
        username: {
          equals: username,
          mode: "insensitive",
        },
      };
    }

    const users = await prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        email: true,
        username: true,
        walletAddress: true,
        name: true,
        twitterUsername: true,
        showWalletAddress: true,
        avatarImage: true,
        bannerImage: true,
        createdAt: true,
        followers: true,
        following: true,
      },
    });

    let user: any = users && users.length > 0 ? users[0] : null;

    if (!user) {
      return res.status(400).json({ error: "not exists user" });
    }

    if (user && session && user.email === session.email) {
      user.authenticated = true;
    }
    if (
      user.username &&
      !user.showWalletAddress &&
      session?.publicAddress !== user.walletAddress
    ) {
      user.walletAddress = null;
    }

    res.status(200).json({ user });
  } catch (e) {
    console.log(e);
    res.status(500).send({ e });
  }
}
