"use client";

import { io } from "socket.io-client";

import {
  createContext,
  useCallback,
  useState,
  useEffect,
  useContext,
} from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

const SocketContext = createContext(null);

export const useSocket = () => {
  const state = useContext(SocketContext);

  if (!state) {
    throw new Error("Socket state not found");
  }

  return state;
};

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const [latestData, setLatestData] = useState({});
  const [latestVisibleFiles, setLatestVisibleFiles] = useState([]);
  const { user, isSignedIn } = useUser();
  if (!isSignedIn) {
    toast.error("not signed in");
    return null;
  }
  const username = isSignedIn ? user.username : "";

  const sendMessage = useCallback(
    ({ activeFile, data, roomId }) => {
      console.log("Sending message: ", activeFile, data);

      if (!socket) {
        console.log("socket not found");
      }
      if (socket) {
        console.log("socket is available");
        socket.emit("event:message", {
          activeFile: activeFile,
          data: data,
          roomId: roomId,
        });
      }
    },
    [socket],
  );

  const joinRoom = useCallback(
    ({ roomId }) => {
      if (!socket) {
        console.log("socket not found");
      }
      if (socket) {
        console.log("socket is available");
        console.log("event:join-room", roomId);
        socket.emit("event:join-room", {
          roomId: roomId,
        });
      }
    },
    [socket],
  );

  const sendVisibleFiles = useCallback(
    ({ visibleFiles }) => {
      console.log("Visible files: ", visibleFiles);

      if (!socket) {
        console.log("socket not available in visible files");
        return;
      }

      socket.emit("event:visible-files", {
        visibleFiles,
      });
    },
    [socket],
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

    if (socket) {
      console.log("Socket is here");
    }

    socket.on("event:server-message", dataMsg);
    socket.on("event:sync-visible-files", filesMsg);

    return () => {
      socket.off("event:server-message", dataMsg);
      socket.off("event:sync-visible-files", filesMsg);
    };
  }, [socket]);

  useEffect(() => {
    let _socket;
    if (username) {
      _socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
        auth: {
          token: username,
        },
      });
      setSocket(_socket);
    } else {
      toast.error("username not found");
    }

    return () => {
      _socket?.disconnect();
    };
  }, [username]);

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
        }}
      >
        {children}
      </SocketContext.Provider>
    </>
  );
};

export default SocketProvider;
