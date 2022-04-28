import { NextApiRequest, NextApiResponse } from "next";
import { EventDetails, LocationInfo } from "lib/types";
import prisma from "lib/prisma";
import { getLoginSession } from "../../lib/auth";
import moment from "moment";

export default async function getEvents(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { filter } = JSON.parse(req.body);

  // TODO: filter events
  // filter: going, host, invites, past, ...
  try {
    const session = await getLoginSession(req);
    if (!session) {
      res.status(500).json("should log in");
      return;
    }
    const user = await prisma.user.findUnique({
      where: { email: session.email },
      select: { id: true },
    });
    const today = new Date(moment().format("YYYY-MM-DD") + " 00:00:00");
    const events = await prisma.event.findMany({
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

    let eventDetails: EventDetails[] = [];

    events.map((event) => {
      const coverPhoto = JSON.parse(event.coverPhoto || "{}");
      const location: LocationInfo = JSON.parse(event.location || "{}") || {};
      const startTime = moment(event.startTime);
      const now = moment();
      if (startTime.dayOfYear() === now.dayOfYear()) {
        if (event.endTime && moment(event.endTime).isAfter(now)) return;
      }
      eventDetails.push({
        id: event.id,
        hostId: event.hostId || -1,
        title: event.title || "",
        description: event.description || "",
        startTime: event.startTime ? event.startTime.toUTCString() : "",
        endTime: event.endTime ? event.endTime.toUTCString() : "",
        location,
        going: 1, // TODO:
        coverPhoto,
      });
    });
    res.status(200).json({ events: eventDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}
