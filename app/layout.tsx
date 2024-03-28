import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "./context/authContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Creative Cart",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, alias quidem!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
