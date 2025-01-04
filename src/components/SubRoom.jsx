import { RoomProvider } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";

export default function SubRoom({ roomId, id, children }) {
  const x = `${roomId}-${id}` ?? "nextjs-liveblocks-sub-room";
  return (
    <>
      <RoomProvider
        id={x}
        initialPresence={{
          cursor: null,
        }}
      >
        <ClientSideSuspense fallback={<p className="text-black">Loading...</p>}>
          {() => children}
        </ClientSideSuspense>
      </RoomProvider>
    </>
  );
}
