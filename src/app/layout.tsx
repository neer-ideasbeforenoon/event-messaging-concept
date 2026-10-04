import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { SkyBackdrop } from "@/components/sky-backdrop";
import { cn } from "@/lib/utils";

const themeScript = `(function(){try{var k="theme";var d=document.documentElement;var t=localStorage.getItem(k);if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: dark)");t=m.matches?"dark":"light";m.addEventListener("change",function(e){if(localStorage.getItem(k))return;d.classList.toggle("dark",e.matches)})}d.classList.toggle("dark",t==="dark")}catch(e){}})()`;

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Messages",
  description: "Customer messaging for the event platform",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <SkyBackdrop />
        {children}
      </body>
    </html>
  );
}
