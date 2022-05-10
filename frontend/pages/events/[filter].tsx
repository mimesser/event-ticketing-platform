import Layout from "components/Layout";
import FilteredEvents from "components/events/FilteredEvents";
import HostingEvents from "components/events/HostingEvents";
import InvitesView from "components/events/InvitesView";
import EventPage from "components/EventPage";
import { eventFilters } from "lib/utils";
import { getLoginSession } from "lib/auth";

function Events({ filter, eventId }: { filter: string; eventId: number }) {
  return filter ? (
    <Layout>
      {filter === "going" ? (
        <FilteredEvents title="Going" filter="going" showDetailsMenu={true} />
      ) : filter === "past" ? (
        <FilteredEvents
          title="Your Past Events"
          filter="past"
          showDetailsMenu={false}
        />
      ) : filter === "calendar" ? (
        <FilteredEvents
          layout="horizontal"
          title="Going"
          filter="going"
          showDetailsMenu={true}
        />
      ) : filter === "invites" ? (
        <InvitesView/>
      ) : filter === "hosting" ? (
        <HostingEvents />
      ) : (
        <div>{filter} </div>
      )}
    </Layout>
  ) : (
    <EventPage eventId={eventId} />
  );
}

export async function getServerSideProps(context: any) {
  const session = await getLoginSession(context.req);
  const { filter } = context.query;
  if (eventFilters.indexOf(filter) !== -1 && session)
    return { props: { filter } };
  if (filter.match(/^[0-9]*$/))
    return {
      props: {
        eventId: parseInt(filter),
      },
    };
  return {
    redirect: {
      permanent: false,
      destination: "/events/",
    },
  };
}

export default Events;
