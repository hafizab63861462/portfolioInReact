import Landing from "../scenes/Landing";
import DotGroup from "../scenes/DotGroup";
import MySkills from "../scenes/MySkills";
import LineGradient from "../components/LineGradient";
import Projects from "../scenes/Projects";
import MyGigsLink from "../scenes/MyGigsLink";
import BookMeeting from "../scenes/BookMeeting";
import Contact from "../scenes/Contact";
import useMediaQuery from "../hooks/useMediaQuery";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const Home = () => {
  const [selectedPage, setSelectedPage] = useState("home");
  const isDesktop = useMediaQuery("(min-width: 1060px)");
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const scrollToSection = () => {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        const sectionId = location.hash.replace("#", "");
        setSelectedPage(sectionId);
      }
    };

    // Allow layout + Calendly placeholder to settle before scrolling
    const timer = setTimeout(scrollToSection, 350);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <div className="w-5/6 mx-auto md:h-full">
        {isDesktop && (
          <DotGroup
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
          />
        )}
        <motion.div
          margin="0 0 -200px 0"
          amount="all"
          onViewportEnter={() => setSelectedPage("home")}
        >
          <Landing setSelectedPage={setSelectedPage} />
        </motion.div>
      </div>
      <LineGradient />
      <div className="w-5/6 mx-auto ">
        <motion.div
          margin="0 0 -200px 0"
          amount="all"
          onViewportEnter={() => setSelectedPage("skills")}
        >
          <MySkills />
        </motion.div>
      </div>
      <LineGradient />
      <div className="w-5/6 mx-auto">
        <motion.div
          margin="0 0 -200px 0"
          amount="all"
          onViewportEnter={() => setSelectedPage("projects")}
        >
          <Projects />
        </motion.div>
      </div>
      <LineGradient />
      <div className="w-5/6 mx-auto">
        <motion.div
          margin="0 0 -200px 0"
          amount="all"
          onViewportEnter={() => setSelectedPage("gigs")}
        >
          <MyGigsLink />
        </motion.div>
      </div>
      <LineGradient />
      <div className="w-5/6 mx-auto">
        <motion.div
          margin="0 0 -200px 0"
          amount="all"
          onViewportEnter={() => setSelectedPage("book-meeting")}
        >
          <BookMeeting />
        </motion.div>
      </div>
      <LineGradient />
      <div className="w-5/6 mx-auto">
        <motion.div
          margin="0 0 -200px 0"
          amount="all"
          onViewportEnter={() => setSelectedPage("contact")}
        >
          <Contact />
        </motion.div>
      </div>
    </>
  );
};

export default Home;
