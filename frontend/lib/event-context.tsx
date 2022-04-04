import moment from "moment";
import { ReactElement, createContext, useContext, useState } from "react";

const EventContext = createContext<{
  eventName?: string;
  eventLocation?: string;
  startDate?: string;
  endDate?: string;
  privacy?: string;
  invitable?: boolean;

  setEventName?: any;
  setEventLocation?: any;
  setStartDateAndTime?: any;
  setEndDateAndTime?: any;
  setEventPrivacy?: any;
  setEventInvitable?: any;
}>({});

export const useNewEvent = () => useContext(EventContext);

export default function EventProvider({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [privacy, setEventPrivacy] = useState("");
  const [invitable, setEventInvitable] = useState(true);

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
        eventLocation,
        startDate,
        endDate,
        privacy,
        invitable,

        setEventName,
        setEventLocation,
        setStartDateAndTime,
        setEndDateAndTime,
        setEventPrivacy,
        setEventInvitable,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}
