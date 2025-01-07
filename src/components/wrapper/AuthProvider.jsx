import { ClerkProvider } from "@clerk/nextjs";

export default function AuthProvider({ children }) {
  return (
    <>
      <ClerkProvider>{children}</ClerkProvider>
    </>
  );
}
