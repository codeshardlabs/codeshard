"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Button from "../ui/Button";
import Plus from "../ui/icons/Plus";
import ArrowDown from "../ui/icons/ArrowDown";
import Code from "../ui/icons/Code";
import JoinRoom from "../ui/icons/JoinRoom";
import Cloud from "../ui/icons/Cloud";
import { useModal } from "../../hooks/useModal";
import Close from "../ui/icons/Close";
import styles from "../../app/PgModal.module.css";
import clsx from "clsx";
import { templates } from "../../utils";
import { useAuth } from "@clerk/nextjs";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import ItemsList from "./ItemsList";

export default function Navbar() {
  const { userId } = useAuth();
  const router = useRouter();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isJoinRoomModalOpen, setIsJoinRoomOpen] = useState(false);
  const [roomOpen, setRoomOpen] = useState(false);
  const [roomInput, setRoomInput] = useState("");
  const [pgModalOpen, setPgModalOpen] = useState(false);
  const pgModalRef = useRef();
 useModal(pgModalOpen, setPgModalOpen, pgModalRef);
  const modal = useRef();
  const joinModal = useRef();

  useEffect(() => {
    const handleBodyClick = (e) => {
      if (isPopoverOpen && modal.current && !modal.current.contains(e.target)) {
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener("click", handleBodyClick);
    return () => {
      document.removeEventListener("click", handleBodyClick);
    };
  }, [isPopoverOpen]);

  useEffect(() => {
    const handleBodyClick = (e) => {
      if (
        isJoinRoomModalOpen &&
        joinModal.current &&
        !joinModal.current.contains(e.target)
      ) {
        setIsJoinRoomOpen(false);
      }
    };

    document.addEventListener("click", handleBodyClick);
    return () => {
      document.removeEventListener("click", handleBodyClick);
    };
  }, [isJoinRoomModalOpen]);

  const joinRoom = () => {
    if (!roomInput) {
      return;
    }

    router.push(`/room/${roomInput}`);
  };

  let PgModal = () => (
    <>
      <dialog
        onClose={() => setPgModalOpen(false)}
        className={clsx(
          "flex flex-col gap-5 w-[90%] h-[75vh absolute left-3 top-12 z-40 p-4 py-8   bg-[#090C08]",
          styles.container,
        )}
        ref={pgModalRef}
      >
        <button
          onClick={() => setPgModalOpen(false)}
          className="self-end border border-transparent p-1 hover:opacity-60 hover:border-white hover:rounded-md"
        >
          <Close className="fill-black size-4" />
        </button>
        <div className="grid grid-cols-5 gap-16">
          {templates.map((template) => {
            return (
              <Link
                className="text-white border text-xl p-2 cursor-pointer hover:opacity-65"
                href={(function () {
                  const roomRoute = `/room/new-room?template=${template}`;
                  const shardRoute = `/shard/template/${template}`;
                  const tryEditorRoute = `/try-editor/${template}`;
                  const routeToPushTo = userId
                    ? roomOpen
                      ? roomRoute
                      : shardRoute
                    : tryEditorRoute;
                  // router.push(routeToPushTo);
                  return routeToPushTo;
                })()}
                key={template}
              >
                {template}
              </Link>
            );
          })}
        </div>
      </dialog>
    </>
  );

  

  let codeModal = (
    <>
      <ul
        ref={modal}
        className="text-xs p-2 z-50 rounded-md absolute flex flex-col right-[3rem] text-black top-14 cursor-pointer bg-white"
      >
        <li
          onClick={() => {
            setPgModalOpen(true);
          }}
          className="bg-white px-2 p-1  flex gap-2 hover:bg-slate-200"
        >
          <Code className={"size-4 fill-white"} /> New Shard
        </li>
        <li
          onClick={() => {
            setPgModalOpen(true);
            setRoomOpen(true);
          }}
          className="bg-white px-2 p-1 flex gap-2 hover:bg-slate-200"
        >
          <Cloud className={"size-4"} /> New Room
        </li>
        <li
          onClick={() => {
            setIsPopoverOpen(false);
            setIsJoinRoomOpen(true);
          }}
          className="bg-white px-2 p-1 flex gap-2 hover:bg-slate-200"
        >
          <JoinRoom className={" size-4"} /> Join Room
        </li>
      </ul>
    </>
  );

  let joinRoomModal = (
    <div
      ref={joinModal}
      className="flex border border-white/20 w-[400px] flex-col gap-6 bg-black/95 p-8 z-50 rounded-lg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl backdrop-blur-sm"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Join Room</h1>
        <p className="text-sm text-gray-400">Enter a room ID to join an existing collaborative session</p>
      </div>
      
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="roomId" className="text-sm text-gray-300">Room ID</label>
          <input
            id="roomId"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            placeholder="Enter room ID..."
            className="h-10 rounded-md bg-gray-800 border border-gray-700 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            type="text"
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button 
            onClick={() => setIsJoinRoomOpen(false)}
            className="bg-transparent hover:bg-gray-800 text-gray-400"
          >
            Cancel
          </Button>
          <Button 
            onClick={joinRoom}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!roomInput}
          >
            Join Room
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="flex mx-2 my-4  gap-4 items-center justify-between text-sm">
      <h1 className="text-2xl">
        <Link href="/">CODESHARD</Link>
      </h1>

      <div className="flex gap-3 items-center">
        <SignedOut>
          <SignInButton className="bg-white text-black p-2 rounded-sm hover:bg-gray-200" />
          <>
            {pgModalOpen && (
              <>
                <PgModal />
              </>
            )}
            <Button
              type="outline"
              onClick={() => {
                console.log("user clicked");
                setPgModalOpen(true);
              }}
            >
              Try Editor
            </Button>
          </>
        </SignedOut>
        <SignedIn>
          <>
            <ItemsList />
            <Button onClick={() => setIsPopoverOpen(true)} type="outline">
              <Plus className="size-3 fill-white" />{" "}
              <ArrowDown className="fill-white size-4" />
            </Button>
            {isPopoverOpen && <>{codeModal}</>}
            {isJoinRoomModalOpen && <>{joinRoomModal}</>}
            {pgModalOpen && (
              <>
                <PgModal sessionModal />
              </>
            )}
            <UserButton />
          </>
        </SignedIn>
      </div>
    </div>
  );
}
