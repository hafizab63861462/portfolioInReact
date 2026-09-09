"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import LineGradient from "@/components/LineGradient";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

const Section = ({ title, accent, children, index = 0 }) => (
  <motion.section
    custom={index}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
    variants={fadeUp}
    className="mb-14"
  >
    <div className="flex items-center gap-4 mb-6">
      <h2 className="font-playfair font-semibold text-2xl md:text-3xl text-white">
        {title}
      </h2>
      <div className="h-px flex-1" style={{ background: accent, opacity: 0.4 }} />
    </div>
    {children}
  </motion.section>
);

const Tag = ({ label, color, textDark }) => (
  <span
    className="text-xs font-semibold font-opensans tracking-wide px-3 py-1.5 rounded-full"
    style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
  >
    {label}
  </span>
);

const BulletList = ({ items, accent }) => (
  <ul className="space-y-3">
    {items.map((item) => (
      <li key={item} className="flex gap-3 font-opensans text-grey leading-relaxed">
        <span
          className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: accent }}
        />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const TechCategory = ({ title, items }) => (
  <div className="bg-[#05003a] rounded-xl p-5 border border-white/5">
    <h4 className="font-playfair font-semibold text-white mb-3">{title}</h4>
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="text-xs font-opensans text-grey px-2.5 py-1 rounded-md bg-white/5"
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);

const ProjectDetailView = ({ project, accent }) => {
  const { color, textDark } = accent;
  const tech = project.technologies;

  return (
    <div className="bg-deep-blue min-h-screen pt-28 pb-20">
      <div className="w-5/6 max-w-5xl mx-auto">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 font-opensans text-sm text-grey hover:text-yellow transition duration-300 mb-10"
          >
            <span>←</span> Back to Projects
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden border border-white/5 mb-12"
          style={{ background: "#05003a" }}
        >
          <div className="h-1.5 w-full" style={{ background: color }} />

          {project.video ? (
            <div className="relative overflow-hidden bg-black">
              <video
                src={project.video}
                controls
                playsInline
                preload="metadata"
                poster={project.image}
                className="w-full aspect-video"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : project.image ? (
            <div className="relative h-56 sm:h-72 md:h-96 overflow-hidden bg-white/5">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-contain p-4"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(to top, #05003a 0%, transparent 40%)`,
                }}
              />
            </div>
          ) : (
            <div
              className="h-40 sm:h-48 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${color}18 0%, #05003a 60%)`,
              }}
            >
              <span
                className="font-playfair font-bold text-6xl select-none"
                style={{ color, opacity: 0.25 }}
              >
                {project.title.charAt(0)}
              </span>
            </div>
          )}

          <div className="p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className="text-xs font-semibold font-opensans tracking-wide px-3 py-1 rounded-full"
                style={{ background: color, color: textDark }}
              >
                {project.stack}
              </span>
              <span className="text-xs font-opensans text-dark-grey">
                {project.industry}
              </span>
            </div>

            <h1 className="font-playfair font-bold text-3xl md:text-4xl text-white leading-snug mb-4">
              {project.title}
            </h1>

            <p
              className="font-opensans text-lg leading-relaxed border-l-2 pl-4"
              style={{ borderColor: color, color: "#ededed" }}
            >
              {project.headline}
            </p>

            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 font-opensans text-sm font-semibold px-4 py-2 rounded-full border transition duration-300 hover:text-white"
                style={{ borderColor: `${color}66`, color }}
              >
                Visit Live Site ↗
              </a>
            )}
          </div>
        </motion.div>

        {project.images?.length > 0 && (
          <Section title="Product Screenshots" accent={color} index={0}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.images.map((src) => (
                <div
                  key={src}
                  className="rounded-xl overflow-hidden border border-white/5 bg-[#05003a]"
                >
                  <img
                    src={src}
                    alt={`${project.title} screenshot`}
                    className="w-full h-48 sm:h-64 object-contain bg-white/5 p-2 hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </Section>
        )}

        <LineGradient />

        {/* Description */}
        <div className="mt-14">
          <Section title="Project Description" accent={color} index={project.images?.length ? 1 : 0}>
            <div className="space-y-4">
              {project.description.map((para, i) => (
                <p key={i} className="font-opensans text-grey leading-relaxed text-base md:text-lg">
                  {para}
                </p>
              ))}
            </div>
          </Section>

          <Section title="My Role" accent={color} index={project.images?.length ? 2 : 1}>
            <BulletList items={project.role} accent={color} />
          </Section>

          <Section title="Technologies Used" accent={color} index={project.images?.length ? 3 : 2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TechCategory title="Frontend" items={tech.frontend} />
              <TechCategory title="Backend" items={tech.backend} />
              <TechCategory title="Database" items={tech.database} />
              <TechCategory title="APIs & Integrations" items={tech.apis} />
              <TechCategory title="Cloud & Deployment" items={tech.cloud} />
              <TechCategory title="Tools" items={tech.tools} />
            </div>
          </Section>

          <Section title="Skills" accent={color} index={project.images?.length ? 4 : 3}>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <Tag key={skill} label={skill} color={color} textDark={textDark} />
              ))}
            </div>
          </Section>

          <Section title="Key Features" accent={color} index={project.images?.length ? 5 : 4}>
            <BulletList items={project.keyFeatures} accent={color} />
          </Section>

          <Section title="Technical Challenges Solved" accent={color} index={project.images?.length ? 6 : 5}>
            <BulletList items={project.technicalChallenges} accent={color} />
          </Section>

          <Section title="Results & Impact" accent={color} index={project.images?.length ? 7 : 6}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.results.map((result) => (
                <div
                  key={result}
                  className="bg-[#05003a] rounded-xl p-5 border border-white/5"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mb-3 text-sm font-bold"
                    style={{ background: `${color}22`, color }}
                  >
                    ✓
                  </div>
                  <p className="font-opensans text-grey text-sm leading-relaxed">
                    {result}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Industry" accent={color} index={project.images?.length ? 8 : 7}>
            <p className="font-opensans text-grey text-lg">{project.industry}</p>
          </Section>

          <Section title="Portfolio Summary" accent={color} index={project.images?.length ? 9 : 8}>
            <div
              className="rounded-xl p-6 md:p-8 border"
              style={{
                background: `${color}08`,
                borderColor: `${color}33`,
              }}
            >
              <p className="font-opensans text-grey leading-relaxed text-base md:text-lg">
                {project.portfolioSummary}
              </p>
            </div>
          </Section>

          <Section title="SEO Keywords" accent={color} index={project.images?.length ? 10 : 9}>
            <div className="flex flex-wrap gap-2">
              {project.seoKeywords.map((kw) => (
                <span
                  key={kw}
                  className="text-xs font-opensans text-dark-grey px-2.5 py-1 rounded-md bg-white/5 border border-white/5"
                >
                  {kw}
                </span>
              ))}
            </div>
          </Section>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="font-opensans text-grey mb-6">
            Interested in a similar project? Let's talk.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="bg-gradient-rainblue text-deep-blue rounded-sm py-3 px-7 font-semibold font-opensans
                hover:bg-blue hover:text-white transition duration-500"
            >
              Contact Me
            </Link>
            <Link
              href="/#projects"
              className="rounded-sm py-3 px-7 font-semibold font-opensans border border-white/20 text-grey
                hover:border-yellow hover:text-yellow transition duration-500"
            >
              View All Projects
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetailView;
