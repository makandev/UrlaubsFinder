import { Hero } from "@/components/Hero";
import { Explorer } from "@/components/Explorer";
import { Footer } from "@/components/Footer";
import { Onboarding } from "@/components/Onboarding";

export default function Home() {
  return (
    <>
      <Onboarding />
      <Hero />
      <Explorer />
      <Footer />
    </>
  );
}
