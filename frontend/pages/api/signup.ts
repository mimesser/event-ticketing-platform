import { NextApiResponse, NextApiRequest } from "next";

import prisma from "../../lib/prisma";

export default async function user(req: NextApiRequest, res: NextApiResponse) {
  const user = await prisma.user.findUnique({
    where: { email: JSON.parse(req.body).email },
  });

  res.status(200).json({ user });
}
