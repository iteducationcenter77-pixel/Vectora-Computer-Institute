import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import AnnouncementBar from "@/components/ui/AnnouncementBar";
import ParticleBackground from "@/components/ui/ParticleBackground";
import ChatBot from "@/components/ChatBot";

export const metadata: Metadata = {
  title: "Vectora Computer Institute | Modern AI & Computer Training Centre",
  description: "Vectora Computer Institute is a modern computer training centre focused on AI, programming, digital skills, and practical education. Courses include AI & Data Science, DCA, ADCA, PGDCA, Tally, Graphic Design, Web Development, Digital Marketing, and Cyber Security.",
  keywords: "computer institute, AI training, programming courses, DCA, ADCA, PGDCA, Tally, web development, Assam, Howly",
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
      <body>
        <ParticleBackground />
        <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
          <AnnouncementBar />
          <Navbar />
        </header>
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
        <Footer />
        <ChatBot />
        <WhatsAppButton />
      </body>
    </html>
  );
}
