import React, { createContext, useState } from "react";
import axios from "axios";

export const UserDataContext = createContext();

export function UserDataContextProvider({ children }) {
  const serverURL = "http://localhost:8000";

  const [userData, setUserData] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const res = await axios.get(`${serverURL}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(res.data.user);
      console.log("Current user data:", res.data.user);
    } catch (error) {
      console.log("Error fetching current user:", error);
    }
  };

  const value = {
    serverURL,
    userData,
    setUserData,
    handleCurrentUser,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}
