"use client";

import LineGradient from "../components/LineGradient";
import CalendlyEmbed from "../components/CalendlyEmbed";
import { motion } from "framer-motion";
import { CALENDLY_URL } from "../config/calendly";

const benefits = [
  {
    icon: "💼",
    title: "Project Discussion",
    desc: "Scope, timeline, and delivery plan for your product idea.",
  },
  {
    icon: "🚀",
    title: "Freelance Work",
    desc: "Contract, part-time, or full-project engagement options.",
  },
  {
    icon: "🤖",
    title: "AI Consultation",
    desc: "Integrate AI features, automation, and smart workflows.",
  },
  {
    icon: "⚡",
    title: "Web Development",
    desc: "Full-stack builds with React, Node.js, and modern stacks.",
  },
  {
    icon: "🎯",
    title: "Technical Guidance",
    desc: "Architecture reviews, scaling advice, and best practices.",
  },
];

const meetingDetails = [
  { icon: "⏱️", label: "30 Minutes" },
  { icon: "📹", label: "Google Meet" },
  { icon: "⚡", label: "Free Consultation" },
  { icon: "🌍", label: "Your Local Time" },
];

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
};

const BenefitCard = ({ icon, title, desc, index }) => (
  <motion.div
    custom={index}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    variants={cardVariant}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="group flex gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm
      hover:border-blue/30 hover:bg-white/[0.07] transition-all duration-300"
  >
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0
        bg-gradient-to-br from-blue/20 to-red/20 border border-white/10
        group-hover:scale-110 transition-transform duration-300"
    >
      {icon}
    </div>
    <div>
      <p className="font-opensans font-semibold text-white text-sm mb-0.5">{title}</p>
      <p className="font-opensans text-xs text-dark-grey leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

const BookMeeting = () => {
  return (
    <section
      id="book-meeting"
      className="relative pt-10 pb-16 scroll-mt-28 md:scroll-mt-32"
      aria-labelledby="book-meeting-heading"
    >
      {/* ambient glow — desktop only */}
      <div
        className="hidden lg:block absolute -top-20 -left-32 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #2CBCE9 0%, transparent 70%)" }}
      />
      <div
        className="hidden lg:block absolute top-1/2 -right-20 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #DC4492 0%, transparent 70%)" }}
      />

      {/* ── MOBILE HEADER (unchanged flow) ── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        variants={{
          hidden: { opacity: 0, y: -30 },
          visible: { opacity: 1, y: 0 },
        }}
        className="text-center mb-12 lg:hidden"
      >
        <p className="font-playfair font-semibold text-4xl">
          <span className="text-blue">BOOK</span> A FREE 30-MINUTE CALL
        </p>
        <div className="flex justify-center mt-5">
          <LineGradient width="w-1/3" />
        </div>
        <p className="mt-6 text-grey font-opensans text-lg max-w-2xl mx-auto leading-relaxed">
          Let's work together. Pick a time that suits you and we'll talk through
          your idea, product, or hiring needs — no back-and-forth emails required.
        </p>
      </motion.div>

      {/* ── TWO-COLUMN LAYOUT ── */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-14 lg:items-start">

        {/* LEFT — rich content (desktop) / stacked (mobile) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, x: -40 },
            visible: { opacity: 1, x: 0 },
          }}
          className="lg:col-span-5 flex flex-col gap-6 mb-10 lg:mb-0 lg:sticky lg:top-32"
        >
          {/* desktop-only heading */}
          <div className="hidden lg:block">
            <p className="text-xs font-opensans font-semibold uppercase tracking-[0.2em] text-blue mb-3">
              Book a Meeting
            </p>
            <h2
              id="book-meeting-heading"
              className="font-playfair font-semibold text-3xl xl:text-4xl text-white leading-snug mb-4"
            >
              Let's Build Something{" "}
              <span className="text-yellow">Amazing Together</span>
            </h2>
            <p className="text-grey font-opensans text-sm leading-relaxed">
              Schedule a free 30-minute discovery call to discuss your project,
              explore collaboration options, and get expert technical guidance —
              all with zero commitment.
            </p>
          </div>

          {/* mobile-only sub-heading */}
          <div className="lg:hidden">
            <p className="font-playfair font-semibold text-2xl text-white leading-snug mb-3">
              Let's <span className="text-yellow">work together.</span>
            </p>
            <p className="text-grey font-opensans text-sm leading-relaxed">
              Whether you're launching a new product or scaling an existing one —
              book a free call and let's see if we're a good fit.
            </p>
          </div>

          {/* meeting detail pills */}
          <div className="grid grid-cols-2 gap-3">
            {meetingDetails.map((detail, i) => (
              <motion.div
                key={detail.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariant}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-white/10
                  bg-white/[0.04] backdrop-blur-sm"
              >
                <span className="text-base" aria-hidden="true">{detail.icon}</span>
                <span className="font-opensans text-xs font-semibold text-grey">
                  {detail.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* benefit cards */}
          <div className="flex flex-col gap-3">
            <p className="font-opensans text-xs font-semibold uppercase tracking-widest text-dark-grey">
              What we can discuss
            </p>
            {benefits.map((b, i) => (
              <BenefitCard key={b.title} {...b} index={i} />
            ))}
          </div>

          {/* availability + fallback link */}
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <p className="text-sm font-opensans text-grey">
                Available for new projects
              </p>
            </div>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-opensans text-sm font-semibold text-blue hover:text-yellow transition duration-300 w-fit"
            >
              Open in Calendly ↗
            </a>
          </div>
        </motion.div>

        {/* RIGHT — Calendly embed */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 },
          }}
          className="lg:col-span-7 w-full"
        >
          <div
            className="rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm"
            style={{
              background: "rgba(5, 0, 58, 0.85)",
              boxShadow:
                "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(44,188,233,0.08)",
            }}
          >
            <div
              className="hidden lg:flex items-center justify-between px-5 py-3 border-b border-white/5"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <p className="font-opensans text-xs font-semibold text-grey uppercase tracking-widest">
                Select a Date &amp; Time
              </p>
              <span className="text-xs font-opensans text-dark-grey">
                Powered by Calendly
              </span>
            </div>
            <CalendlyEmbed />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BookMeeting;
