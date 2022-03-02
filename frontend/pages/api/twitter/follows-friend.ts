import { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";

export default async function followsFriend(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, selectedFrenz }: any = JSON.parse(req.body);

  if (!email) {
    res.status(400).json({ error: "Missing email" });
    return;
  }

  try {
    await prisma.user.update({
      where: { email: email },
      data: {
        following: { connect: selectedFrenz.map((id: any) => ({ id })) },
      },
    });

    res.status(200).json({ status: "update success" });
  } catch (e) {
    console.log(e);

    res.status(500).json({ e });
  }
}
