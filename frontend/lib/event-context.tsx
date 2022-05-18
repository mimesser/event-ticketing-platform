import moment from "moment";
import { ReactElement, createContext, useContext, useState } from "react";
import { LocationInfo } from "./types";

const EventContext = createContext<{
  eventId?: number;
  eventName?: string;
  eventLocation?: LocationInfo;
  timezone?: any;
  eventDescription?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  privacy?: string;
  invitable?: boolean;
  cover?: any;
  showGuestList?: boolean;
  coHosts?: any;

  setEventId?: any;
  setEventName?: any;
  setEventLocation?: any;
  setTimezone?: any;
  setEventDescription?: any;
  setStartDateAndTime?: any;
  setEndDateAndTime?: any;
  setEventPrivacy?: any;
  setEventInvitable?: any;
  setCover?: any;
  setShowGuestList?: any;
  setCoHosts?: any;
}>({});

export const useNewEvent = () => useContext(EventContext);

export default function EventProvider({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  const [eventId, setEventId] = useState(0);
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState({});
  const [timezone, setTimezone] = useState({});
  const [eventDescription, setEventDescription] = useState("");
  const [eventStartDate, setStartDate] = useState("");
  const [eventEndDate, setEndDate] = useState("");
  const [privacy, setEventPrivacy] = useState("");
  const [invitable, setEventInvitable] = useState(true);
  const [cover, setCover] = useState({});
  const [showGuestList, setShowGuestList] = useState<boolean>(true);
  const [coHosts, setCoHosts] = useState<any>([]);

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
        eventId,
        eventName,
        eventLocation,
        timezone,
        eventDescription,
        eventStartDate,
        eventEndDate,
        privacy,
        invitable,
        cover,
        showGuestList,
        coHosts,

        setEventId,
        setEventName,
        setEventLocation,
        setTimezone,
        setEventDescription,
        setStartDateAndTime,
        setEndDateAndTime,
        setEventPrivacy,
        setEventInvitable,
        setCover,
        setShowGuestList,
        setCoHosts,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}
