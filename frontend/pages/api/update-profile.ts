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

  if (!email) {
    res.status(400).json({ error: "Missing email" });
    return;
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: { email: true, username: true },
    });

    const filteredUsers = users.find(user => user.email !== email);
    if(filteredUsers)
      res.status(200).json({ error: true })

    const user = await prisma.user.update({
      where: { email: email },
      data: {
        name: name,
        username: username,
        avatarImage: avatarImage,
        bannerImage: bannerImage,
      },
    });
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
