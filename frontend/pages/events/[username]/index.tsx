import Layout from "components/Layout";
import { getLoginSession } from "lib/auth";

function UserEvents() {
  return (
    <Layout>
      <></>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getLoginSession(context.req);
  if (session) {
    return {
      props: {},
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: `/events`,
      },
    };
  }
}

export default UserEvents;
