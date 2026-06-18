import PermatechImage from "@/images/assets/permatech.png";
import AvumyImage from "@/images/assets/avumy.png";
import DarlingsImage from "@/images/assets/darlings.png";
import EattakImage from "@/images/assets/eattak.png";

export const featuredProjects = [
  {
    id: "01",
    title: "Permatech Roofing",
    category: "Enterprise eCommerce",
    image: PermatechImage,
    description:
      "Developed scalable eCommerce experiences including bundle pricing, checkout optimization, product filtering and customer pricing.",
    technologies: [
      "Next.js",
      "TypeScript",
      "GraphQL",
      "Apollo Client",
      "Tailwind CSS",
    ],
    highlights: [
      "Dynamic Bundle Pricing",
      "Custom Checkout Funnels",
      "B2B Customer Tiers",
      "High-Performance Listings",
    ],
  },
  {
    id: "02",
    title: "Rubberized Roofing",
    category: "B2B Commerce",
    image: EattakImage,
    description:
      "Built a modern roofing commerce platform featuring real-time quote generation, responsive interfaces, and optimized B2B workflows.",
    technologies: [
      "React",
      "Next.js",
      "GraphQL",
      "Magento API",
      "Tailwind CSS",
    ],
    highlights: [
      "Responsive Quotation UI",
      "ERP Order Integration",
      "Optimized Checkout Flows",
      "Sub-second Load Times",
    ],
  },
  {
    id: "03",
    title: "Avumy Space",
    category: "Booking Platform",
    image: AvumyImage,
    description:
      "A premium event space and property stay booking platform built to deliver visual excellence and frictionless user reservations.",
    technologies: [
      "React",
      "Next.js",
      "REST APIs",
      "Framer Motion",
      "Tailwind CSS",
    ],
    highlights: [
      "Interactive Booking System",
      "Dynamic Property Filters",
      "Visual Map Integration",
      "Glassmorphic Dashboards",
    ],
  },
  {
    id: "04",
    title: "Darlings of Chelsea",
    category: "Luxury Furniture eCommerce",
    image: DarlingsImage,
    description:
      "High-end luxury furniture eCommerce platform integrating Cylindo 3D assets to enable dynamic product configuration and material inspection.",
    technologies: [
      "Next.js",
      "SCSS",
      "React 19",
      "Cylindo 3D WebGL",
    ],
    highlights: [
      "3D Product Configurator",
      "High-Fidelity Material Swatches",
      "Sleek Layout Interactions",
      "Advanced Render Caching",
    ],
  },
];

export const projects = [
  {
    number: "01",
    title: "Permatech Roofing",
    subtitle: "Enterprise Commerce Platform",
    image: PermatechImage,
  },
  {
    number: "02",
    title: "Rubberized Roofing",
    subtitle: "B2B Commerce Platform",
    image: EattakImage,
  },
  {
    number: "03",
    title: "Avumy Space",
    subtitle: "Property Booking Platform",
    image: AvumyImage,
  },
  {
    number: "04",
    title: "Darlings of Chelsea",
    subtitle: "Luxury Furniture eCommerce",
    image: DarlingsImage,
  },
];