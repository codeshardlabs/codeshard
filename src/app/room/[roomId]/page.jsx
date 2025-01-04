import connectToDB from "@/src/lib/database";
import { Shard } from "@/src/models/Shard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CollaborativeSandpackEditor from "@/src/components/CollaborativeSandpackEditor";
import { formatFilesLikeInDb, templates } from "@/src/utils";
import { SANDBOX_TEMPLATES } from "@/src/templates";

export default async function CollaborativeRoomPage({ params, searchParams }) {
  const session = await auth();
  const roomId = params["roomId"];
  console.log("Room id: ", roomId);
  const template = searchParams["template"];
  console.log("Template: ", template);
  connectToDB();
  let shardDetails = null;

  if (!session || !roomId) {
    console.log("session not present");
    redirect("/");
  }

  if (roomId === "new-room") {
    if (!template || !templates.includes(template)) {
      console.log("Template not valid");
      redirect("/");
    }
    shardDetails = await Shard.create({
      creator: session?.user?.name,
      type: "private",
      mode: "collaboration",
      templateType: template,
      files: formatFilesLikeInDb(SANDBOX_TEMPLATES[template].files),
    });

    if (!shardDetails) {
      console.log("could not create shard");
      redirect("/your-work");
    }

    console.log("Id: ", shardDetails?._id);
  }

  if (roomId !== "new-room") {
    shardDetails = await Shard.findOne({ _id: roomId });
    if (!shardDetails) {
      console.log("shard details not present");
      redirect("/your-work");
    }
  }

  console.log("Shard details: ", shardDetails);

  const { creator, isTemplate, _id } = shardDetails;

  if (session) {
    if (roomId === "new-room" && session?.user?.name !== creator) {
      console.log("shard is private or collaborative");
      redirect("/");
    }
  }

  return (
    <>
      <CollaborativeSandpackEditor
        shardDetails={JSON.stringify(shardDetails)}
        template={isTemplate ? shardDetails.templateType : "react"}
        id={_id.toString() ?? ""}
        isNewShard={roomId === "new-room"}
      />
    </>
  );
}
