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
    if (ethers.utils.isAddress(username)) {
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
        email: true,
        username: true,
        walletAddress: true,
        name: true,
        twitterUsername: true,
        avatarImage: true,
        bannerImage: true,
        createdAt: true,
      },
    });

    let user: any = users && users.length > 0 ? users[0] : null;
    if (user && session && user.email === session.email) {
      user.authenticated = true;
    }

    res.status(200).json({ user });
  } catch (e) {
    console.log(e);
    res.status(500).send({ e });
  }
}