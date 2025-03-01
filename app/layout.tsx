import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Parsonex Dashboard",
  description: "Parsonex Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + "min-h-[100svh] bg-gray-bg"}>
        <ClerkProvider dynamic>
          <div className="absolute inset-0 flex">
            <div className="h-full flex-grow">{children}</div>
          </div>
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
