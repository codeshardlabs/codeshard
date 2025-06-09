import { useContext } from "react";
import { SocketContext } from "@/src/context/SocketContext";

export const useSocket = () => {
    const state = useContext(SocketContext);
  
    if (!state) {
      throw new Error("Socket state not found");
    }
  
    return state;
  };