

"use client";

import { createContext, useState } from "react";

export const RoomContext = createContext(null);

 const RoomContextProvider = ({ children }) => {
    // {userId: string, role: RoomRole}
  const [userRole, setUserRole] = useState(null);
  console.log("userRole: ", userRole);

  const handleUserRole = (userId, role) => {
    setUserRole({
      userId: userId,
      role: role,
    });
  }

  return (
    <RoomContext.Provider 
      value={{
        userRole,
        handleUserRole
          }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomContextProvider;