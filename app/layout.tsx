import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Golem AI — Technology Solutions. Blockchain",
  description: "GPT + Digital Twin/Worker for dispensary ops across the US/CA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
