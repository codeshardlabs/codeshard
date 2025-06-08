import WorkCard from "./WorkCard";
import { redirect } from "next/navigation";
// import { CommentContextProvider } from "@/src/context/CommentContext";
import { auth, currentUser } from "@clerk/nextjs/server";
import { fetchShards } from "@/src/lib/actions";
import { handleFailureCase, throwFailureCb, makeFilesAndDependenciesUIStateLike, GlobalConstants} from "@/src/lib/utils";
import { Fragment } from "react";
const fetchShardsByUserId = async (userId, limit=10, offset=0) => {
  try {

    const out = await fetchShards(userId, limit, offset);
    handleFailureCase(out, ["shards"], {src: "fetchShards()"}, throwFailureCb);
    return out.data.shards;
  } catch (error) {
    console.log("error in fetching shards: ", error);
    return [];
  }
};

async function Work() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  const shards = await fetchShardsByUserId(userId, GlobalConstants.GET_REQUEST_DEFAULT_LIMIT, GlobalConstants.GET_REQUEST_DEFAULT_OFFSET);
  console.log("Shards: ", shards);
  if (shards.length == 0) {
    return <>No Shards Yet...</>;
  }
  const shardsCollection = shards.map((shard) => {
    const [files, dependencies, devDependencies] =
      makeFilesAndDependenciesUIStateLike(shard.files, shard.dependencies);

    // const ind = shard.likes.findIndex(
    //   (temp) => temp.shardId === shard.id && temp.likedBy === userId,
    // );
    // let likeStatus = ind === -1 ? "unliked" : "liked";

    return (
      // <CommentContextProvider key={shard.id}>
      <Fragment key={shard.id}>
        <WorkCard
          // likeStatus={likeStatus}
          // likes={shard.likes.length}
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
          id={shard.id}
        />
      </Fragment>
    //   </CommentContextProvider> 
    );
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {shardsCollection}
    </div>
  );
}

export default Work;
