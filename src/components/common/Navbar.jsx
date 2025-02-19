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
      className="flex border border-white w-[30vw] flex-col gap-4 bg-black p-4 z-20 rounded-md absolute left-1/3 top-1/3"
    >
      <h1 className="text-xl">Enter Room ID: </h1>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          className="h-8 rounded-md text-black caret-black"
          type="text"
        />
        <Button onClick={joinRoom} className={"self-end w-fit"}>
          Join
        </Button>
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
