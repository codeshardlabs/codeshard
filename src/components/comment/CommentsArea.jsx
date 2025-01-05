import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Separator } from "@/src/components/ui/separator";
import CommentMsg from "./CommentMsg";
import { Fragment } from "react";

export function CommentsArea({ comments, isReplyArea = false }) {
  const messages = comments;

  return (
    <ScrollArea className={"h-72 rounded-md border"}>
      <div className="p-4">
        {messages.map((message, index) => (
          <Fragment key={index}>
            <CommentMsg
              key={message._id}
              className="text-sm line-clamp-2 overflow-none"
              _id={message._id}
              isReply={isReplyArea}
              replies={message.replies}
              creator={message.user}
              msg={message.message}
            />
            <Separator className="my-2" />
          </Fragment>
        ))}
      </div>
    </ScrollArea>
  );
}
