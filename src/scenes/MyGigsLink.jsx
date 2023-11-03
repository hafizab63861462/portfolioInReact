import LineGradient from "../components/LineGradient";
import { motion } from "framer-motion";

const MyGigsLink = () => {
  return (
    <section id="gigs" className="pt-10 pb-24">
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
            <span className="text-red">My</span> Gigs
          </p>
          <div className="flex justify-center mt-5">
            <LineGradient width="w-1/4" />
          </div>
        </div>
      </motion.div>

    </section>
  );
};

export default MyGigsLink;
