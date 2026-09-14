import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VaaniX — Voice Impersonation Defense",
  description:
    "Real-time detection and analyst response platform for AI voice impersonation across enterprise call infrastructure.",
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("vaanix-theme");
    var theme = stored === "dark" || stored === "light" ? stored : "light";
    if (theme === "dark") document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full bg-background text-foreground font-sans">
        {children}
        <Toaster position="top-right" theme="system" richColors closeButton />
      </body>
    </html>
  );
}
