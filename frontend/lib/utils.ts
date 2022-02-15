export const shortenAddress = (address: string) => {
  if (!address) return "";
  if (address.startsWith("0x")) {
    if (address.length < 12) return address;
    return address.slice(0, 6) + "..." + address.slice(-4);
  }
  if (address.length < 10) return address;
  return address.slice(0, 4) + "..." + address.slice(-4);
};

export const stopPropagation = (e: React.MouseEvent<HTMLElement>) => {
  e.stopPropagation();
};

export const moonPaySrc = `https://buy-staging.moonpay.io?apiKey=${process.env.NEXT_PUBLIC_MOONPAY_TEST_KEY}&currencyCode=ETH&colorCode=%23107cf1`;
