import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center">
      <SignUp forceRedirectUrl="/onboarding" />
    </div>
  );
}
