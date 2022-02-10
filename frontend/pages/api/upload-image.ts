import { Storage } from "@google-cloud/storage";
import { NextApiRequest, NextApiResponse } from "next";

export default async function uploadImage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    credentials: {
      client_email: process.env.GCP_SERVICE_ACCOUNT,
      private_key: process.env.GCP_SERVICE_ACCOUNT_PRIVATE_KEY,
    },
  });

  const bucket = storage.bucket(process.env.GCP_STORAGE_BUCKET_NAME as string);
  const file = bucket.file(req.query.file as string);

  try {
    if (await file.exists()) {
      await file.delete();
    }
  } catch (_error) {
    // ignore for now
  }

  const options = {
    expires: Date.now() + 1 * 60 * 1000, //  1 minute,
    fields: { "x-goog-meta-test": "data" },
  };

  const [response] = await file.generateSignedPostPolicyV4(options);
  res.status(200).json(response);
}
