import LineGradient from "../components/LineGradient";
import { motion } from "framer-motion";

const ACCENT = {
  blue: { color: "#2CBCE9", textDark: "#010026" },
  red: { color: "#DC4492", textDark: "#ffffff" },
  yellow: { color: "#FDCC49", textDark: "#010026" },
};

const projects = [
  {
    title: "Copy Trading",
    stack: "Node / React",
    accent: "blue",
    description:
      "Cross-exchange copy trading platform allowing users to replicate trades across Binance and Bybit with real-time analytics and performance tracking. Built with WebSocket streams for live order mirroring and a dashboard for portfolio-level insights.",
  },
  {
    title: "QuickTopups",
    stack: "Next.js / Node",
    accent: "red",
    description:
      "Digital recharge and voucher platform integrated into EasyPaisa, JazzCash, Askari Bank, Allied Bank, and Zindagi. Enables instant top-ups, bill payments, and voucher redemption at scale across major banking apps.",
  },
  {
    title: "QuickTopups Mobile",
    stack: "React Native / NestJS",
    accent: "yellow",
    description:
      "Mobile app companion to the QuickTopups platform — built with React Native for cross-platform iOS and Android delivery and NestJS on the backend. Brings full recharge, voucher, and payment functionality to mobile users.",
  },
  {
    title: "M1neral",
    stack: "MERN",
    accent: "blue",
    description:
      "All-in-one transaction management platform for minerals and royalties with a robust spatial search tool. Promotes collaboration between buyers, sellers, service providers, and financial institutions to dramatically cut cycle times.",
  },
  {
    title: "Opto Health",
    stack: "MERN",
    accent: "red",
    description:
      "Healthcare management platform with automated patient triage, dynamic intake forms, and a smart doctor assignment engine. Streamlines the full care journey from registration to consultation with configurable clinical workflows.",
  },
  {
    title: "Easy Health",
    stack: "MERN",
    accent: "yellow",
    description:
      "Innovative healthcare platform expanding access to preventive care. Integrates primary, mental, and social healthcare into one holistic solution, leveraging in-home and telehealth visits for a 360° member view.",
  },
  {
    title: "Omnilocal",
    stack: "Next.js",
    accent: "blue",
    description:
      "Leading hyperlocal advertising and foot-traffic attribution solution. Connects brands with their target audience using next-generation location data and a fully integrated tech stack for real-world in-store attribution.",
  },
  {
    title: "FYP — eBay Clone",
    stack: "MERN",
    accent: "red",
    description:
      "Full-featured marketplace platform delivering eBay-equivalent services for the Pakistani market — product listings, bidding, buying and selling across multiple categories, bridging the gap for local users.",
  },
  {
    title: "Bug Management System",
    stack: "MERN",
    accent: "yellow",
    description:
      "Role-based bug tracking system with three user types: Project Manager, Developer, and QA. Managers create and assign projects; team members view only their assigned work, keeping workflows clean and focused.",
  },
  {
    title: "Hospital Management",
    stack: "MERN",
    accent: "blue",
    description:
      "Three-role hospital system (Admin, Doctor, Patient). Admins assign doctors to hospitals and treatments; patients browse doctors by city and send appointment requests that doctors accept or reject.",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const ProjectCard = ({ index, title, stack, accent, description }) => {
  const { color, textDark } = ACCENT[accent];
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="relative flex flex-col bg-[#05003a] rounded-2xl overflow-hidden border border-white/5"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
    >
      {/* top accent stripe */}
      <div className="h-1 w-full" style={{ background: color }} />

      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* number + badge row */}
        <div className="flex items-center justify-between">
          <span
            className="font-playfair font-bold text-4xl leading-none select-none"
            style={{ color, opacity: 0.35 }}
          >
            {num}
          </span>
          <span
            className="text-xs font-semibold font-opensans tracking-wide px-3 py-1 rounded-full"
            style={{ background: color, color: textDark }}
          >
            {stack}
          </span>
        </div>

        {/* title */}
        <h3 className="font-playfair font-semibold text-xl text-white leading-snug">
          {title}
        </h3>

        {/* divider */}
        <div
          className="h-px w-12"
          style={{ background: color, opacity: 0.5 }}
        />

        {/* description */}
        <p className="font-opensans text-sm text-grey leading-relaxed flex-1">
          {description}
        </p>
      </div>

      {/* bottom glow on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: color }}
      />
    </motion.div>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="pt-10 pb-40">
      {/* HEADING */}
      <motion.div
        className="md:w-3/5 mx-auto text-center mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        variants={{
          hidden: { opacity: 0, y: -40 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <p className="font-playfair font-semibold text-4xl">
          <span className="text-red">PRO</span>JECTS
        </p>
        <div className="flex justify-center mt-5 mb-8">
          <LineGradient width="w-1/3" />
        </div>
        <p className="text-lg text-grey font-opensans leading-relaxed">
          A selection of client and product projects spanning full-stack web,
          healthcare, fintech, and marketplace domains — built with modern
          architectures and shipped to production.
        </p>
      </motion.div>

      {/* GRID */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.title} index={i} {...project} />
        ))}
      </motion.div>
    </section>
  );
};

export default Projects;
