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
  for (var i = 0; i < 1440; i += 15) {
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

export const roundUpTime = () => {
  const date = new Date(Math.ceil(new Date().getTime() / 3600000) * 3600000);
  var hours: number = date.getHours();
  var minutes: number | string = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;

  var strTime: string = hours + ":" + minutes + " " + ampm;

  return strTime.toString();
};

export const roundUpTimePlus3 = () => {
  const date = new Date(Math.ceil(new Date().getTime() / 3600000) * 3600000);
  const h = 3;

  date.setTime(date.getTime() + h * 60 * 60 * 1000);

  var hours: number = date.getHours();
  var minutes: number | string = date.getMinutes();
  var ampm: string = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;

  var strTime: string = hours + ":" + minutes + " " + ampm;
  return strTime.toString();
};

export const getTimezoneByLocation = async (lat: number, lng: number) => {
  const tz = await fetch(
    `https://maps.googleapis.com/maps/api/timezone/json?location=${lat}%2C${lng}&timestamp=${Math.floor(
      Date.now() / 1000
    )}&key=${process.env.NEXT_PUBLIC_GOOGLE_TIMEZONE_API}`
  );
  return await tz.json();
};

export const tzAbbreviation = (tz: string) => {
  return tz.replace(/[^A-Z]/g, "");
};

export const getLocalTimezone = () => {
  const longTimezone = new Date()
    .toLocaleTimeString("en-us", { timeZoneName: "long" })
    .split(" ")
    .slice(2)
    .join(" ");
  return {
    name: longTimezone,
    abbr: tzAbbreviation(longTimezone),
  };
};
