import { redirect } from "next/navigation";
import CollaborativeSandpackEditor from "@/src/components/editor/CollaborativeSandpackEditor";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createNewRoom, fetchLatestRoomFilesState, fetchRoomMembers, inviteUserToRoom } from "@/src/lib/actions";
import { logFailureCb, handleFailureCase, templates, RoomRole } from "@/src/lib/utils";



export default async function CollaborativeRoomPage({ params, searchParams }) {
  const { userId } = await auth();
  const user = await currentUser();
  const roomId = params["roomId"];
  const template = searchParams["template"];
  console.log("Template: ", template);

  if (!userId || !roomId) {
    console.log("session not present");
    redirect("/");
  }

  let shardDetails, userRole;
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

    shardDetails = out.data.shards?.[0];
    const files = out.data.files;
    console.log("shard details: ", shardDetails);
    console.log("files: ", files);
    shardDetails.files = files;

    const newRoomId = shardDetails?.id;

    let roomMembersResponse = await fetchRoomMembers(userId, newRoomId);
  if (!roomMembersResponse || roomMembersResponse?.error || !roomMembersResponse?.data) {
    console.log("could not fetch room members: "+ roomMembersResponse);
      if(roomMembersResponse?.error) console.log("explicit error message: " + roomMembersResponse?.error?.message || "could not fetch room members")
      redirect("/");
  }

  console.log("members: ", roomMembersResponse.data);
    // Member type => [{id: number, userId: string, roomId: number, role : enum<'owner', 'editor', 'viewer'>}]
    let members = roomMembersResponse.data.members ?? [];
    const isOwner = members.some(member => member.userId === userId && member.role === RoomRole.OWNER);

    if(isOwner) {
      // user is already an owner of the room, redirect to the room
      redirect(`/room/${newRoomId}`);
    }
      else {
        // user is not an owner of the room, add them as an owner
      const out = await inviteUserToRoom(userId, newRoomId, user.primaryEmailAddress?.emailAddress ?? "", RoomRole.OWNER);
      if(out?.error) {
        console.log("error occurred in inviteUserToRoom: ", out);
        redirect("/");
      }

      userRole = RoomRole.OWNER;
    }
  }

  if (roomId !== "new-room") {
    let out = await fetchLatestRoomFilesState(userId, roomId);
    if (!out || out?.error || !out?.data) {
      console.log("could not fetch latest room state: "+ out);
      if(out?.error) console.log("explicit error message: " + out?.error?.message)
        redirect("/");
    }

    let data = out.data;
    shardDetails = data.shard;

    let roomMembersResponse = await fetchRoomMembers(userId, roomId);
  if (!roomMembersResponse || roomMembersResponse?.error || !roomMembersResponse?.data) {
    console.log("could not fetch room members: "+ roomMembersResponse);
      if(roomMembersResponse?.error) console.log("explicit error message: " + roomMembersResponse?.error?.message || "could not fetch room members")
      redirect("/");
  }

  console.log("members: ", roomMembersResponse.data);
    // Member type => [{id: number, userId: string, roomId: number, role : enum<'owner', 'editor', 'viewer'>}]
    let members = roomMembersResponse.data.members ?? [];
    const isMember = members.some(member => member.userId === userId);

    if(shardDetails?.userId === userId && !isMember) {
      // user is the creator of the room and not a member yet, add them as a "owner"
      const out = await inviteUserToRoom(userId, roomId, user.primaryEmailAddress?.emailAddress ?? "", RoomRole.OWNER);
      if(out?.error) {
        console.log("error occurred in inviteUserToRoom: ", out);
        redirect("/");
      }
      userRole = RoomRole.OWNER;
    }
    else if (!isMember && shardDetails?.userId !== userId) {
      // user is not a member of the room and is not the creator of the room, redirect to the home page
      redirect("/");
    }
    else if(isMember) {
      userRole = members.find(member => member.userId === userId)?.role ?? 'undefined';
    }
  }

  console.log("Shard details: ", shardDetails);
  console.log("User role: ", userRole);

  return (
    <>
      <CollaborativeSandpackEditor
        shardDetails={JSON.stringify(shardDetails)}
        template={shardDetails?.templateType}
        id={shardDetails?.id ?? ""}
        isNewShard={roomId === "new-room"}
        userRole={userRole}
      />
    </>
  );
}
