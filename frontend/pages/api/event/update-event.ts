import { NextApiResponse } from "next";
import { getLoginSession } from "lib/auth";
import moment from "moment";
import multer from "multer";
import nextConnect from "next-connect";
import prisma from "lib/prisma";
import { supabase } from "lib/supabase";

const upload = multer({});

const apiRoute = nextConnect({});

const uploadMiddleware = upload.single("file");

apiRoute.use(uploadMiddleware);

apiRoute.post(async (req: any, res: NextApiResponse) => {
  const session = await getLoginSession(req);
  if (!session) {
    res.status(400).json({ error: "Missing session" });
    return;
  }

  if (!req.body) {
    res.status(400).json({ error: "Missing request body" });
    return;
  }

  const { title, description, location, startTime, endTime, showGuestList } =
    req.body;
  const coHosts = JSON.parse(req.body.coHosts);
  const eventId = parseInt(req.body?.eventId);
  if (!eventId) {
    res.status(400).json({ error: "Missing eventId in request body" });
    return;
  }
  // check if there exists an event with id = `eventId`, hostId=user.id
  const user = await prisma.user.findUnique({
    where: { email: session.email },
    select: { id: true },
  });

  if (!user) {
    res.status(403).json({ error: "unauthenticatd user" });
    return;
  }

  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      hostId: user?.id,
    },
  });

  if (!event) {
    return res.status(400).json({ error: "Invalid event id" });
  }

  let coverPhoto: string | null = "";

  // TODO: remove already uploaded cover photo from storage bucket

  if (req.file) {
    const coverPhotoPath = encodeURIComponent(
      session.publicAddress + "-" + "cover" + "-" + Date.now()
    );

    const BUCKET_NAME: string = process.env
      .NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME as string;
    const storage = supabase.storage.from(BUCKET_NAME);
    const { error } = await storage.upload(coverPhotoPath, req.file?.buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: "image",
    });

    if (error) {
      console.error(error);
      console.log(error);
      res.status(500).json(error);
      return;
    }
    coverPhoto = storage.getPublicUrl(coverPhotoPath).publicURL;
    const pos = JSON.parse(req.body.pos);
    coverPhoto = JSON.stringify({
      url: coverPhoto,
      pos,
    });
  }
  if (!coverPhoto) coverPhoto = "";
  try {
    await prisma.event.update({
      data: {
        title,
        description,
        coverPhoto,
        location,
        startTime: moment(startTime, "YYYY-MM-DD h:mm A").toDate(),
        endTime: !endTime
          ? null
          : moment(endTime, "YYYY-MM-DD h:mm A").toDate(),
        showGuestList: showGuestList === "true",
      },
      where: {
        id: eventId,
      },
    });
    // update coHosts
    await prisma.coHosts.deleteMany({
      where: {
        eventId: eventId,
      },
    });
    const coHostInfo = coHosts.map((userId: number) => ({
      eventId,
      cohostId: userId,
    }));
    await prisma.coHosts.createMany({
      data: coHostInfo,
    });
    res.status(200).json({ status: "ok", eventId: eventId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
