import { ethers } from "ethers";
import { getLoginSession } from "lib/auth";
import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function publicUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getLoginSession(req);

    const { username } = JSON.parse(req.body);

    let whereCondition;
    if(ethers.utils.isAddress(username)) {
      whereCondition = {
        walletAddress: {
          equals: username,
          mode: "insensitive",
        }
      };
    }
    else {
      whereCondition = {
        username: {
          equals: username,
          mode: "insensitive",
        }
      };
    }
    
    const users = await prisma.user.findMany({
      where: whereCondition as any,
      select: { 
        email: true,
        username: true,
        walletAddress: true,
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
