import Layout from "components/Layout";
import FilteredEvents from "components/events/FilteredEvents";
import HostingEvents from "components/events/HostingEvents";
import InvitesView from "components/events/InvitesView";
import EventPage from "components/EventPage";
import { eventFilters } from "lib/utils";
import { useRouter } from "next/router";
import { useUserInfo } from "lib/user-context";
import React from "react";

function Events() {
  const router = useRouter();
  const { filter }: any = router.query;
  const { user } = useUserInfo();

  React.useEffect(() => {
    if (!filter) {
      return;
    }
    if (!filter.match(/^[0-9]*$/) && eventFilters.indexOf(filter) === -1) {
      router.push(
        {
          pathname: `/events/`,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [filter, router]);

  return filter && eventFilters.indexOf(filter) !== -1 && user ? (
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
          showExportButton={true}
        />
      ) : filter === "invites" ? (
        <InvitesView />
      ) : filter === "hosting" ? (
        <HostingEvents />
      ) : (
        <div>{filter} </div>
      )}
    </Layout>
  ) : filter && filter.match(/^[0-9]*$/) ? (
    <EventPage eventId={parseInt(filter)} />
  ) : (
    <Layout>{}</Layout>
  );
}

export default Events;
