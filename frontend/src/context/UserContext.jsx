import React, { createContext } from "react";

export const UserDataContext = createContext(); 

function UserContext({ children }) {
  const serverURL = "http://localhost:8000"; 
  const value = {
    serverURL,
  };

  return (
    <UserDataContext.Provider value={{ serverURL }}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;
