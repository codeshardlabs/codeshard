const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function saveUserMetadata(userId) {
   const res =  await fetch(`${url}`, {
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

