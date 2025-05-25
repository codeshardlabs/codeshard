import { redirect } from "next/navigation";
import SandpackEditor from "@/src/components/editor/SandpackEditor";
import { auth, currentUser } from "@clerk/nextjs/server";
import { fetchShardById } from "@/src/lib/actions";
import { handleFailureCase, logFailureCb } from "@/src/lib/utils";


export default async function NewShardPage({ params }) {
  const { userId } = await auth();
  const user = await currentUser();
  const shardId = params["shard-id"];
  console.log("Shard id: ", shardId);

  if (!userId || !shardId) {
    console.log("user or shard not present");
    redirect("/");
  }

 const out =  await fetchShardById(userId, shardId);
 handleFailureCase(out, ["shard"], {src: "fetchShardById()", redirectUri: "/"}, logFailureCb);
  let shardDetails = out.data.shard;
  console.log("Shard details: ", shardDetails);
  const { templateType, userId: creator, id } = shardDetails;

  if (userId !== creator) {
    console.log("shard is private or collaborative");
    redirect("/");
  }

  return <SandpackEditor
        shardDetails={JSON.stringify(shardDetails)}
        template={templateType}
        shard={true}
        id={id}
      />
}
