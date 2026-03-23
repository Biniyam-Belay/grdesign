import Hero from "@/components/content/Hero";
import ClientLogos from "@/components/content/ClientLogos";
import CapabilitiesIntro from "@/components/content/CapabilitiesIntro";
import SocialProofSection from "@/components/content/SocialProofSection";
import FeaturedWorks from "@/components/content/FeaturedWorks";
import AboutSection from "@/components/content/AboutSection";

export default function Home() {
  return (
    <main className="bg-[#F5F5F0]">
      <div className="mx-auto w-full max-w-8xl">
        <Hero />
        <ClientLogos />
        <CapabilitiesIntro />
        <FeaturedWorks />
        <SocialProofSection />
        <AboutSection />
      </div>
    </main>
  );
}
