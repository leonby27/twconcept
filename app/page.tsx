import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Products from "@/components/Products";
import Pricing from "@/components/Pricing";
import Why from "@/components/Why";
import Cms from "@/components/Cms";
import Migration from "@/components/Migration";
import Panel from "@/components/Panel";
import Infrastructure from "@/components/Infrastructure";
import Security from "@/components/Security";
import Reviews from "@/components/Reviews";
import Support from "@/components/Support";
import Blog from "@/components/Blog";
import Partners from "@/components/Partners";
import FinalCta from "@/components/FinalCta";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Products />
        <div className="band">
          <Pricing />
          <Why />
        </div>
        <Migration />
        <Cms />
        <Panel />
        <Security />
        <Infrastructure />
        <Reviews />
        <Support />
        <Partners />
        <Blog />
        <div className="band band--footer">
          <FinalCta />
          <Faq />
          <Footer />
        </div>
      </main>
      <RevealOnScroll />
    </>
  );
}
