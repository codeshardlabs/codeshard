import { useRouter } from "next/navigation";
import Profile from "../ui/icons/Profile";
import Code from "../ui/icons/Code";
import JoinRoom from "../ui/icons/JoinRoom";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import clsx from "clsx";

const ItemsList = () => {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  if (!isSignedIn) {
    toast.error("not signed in");
    return null;
  }

  const liItems = [
    {
      content: "View Profile",
      target: `/${user.username.toLowerCase().split(" ").join("-")}`,
    },
    {
      content: "Your Work",
      target: "/your-work",
    },
    {
      content: "Rooms List",
      target: "/rooms-list",
    },
  ];

  const evenLiStyles = ``;
  return (
    <>
      <ul className="rounded-sm flex gap-3 ">
        {liItems.map((item, index) => (
          <li
            key={index}
            onClick={() => {
              router.push(item.target);
            }}
            className={clsx(
              "text-sm px-2 p-1 rounded-sm cursor-pointer",
              index % 2 == 0 &&
                "text-black bg-slate-200 border border-transparent hover:text-white  hover:border-white hover:bg-transparent",
              index % 2 != 0 &&
                "hover:text-black hover:bg-slate-200 border hover:border-transparent text-white  border-white bg-transparent",
            )}
          >
            {item.content}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ItemsList;
