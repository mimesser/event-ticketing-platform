import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "csv-stringify/sync";
import prisma from "lib/prisma";
import { getLoginSession } from "lib/auth";

export default async function getEvents(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    if (!req.body) {
      res.status(400).json({ error: "Missing request body" });
      return;
    }

    const { eventId } = JSON.parse(req.body);

    if (!eventId) {
      res.status(400).json({ error: "Missing eventId in request body" });
      return;
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        hostId: true,
      },
    });

    let csv = "";

    if (event) {
      const session = await getLoginSession(req);
      const currentUser = await prisma.user.findUnique({
        where: { email: session.email },
        select: { id: true },
      });
      const hostId = event?.hostId;
      const isCEO =
        session?.email === "hj@dystopialabs.com" && currentUser?.id === hostId;
      const user = await prisma.user.findUnique({
        where: {
          id: hostId as any,
        },
        select: {
          username: true,
          name: true,
          walletAddress: true,
          email: isCEO,
          showWalletAddress: true,
        },
      });
      const guests: any[] = [];

      if (user) {
        guests.push({
          username:
            (user?.username ? user?.username : user?.walletAddress) || "",
          name: user?.name ? user?.name : "",
          status: "Going",
          ...(isCEO
            ? {
                email: user.email,
                wallet: user?.showWalletAddress
                  ? user?.walletAddress || ""
                  : "",
              }
            : {}),
        });
      }
      let columns = ["name", "username"];
      let headers = "Name, Username, ";

      if (isCEO) {
        columns.push("email");
        columns.push("wallet");
        headers += "Email, ";
        headers += "WalletAddress, ";
      }
      columns.push("status");
      headers += "Status";

      csv =
        headers +
        "\n" +
        stringify(guests, {
          columns,
          quoted: true,
        });
    }
    res.status(200).json({ csv });
  } else {
    res.status(400).json({ error: "Wrong method" });
    return;
  }
}
