import { Magic } from "magic-sdk";
import { isBrowser, isProduction, isTest } from "lib/utils";

const customNodeOptions = {
  rpcUrl: "https://polygon-rpc.com",
  chainId: 137,
};

export const magic = isBrowser
  ? new Magic(
      process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY ?? "",
      isTest
        ? { testMode: true }
        : isProduction
        ? { network: customNodeOptions }
        : { network: "ropsten" }
    )
  : undefined;
