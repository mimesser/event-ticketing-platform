import { Magic } from "@magic-sdk/admin";
import { isBrowser } from "lib/utils";

export const magic = isBrowser
  ? new Magic(process.env.MAGIC_SECRET_KEY ?? "")
  : undefined;
