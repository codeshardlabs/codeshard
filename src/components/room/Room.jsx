import { RoomProvider } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { ScaleLoader } from "react-spinners";

export default function Room({ roomId, children }) {
  const x = `${roomId}` ?? "nextjs-liveblocks";

  return (
    <>
      <RoomProvider
        id={x}
        initialPresence={{
          cursor: null,
        }}
      >
        <ClientSideSuspense
          fallback={
            <div className="text-black flex h-screen w-screen items-center justify-center">
              <ScaleLoader
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          }
        >
          {() => children}
        </ClientSideSuspense>
      </RoomProvider>
    </>
  );
}
