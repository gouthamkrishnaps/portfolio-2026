import About from "../components/About";
import Achievements from "../components/Achievements";
import CaseStudies from "../components/CaseStudies";
import Contact from "../components/Contact";
import Experience from "../components/Experience";
import FeaturedProjects from "../components/FeaturedProjects";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import TechStackMarquee from "../components/TechStackMarquee";
import SkillsUniverse from "../components/SkillsUniverse";
import BuildTogether from "../components/BuildTogether";
import SolutionsBento from "../components/SolutionsBento";


export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Hero />
      <TechStackMarquee />
      <About />
      <Experience />
      <FeaturedProjects />
      {/* <CaseStudies /> */}
      <SkillsUniverse />
      <Achievements />
      <SolutionsBento />
      <BuildTogether />
      <Contact />
      <Footer />
    </main>
  )
}