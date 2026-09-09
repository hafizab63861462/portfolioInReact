"use client";

import LineGradient from "../components/LineGradient";
import { motion } from "framer-motion";
import Link from "next/link";
import { ACCENT } from "../data/accents";

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

const ProjectCard = ({ index, slug, title, stack, accent, shortDescription, image }) => {
  const { color, textDark } = ACCENT[accent];
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div variants={cardVariant}>
      <Link
        href={`/projects/${slug}`}
        className="group relative flex flex-col bg-[#05003a] rounded-2xl overflow-hidden border border-white/5 h-full
          hover:border-white/15 transition-all duration-300"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
      >
        {/* top accent stripe */}
        <div className="h-1 w-full" style={{ background: color }} />

        {/* optional thumbnail */}
        {image && (
          <div className="h-36 overflow-hidden bg-white/5">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-contain p-2 opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
            />
          </div>
        )}

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
          <h3 className="font-playfair font-semibold text-xl text-white leading-snug group-hover:text-yellow transition duration-300">
            {title}
          </h3>

          {/* divider */}
          <div
            className="h-px w-12"
            style={{ background: color, opacity: 0.5 }}
          />

          {/* description */}
          <p className="font-opensans text-sm text-grey leading-relaxed flex-1">
            {shortDescription}
          </p>

          {/* view detail */}
          <span
            className="font-opensans text-xs font-semibold flex items-center gap-1 mt-1"
            style={{ color }}
          >
            View Details
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

const Projects = ({ cards = [] }) => {
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
        {cards.map((project, i) => (
          <ProjectCard key={project.slug} index={i} {...project} />
        ))}
      </motion.div>
    </section>
  );
};

export default Projects;
