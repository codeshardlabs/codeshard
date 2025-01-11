import { redirect } from "next/navigation";
import SandpackEditor from "@/src/components/editor/SandpackEditor";
import { auth } from "@clerk/nextjs/server";

export default async function NewShardPage({ params }) {
  const { userId } = await auth();
  const shardId = params["shard-id"];
  console.log("Shard id: ", shardId);
  connectToDB();

  if (!userId) {
    console.log("user not present");
    redirect("/");
  }

  let shardDetails = await Shard.findOne({ _id: shardId }).lean();
  if (!shardDetails) {
    console.log("shard id not valid");
    redirect("/");
  }
  console.log("Shard details: ", shardDetails);

  const { templateType, type, creator, _id, mode } = shardDetails;

  if (
    session?.user?.name !== creator &&
    (type === "private" || mode === "collaboration")
  ) {
    console.log("shard is private or collaborative");
    redirect("/");
  }

  return (
    <>
      <SandpackEditor
        shardDetails={JSON.stringify(shardDetails)}
        template={templateType ?? "react"}
        shard={true}
        id={_id.toString() ?? null}
      />
    </>
  );
}
