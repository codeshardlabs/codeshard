"use server";
import { HttpMethod } from "../utils/enums";
import { redirect } from "next/navigation";
import { protectedRouteHeaders, jsonify } from "./utils";
import { auth } from "@clerk/nextjs/server";
const apiOrigin = process.env.NEXT_PUBLIC_BACKEND_URL;
const apiVersion = "v1";
let backendEndpoint = `${apiOrigin}/api/${apiVersion}`;
  

/**************************************USER ROUTES ******************************/

export async function getUserInfo(userId) {
    try {
        let url = `${backendEndpoint}/users/${userId}`;
        const res = await fetch(url, {
            method: HttpMethod.Get
        });
    
        return await res.json();
    }
        catch (error) {
            console.log("error occurred in saveUserMetadata", error)
            return null;
        }
}

export async function followUser(userId, userToBeFollowed) {
    let url = `${backendEndpoint}/users/${userToBeFollowed}/follow`;
    try {
        const res = await fetch(url, {
            method: HttpMethod.Post,
            headers: protectedRouteHeaders(userId)
        });
        return await res.json();
    }
    catch (error) {
        console.log("error occurred in followUser", error)
        return null;
    }
}

export async function unfollowUser(userId, userToBeUnfollowed) {
    let url = `${backendEndpoint}/users/${userToBeUnfollowed}/follow`;
    try {
        const res = await fetch(url, {
            method: HttpMethod.Delete,
            headers: protectedRouteHeaders(userId)
        });
        return await res.json();
    }
    catch (error) {
        console.log("error occurred in unfollowUser", error)
        return null;
    }
}


