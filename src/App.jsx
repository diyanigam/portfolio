import { motion } from "framer-motion"; 


export default function App() {
  return (
    <div>
    <motion.div
      className="text-5xl font-bold text-fuchsia-600 p-10"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
    <div className="text-6xl text-purple-600 font-extrabold p-10">
    Hello World
    </div>
      </motion.div>
      
      <motion.div
          whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          className="text-5xl font-bold text-blue-500 p-10"
        >
        Hover over me
      </motion.div>
</div>

  );
}
