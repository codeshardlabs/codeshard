"use server";

import { updateShard } from "./actions";
import { toast } from "sonner";

export async function updateShardTitle(userId, shardId, newTitle) {
  try {
    const res = await updateShard(userId, shardId, {
      title: newTitle
    });
    
    if (res.error) {
      toast.error("Could not save shard name");
      return false;
    }
    return true;
  } catch (err) {
    console.log("could not save shard name");
    return false;
  }
} 