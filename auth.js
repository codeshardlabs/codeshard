import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDB from "@/src/lib/database";
import { User } from "./src/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      async authorize(credentials) {
        const { email, password } = credentials;
        connectToDB();
        const user = await User.findOne({ email });
        console.log("User: ", user);
        if (!user) {
          return null;
        }
        console.log("Email: ", email);
        console.log("Password: ", password);

        const flag = await bcrypt.compare(password, user.password);

        console.log("Password Match: ", flag);
        if (flag === false) {
          return null;
        }

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async session({ token, session }) {
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  trustHost: true,
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions);
