export const shortenAddress = (address: string) => {
  if (!address) return "";
  if (address.startsWith("0x")) {
    if (address.length < 12) return address;
    return address.slice(0, 6) + "..." + address.slice(-4);
  }
  if (address.length < 10) return address;
  return address.slice(0, 4) + "..." + address.slice(-4);
};

export const shortenText = (text: string, length: number = 45) => {
  if (!text) return "";

  if (length > 7 && text.length > length) {
    return text.slice(0, length - 7) + "...";
  } else {
    return text;
  }
};

export const stopPropagation = (e: React.MouseEvent<HTMLElement>) => {
  e.stopPropagation();
};

export const isBrowser = typeof window !== "undefined";

export const isProduction = process.env.NODE_ENV === "production";

export const checkUsernameEqual = (left: any, right: any) => {
  if (!left) left = "";
  if (!right) right = "";

  return left.toString().toLowerCase() === right.toString().toLowerCase();
};

export const eventTime = () => {
  var hours, minutes, ampm;
  var time = [];
  var uniqueChars: any = [];
  for (var i = 0; i <= 1440; i += 15) {
    hours = Math.floor(i / 60);
    minutes = i % 60;
    if (minutes < 10) {
      minutes = "0" + minutes; // adding leading zero
    }
    ampm = hours % 24 < 12 ? "AM" : "PM";
    hours = hours % 12;
    if (hours === 0) {
      hours = 12;
    }
    time.push(hours + ":" + minutes + " " + ampm);
  }
  time.forEach((c) => {
    if (!uniqueChars.includes(c)) {
      uniqueChars.push(c);
    }
  });
  return uniqueChars;
};
