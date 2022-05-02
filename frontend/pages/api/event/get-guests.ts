import { NextApiRequest, NextApiResponse } from "next";
import { Guest } from "lib/types";
import prisma from "lib/prisma";

export default async function getEvents(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { eventId } = JSON.parse(req.body);
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        hostId: true,
      },
    });

    const guests = [];
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
          username: user?.username ? user?.username : user?.walletAddress,
          name: user?.name ? user?.name : "",
          status: "Going",
        });
      }
    }
    res.status(200).json({ guests });
  } else {
    res.status(403);
  }
}
