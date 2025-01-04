import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import Avatar from "react-avatar";
import Profile from "./ui/icons/Profile";
import Code from "./ui/icons/Code";
import JoinRoom from "./ui/icons/JoinRoom";
import { signOutHandler } from "@/src/lib/actions";

const SideDrawer = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/login");
    return;
  }
  return (
    <>
      <ul className="p-4 w-[15vw]   flex flex-col ">
        <li className="flex items-center gap-2 border-b border-slate-300 pb-2 mb-2">
          <Avatar size="30" round={true} name={session?.user?.name} />{" "}
          <em>{session?.user?.name} </em>
        </li>
        <li
          onClick={() => {
            let name = session?.user?.name;

            router.push(`/${name.toLowerCase().split(" ").join("-")}`);
          }}
          className="text-sm flex gap-2 items-center px-2 p-1 rounded-md cursor-pointer hover:bg-slate-200"
        >
          <Profile className="size-3" /> View Profile
        </li>
        <li
          onClick={() => router.push("/your-work")}
          className="text-sm flex gap-2 items-center px-2 p-1 rounded-md cursor-pointer hover:bg-slate-200"
        >
          <Code className={"size-4 fill-black"} /> Your Work
        </li>
        <li
          onClick={() => router.push("/rooms-list")}
          className=" text-sm flex gap-2 items-center px-2 p-1 rounded-md cursor-pointer hover:bg-slate-200"
        >
          <JoinRoom className={"size-3"} /> Rooms List
        </li>
        <li
          onClick={async () => await signOutHandler()}
          className="border-t border-slate-300 mt-2 text-md cursor-pointer p-2"
        >
          Signout
        </li>
      </ul>
    </>
  );
};

export default SideDrawer;
