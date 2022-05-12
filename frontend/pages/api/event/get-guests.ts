import { NextApiRequest, NextApiResponse } from "next";
import { Guest } from "lib/types";
import prisma from "lib/prisma";

export default async function getEvents(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    if (!req.body) {
      res.status(400).json({ error: "Missing request body" });
      return;
    }

    const { eventId } = JSON.parse(req.body);

    if (!eventId) {
      res.status(400).json({ error: "Missing eventId in request body" });
      return;
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        hostId: true,
      },
    });

    const guests: Guest[] = [];
    if (event) {
      const hostId = event?.hostId;
      const user = await prisma.user.findUnique({
        where: {
          id: hostId as any,
        },
        select: {
          username: true,
          name: true,
          walletAddress: true,
        },
      });
      if (user) {
        guests.push({
          username:
            (user?.username ? user?.username : user?.walletAddress) || "",
          name: user?.name ? user?.name : "",
          status: "Going",
        });
      }
    }
    res.status(200).json({ guests });
  } else {
    res.status(400).json({ error: "Wrong method" });
    return;
  }
}
