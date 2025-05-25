import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import clsx from "clsx";
import Link from "next/link";

const ItemsList = () => {
  const { isSignedIn } = useUser();
  const { userId } = useAuth();
  const router = useRouter();
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
  ];

  const evenLiStyles = ``;
  return (
    <>
      <ul className="rounded-sm flex gap-3 ">
        {liItems.map((item, index) => (
          <Link
            key={index}
            href={item.target}
            className={
              clsx(
              "text-md px-2 p-1 rounded-sm cursor-pointer",
              "text-black bg-slate-200 border border-transparent hover:text-white  hover:border-white hover:bg-transparent"
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
