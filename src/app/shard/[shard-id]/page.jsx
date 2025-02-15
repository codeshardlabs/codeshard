import { redirect } from "next/navigation";
import SandpackEditor from "@/src/components/editor/SandpackEditor";
import { auth, currentUser } from "@clerk/nextjs/server";
import { fetchShardById, handleFailureCase } from "@/src/lib/actions";

export default async function NewShardPage({ params }) {
  const { userId } = await auth();
  const user = await currentUser();
  const shardId = params["shard-id"];
  console.log("Shard id: ", shardId);

  if (!userId) {
    console.log("user not present");
    redirect("/");
  }

 const out =  await fetchShardById(userId, shardId);
 handleFailureCase()
  // let shardDetails = await db.query.shards.findFirst({
  //   where: (shards) =>
  //     and(
  //       eq(shards.id, shardId),
  //       eq(shards.type, "public"),
  //       eq(shards.mode, "normal"),
  //     ),
  //   with: {
  //     files: true,
  //     dependencies: true,
  //   },
  // });
  if (!shardDetails) {
    console.log("shard id not valid");
    redirect("/");
  }
  console.log("Shard details: ", shardDetails);

  const { templateType, userId: creator, id } = shardDetails;

  if (userId !== creator) {
    console.log("shard is private or collaborative");
    redirect("/");
  }

  return (
    <>
      <SandpackEditor
        shardDetails={JSON.stringify(shardDetails)}
        template={templateType}
        shard={true}
        id={id}
      />
    </>
  );
}
