import "./globals.css";
import AuthProvider from "./AuthProvider";
import ReduxProvider from "./ReduxProvider";
import { Analytics } from "@vercel/analytics/react";

import { SandPackCSS } from "@/src/components/sandpack-styles";
import { Toaster } from "sonner";
import SocketProvider from "@/src/context/SocketContext";

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
          <ReduxProvider>
            {children}
            <Toaster richColors position="top-center" />
            <Analytics />
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
