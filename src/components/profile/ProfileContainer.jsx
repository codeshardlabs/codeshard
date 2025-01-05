import { makeFilesAndDependenciesUIStateLike } from "@/src/utils";
import { CommentContextProvider } from "@/src/context/CommentContext";
import ProfileCard from "./ProfileCard";
import { Fragment } from "react";

function ProfileContainer({ shards, id: userId }) {
  console.log("Shards from profile: ", shards);

  const shardsCollection =
    shards.length > 0
      ? shards.map((shard, index) => {
          if (shard.mode === "collaboration") {
            return <Fragment key={index}></Fragment>;
          }

          const [files, dependencies, devDependencies] = shard.isTemplate
            ? makeFilesAndDependenciesUIStateLike(
                shard.files,
                shard.dependencies,
              )
            : [null, null, null];
          const likeStatus = shard.likedBy?.includes(userId)
            ? "liked"
            : "unliked";

          return (
            <CommentContextProvider key={shard._id.toString()}>
              <ProfileCard
                creator={shard.creator}
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

export default ProfileContainer;
