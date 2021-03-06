import { User } from "@prisma/client";
import { getLoginSession } from "lib/auth";
import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function updateProfile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getLoginSession(req);

    if (!session) {
      res.status(400).json({ error: "Missing session" });
      return;
    }

    if (!req.body) {
      res.status(400).json({ error: "Missing request body" });
      return;
    }

    const { name, username, avatarImage, bannerImage }: User = JSON.parse(
      req.body
    );
    const filteredUsername = username?.replace(/[^a-zA-Z_0-9]/g, "");

    if (typeof filteredUsername === "string") {
      if (filteredUsername?.length !== 0) {
        const users = await prisma.user.findMany({
          where: {
            username: {
              equals: filteredUsername,
              mode: "insensitive",
            },
          },
          select: { email: true, username: true },
        });

        const filteredUsers = users.find(
          (user) => user.email !== session.email
        );
        if (filteredUsers) {
          return res.status(200).json({ error: true });
        }
      }
    }

    const user = await prisma.user.update({
      where: { email: session.email },
      data: {
        name: name === null || name.length === 0 ? null : name,
        username:
          filteredUsername === null || filteredUsername?.length === 0
            ? null
            : filteredUsername,
        avatarImage:
          avatarImage === null || avatarImage.length === 0 ? null : avatarImage,
        bannerImage:
          bannerImage === null || bannerImage.length === 0 ? null : bannerImage,
      },
    });

    const follower = await prisma.user.findUnique({
      where: {
        email: session.email,
      },
      select: {
        username: true,
        name: true,
        walletAddress: true,
        id: true,
      },
    });

    await prisma.notification.updateMany({
      where: {
        followerUserId: {
          equals: follower?.id,
        },
      },
      data: {
        title: follower?.name
          ? follower?.name
          : follower?.username
          ? `@${follower?.username}`
          : follower?.walletAddress,
      },
    });

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
