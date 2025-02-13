import { HttpMethod } from "../utils/enums";
import { jsonify, protectedRouteHeaders } from "./utils";

const apiOrigin = process.env.NEXT_PUBLIC_BACKEND_URL;
const apiVersion = "v1";
let backendEndpoint = `${apiOrigin}/api/${apiVersion}`;


export async function saveUserMetadata(userId) {
    let url = `${backendEndpoint}/users`;
    const res = await fetch(url, {
        method: HttpMethod.Post,
        body: JSON.stringify({
            id: userId
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    return res.json();
}

export async function saveShard(userId, shardId, content) {
    // protected route
    let url = `${backendEndpoint}/shards/${shardId}`;
    try {
        const res = await fetch(url, {
            method: HttpMethod.Put,
            body: jsonify({
                files: content.files,
                dependencies: content.dependencies
            }),
            headers: protectedRouteHeaders(userId, true)
        });

        return res.json();

    } catch (error) {
        console.log("error occurred in saveShard", error)
        return null;
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
        return res.json();

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
        return res.json();

    } catch (error) {
        console.log("error occured in deleteShardById", error)
        return null;
    }
}

export async function updateShard(userId, shardId, content) {
    let title = content.title ?? "";
    let type = content.type ?? "public";
    let url = new URL(`${backendEndpoint}/shards/${shardId}`);
    url.searchParams.append("title", title);
    url.searchParams.append("type", type);

    try {
        const res = await fetch(url.toString(), {
            method: HttpMethod.Patch,
            headers: protectedRouteHeaders(userId, true)
        });
        return res.json();

    } catch (error) {
        console.log("error occured in updateShard", error)
        return null;
    }
}

export async function getComments(userId, limit=10, offset=0) {
    let url = new URL(`${backendEndpoint}/shards/${shardId}/comments`);
    url.searchParams.append("limit", limit);
    url.searchParams.append("offset", offset);

    try {
        const res = await fetch(url.toString(), {
            method: HttpMethod.Get,
            headers: protectedRouteHeaders(userId)
        });
        return res.json();

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
        return res.json();

    } catch (error) {
        console.log("error occured in addComment", error)
        return null;
    }
}