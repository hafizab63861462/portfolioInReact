"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

import Landing from "@/scenes/Landing";
import DotGroup from "@/scenes/DotGroup";
import MySkills from "@/scenes/MySkills";
import Projects from "@/scenes/Projects";
import MyGigsLink from "@/scenes/MyGigsLink";
import BookMeeting from "@/scenes/BookMeeting";
import Contact from "@/scenes/Contact";
import LineGradient from "@/components/LineGradient";

const HomeSections = ({ cards }) => {
  const [selectedPage, setSelectedPage] = useState("home");
  const pathname = usePathname();

  useEffect(() => {
    // There is no App Router hook for the fragment — it is never sent to the
    // server. Reading it inside the effect (not during render) is what keeps
    // this hydration-safe.
    const hash = window.location.hash;
    if (!hash) return;

    // Allow layout + the Calendly placeholder to settle before scrolling.
    const timer = setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ block: "start" });
        setSelectedPage(hash.slice(1));
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <div className="w-5/6 mx-auto md:h-full">
        <DotGroup
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
        <motion.div onViewportEnter={() => setSelectedPage("home")}>
          <Landing setSelectedPage={setSelectedPage} />
        </motion.div>
      </div>

      <LineGradient />
      <div className="w-5/6 mx-auto">
        <motion.div onViewportEnter={() => setSelectedPage("skills")}>
          <MySkills />
        </motion.div>
      </div>

      <LineGradient />
      <div className="w-5/6 mx-auto">
        <motion.div onViewportEnter={() => setSelectedPage("projects")}>
          <Projects cards={cards} />
        </motion.div>
      </div>

      <LineGradient />
      <div className="w-5/6 mx-auto">
        <motion.div onViewportEnter={() => setSelectedPage("gigs")}>
          <MyGigsLink />
        </motion.div>
      </div>

      <LineGradient />
      <div className="w-5/6 mx-auto">
        <motion.div onViewportEnter={() => setSelectedPage("book-meeting")}>
          <BookMeeting />
        </motion.div>
      </div>

      <LineGradient />
      <div className="w-5/6 mx-auto">
        <motion.div onViewportEnter={() => setSelectedPage("contact")}>
          <Contact />
        </motion.div>
      </div>
    </>
  );
};

export default HomeSections;
