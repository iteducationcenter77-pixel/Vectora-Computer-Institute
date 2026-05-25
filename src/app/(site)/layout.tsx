import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import AnnouncementBar from "@/components/ui/AnnouncementBar";
import ParticleBackground from "@/components/ui/ParticleBackground";
import ChatBot from "@/components/ChatBot";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
    </>
  );
}
