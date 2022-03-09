import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function signupNotifications(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = JSON.parse(req.body);

  try {
    const userId = await prisma.user.findUnique({
      where: { email: email },
      select: { id: true },
    });

    await prisma.notification.createMany({
      data: [
        {
          description: "this is the first notification available",
          userId: userId?.id,
          title: "",
        },
        {
          description: "this is the second notification available",
          userId: userId?.id,
          title: "",
        },
        {
          description:
            "this is the third notification available but longer so i can test responsiveness",
          userId: userId?.id,
          title: "",
        },
        {
          description: "this is the fourth notification available",
          userId: userId?.id,
          title: "",
        },
        {
          description: "this is the fifth notification available",
          userId: userId?.id,
          title: "",
        },
      ],
    });

    res.status(200).json({ status: "Create signup notificatons success" });
  } catch (error) {
    res.status(500).json({ error });
  }
}
