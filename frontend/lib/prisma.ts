import { PrismaClient } from "@prisma/client";
import { isProduction } from "lib/utils";

declare const global: NodeJS.Global & { prisma?: PrismaClient };

let prisma: PrismaClient;

if (isProduction) {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
