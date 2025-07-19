import type { Metadata } from "next";
import "./globals.css";

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
      <body className="scrollbar-twitch">{children}</body>
    </html>
  );
}