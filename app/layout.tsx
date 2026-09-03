import type { Metadata } from "next";
import AnimatedBackground from "./components/animated-background";
import { readContent } from "../lib/content-storage";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { siteSettings } = await readContent();
  return {
    title: siteSettings.siteTitle,
    description: siteSettings.siteDescription,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
