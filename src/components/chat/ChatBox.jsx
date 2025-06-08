"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { Minimize2, Maximize2, X } from "lucide-react";
import { Rnd } from "react-rnd";
import { useSocket } from "@/src/hooks/useSocket";

export default function ChatBox({roomId}) {
  const { socket, chatMessages, sendChatMessage } = useSocket();
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  console.log("messages", chatMessages);

 

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const message = {
      text: newMessage,
      sender: user.username, 
      timestamp: new Date().toISOString(),
    };

    console.log("sending chat message", message);
    sendChatMessage({
      ...message,
      roomId: roomId,
    });
    setNewMessage("");
  };

  if (!isVisible) return null;

  return (
    <Rnd
      default={{
        x: window.innerWidth - 400,
        y: window.innerHeight - 400,
        width: 350,
        height: isMinimized ? 40 : 300,
      }}
      minWidth={250}
      minHeight={40}
      maxWidth={window.innerWidth * 0.3}
      maxHeight={window.innerHeight}
      bounds="window"
      dragHandleClassName="drag-handle"
      style={{
        position: 'fixed',
        zIndex: 9999,
      }}
    >
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
        <div className="drag-handle bg-gray-700 p-2 flex justify-between items-center cursor-move">
          <span className="text-white font-medium">Chat</span>
          <div className="flex gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-300 hover:text-white"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-gray-300 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    msg.sender === user.username ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-2 ${
                      msg.sender === user.username
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    <div className="text-xs text-gray-300 mb-1">
                      {msg.sender}
                    </div>
                    <div>{msg.text}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-2 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </Rnd>
  );
} 