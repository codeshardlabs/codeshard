import { redirect } from "next/navigation";
import CollaborativeSandpackEditor from "@/src/components/editor/CollaborativeSandpackEditor";
import { templates } from "@/src/utils";
import { auth } from "@clerk/nextjs/server";
import { createNewRoom, fetchLatestRoomFilesState } from "@/src/lib/actions";
import { logFailureCb, handleFailureCase } from "@/src/lib/utils";



export default async function CollaborativeRoomPage({ params, searchParams }) {
  const { userId } = await auth();
  const roomId = params["roomId"];
  const template = searchParams["template"];
  console.log("Template: ", template);

  if (!userId || !roomId) {
    console.log("session not present");
    redirect("/");
  }

  let shardDetails; 
  if (roomId === "new-room") {
    if (!template || !templates.includes(template)) {
      console.log("Template not valid");
      redirect("/");
    }

    const out = await createNewRoom(userId, {
      templateType: template
    });

    handleFailureCase(out, ["shards", "files"], {
      src: "createNewRoom()"
    }, logFailureCb);

    shardDetails = out.data.shards;
    const files = out.data.files;
    console.log("shard details: ", shardDetails);
    console.log("files: ", files);
    shardDetails.files = files;
  }

  if (roomId !== "new-room") {
    let out = await fetchLatestRoomFilesState(userId, roomId);
    if (!out || out?.error || !out?.data) {
      console.log("could not fetch latest room state: "+ out);
      if(out?.error) console.log("explicit error message: " + out?.error?.message)
        redirect("/your-work");
    }

    let data = out.data;
    shardDetails = data.shard;
  }

  console.log("Shard details: ", shardDetails);

  const { userId: creator, isTemplate, id } = shardDetails;

  return (
    <>
      <CollaborativeSandpackEditor
        shardDetails={JSON.stringify(shardDetails)}
        template={isTemplate ? shardDetails?.templateType : "react"}
        id={shardDetails?.id ?? ""}
        isNewShard={roomId === "new-room"}
      />
    </>
  );
}
