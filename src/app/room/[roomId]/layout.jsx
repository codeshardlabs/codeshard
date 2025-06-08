import RoomNavbar from "@/src/components/common/RoomNavbar";
import SocketProvider from "@/src/context/SocketContext";
import RoomContextProvider from "@/src/context/RoomContext";

const RoomLayout = ({ children }) => {
  return (
    <div className="bg-black">
      <RoomContextProvider>
        <SocketProvider>
          <RoomNavbar />
          {children}
          </SocketProvider>
      </RoomContextProvider>
    </div>
  );
};

export default RoomLayout;
