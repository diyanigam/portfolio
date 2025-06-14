import { motion } from "framer-motion";
import myImage from "/assets/yay.png";

export default function About() {
  return (
    <section className="flex flex-col md:flex-row-reverse items-center justify-center gap-8 px-4 py-16">
      <motion.div
        className="w-full md:w-[40%] max-w-md rounded-xl overflow-hidden flex-shrink-0"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={myImage}
          alt="About"
          className="w-full h-full object-contain transform -scale-x-100"
        />
      </motion.div>

      <motion.div
        className="text-center md:text-left max-w-xl flex flex-col justify-center"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-semibold mb-4">A Bit More About Me</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Beyond code and research, I love blending creativity with logic! Exploring how hardware, AI, and interaction design can work together to shape intuitive, intelligent tools.
        </p>
      </motion.div>
    </section>
  );
}