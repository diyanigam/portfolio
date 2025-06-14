import { motion } from "framer-motion"; 
import DarkModeToggle from "./components/darkmode";
import CustomCursor from "./components/cursor";
import SpriteSection from "./components/bot";
import Intro from "./components/intro";
import About from "./components/About";



export default function App() {
  return (
    
    <div className="min-h-screen bg-cream dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500 flex flex-col items-center justify-center p-10 gap-6">
    <CustomCursor />

    <div className="text-black dark:bg-gray-900 dark:text-white">
      <Intro />
    </div>


    <SpriteSection />
    <motion.div
      className="text-5xl font-bold text-fuchsia-600 p-10"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
    <div className="text-6xl text-pink-600 font-extrabold p-10">
    kirby kirby kirby
    </div>
      </motion.div>
      <DarkModeToggle />
      <motion.div
          whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          className="text-5xl font-bold text-blue-500 p-10"
        >
        <button className="cursor-hover">🚧 Work In Progress 🚧</button>
      </motion.div>


      <div className="yay">
   <About />
</div>
</div>



  );
}
