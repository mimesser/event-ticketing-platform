import { getLoginSession } from "lib/auth";
import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function signupNotifications(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getLoginSession(req);

  if (!session) {
    res.status(400).json({ error: "Missing session" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.email },
      select: { id: true, nativeAssetBalance: true, twitterUsername: true },
    });

    if (user?.nativeAssetBalance === "0" || user?.nativeAssetBalance === null) {
      await prisma.notification.create({
        data: {
          description: "To get started, fuel up with some MATIC",
          userId: user?.id,
          avatarImage: "/icons/matic.svg",
          notificationType: "Matic",
        },
      });
    }

    if (user?.twitterUsername === null) {
      await prisma.notification.create({
        data: {
          description:
            "Link your Twitter account to get the most out of Impish",
          userId: user?.id,
          avatarImage: "/icons/twitter.svg",
          notificationType: "Twitter",
        },
      });
    }

    res.status(200).json({ status: "Create signup notificatons success" });
  } catch (error) {
    res.status(500).json({ error });
  }
}
