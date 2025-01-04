import { auth } from "@/auth";
import connectToDB from "@/lib/database";
import { User } from "@/models/User";
import WorkCard from "./WorkCard";
import { redirect } from "next/navigation";
import { Fragment } from "react";
import { makeFilesAndDependenciesUIStateLike } from "@/utils";
import { CommentContextProvider } from "@/context/CommentContext";
import { getCommentsOfShard } from "@/lib/actions";

const fetchShards = async (email) => {
  const res = await fetch(`${process.env.HOST_URL}/api/shard?email=${email}`, {
    cache: "no-store",
    next: { tags: ["shards"] },
  });

  const shards = await res.json();

  return shards;
};

async function Work() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const shards = await fetchShards(session?.user.email);
  connectToDB();
  const user = await User.findOne({ email: session?.user.email });

  if (!user) {
    redirect("/login");
  }
  console.log("Shards: ", shards);
  const shardsCollection =
    shards.length > 0
      ? shards.map(async (shard, index) => {
          if (shard.mode === "collaboration") {
            return <Fragment key={index}></Fragment>;
          }

          const [files, dependencies, devDependencies] = shard.isTemplate
            ? makeFilesAndDependenciesUIStateLike(
                shard.files,
                shard.dependencies,
              )
            : [null, null, null];
          const likeStatus = shard.likedBy?.includes(user._id.toString())
            ? "liked"
            : "unliked";
      
          return (
            <CommentContextProvider key={shard._id.toString()}>
              <WorkCard
                likeStatus={likeStatus}
                likes={shard.likedBy?.length ?? 0}
                isTemplate={shard.isTemplate}
                content={{
                  templateType: shard.templateType,
                  files,
                  dependencies,
                  devDependencies,
                }}
                mode={shard.mode}
                type={shard.type}
                title={shard.title}
                id={shard._id.toString()}
              />
            </CommentContextProvider>
          );
        })
      : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {shards.length > 0 ? (
        shardsCollection
      ) : (
        <p className="text-white p-2 col-span-full">No Shards Yet...</p>
      )}
    </div>
  );
}

export default Work;
