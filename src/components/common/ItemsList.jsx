import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isRoomPath } from "@/src/lib/utils";

const ItemsList = () => {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  if (!isSignedIn) {
    toast.error("not signed in");
    return null;
  }
  

  const liItems = [
    // {
    //   content: "View Profile",
    //   target: `/${userId}`,
    // },
    {
      content: "Your Work",
      target: "/your-work",
    },
    {
      content: "Rooms List",
      target: "/rooms-list",
    },
    {
      content: "Create Assignment",
      target: "/create-assignment",
    },
    {
      content: "View Assignments",
      target: "/assignments",
    },
  ];

  const isRoomPathFlag = isRoomPath(pathname);

   return (
    <>
      <ul className="rounded-sm flex gap-3">
        {!isRoomPathFlag && liItems.map((item, index) => (
          <Link
            key={index}
            href={item.target}
            className={
              clsx(
                "text-md px-2 p-1 rounded-sm cursor-pointer",
                "text-white bg-gray-800 border border-transparent hover:bg-gray-700 hover:border-gray-600"
              )
            }
          >
            {item.content}
          </Link>
        ))}
      </ul>
    </>
  );
};

export default ItemsList;
