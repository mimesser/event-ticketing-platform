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

    const { username } = JSON.parse(req.body);

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
    if (user && session && user.email === session.email) {
      user.authenticated = true;
    }

    if (user.username && !user.showWalletAddress) {
      user.walletAddress = null;
    }

    res.status(200).json({ user });
  } catch (e) {
    console.log(e);
    res.status(500).send({ e });
  }
}
