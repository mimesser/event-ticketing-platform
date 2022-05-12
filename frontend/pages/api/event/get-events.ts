import { NextApiRequest, NextApiResponse } from "next";
import { EventDetails, LocationInfo } from "lib/types";
import prisma from "lib/prisma";
import { getLoginSession } from "lib/auth";
import moment from "moment";

export default async function getEvents(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    if (!req.body) {
      res.status(400).json({ error: "Missing request body" });
      return;
    }

    const { filter } = JSON.parse(req.body);

    if (!filter) {
      res.status(400).json({ error: "Missing filter in request body" });
      return;
    }

    // TODO: filter events
    // filter: going, host, invites, past, ...
    try {
      const session = await getLoginSession(req);
      if (!session) {
        res.status(400).json({ error: "Missing session" });
        return;
      }
      const user = await prisma.user.findUnique({
        where: { email: session.email },
        select: { id: true },
      });
      const today = new Date(moment().format("YYYY-MM-DD") + " 00:00:00");
      let events: any[] = [];
      if (filter === "going")
        events = await prisma.event.findMany({
          where: {
            hostId: user?.id,
            startTime: {
              gte: today,
            },
          },
          orderBy: {
            startTime: "asc",
          },
        });
      else if (filter === "past")
        events = await prisma.event.findMany({
          where: {
            hostId: user?.id,
            startTime: {
              lt: today,
            },
          },
          orderBy: {
            startTime: "desc",
          },
        });

      let eventDetails: EventDetails[] = [];

      events.map((event) => {
        const coverPhoto = JSON.parse(event.coverPhoto || "{}");
        const location: LocationInfo = JSON.parse(event.location || "{}") || {};
        const startTime = moment(event.startTime);
        const now = moment();
        if (startTime.dayOfYear() === now.dayOfYear()) {
          if (event.endTime && moment(event.endTime).isBefore(now)) return;
        }
        eventDetails.push({
          id: event.id,
          hostId: event.hostId || -1,
          title: event.title || "",
          description: event.description || "",
          startTime: event.startTime ? event.startTime.toUTCString() : "",
          endTime: event.endTime ? event.endTime.toUTCString() : "",
          location,
          count: 1, // TODO:
          coverPhoto,
          privacy: event.privacySetting || "Public",
        });
      });
      res.status(200).json({ events: eventDetails });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  } else {
    res.status(400).json({ error: "Wrong method" });
    return;
  }
}
