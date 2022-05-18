import { getLoginSession } from "lib/auth";
import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function getHosts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let condition: any[] = [
      {
        privacySetting: "Public",
      },
    ];
    const session = await getLoginSession(req);

    if (!session) {
      res.status(400).json({ error: "Missing session" });
      return;
    }

    if (session) {
      const user = await prisma.user.findUnique({
        where: { email: session.email },
        select: { id: true },
      });
      condition.push({
        privacySetting: "Private",
        hostId: user?.id,
      });
    }

    if (!req.body) {
      res.status(400).json({ error: "Missing request body" });
      return;
    }

    const { eventId } = JSON.parse(req.body);

    if (!eventId) {
      res.status(400).json({ error: "Missing eventId in request body" });
      return;
    }

    try {
      const events = await prisma.event.findMany({
        where: {
          OR: condition,
          id: eventId,
        },
      });

      if (!events || events.length !== 1) return res.status(200).json({});

      const coHostIds = await prisma.coHosts.findMany({
        where: {
          eventId,
        },
        select: {
          cohostId: true,
        },
      });

      const userIdList = coHostIds.map((item) => item.cohostId || -1);
      const coHosts = await prisma.user.findMany({
        where: {
          id: {
            in: userIdList,
          },
        },
        select: {
          id: true,
          username: true,
          name: true,
          avatarImage: true,
        },
      });

      const owner = await prisma.user.findUnique({
        where: { id: events[0].hostId as number },
        select: {
          avatarImage: true,
          walletAddress: true,
          username: true,
          name: true,
        },
      });

      return res.status(200).json({
        event: {
          ...events[0],
          ...owner,
          coHosts,
        },
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  } else {
    res.status(403).json({ error: "Wrong method" });
    return;
  }
}
