"use client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { saveUserMetadata } from "@/src/lib/actions";
import { useAuth, useUser } from "@clerk/nextjs";

const AuthRedirect = () => {
  const { userId } = useAuth();
  const { isSignedIn } = useUser();

  useEffect(() => {
    const saveMetadataAndRedirect = async () => {
      try {
        const user = await saveUserMetadata(userId);
        if (!user) throw new Error("internal server error");
        window.location.href = "/";
      } catch (error) {
        console.error("Error saving metadata:", error);
      }
    };

    if (isSignedIn) saveMetadataAndRedirect();
  }, [isSignedIn, userId]);

  return (
    <div className="min-h screen bg-black flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <Loader2 className="h-12 w-12 animate-spin text-white mx-auto" />

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">
            Setting up your account
          </h1>
          <p className="text-gray-400">
            Please wait while we finish configuring your account...
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthRedirect;
