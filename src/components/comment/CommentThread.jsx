"use client";
import React, { useState } from "react";
import CommentMsg from "./CommentMsg";

const CommentThread = ({ comments: initialComments }) => {
  const [comments, setComments] = useState(initialComments);

  return (
    <div className="p-4">
      {comments.map((comment, index) => {
        return (
          <CommentMsg
            isReply={false}
            key={index}
            msg={comment.message}
            creator={comment.user}
            replies={comment.replies}
          />
        );
      })}
    </div>
  );
};

export default CommentThread;
