import "~/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Todo App",
  description: "A simple todo list application",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
