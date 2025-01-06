import "./globals.css";
import ReduxProvider from "../components/wrapper/ReduxProvider";
import { Analytics } from "@vercel/analytics/react";
import { SandPackCSS } from "@/src/components/ui/sandpack-styles";
import { Toaster } from "sonner";

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
