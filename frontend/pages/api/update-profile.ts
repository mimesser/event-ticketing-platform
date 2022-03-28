import { User } from "@prisma/client";
import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function updateProfile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, name, username, avatarImage, bannerImage }: User = JSON.parse(
    req.body
  );
  const filteredUsername = username?.replace(/[^a-zA-Z_0-9]/g, "");

  if (!email) {
    res.status(400).json({ error: "Missing email" });
    return;
  }

  try {
    if (filteredUsername !== null) {
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

        const filteredUsers = users.find((user) => user.email !== email);
        if (filteredUsers) res.status(200).json({ error: true });
      }
    }

    const user = await prisma.user.update({
      where: { email: email },
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
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
