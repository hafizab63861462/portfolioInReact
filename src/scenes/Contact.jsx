import LineGradient from "../components/LineGradient";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import React, { useRef } from "react";

const InfoCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-[#05003a]">
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "linear-gradient(135deg, #24CBFF, #FC59FF)" }}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs text-dark-grey font-opensans uppercase tracking-widest mb-0.5">
        {label}
      </p>
      <p className="text-white font-opensans text-sm font-semibold">{value}</p>
    </div>
  </div>
);

const Contact = () => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();
  const form = useRef();

  const onSubmit = async () => {
    emailjs
      .sendForm(
        "service_t61azuy",
        "template_gs5ykq9",
        form.current,
        "ViFWJV1yVBdlQtx3a",
      )
      .then(
        () => {
          alert("Hafiz Abdullah Received Your Message");
          reset();
        },
        (error) => {
          alert("Message not Send Some thing went wrong", error.text);
        },
      );
  };

  return (
    <section id="contact" className="pt-8 pb-8">
      {/* HEADING */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        variants={{
          hidden: { opacity: 0, y: -30 },
          visible: { opacity: 1, y: 0 },
        }}
        className="text-center mb-16"
      >
        <p className="font-playfair font-semibold text-4xl">
          <span className="text-yellow">CONTACT ME</span> TO GET STARTED
        </p>
        <div className="flex justify-center mt-5">
          <LineGradient width="w-1/3" />
        </div>
        <p className="mt-6 text-grey font-opensans text-lg max-w-xl mx-auto">
          Have a project in mind or want to collaborate? Drop a message and I'll
          get back to you within 24 hours.
        </p>
      </motion.div>

      {/* TWO-COLUMN LAYOUT */}
      <div className="md:flex md:gap-12 items-start">
        {/* LEFT — INFO */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, x: -40 },
            visible: { opacity: 1, x: 0 },
          }}
          className="md:basis-2/5 flex flex-col gap-5 mb-12 md:mb-0"
        >
          <div>
            <p className="font-playfair font-semibold text-3xl text-white leading-snug">
              Let's build something{" "}
              <span className="text-yellow">great together.</span>
            </p>
            <p className="mt-4 text-grey font-opensans text-sm leading-relaxed">
              I'm available for freelance projects, full-time roles, and
              consulting engagements. Whether it's a new product from scratch or
              scaling an existing one — let's talk.
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <InfoCard
              label="Phone"
              value="+92 321 4365740"
              icon={
                <svg
                  className="w-5 h-5 text-deep-blue"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                </svg>
              }
            />
            <InfoCard
              label="Upwork"
              value="Hafiz Abdullah — Top Rated"
              icon={
                <svg
                  className="w-5 h-5 text-deep-blue"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.546-1.405 0-2.543-1.14-2.543-2.546V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
                </svg>
              }
            />
            <InfoCard
              label="Fiverr"
              value="hafizabdulla377"
              icon={
                <svg
                  className="w-5 h-5 text-deep-blue"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 9.685v2.044h-1.74c-1.107 0-1.335.527-1.335 1.29v1.724h3.004l-.392 3.036h-2.612V24h-3.128v-6.221H14.57v-3.036h2.227v-1.99c0-2.21 1.347-3.41 3.312-3.41.943 0 1.754.07 1.99.102v2.24h-1.369c-1.07 0-1.278.51-1.278 1.256v1.648h2.557l-.393 3.036H19.452V24h-3.149V17.78h-2.25v-3.036h2.25v-1.99C16.303 10.54 17.671 9 19.72 9c.942 0 2.32.073 2.28.073V9.685zM8.57 5.143a1.714 1.714 0 11-3.43 0 1.714 1.714 0 013.43 0zM7.714 8H5.143A1.143 1.143 0 004 9.143v9.714C4 19.488 4.512 20 5.143 20h2.571C8.345 20 8.857 19.488 8.857 18.857V9.143C8.857 8.512 8.345 8 7.714 8z" />
                </svg>
              }
            />
          </div>

          {/* availability badge */}
          <div className="flex items-center gap-3 mt-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </span>
            <p className="text-sm font-opensans text-grey">
              Available for new projects
            </p>
          </div>
        </motion.div>

        {/* RIGHT — FORM */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, x: 40 },
            visible: { opacity: 1, x: 0 },
          }}
          className="md:basis-3/5"
        >
          <div
            className="rounded-2xl border border-white/5 p-8"
            style={{
              background: "#05003a",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            }}
          >
            <form
              ref={form}
              onSubmit={handleSubmit(onSubmit)}
              action="https://formspree.io/f/xeqwgrdl"
              method="POST"
              target="_blank"
              className="flex flex-col gap-5"
            >
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-opensans font-semibold uppercase tracking-widest text-dark-grey">
                  Your Name
                </label>
                <input
                  className="w-full bg-deep-blue border border-white/10 rounded-lg px-4 py-3
                    font-opensans text-white placeholder-dark-grey text-sm
                    focus:outline-none focus:border-blue transition duration-300"
                  type="text"
                  placeholder="e.g. John Smith"
                  name="user_name"
                  {...register("user_name", { required: true, maxLength: 100 })}
                />
                {errors.user_name && (
                  <p className="text-red text-xs mt-0.5">
                    {errors.user_name.type === "required" &&
                      "Name is required."}
                    {errors.user_name.type === "maxLength" &&
                      "Max 100 characters."}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-opensans font-semibold uppercase tracking-widest text-dark-grey">
                  Email Address
                </label>
                <input
                  className="w-full bg-deep-blue border border-white/10 rounded-lg px-4 py-3
                    font-opensans text-white placeholder-dark-grey text-sm
                    focus:outline-none focus:border-blue transition duration-300"
                  type="text"
                  placeholder="you@example.com"
                  name="user_email"
                  {...register("user_email", {
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  })}
                />
                {errors.user_email && (
                  <p className="text-red text-xs mt-0.5">
                    {errors.user_email.type === "required" &&
                      "Email is required."}
                    {errors.user_email.type === "pattern" &&
                      "Enter a valid email address."}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-opensans font-semibold uppercase tracking-widest text-dark-grey">
                  Message
                </label>
                <textarea
                  className="w-full bg-deep-blue border border-white/10 rounded-lg px-4 py-3
                    font-opensans text-white placeholder-dark-grey text-sm resize-none
                    focus:outline-none focus:border-blue transition duration-300"
                  name="message"
                  placeholder="Tell me about your project..."
                  rows="5"
                  {...register("message", { required: true, maxLength: 2000 })}
                />
                {errors.message && (
                  <p className="text-red text-xs mt-0.5">
                    {errors.message.type === "required" &&
                      "Message is required."}
                    {errors.message.type === "maxLength" &&
                      "Max 2000 characters."}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 rounded-lg font-opensans font-semibold text-deep-blue
                  text-sm tracking-wide transition duration-300 hover:opacity-80 hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background:
                    "linear-gradient(90deg, #24CBFF 14.53%, #FC59FF 69.36%, #FFBD0C 117.73%)",
                }}
              >
                SEND MESSAGE →
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
