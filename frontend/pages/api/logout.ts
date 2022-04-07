import { getLoginSession } from "lib/auth";
import { removeTokenCookie } from "lib/auth-cookie";
import { magic } from "lib/magicAdmin";
import { NextApiResponse, NextApiRequest } from "next";

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getLoginSession(req);

    if (session) {
      await magic?.users.logoutByIssuer(session.issuer);
      removeTokenCookie(res);
    }

    res.status(200).json({ status: "User logged out" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
