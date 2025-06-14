import { motion } from "framer-motion";
import me from "/assets/hi.png";

export default function Intro() {
  return (
   <section className="flex flex-col md:flex-row items-center justify-center gap-8 py-16 px-4">
      <motion.div
       className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 dark:from-pink-600 dark:via-purple-600 dark:to-indigo-600"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={me}
          alt="Me"
          className="w-full h-full object-cover scale-100 -translate-y-0"
        />
      </motion.div>

      <motion.div
        className="text-center md:text-left max-w-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-4xl font-bold mb-4">Welcome to my portfolio</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
           From fine-tuning language models to crafting smart systems on tiny devices, I love turning ideas into working tech. Dive in and explore what I’ve been working on!
        </p>
      </motion.div>
    </section>
  );
}