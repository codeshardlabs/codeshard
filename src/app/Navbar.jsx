"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Button from "@/src/components/ui/Button";
import Avatar from "react-avatar";
import Plus from "@/src/components/ui/icons/Plus";
import ArrowDown from "@/src/components/ui/icons/ArrowDown";
import Code from "@/src/components/ui/icons/Code";
import JoinRoom from "@/src/components/ui/icons/JoinRoom";
import Cloud from "@/src/components/ui/icons/Cloud";
import Drawer from "@mui/material/Drawer";
import SideDrawer from "@/src/components/SideDrawer";
import { useModal } from "@/src/customHooks/useModal";
import Close from "@/src/components/ui/icons/Close";
import styles from "./PgModal.module.css";
import clsx from "clsx";
import { templates } from "@/src/utils";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isJoinRoomModalOpen, setIsJoinRoomOpen] = useState(false);
  const [pgModalOpen, setPgModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [roomOpen, setRoomOpen] = useState(false);
  const [roomInput, setRoomInput] = useState("");
  const modal = useRef();
  const joinModal = useRef();
  const pgModalRef = useRef();
  useModal(pgModalOpen, setPgModalOpen, pgModalRef);

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

  const onAvatarClick = () => {
    setIsDrawerOpen((prev) => !prev);
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
              <div
                className="text-white border p-2 cursor-pointer hover:opacity-65"
                onClick={() => {
                  const roomRoute = `/room/new-room?template=${template}`;
                  const shardRoute = `/shard/template/${template}`;
                  const tryEditorRoute = `/try-editor/${template}`;
                  const routeToPushTo = session
                    ? roomOpen
                      ? roomRoute
                      : shardRoute
                    : tryEditorRoute;
                  router.push(routeToPushTo);
                }}
                key={template}
              >
                <p className="text-xl">{template}</p>
              </div>
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
        className="text-xs p-2 z-50 rounded-md absolute flex flex-col right-[3.7rem] text-black top-14 cursor-pointer bg-white"
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
        <Drawer
          anchor={"right"}
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        >
          <SideDrawer />
        </Drawer>
        {!session && (
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
        )}

        {session ? (
          <>
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

            {/* <Link href="/your-work"> */}
            <button onClick={onAvatarClick}>
              <Avatar name={session.user?.name} round={true} size="40" />
            </button>
            {/* </Link> */}
          </>
        ) : (
          <>
            {/* <Link className="cursor-pointer bg-[#47cf73] hover:bg-[#248C46] text-black px-2 py-2 rounded-md text-sm" href="/register">Signup</Link> */}
            <Button onClick={() => router.push("/register")} type="primary">
              Signup
            </Button>
            {/* <Link className="hover:text-slate-300 text-sm cursor-pointer" href="/login">Signin</Link> */}
            <Button type="outline" onClick={() => router.push("/login")}>
              Login
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
