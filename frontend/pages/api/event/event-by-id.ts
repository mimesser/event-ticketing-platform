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

  const user = await prisma.user.findUnique({
    where: { email: session.email },
    select: { id: true },
  });

  const { eventId } = JSON.parse(req.body);

  try {
    const events = await prisma.event.findMany({
      where: {
        OR: [
          {
            privacySetting: "Public",
          },
          {
            privacySetting: "Private",
            hostId: user?.id,
          },
        ],
        id: eventId,
      },
    });

    if (!events || events.length !== 1) return res.status(200).json({});

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
      },
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}
