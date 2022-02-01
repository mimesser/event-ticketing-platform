import { Magic } from "@magic-sdk/admin";
import { setLoginSession } from "../../lib/auth";
import prisma from "../../lib/prisma";

export default async function login(req, res) {
  const magic = new Magic(process.env.MAGIC_SECRET_KEY);
  const didToken = req.headers.authorization.substr(7);
  const metadata = await magic.users.getMetadataByToken(didToken);
  await setLoginSession(res, metadata);
  try {
    const dbInfo = {
      wallet: metadata.publicAddress,
      email: metadata.email,
    }
    const result = await prisma.user.upsert({
      where: {
        email: metadata.email
      },
      create: dbInfo,
      update: dbInfo,
    });
  } catch(e) {
    console.error(e);
  }
  res.send({ done: true });
}
