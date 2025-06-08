import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";


export const useRoom = () => {
    const state = useContext(RoomContext);
    if (!state) {
      console.log("Could not find RoomContext state");
    }
    return state;
  };