"use client";

import { addComment } from "@/src/lib/actions";
import { findParentComment } from "@/src/utils";
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

const CommentContext = createContext(null);

export const useActiveComment = () => {
  const state = useContext(CommentContext);
  if (!state) {
    console.log("Could not find state");
  }
  return state;
};

export const CommentContextProvider = ({ children }) => {
  const [activeComment, setActiveComment] = useState(null);
  const [commentCreator, setCommentCreator] = useState(null);
  let [comments, setComments] = useState([]);
  const [parentComment, setParentComment] = useState(null);
  const [shardId, setShardId] = useState(null);

  console.log("Active Comment: ", activeComment);

  const createNewComment = async (message, creator, shardId) => {
    try {
      toast.promise(
        addComment(creator, shardId, message),
        {
          loading: "Adding New Comment...",
          success: (data) => {
            const parent = data.parentId;
            console.log("newly created comment: ", data);

            if (!parent) {
              console.log("idhar ni aya ma ka loda");
              setComments((prev) => [
                {
                  ...data,
                  replies: [],
                },
                ...prev,
              ]);
            } else {
              console.log("wtf is happening");
              const temp = findParentComment(comments, parent);
              console.log("aaja bhosdike");
              console.log(temp);
              if (temp !== null) {
                if (!temp.replies.includes(data)) {
                  temp.replies.push({
                    ...data,
                    replies: [],
                  });
                }

                setParentComment(temp);
                setComments(comments);
              }
            }

            return "Comment saved successfully";
          },
          error: (ctx) => {
            console.log(ctx);
            return "Could not add new Comment";
          },
        },
      );
    } catch (error) {
      console.log("new comment error: ", error);
    }
  };

  return (
    <CommentContext.Provider
      value={{
        parentComment,
        setParentComment,
        shardId,
        setShardId,
        createNewComment,
        comments,
        setComments,
        commentCreator,
        setCommentCreator,
        activeComment,
        setActiveComment,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};
