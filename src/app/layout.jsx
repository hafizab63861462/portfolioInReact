import { Playfair_Display, Open_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/scenes/Navbar";
import Footer from "@/scenes/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

// Weight axis deliberately restricted to 400-600 to match what the CRA site
// actually loaded (wght@400;600). Six `font-bold` (700) usages currently
// render as 600 because 700 was never downloaded; loading the full variable
// axis would silently make those headings heavier. Remove `weight` to opt in.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-playfair",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-opensans",
});

export const metadata = {
  metadataBase: new URL("https://hafizportfolio.netlify.app"),
  title: {
    default: "Hafiz Abdullah — Full-Stack Software Engineer",
    template: "%s | Hafiz Abdullah",
  },
  description:
    "Software Engineer with 5+ years building full-stack applications — React, " +
    "Next.js, Node.js, NestJS and MongoDB. Based in Lahore, Pakistan.",
  keywords: [
    "Full-Stack Developer", "React Developer", "Node.js Developer", "Next.js",
    "NestJS", "MongoDB", "MERN Stack", "React Native", "Lahore", "Pakistan",
  ],
  authors: [{ name: "Hafiz Abdullah" }],
  creator: "Hafiz Abdullah",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Hafiz Abdullah",
    title: "Hafiz Abdullah — Full-Stack Software Engineer",
    description:
      "5+ years building scalable web and mobile products across fintech, " +
      "healthcare and marketplace domains.",
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@HafizAb63861462",
  },
  robots: { index: true, follow: true },
};

// themeColor belongs in `viewport`, not `metadata` (moved in Next 14).
export const viewport = {
  themeColor: "#010026",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hafiz Abdullah",
  jobTitle: "Full-Stack Software Engineer",
  url: "https://hafizportfolio.netlify.app",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lahore",
    addressCountry: "PK",
  },
  sameAs: [
    "https://www.linkedin.com/in/hafiz-abdullah-4b2471203/",
    "https://github.com/hafizab63861462",
    "https://twitter.com/HafizAb63861462",
  ],
  knowsAbout: [
    "JavaScript", "React", "Next.js", "Node.js", "NestJS",
    "React Native", "MongoDB", "Elasticsearch", "GraphQL", "REST APIs", "AWS",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      // Opts back into Next's pre-16 behaviour: instant jump on route change,
      // smooth scroll for in-page anchors. Without this, the global
      // `scroll-behavior: smooth` makes every navigation animate-scroll.
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${openSans.variable}`}
    >
      <body className="bg-deep-blue text-white min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Navbar />
        <div className="app bg-deep-blue min-h-full">{children}</div>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
