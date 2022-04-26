import { getLoginSession } from "lib/auth";
import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function getHosts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getLoginSession(req);
  if (!session) {
    res.status(400).json({ error: "Missing session" });
    return;
  }

  const { search } = JSON.parse(req.body);

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
        email: {
          not: session.email,
        },
      },
      select: {
        id: true,
        username: true,
        name: true,
        avatarImage: true,
      },
    });

    res.status(200).json({ hosts: users });
  } catch (error) {
    res.status(500).json({ error });
  }
}
