import { NextApiResponse } from "next";
import { supabase } from "lib/supabase";
import multer from "multer";
import nextConnect from "next-connect";

const upload = multer({});

const apiRoute = nextConnect({});

const uploadMiddleware = upload.single("file");

apiRoute.use(uploadMiddleware);

apiRoute.post(async (req: any, res: NextApiResponse) => {
    const filename = req.query.filename;
    const BUCKET_NAME: string = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME as string;
    const storage = supabase.storage.from(BUCKET_NAME);
    const { error } = await storage
        .upload(filename, req.file.buffer, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) {
        console.error(error);
        res.status(500).json(error);
        return;
    }

    const { publicURL } = storage.getPublicUrl(filename);

    res.status(200).json({
        url: publicURL + "?token=" + process.env.NEXT_PUBLIC_SUPABASE_KEY,
    });
});

export default apiRoute;

export const config = {
    api: {
        bodyParser: false,
    },
};
