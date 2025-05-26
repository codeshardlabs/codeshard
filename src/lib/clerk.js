"use server";
import { createClerkClient } from "@clerk/nextjs/server";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const fetchClerkUser = async (userId) => {
  try {
    const user = await clerkClient.users.getUser(userId);
    return user;
  } catch (error) {
    return null;
  }
};


export const getPrimaryEmailFromClerk = async (userId) => {
  try {
    const user = await fetchClerkUser(userId);
    return user?.primaryEmailAddress?.emailAddress;
  } catch (error) {
    console.error("Error fetching primary email from Clerk:", error);
    return ""
  }
};