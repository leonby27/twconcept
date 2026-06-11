import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Products from "@/components/Products";
import Pricing from "@/components/Pricing";
import Migration from "@/components/Migration";
import Why from "@/components/Why";
import Panel from "@/components/Panel";
import Audience from "@/components/Audience";
import Reviews from "@/components/Reviews";
import Ecosystem from "@/components/Ecosystem";
import Blog from "@/components/Blog";
import Partners from "@/components/Partners";
import GsapEffects from "@/components/GsapEffects";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Products />
        <Pricing />
        <Migration />
        <Why />
        <Panel />
        <Audience />
        <Reviews />
        <Ecosystem />
        <Blog />
        <Partners />
      </main>
      <GsapEffects />
    </>
  );
}
