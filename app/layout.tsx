import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Social Memory - Never forget what matters",
  description: "AI-powered personal CRM that helps you remember and deepen all your human connections",
  keywords: ["social memory", "personal CRM", "relationship management", "AI assistant"],
  authors: [{ name: "Social Memory" }],
  openGraph: {
    title: "Social Memory - Never forget what matters",
    description: "AI-powered personal CRM that helps you remember and deepen all your human connections",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="scrollbar-twitch">
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              className: '!bg-white !text-gray-900 !border !border-gray-200 !shadow-lg',
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#111827',
                border: '1px solid #e5e7eb',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}