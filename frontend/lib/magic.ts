import { Magic } from "magic-sdk";

const customNodeOptions = {
  rpcUrl: "https://polygon-rpc.com",
  chainId: 137,
};

export const magic = new Magic(
  process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY ?? "",
  { network: customNodeOptions }
);
