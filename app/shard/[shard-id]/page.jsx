import { Shard } from "@/models/Shard";
import ShardNavbar from "./ShardNavbar";
import connectToDB from "@/lib/database";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SandpackEditor from "@/components/SandpackEditor";

export default async function NewShardPage({ params }) {
  const session = await auth();
  const shardId = params["shard-id"];
  console.log("Shard id: ", shardId);
  connectToDB();
  

  if (!session) {
    console.log("session not present");
    redirect("/");
  }

  
  let shardDetails = await Shard.findOne({ _id: shardId }).lean();
  if (!shardDetails) {
    console.log("shard id not valid");
    redirect("/");
  }
    console.log("Shard details: ", shardDetails);

  const {  templateType, type, creator, _id, mode } =
    shardDetails;

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
