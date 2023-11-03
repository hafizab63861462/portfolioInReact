import LineGradient from "../components/LineGradient";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const projectVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const Project = ({ title, paragraph }) => {
  const overlayStyles = `absolute h-full w-full opacity-0 hover:opacity-90 transition duration-500
    bg-grey z-30 flex flex-col justify-center items-center text-center p-16 text-deep-blue`;
  const projectTitle = title.split(" ").join("-").toLowerCase();

  return (
    <motion.div variants={projectVariant} className="relative">
      <div className={overlayStyles}>
        <p className="text-2xl font-playfair">{title}</p>
        <p className="mt-7">{paragraph}</p>
      </div>
      <img src={`assets/${projectTitle}.jpeg`} alt={projectTitle} />
    </motion.div>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="pt-48 pb-48">
      {/* HEADINGS */}
      <motion.div
        className="md:w-2/5 mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        variants={{
          hidden: { opacity: 0, y: -50 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <div>
          <p className="font-playfair font-semibold text-4xl">
            <span className="text-red">PRO</span>JECTS
          </p>
          <div className="flex justify-center mt-5">
            <LineGradient width="w-1/3" />
          </div>
        </div>
        <p className="mt-10 mb-10">I work on Number of Project</p>
      </motion.div>

      {/* PROJECTS */}
      <div className="flex justify-center">
        <motion.div
          className="sm:grid sm:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* ROW 1 */}
          <div
            className="flex justify-center text-center items-center p-10 bg-red
              max-w-[400px] max-h-[400px] text-2xl font-playfair font-semibold"
          >
            BEAUTIFUL USER INTERFACES
          </div>
          <Project
            title="Easy Health"
            paragraph="The mission is to improve health outcomes. In this Project, my role is
          as RoR backend Developer. I Mostly work in this Project on Features
       "
          />
          <Project
            title="IOS Projects"
            paragraph="
            •In one year I work on different apps Like Flex Space It's available on the app store
          •I also work on Dhoobi Splash which is SixLogics own Product
          "
          />

          {/* ROW 2 */}
          <Project
            title="FYP (Budding Application)"
            paragraph="Our Mission is to Provide the Same service that Provides PakBizMe.
          This website is not providing its service in Pakistan. In Our Website now users Come and purchase and sale their
          products in different environments like budding etc
          "
          />
          <Project
            title="Bug Management System"
            paragraph="It's my own Practice Project in which there are three users Project Manager Developer and QA Project Manager create Project then assign developer and QA on this Project those who assign project they only see these projects"
          />
          <Project
            title="Hospital Management System"
            paragraph="It's also my Practice Project in which there are 3 users admin Doctor and Patient but for signup here is only two options for Doctors and Patient Admin is by default when ever user login Admin show that user if he is Doctor then he Assign Job to the Doctor in any Hospital . by using my website user only do a job in one hospital and in this Hospital he doing a one treatment only and treatment also assign by Admin to the doctor . and When ever Patient login he or she see all Doctor List that have a Hospital and Treatment in the city then he send request to the Doctor and Doctor have a power to accept and reject Request"
          />

          {/* ROW 3 */}
          <Project
            title="Games"
            paragraph=" I made a Ludo Game in Programming fundamental Subject using C++. I made a Game in Object Oriented Programming Subject using MFC for Designing"
          />
          <Project
            title="Portfolio"
            paragraph="I make this using HTML CSS and bootstrap also deployee 'https://hafizportfolio.netlify.app'"
          />
          <div
            className="flex justify-center text-center items-center p-10 bg-blue
              max-w-[400px] max-h-[400px] text-2xl font-playfair font-semibold"
          >
            SMOOTH USER EXPERIENCE
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
