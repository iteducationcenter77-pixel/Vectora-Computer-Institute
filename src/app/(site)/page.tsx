import HeroSection from '@/components/home/HeroSection'
import AboutSection from '@/components/home/AboutSection'
import CoursesSection from '@/components/home/CoursesSection'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import GalleryPreview from '@/components/home/GalleryPreview'
import CertificateVerify from '@/components/home/CertificateVerify'
import AdmissionForm from '@/components/home/AdmissionForm'
import ContactSection from '@/components/home/ContactSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <CoursesSection />
      <WhyChooseUs />
      <GalleryPreview />
      <CertificateVerify />
      <AdmissionForm />
      <ContactSection />
    </>
  )
}
