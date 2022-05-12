import { getLoginSession } from "lib/auth";
import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function getHosts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getLoginSession(req);
    if (!session) {
      res.status(400).json({ error: "Missing session" });
      return;
    }

    if (!req.body) {
      res.status(400).json({ error: "Missing request body" });
      return;
    }

    const { search } = JSON.parse(req.body);

    if (!search) {
      res.status(400).json({ error: "Missing search in request body" });
      return;
    }

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
  } else {
    res.status(400).json({ error: "Wrong method" });
    return;
  }
}
