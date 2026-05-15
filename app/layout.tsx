import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://orobosa.xyz"),
  title: {
    default: "Samuel Amagbakhen | Full-Stack Developer",
    template: "%s | Samuel Amagbakhen",
  },
  description:
    "Full-stack developer from Lagos building well-designed interfaces, dependable backend systems, and scalable applications.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://orobosa.xyz",
    siteName: "Samuel Amagbakhen",
    title: "Samuel Amagbakhen | Full-Stack Developer",
    description:
      "Full-stack developer from Lagos building well-designed interfaces, dependable backend systems, and scalable applications.",
  },
  twitter: {
    card: "summary",
    creator: "@Samuel_Orobosa",
    title: "Samuel Amagbakhen | Full-Stack Developer",
    description:
      "Full-stack developer from Lagos building well-designed interfaces, dependable backend systems, and scalable applications.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="bg-bg text-ink font-sans antialiased min-h-screen flex flex-col">
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
