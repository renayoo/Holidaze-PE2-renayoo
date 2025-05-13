import { useState, useEffect } from "react";
import { getAuthUser } from "../utils/auth";

export function useAuth() {
  const [user, setUser] = useState(getAuthUser());

  useEffect(() => {
    function handleUpdate() {
      setUser(getAuthUser());
    }

    window.addEventListener("userChanged", handleUpdate);
    return () => window.removeEventListener("userChanged", handleUpdate);
  }, []);

  return user;
}
