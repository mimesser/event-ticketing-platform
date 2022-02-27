import { useRouter } from "next/router";
import { createContext, useContext, useState, ReactElement, useEffect } from "react"

const UserContext = createContext<{
    loading: boolean
    user: any
}>({
    loading: true,
    user: null,
});

export function useUserInfo() {
  const context = useContext(UserContext)
  return {
    user: context.user,
    loading: context.loading
  }
}

export default function UserProvider({
  children
} : {
  children: ReactElement | ReactElement[]
}) {
  const router = useRouter();

  const [user, setUser] = useState(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/user")
    .then((r) => r.json())
    .then((data) => {
      setUser(data?.user || null);
    });
  }, [router.pathname]);

  useEffect(() => {
    if (user !== undefined) setLoading(false);
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        loading,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  )

}