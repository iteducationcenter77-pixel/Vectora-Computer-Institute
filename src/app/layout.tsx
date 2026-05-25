import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vectora Computer Institute | Modern AI & Computer Training Centre",
  description: "Vectora Computer Institute is a modern computer training centre focused on AI, programming, digital skills, and practical education. Courses include AI & Data Science, DCA, ADCA, PGDCA, Tally, Graphic Design, Web Development, Digital Marketing, and Cyber Security.",
  keywords: "computer institute, AI training, programming courses, DCA, ADCA, PGDCA, Tally, web development, Assam, Howly",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Vectora Computer Institute | Learn AI. Lead Tomorrow.",
    description: "Modern computer training centre focused on AI, programming, digital skills, and practical education.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body>{children}</body>
    </html>
  );
}
