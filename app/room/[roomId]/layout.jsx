import SocketProvider from "@/context/SocketContext";

const RoomLayout = ({ children }) => {
  return <div className="w-full h-screen bg-white">
    <SocketProvider>
    {children}
    </SocketProvider>
  </div>;
};

export default RoomLayout;
