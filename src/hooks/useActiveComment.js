import { useContext } from "react";
import { CommentContext } from "@/src/context/CommentContext";

export const useActiveComment = () => {
    const state = useContext(CommentContext);
    if (!state) {
      console.log("Could not find state");
    }
    return state;
  };