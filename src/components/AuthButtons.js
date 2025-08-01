import React from "react";
import { motion } from "framer-motion";

export default function AuthButtons({ onLogin, onSignup }) {
  return (
    <div className="flex gap-4">
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-full hover:bg-white/30 transition-all duration-300"
        onClick={onLogin}
      >
        Login
      </motion.button>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300"
        onClick={onSignup}
      >
        Sign Up
      </motion.button>
    </div>
  );
}
