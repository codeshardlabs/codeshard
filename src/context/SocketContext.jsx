"use client";

import { io } from "socket.io-client";

import {
  createContext,
  useCallback,
  useState,
  useEffect
} from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const [latestData, setLatestData] = useState({});
  const [latestVisibleFiles, setLatestVisibleFiles] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const { user, isSignedIn } = useUser();

  const sendMessage = useCallback(
    ({ activeFile, data, roomId }) => {
      if (!socket) {
        console.log("socket not found");
        return;
      }
      console.log("socket is available");
      socket.emit("event:message", {
        activeFile: activeFile,
        data: data,
        roomId: roomId,
      });
    },
    [socket],
  );

  const sendChatMessage = useCallback(
    ({text, sender, timestamp, roomId}) => {
      if (!socket) {
        console.log("socket not found");
        return;
      }
      socket.emit("event:chat-message", {
        text,
        sender,
        timestamp,
        roomId,
      });
    },
    [socket],
  );

  const joinRoom = useCallback(
    ({ roomId }) => {
      if (!socket) {
        console.log("socket not found");
        return;
      }
      console.log("socket is available");
      console.log("event:join-room", roomId);
      socket.emit("event:join-room", {
        roomId: roomId,
      });
    },
    [socket],
  );

  const sendVisibleFiles = useCallback(
    ({ visibleFiles }) => {
      if (!socket) {
        console.log("socket not available in visible files");
        return;
      }
      console.log("Visible files: ", visibleFiles);
      socket.emit("event:visible-files", {
        visibleFiles,
      });
    },
    [socket],
  );

  const propagateRoomState = useCallback(
    ({ roomId, fileName, code }) => {
      console.log("propagateRoomState() is getting called");
      console.log("roomId: ", roomId);
      console.log("fileName: ", fileName);
      console.log("code: ", code);
      if(socket) {
        socket.emit("event:propagate-room-state", {
          roomId: roomId,
          fileName: fileName,
          code: code,
        });
      }
    },
  );

  useEffect(() => {
    if (!socket) {
      console.log("socket not available");
      return;
    }

    const dataMsg = ({ activeFile, data }) => {
      console.log("dataMsg() is getting called");
      console.log("message from server: ", activeFile, data);

      setLatestData((prev) => {
        return {
          ...prev,
          [activeFile]: {
            code: data,
          },
        };
      });
    };

    const filesMsg = ({ visibleFiles }) => {
      console.log("filesMsg() is getting called");
      console.log("files from server: ", visibleFiles);

      setLatestVisibleFiles(() => {
        return visibleFiles;
      });
    };

    const chatMsg = (message) => {
      console.log("chat message from server: ", message);
      setChatMessages((prev) => [...prev, message]);
    };

    if (socket) {
      console.log("Socket is here");
    }

    socket.on("event:server-message", dataMsg);
    socket.on("event:sync-visible-files", filesMsg);
    socket.on("event:server-chat-message", chatMsg);

    return () => {
      socket.off("event:server-message", dataMsg);
      socket.off("event:sync-visible-files", filesMsg);
      socket.off("event:server-chat-message", chatMsg);
    };
  }, [socket]);

  useEffect(() => {
    let _socket;
    if (user) {
      _socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
        auth: {
          token: user?.id ?? "",
        },
      });
      setSocket(_socket);
    } else {
      toast.error("user not found");
    }

    return () => {
      _socket?.disconnect();
    };
  }, [user]);

  if (!isSignedIn) {
    toast.error("not signed in");
    return null;
  }

  return (
    <>
      <SocketContext.Provider
        value={{
          socket,
          sendMessage,
          latestData,
          latestVisibleFiles,
          sendVisibleFiles,
          joinRoom,
          sendChatMessage,
          chatMessages,
          propagateRoomState,
        }}
      >
        {children}
      </SocketContext.Provider>
    </>
  );
};

export default SocketProvider;
