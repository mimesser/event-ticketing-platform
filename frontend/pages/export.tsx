import Layout from 'components/Layout';
import { useUser } from "lib/hooks";
import { useRouter } from "next/router";
import React from "react";

function ExportPage() {
  const { query } = useRouter();
  const firstTimeUser = query.userExists === "false";
  const user = useUser({
    redirectTo: firstTimeUser ? false : "/dashboard",
    redirectIfFound: true,
  });
  
  return (
    <Layout>
      {user && (
        <>
        </>
      )}
    </Layout>
  );
}

export default ExportPage;
