import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "../ui/textarea";
import Button from "../ui/Button";
import { useActiveComment } from "../../context/CommentContext";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

const CommentTextBox = () => {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);
  const { shardId, commentCreator, createNewComment } = useActiveComment();
  const { user, isSignedIn } = useUser();

  if (!isSignedIn) {
    return null;
  }

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = () => {
    if (input.trim()) {
      setTimeout(() => {
        createNewComment(input, user.username, shardId);
      }, 100);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white mb-4">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={input.length >= 1000}
        placeholder="Add New Comment..."
        className="min-h-[60px] max-h-[200px] p-2 text-base border-0 focus-visible:ring-0 resize-none overflow-hidden"
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-500">{input.length} / 1000</span>
        <Button
          onClick={handleSubmit}
          disabled={input.trim() === ""}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white"
        >
          Send {commentCreator && `@${commentCreator}`}
        </Button>
      </div>
    </div>
  );
};

export default CommentTextBox;
