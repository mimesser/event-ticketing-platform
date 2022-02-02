import { CookieSerializeOptions, serialize } from "cookie";
import { NextApiResponse } from "next";

export const MAX_AGE = 60 * 60 * 8;

export const setTokenCookie = (res: NextApiResponse, token: string) => {
  const cookieOptions: CookieSerializeOptions = {
    maxAge: MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    path: "/",
    sameSite: "lax",
  };
  const cookie = serialize("token", token, cookieOptions);
  res.setHeader("Set-Cookie", cookie);
};
