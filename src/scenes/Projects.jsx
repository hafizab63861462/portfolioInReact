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

const Project = ({
  title,
  paragraph,
  stack = "",
  imageFormat = "jpeg",
  className = "",
  style = {},
}) => {
  const overlayStyles = `absolute opacity-0 hover:opacity-90 transition duration-500 bg-grey z-30 flex flex-col justify-between items-center text-center p-16 text-deep-blue overflow-y-auto`;
  const projectTitle = title.split(" ").join("-").toLowerCase();

  return (
    <motion.div variants={projectVariant} className="relative">
      <div className={overlayStyles} style={{ maxHeight: "25rem" }}>
        <p className="text-2xl font-playfair font-bold mb-4">{`${title} ${stack}`}</p>
        <div className="overflow-y-auto">
          <p>{paragraph}</p>
        </div>
      </div>
      <img
        src={`assets/${projectTitle}.${imageFormat}`}
        alt={projectTitle}
        className={className}
        style={style}
      />
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
        <p className="mt-10 mb-10 text-xl">
          Throughout my career as a Software Engineer, I have had the
          opportunity to work on a diverse range of projects that demonstrate my
          expertise in various technologies and development practices. Below are
          some of the key projects that highlight my skills in frontend and
          backend development, as well as my ability to solve complex problems
          and deliver impactful solutions. Each project is a testament to my
          commitment to quality and innovation, showcasing my proficiency with
          the MERN stack, iOS development, and Ruby on Rails, among other
          technologies
        </p>
      </motion.div>

      {/* PROJECTS */}
      <div className="flex justify-center">
        <motion.div
          className="sm:grid sm:grid-cols-3 gap-4"
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
            I have briefly explained the projects. Please hover over the images
            to read the descriptions
          </div>

          <Project
            title="M1neral"
            stack="(MERN)"
            style={{ width: "25rem", height: "25rem" }}
            paragraph="M1neral is building the first all-in-one transaction management platform for minerals and royalties. M1neral's platform offers a robust spatial search tool to identify opportunities and promote collaboration amongst all parties in the transaction process from buyers and sellers to service providers and financial institutions. The built-for-purpose platform aims to drastically cut cycle times and allow transactions to be completed faster, better, and smarter than ever before"
          />
          <Project
            title="Easy Health"
            stack="(ROR)"
            style={{ width: "25rem", height: "25rem" }}
            imageFormat="jpg"
            paragraph="EasyHealth is a innovative healthcare company dedicated to expanding access to preventive care and helping our clients build relationships with their members.
            EasyHealth's patient-focused, care-obsessed, technology-driven approach - which integrates primary, mental, and social healthcare into one holistic solution - aligns incentives to benefit the patient, health plans, and providers.
            EasyHealth is focused on value based care, risk adjustment, STARs, in-home assessments, and benefit navigation.
            EasyHealth engages the member where they are -- in-the-home and through telehealth -- to develop a 360° view of a members clinical and social needs.
       "
          />
          <Project
            title="Omnilocal"
            stack="(NEXT JS)"
            imageFormat="jpg"
            style={{ width: "25rem", height: "25rem" }}
            paragraph="OmniLocal is a leading hyperlocal advertising and foot traffic attribution solution. We specialize in connecting brands with their target audience in the right place and at the right time, leveraging next-generation targeting and location data. With our fully-integrated tech stack, we provide a comprehensive solution that seamlessly integrates hyperlocal advertising with real-world, in-store visits"
          />

          {/* ROW 2 */}
          <Project
            title="FYP => Ebay"
            stack="(MERN)"
            imageFormat="jpg"
            style={{ width: "25rem", height: "25rem" }}
            paragraph="Our Mission is to Provide the Same service that Provides EBay.
          This website is not providing its service in Pakistan. In Our Website now users Come and purchase and sale their products in different environments like budding etc
          "
          />
          <Project
            title="Bug Management System"
            imageFormat="jpg"
            stack="(ROR)"
            style={{ width: "25rem", height: "25rem" }}
            paragraph="It's my own Practice Project in which there are three users Project Manager Developer and QA Project Manager create Project then assign developer and QA on this Project those who assign project they only see these projects"
          />
          <Project
            title="Hospital Managemet System"
            imageFormat="jpg"
            stack="(ROR)"
            style={{ width: "25rem", height: "25rem" }}
            paragraph="It's also my Practice Project in which there are 3 users admin Doctor and Patient but for signup here is only two options for Doctors and Patient Admin is by default when ever user login Admin show that user if he is Doctor then he Assign Job to the Doctor in any Hospital . by using my website user only do a job in one hospital and in this Hospital he doing a one treatment only and treatment also assign by Admin to the doctor . and When ever Patient login he or she see all Doctor List that have a Hospital and Treatment in the city then he send request to the Doctor and Doctor have a power to accept and reject Request"
          />

          {/* ROW 3 */}
          {/* <Project
            title="Games"
            paragraph=" I made a Ludo Game in Programming fundamental Subject using C++. I made a Game in Object Oriented Programming Subject using MFC for Designing"
          /> */}
          {/* <Project
            title="Portfolio"
            paragraph="I make this using HTML CSS and bootstrap also deployee 'https://hafizportfolio.netlify.app'"
          /> */}
          <div
            className="flex justify-center text-center items-center p-10 bg-blue
              max-w-[400px] max-h-[400px] text-2xl font-playfair font-semibold"
          >
            These are some of the major and well-known projects I've worked on
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
