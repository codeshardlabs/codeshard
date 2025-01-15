import { redirect } from "next/navigation";
import CollaborativeSandpackEditor from "@/src/components/editor/CollaborativeSandpackEditor";
import { formatFilesLikeInDb, templates } from "@/src/utils";
import { SANDBOX_TEMPLATES } from "@/src/templates";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function CollaborativeRoomPage({ params, searchParams }) {
  const {userId} = await auth();
  const user = await currentUser();
  const roomId = params["roomId"];
  console.log("Room id: ", roomId);
  const template = searchParams["template"];
  console.log("Template: ", template);
  connectToDB();
  let shardDetails = null;

  if (!userId || !roomId) {
    console.log("session not present");
    redirect("/");
  }

  if (roomId === "new-room") {
    if (!template || !templates.includes(template)) {
      console.log("Template not valid");
      redirect("/");
    }
    
    // shardDetails = await Shard.create({
    //   creator: session?.user?.name,
    //   type: "private",
    //   mode: "collaboration",
    //   templateType: template,
    //   files: formatFilesLikeInDb(SANDBOX_TEMPLATES[template].files),
    // });

    if (!shardDetails) {
      console.log("could not create shard");
      redirect("/your-work");
    }

    console.log("Id: ", shardDetails?._id);
  }

  if (roomId !== "new-room") {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/room/${roomId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userId}`,
      },
    });
    const responseBody = await response.json();

    let { error, data } = responseBody;
    if (error) {
      console.log("(error) /room/[room-id] page", error.message);
      redirect("/your-work");
    }

    console.log("data: ", data);
    shardDetails = data.shard;
  }

  console.log("Shard details: ", shardDetails);

  const { userId : creator, isTemplate, id } = shardDetails;

  if (session) {
    if (roomId === "new-room" && userId !== creator) {
      console.log("shard is private or collaborative");
      redirect("/");
    }
  }

  return (
    <>
      <CollaborativeSandpackEditor
        shardDetails={JSON.stringify(shardDetails)}
        template={isTemplate ? shardDetails.templateType : "react"}
        id={id.toString() ?? ""}
        isNewShard={roomId === "new-room"}
      
      />
    </>
  );
}
