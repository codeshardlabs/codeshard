import WorkCard from "./WorkCard";
import { redirect } from "next/navigation";
import { Fragment } from "react";
import { makeFilesAndDependenciesUIStateLike } from "@/src/utils";
import { CommentContextProvider } from "@/src/context/CommentContext";
import { auth, currentUser } from "@clerk/nextjs/server";

const fetchShards = async (userId) => {
  const res = await fetch(
    `${process.env.HOST_URL}/api/shard?userId=${userId}`,
    {
      cache: "no-store",
      next: { tags: ["shards"] },
    },
  );

  const shards = await res.text();
  console.log("shards: ", shards);

  return shards;
};

async function Work() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/signin");
  }

  const shards = await fetchShards(userId);
  console.log("Shards: ", shards);
  // const shardsCollection =
  //   shards.length > 0
  //     ? shards.map(async (shard, index) => {
  //         const [files, dependencies, devDependencies] =  makeFilesAndDependenciesUIStateLike(
  //               shard.files,
  //               shard.dependencies,
  //             );

  //         return (
  //           <CommentContextProvider key={shard._id.toString()}>
  //             <WorkCard
  //               likeStatus={likeStatus}
  //               likes={shard.likedBy?.length ?? 0}
  //               isTemplate={shard.isTemplate}
  //               content={{
  //                 templateType: shard.templateType,
  //                 files,
  //                 dependencies,
  //                 devDependencies,
  //               }}
  //               mode={shard.mode}
  //               type={shard.type}
  //               title={shard.title}
  //               id={shard._id.toString()}
  //             />
  //           </CommentContextProvider>
  //         );
  //       })
  //     : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {shards.length > 0 ? (
        // <>{JSON.stringify(shards)}</>
        <></>
      ) : (
        <p className="text-white p-2 col-span-full">No Shards Yet...</p>
      )}
    </div>
  );
}

export default Work;
