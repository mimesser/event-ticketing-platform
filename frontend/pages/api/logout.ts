import { QueryBuilder } from "@mui/icons-material";
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
  } catch (error) {
    console.error(error);
  }
  const query = req.query;
  res.writeHead(302, { Location: query.route });
  res.end();
}
