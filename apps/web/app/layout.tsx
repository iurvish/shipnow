import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "CrewMate AI | Find Your Co-Founder & Startup Team",
  description:
    "CrewMate AI helps you find the perfect co-founder and build your startup team. Discover top talent, connect, and collaborate instantly.",
  keywords: [
    "CrewMate AI",
    "find co-founder",
    "startup team",
    "AI matchmaking",
    "startup talent",
    "business partner",
    "collaboration",
    "entrepreneur",
    "startup networking",
  ],
  openGraph: {
    title: "CrewMate AI | Find Your Co-Founder & Startup Team",
    description:
      "Discover and connect with top startup talent using CrewMate AI.",
    url: "https://yourdomain.com",
    siteName: "CrewMate AI",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "CrewMate AI - Find Your Co-Founder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrewMate AI | Find Your Co-Founder & Startup Team",
    description:
      "Discover and connect with top startup talent using CrewMate AI.",
    images: ["https://yourdomain.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bitcount+Prop+Single:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-mono`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
