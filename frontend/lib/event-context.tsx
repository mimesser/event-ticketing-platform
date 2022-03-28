import moment from "moment";
import { ReactElement, createContext, useContext, useState } from "react";

const EventContext = createContext<{
  eventName?: string;
  startDate?: string;
  endDate?: string;

  setEventName?: any;
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
        startDate,
        endDate,

        setEventName,
        setStartDateAndTime,
        setEndDateAndTime,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}
