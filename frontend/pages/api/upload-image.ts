import { NextApiResponse } from "next";
import { getLoginSession } from "lib/auth";
import { supabase } from "lib/supabase";
import multer from "multer";
import nextConnect from "next-connect";

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

  const filename = req.body.filename;

  if (!filename.includes(session.publicAddress)) {
    res
      .status(400)
      .json({ error: "Not authorized to upload on behalf of user" });
    return;
  }

  const BUCKET_NAME: string = process.env
    .NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME as string;
  const storage = supabase.storage.from(BUCKET_NAME);
  const { error } = await storage.upload(filename, req.file.buffer, {
    cacheControl: "3600",
    upsert: false,
    contentType: "image"
  });

  if (error) {
    console.error(error);
    res.status(500).json(error);
    return;
  }

  const { publicURL } = storage.getPublicUrl(filename);

  res.status(200).json({
    url: publicURL,
  });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
