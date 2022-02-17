import { CookieSerializeOptions, serialize, parse } from "cookie";
import { isProduction } from "lib/utils";
import { NextApiResponse } from "next";

export const MAX_AGE = 60 * 60 * 8;
const TOKEN_NAME = "token";

export const setTokenCookie = (res: NextApiResponse, token: string) => {
  const cookieOptions: CookieSerializeOptions = {
    maxAge: MAX_AGE,
    httpOnly: true,
    secure: isProduction,
    path: "/",
    sameSite: "lax",
  };
  const cookie = serialize("token", token, cookieOptions);
  res.setHeader("Set-Cookie", cookie);
};

export const removeTokenCookie = (res: NextApiResponse) => {
  const cookie = serialize(TOKEN_NAME, "", {
    maxAge: -1,
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
};

export const parseCookies = (req: any) => {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies;

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie;
  return parse(cookie || "");
};

export const getTokenCookie = (req: any) => {
  const cookies = parseCookies(req);
  return cookies[TOKEN_NAME];
};
