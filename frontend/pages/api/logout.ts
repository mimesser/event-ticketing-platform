import { magic } from "lib/magicAdmin";
import { removeTokenCookie } from "../../lib/auth-cookie";
import { getLoginSession } from "../../lib/auth";
import { NextApiResponse, NextApiRequest } from "next";

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getLoginSession(req);

    if (session) {
      await magic.users.logoutByIssuer(session.issuer);
      removeTokenCookie(res);
    }
  } catch (error) {
    console.error(error);
  }

  res.writeHead(302, { Location: "/" });
  res.end();
}
