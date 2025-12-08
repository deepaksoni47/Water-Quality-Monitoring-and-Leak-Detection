import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NotificationInitializer from "@/components/Notifications/NotificationInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Water Monitor Dashboard",
  description:
    "Real-time water quality monitoring and leakage detection system",
  manifest: "/manifest.json",
  icons: {
    icon: "/drop.png",
    apple: "/drop.png",
    shortcut: "/drop.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Water Monitor",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NotificationInitializer />
        {children}
      </body>
    </html>
  );
}
