import { getLoginSession } from "lib/auth";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";

export default async function getEvents(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
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
    if (event === null) {
      return res.status(400).json({ error: "Invalid event id" });
    } else {
      const hostId = event.hostId;
      const session = await getLoginSession(req);
      if (!session) {
        return res.status(401).json({ error: "Please sign in" });
      } else {
        const user = await prisma.user.findUnique({
          where: { email: session.email },
          select: { id: true },
        });
        if (user?.id !== hostId) {
          return res
            .status(401)
            .json({ error: "Only host can delete the event" });
        } else {
          try {
            await prisma.event.delete({ where: { id: eventId } });
            return res.status(200).json({ status: "OK" });
          } catch (err) {
            return res.status(500).json({ error: err });
          }
        }
      }
    }
  } else {
    return res.status(405).json({ error: "method not allowed" });
  }
}
