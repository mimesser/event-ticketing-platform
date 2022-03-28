import moment from "moment";
import {
  ReactElement,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const EventContext = createContext<{
  eventName?: string;
  host?: string;
  avatar?: string;
  address?: string;
  startDate?: string;
  endDate?: string;

  setEventName?: any;
  setHost?: any;
  setAvatar?: any;
  setAddress?: any;
  setStartDateAndTime?: any;
  setEndDateAndTime?: any;
}>({});

export const useNewEvent = () => useContext(EventContext);

export default function EventProvider({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  const [eventName, setEventName] = useState("");
  const [host, setHost] = useState("");
  const [avatar, setAvatar] = useState("");
  const [address, setAddress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const setStartDateAndTime = (date: string, time: string) => {
    const formatted = moment(date).format("YYYY-MM-DD ") + time;
    setStartDate(formatted);
  };

  const setEndDateAndTime = (show: boolean, date: string, time: string) => {
    if (show) {
      const formatted = moment(date).format("YYYY-MM-DD ") + time;
      setEndDate(formatted);
    } else {
      setEndDate("");
    }
  };

  return (
    <EventContext.Provider
      value={{
        eventName,
        host,
        avatar,
        address,
        startDate,
        endDate,

        setEventName,
        setHost,
        setAvatar,
        setAddress,
        setStartDateAndTime,
        setEndDateAndTime,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}
