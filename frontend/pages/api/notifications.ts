import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function notifications(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = JSON.parse(req.body);

  if (req.method === "DELETE") {
    try {
      await prisma.notification.updateMany({
        where: {
          id: {
            in: id,
          },
        },
        data: {
          isRead: true,
        },
      });

      res.status(200).json({ status: "Mark notificatons as read success" });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
