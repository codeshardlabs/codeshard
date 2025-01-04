import NextAuth from "next-auth";

const handler = NextAuth({
  providers: [], // No external providers
  secret: process.env.AUTH_SECRET, // Required even in development
  trustHost: true, // Set to true for development mode
});

export { handler as GET, handler as POST };
