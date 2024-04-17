import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "./context/authContext";
import { Toaster } from "react-hot-toast";
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
        <Toaster 
        position="top-right"
        toastOptions={{
          duration: 1000,
          style: {
            padding: '16px',
            color: '#fff',
            background: '#333',
          },
        }}
        />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
