import Iron from "@hapi/iron";
import { NextApiResponse, NextApiRequest } from "next";
import { MAX_AGE, setTokenCookie, getTokenCookie } from "./auth-cookie";

const TOKEN_SECRET: any = process.env.TOKEN_SECRET;

export const setLoginSession = async (res: NextApiResponse, metadata: any) => {
  const createdAt = Date.now();
  const obj = { ...metadata, createdAt, maxAge: MAX_AGE };
  const token = await Iron.seal(obj, TOKEN_SECRET, Iron.defaults);
  setTokenCookie(res, token);
};

export const getLoginSession = async (req: NextApiRequest) => {
  const token = getTokenCookie(req);

  if (!token) return;

  const session = await Iron.unseal(token, TOKEN_SECRET, Iron.defaults);
  const expiresAt = session.createdAt + session.maxAge * 1000;

  // Validate the expiration date of the session
  if (Date.now() > expiresAt) {
    throw new Error("Session expired");
  }

  return session;
};
