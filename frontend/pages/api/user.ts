import { getLoginSession } from "../../lib/auth";
import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function user(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getLoginSession(req);
    // After getting the session you may want to fetch for the user instead
    // of sending the session's payload directly, this example doesn't have a DB
    // so it won't matter in this case
    
    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    res.status(200).json({ user: user || null });
  } catch(e) {
    res.status(500).send({ e });
  }
}
