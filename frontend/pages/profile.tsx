import React from "react";
import { useUser } from "../lib/hooks";
import Link from "next/link";

function Profile() {
  const user = useUser({ redirectTo: "/" });

  return (
    <div className="body">
      <h1>Profile</h1>

      {user && (
        <>
          <p>Your session:</p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
          <Link href="/api/logout" passHref>
            <button>Logout</button>
          </Link>
        </>
      )}
      <style jsx>{`
        .body {
          text-align: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
}

export default Profile;