import About from "../components/About";
import Achievements from "../components/Achievements";
import CaseStudies from "../components/CaseStudies";
import Contact from "../components/Contact";
import Experience from "../components/Experience";
import FeaturedProjects from "../components/FeaturedProjects";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import SkillsUniverse from "../components/SkillsUniverse";
import BuildTogether from "../components/BuildTogether";


export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Hero />
      <About />
      <Experience />
      <FeaturedProjects />
      {/* <CaseStudies /> */}
      <SkillsUniverse />
      <Achievements />
      <BuildTogether />
      <Contact />
      <Footer />
    </main>
  )
}