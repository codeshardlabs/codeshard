import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SandPackCSS } from "../components/ui/sandpack-styles";
import { Toaster } from "sonner";
import AuthProvider from "../components/wrapper/AuthProvider";
import Navbar from "../components/common/Navbar";

export const metadata = {
  title: "CodeShard: Collaborative Code Editor",
  description:
    "CodeShard is a collaborative code editor for creating, sharing and collaborating on frontend templates.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <SandPackCSS />
      </head>
      <body className="bg-black text-white" suppressHydrationWarning={true}>
        <AuthProvider>
          <Navbar />
          {children}
          <Toaster richColors position="top-center" />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
