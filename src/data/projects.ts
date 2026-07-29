import PermatechImage from "@/images/assets/permatech.png";
import AvumyImage from "@/images/assets/avumy.png";
import DarlingsImage from "@/images/assets/darlings.png";
import EattakImage from "@/images/assets/eattak.png";
import PendriveImage from "@/images/assets/pendrive.png";
import JBSushiImage from "@/images/assets/sushi.png";
// import GitSandboxImage from "@/images/assets/git_sandbox.png";

export const featuredProjects = [
  {
    id: "01",
    title: "Darlings of Chelsea",
    category: "Luxury Furniture eCommerce",
    image: DarlingsImage,
    url: "https://www.darlingsofchelsea.co.uk/",
    description:
      "Enhanced a premium furniture eCommerce platform with modern UI improvements, performance optimizations, and Cylindo 3D product visualization integration.",
    technologies: [
      "Next.js",
      "React 19",
      "SCSS",
      "Cylindo 3D WebGL",
    ],
    highlights: [
      "3D Product Configurator",
      "Material Visualization",
      "Performance Optimization",
      "Modern UI Enhancements",
    ],
  },
  {
    id: "02",
    title: "Permatech Roofing",
    category: "Enterprise eCommerce",
    image: PermatechImage,
    url: "https://permatechroofing.com/",
    description:
      "Developed scalable B2B eCommerce solutions including bundle pricing, customer-specific pricing, checkout workflows, and product management.",
    technologies: [
      "Next.js",
      "TypeScript",
      "GraphQL",
      "Apollo Client",
      "Tailwind CSS",
    ],
    highlights: [
      "Bundle Pricing Logic",
      "Contractor Workflows",
      "Custom Checkout",
      "Magento Integration",
    ],
  },
  {
    id: "03",
    title: "Avumy Space",
    category: "Property & Event Booking",
    image: AvumyImage,
    url: "https://www.avumy.com/",
    description:
      "Created a property and event booking platform enabling users to discover, book, and manage spaces through an intuitive experience.",
    technologies: [
      "React",
      "Next.js",
      "REST APIs",
      "Framer Motion",
      "Tailwind CSS",
    ],
    highlights: [
      "Property Booking",
      "Event Space Listings",
      "Advanced Search Filters",
      "Interactive User Experience",
    ],
  },
  {
    id: "04",
    title: "Pendrive",
    category: "Cloud File Sharing Platform",
    image: PendriveImage,
    url: "https://pendrive.me/",
    description:
      "Developed a virtual file-sharing and storage platform that enables users to securely upload, organize, manage, and share digital content through a modern cloud-based experience.",
    technologies: [
      "Next.js",
      "React",
      "Node.js",
      "MySQL",
      "Tailwind CSS",
    ],
    highlights: [
      "Secure File Sharing",
      "Virtual Storage Management",
      "User Access Controls",
      "Cross-Platform Experience",
    ],
  },
  {
    id: "05",
    title: "JB Sushi",
    category: "Restaurant Ordering Platform",
    image: JBSushiImage,
    url: "https://www.jbsushi.com/",
    description:
      "Built a modern restaurant ordering experience with menu management, online ordering, and optimized customer interactions.",
    technologies: [
      "Next.js",
      "React",
      "REST APIs",
      "Tailwind CSS",
    ],
    highlights: [
      "Online Ordering",
      "Menu Management",
      "Responsive Experience",
      "Customer Engagement",
    ],
  },
  {
    id: "06",
    title: "EatTak",
    category: "Food Delivery Platform",
    image: EattakImage,
    url: "https://eattak.com/",
    description:
      "Developed a Swiggy-style food ordering platform featuring restaurant discovery, online ordering, live order management, and customer-focused experiences.",
    technologies: [
      "React",
      "Next.js",
      "Node.js",
      "REST APIs",
      "Tailwind CSS",
    ],
    highlights: [
      "Food Ordering System",
      "Restaurant Listings",
      "Order Management",
      "Mobile-First Design",
    ],
  },
];

export const projects = [
  /* Commented out Git Sandbox project card
  {
    number: "00",
    title: "Collaborative Git Visualizer",
    subtitle: "Real-time Developer Sandbox",
    image: GitSandboxImage,
    url: "/sandbox",
  },
  */
  {
    number: "01",
    title: "Darlings of Chelsea",
    subtitle: "Luxury Furniture eCommerce",
    image: DarlingsImage,
    url: "https://www.darlingsofchelsea.co.uk/",
  },
  {
    number: "02",
    title: "Permatech Roofing",
    subtitle: "Enterprise Commerce Platform",
    image: PermatechImage,
    url: "https://permatechroofing.com/",
  },
  {
    number: "03",
    title: "Avumy Space",
    subtitle: "Property Booking Platform",
    image: AvumyImage,
    url: "https://www.avumy.com/",
  },
  {
    number: "04",
    title: "Pendrive",
    subtitle: "Cloud File Sharing Platform",
    image: PendriveImage,
    url: "https://pendrive.me/",
  },
  {
    number: "05",
    title: "JB Sushi",
    subtitle: "Restaurant Ordering Platform",
    image: JBSushiImage,
    url: "https://www.jbsushi.com/",
  },
  {
    number: "06",
    title: "EatTak",
    subtitle: "Food Delivery Platform",
    image: EattakImage,
    url: "https://eattak.com/",
  },
];