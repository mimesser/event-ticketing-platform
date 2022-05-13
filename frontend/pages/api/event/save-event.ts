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

  const {
    title,
    description,
    location,
    startTime,
    endTime,
    privacy,
    showGuestList,
    invitable,
  } = req.body;

  const coHosts = JSON.parse(req.body.coHosts);

  let coverPhoto: string | null = "";
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
    const user = await prisma.user.findUnique({
      where: { email: session.email },
      select: { id: true },
    });
    const { id: eventId } = await prisma.event.create({
      data: {
        title,
        description,
        coverPhoto,
        location,
        hostId: user?.id,
        startTime: moment(startTime, "YYYY-MM-DD h:mm A").toDate(),
        endTime: !endTime
          ? null
          : moment(endTime, "YYYY-MM-DD h:mm A").toDate(),
        privacySetting: privacy,
        invitable: invitable === "true",
        showGuestList: showGuestList === "true",
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