export async function saveUserMetadata(userId) {
   try {
    let url = `${backendEndpoint}/users`;
    const res = await fetch(url, {
        method: HttpMethod.Post,
        body: jsonify({
            id: userId
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    return await res.json();
}
    catch (error) {
        console.log("error occurred in saveUserMetadata", error)
        return null;
    }
}

/************************************SHARD ROUTES *******************************/

export async function createShard(userId, content) {
    try {
        const res = await fetch(`${backendEndpoint}/shards`,{
            method: HttpMethod.Post,
            body: jsonify({
                templateType: content.templateType,
                mode: content.mode,
                type: content.type
            }),
            headers: protectedRouteHeaders(userId, true)
        });
        return await res.json();

    } catch (error) {
        console.log("error occured in getComments", error)
        return null;
    }
}

export async function fetchShards(userId, limit=10, offset=0) {
    //protected route
    let url = new URL(`${backendEndpoint}/shards`);
    url.searchParams.append("limit", limit);
    url.searchParams.append("offset", offset);
    try {
        const res = await fetch(url.toString(), {
            method: HttpMethod.Get,
            headers: protectedRouteHeaders(userId)
        });
        return await res.json();

    } catch (error) {
        console.log("error occured in fetchShards", error)
        return null;
    }
}

export async function saveShard(userId, shardId, content) {
    // protected route
    let url = `${backendEndpoint}/shards/${shardId}`;
    try {
        const res = await fetch(url, {
            method: HttpMethod.Put,
            body: jsonify(formatSaveShardBody(content, shardId)),
            headers: protectedRouteHeaders(userId, true)
        });

        return await res.json();

    } catch (error) {
        console.log("error occurred in saveShard", error)
        return null;
    }
}

export async function makeRequestToCodingAssistant(userId, shardId, query) {
    // protected route
    let url = `${backendEndpoint}/shards/${shardId}/assistant`;
    try {
        const res = await fetch(url, {
            method: HttpMethod.Post,
            body: jsonify({
                query: query
            }),
            headers: protectedRouteHeaders(userId, true)
        });

        return await res.json();

    } catch (error) {
        console.log("error occurred in saveShard", error)
        return null;
    }
}

function formatSaveShardBody(content, shardId) {
    const files = Object.keys(content?.files ?? {}).map((file) => {
        return {
            name: file,
            code: content.files[file].code,
        }
    })

    const dependencies = Object.keys(content?.dependencies ?? {}).map((dependency) => {
            return {
                name: dependency,
                version: content.dependencies[dependency] ?? "latest",
                isDevDependency: false,
                shardId: shardId
            }
    })

    const devDependencies = Object.keys(content?.devDependencies ?? {}).map((dependency) => {
        return {
            name: dependency,
            version: content.devDependencies[dependency] ?? "latest",
            isDevDependency: true,
            shardId: shardId
        }
    })

    return {
        files,
        dependencies: [...dependencies, ...devDependencies],
    }
}

export async function fetchShardById(userId, shardId) {
    //protected route
    let url = `${backendEndpoint}/shards/${shardId}`;
    try {
        const res = await fetch(url, {
            method: HttpMethod.Get,
            headers: protectedRouteHeaders(userId)
        });
        return await res.json();

    } catch (error) {
        console.log("error occured in fetchShardById", error)
        return null;
    }
}

export async function deleteShardById(userId, shardId) {
    let url = `${backendEndpoint}/shards/${shardId}`;
    try {
        const res = await fetch(url, {
            method: HttpMethod.Delete,
            headers: protectedRouteHeaders(userId)
        });
        return await res.json();

    } catch (error) {
        console.log("error occured in deleteShardById", error)
        return null;
    }
}

export async function updateShard(userId, shardId, content) {
    let title = content.title;
    let type = content.type;
    let url = new URL(`${backendEndpoint}/shards/${shardId}`);
    if(title) url.searchParams.append("title", title);
    if(type) url.searchParams.append("type", type);

    try {
        const res = await fetch(url.toString(), {
            method: HttpMethod.Patch,
            headers: protectedRouteHeaders(userId)
        });
        return await res.json();

    } catch (error) {
        console.log("error occured in updateShard", error)
        return null;
    }
}

export async function getComments(userId, shardId, limit=10, offset=0) {
    let url = new URL(`${backendEndpoint}/shards/${shardId}/comments`);
    url.searchParams.append("limit", limit);
    url.searchParams.append("offset", offset);

    try {
        const res = await fetch(url.toString(), {
            method: HttpMethod.Get,
            headers: protectedRouteHeaders(userId)
        });
        return await res.json();

    } catch (error) {
        console.log("error occured in getComments", error)
        return null;
    }
}

export async function addComment(userId, shardId, content) {
    let url =`${backendEndpoint}/shards/${shardId}/comments`;
   
if(message === "") throw new Error("message string empty");
    try {
        const res = await fetch(url, {
            method: HttpMethod.Post,
            body: jsonify({
                message: content.message,
                shardId: shardId
            }),
            headers: protectedRouteHeaders(userId, true)
        });
        return await res.json();

    } catch (error) {
        console.log("error occured in addComment", error)
        return null;
    }
}

export async function likeShard(userId,shardId) {
    try {
        const res = await fetch(`${backendEndpoint}/shards/${shardId}/likes`, {
            method: HttpMethod.Post,
            headers: protectedRouteHeaders(userId)
        })
        return await res.json();

    } catch (error) {
        console.log("error occured in likeShard", error)
        return null;
    }
}


export async function dislikeShard(userId,shardId) {
    try {
        const res = await fetch(`${backendEndpoint}/shards/${shardId}/likes`, {
            method: HttpMethod.Delete,
            headers: protectedRouteHeaders(userId)
        });

        return await res.json();

    } catch (error) {
        console.log("error occured in dislikeShard", error)
        return null;
    }
}


/**************************COMMENT ROUTE************************/

export async function deleteComment(userId, commentId, content) {
    try {
        const res = await fetch(`${backendEndpoint}/comments/${commentId}`, {
            method: HttpMethod.Delete,
            body: jsonify({
                shardId: content.shardId
            }),
            headers: protectedRouteHeaders(userId, true)
        });
        return await res.json();

    } catch (error) {
        console.log("error occured in getComments", error)
        return null;
    }
}

/************************************* ROOM ROUTES ******************************************/
export async function fetchAllRooms(userId, limit=10, offset=0) {
    let url = new URL(`${backendEndpoint}/rooms`);
    url.searchParams.append("limit", limit);
    url.searchParams.append("offset", offset);

    try {
        const res = await fetch(url.toString(), {
            method: HttpMethod.Get,
            headers: protectedRouteHeaders(userId)
        });
        return await res.json();

    } catch (error) {
        console.log("error occured in fetchAllRooms", error)
        return null;
    }
}

export async function fetchLatestRoomFilesState(userId, shardId) {
    let url = `${backendEndpoint}/rooms/${shardId}`;

    try {
        const res = await fetch(url, {
            method: HttpMethod.Get,
            headers: protectedRouteHeaders(userId)
        });
        return await res.json();

    } catch (error) {
        console.log("error occured in fetchAllRooms", error)
        return null;
    }
}

export async function createNewRoom(userId, content) {
    try {
        const res = await fetch(`${backendEndpoint}/rooms`,{
            method: HttpMethod.Post,
            body: jsonify({
                templateType: content.templateType
            }),
            headers: protectedRouteHeaders(userId, true)
        });
        return await res.json();

    } catch (error) {
        console.log("error occured in getComments", error)
        return null;
    }
}

/************************************ASSIGNMENT ROUTES *******************************/

export async function createAssignment(formData) {
  const { userId } = await auth();
  
  try {
    const response = await fetch(`${backendEndpoint}/assignments`, {
      method: HttpMethod.Post,
      headers: protectedRouteHeaders(userId, true),
      body: jsonify({
        ...formData,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create assignment");
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating assignment:", error);
    throw error;
  }
}

export async function getAssignments() {
  try {
    const response = await fetch(`${backendEndpoint}/assignments`, {
      method: HttpMethod.Get,
    });
    if (!response.ok) throw new Error("Failed to fetch assignments");
    return await response.json();
  } catch (error) {
    console.error("Error fetching assignments:", error);
    throw error;
  }
}

export async function submitProject(assignmentId, submissionData) {
  const { userId } = await auth();
  
  try {
    const response = await fetch(
      `${backendEndpoint}/assignments/${assignmentId}/submit`,
      {
        method: HttpMethod.Post,
        headers: protectedRouteHeaders(userId, true),
        body: jsonify(submissionData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to submit project");
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting project:", error);
    throw error;
  }
}

export async function getSubmissions(assignmentId) {
  const { userId } = await auth();
  
  try {
    const response = await fetch(
      `${backendEndpoint}/assignments/${assignmentId}/submissions`,
      {
        method: HttpMethod.Get,
        headers: protectedRouteHeaders(userId),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch submissions");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching submissions:", error);
    throw error;
  }
}

