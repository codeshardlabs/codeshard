const apiOrigin = process.env.NEXT_PUBLIC_BACKEND_URL;
const apiVersion = "api/v1";
let backendEndpoint = `${apiOrigin}/${apiVersion}`;
export async function saveUserMetadata(userId) {
    let url =  `${backendEndpoint}/users`;
   const res =  await fetch(`url`, {
        method: "POST",
        body: JSON.stringify({
            id: userId
        }),
        headers: {
            "Content-Type" : "application/json"
        }
    });

    return res.json();
}

