import { useRouter } from "next/navigation";
// import Profile from "../ui/icons/Profile";
import Code from "../ui/icons/Code";
import JoinRoom from "../ui/icons/JoinRoom";
import { useUser } from "@clerk/nextjs";

const ItemsList = () => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <>
      <ul className="p-4 flex">
        {/* <li
          onClick={() => {
            let name = session?.user?.name;

            router.push(`/${name.toLowerCase().split(" ").join("-")}`);
          }}
          className="text-sm flex gap-2 items-center px-2 p-1 rounded-md cursor-pointer hover:bg-slate-200"
        >
          <Profile className="size-3" /> View Profile
        </li> */}
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
      </ul>
    </>
  );
};

export default ItemsList;
