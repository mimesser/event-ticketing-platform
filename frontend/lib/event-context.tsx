import moment from "moment";
import { ReactElement, createContext, useContext, useState } from "react";

const EventContext = createContext<{
	eventName?: string;
	eventLocation?: any;
	timezone?: any;
	eventDescription?: string;
	startDate?: string;
	endDate?: string;
	privacy?: string;
	invitable?: boolean;
	cover?: any;

	setEventName?: any;
	setEventLocation?: any;
	setTimezone?: any;
	setEventDescription?: any;
	setStartDateAndTime?: any;
	setEndDateAndTime?: any;
	setEventPrivacy?: any;
	setEventInvitable?: any;
	setCover?: any;
}>({});

export const useNewEvent = () => useContext(EventContext);

export default function EventProvider({
	children,
}: {
	children: ReactElement | ReactElement[];
}) {
	const [eventName, setEventName] = useState("");
	const [eventLocation, setEventLocation] = useState({});
	const [timezone, setTimezone] = useState({});
	const [eventDescription, setEventDescription] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [privacy, setEventPrivacy] = useState("");
	const [invitable, setEventInvitable] = useState(true);
	const [cover, setCover] = useState({});

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
				timezone,
				eventDescription,
				startDate,
				endDate,
				privacy,
				invitable,
				cover,

				setEventName,
				setEventLocation,
				setTimezone,
				setEventDescription,
				setStartDateAndTime,
				setEndDateAndTime,
				setEventPrivacy,
				setEventInvitable,
				setCover,
			}}
		>
			{children}
		</EventContext.Provider>
	);
}
