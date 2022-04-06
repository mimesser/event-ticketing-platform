import { Magic } from "magic-sdk";
import { isBrowser, isProduction, isTest } from "lib/utils";

const customNodeOptions = {
  rpcUrl: "https://polygon-rpc.com",
  chainId: 137,
};

export const magic = isBrowser
  ? new Magic(
      process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY ?? "",
      isProduction
        ? { network: customNodeOptions }
        : isTest
        ? { testMode: true }
        : { network: "ropsten" }
    )
  : undefined;
