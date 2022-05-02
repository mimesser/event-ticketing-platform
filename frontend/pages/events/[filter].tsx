import Layout from "components/Layout";
import GoingEvents from "components/GoingEvents";
import EventPage from "components/EventPage";
import { eventFilters } from "lib/utils";
import { getLoginSession } from "lib/auth";

function Events({ filter, eventId }: { filter: string; eventId: number }) {
  return filter ? (
    <Layout>
      {filter === "going" ? <GoingEvents /> : <div>{filter} </div>}
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
