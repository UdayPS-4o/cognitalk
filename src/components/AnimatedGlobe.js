import React from "react";
import { motion } from "framer-motion";

export default function AnimatedGlobe() {
  return (
    <div className="relative mx-auto my-8 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative"
      >
        {/* Main Globe */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 shadow-2xl relative overflow-hidden"
        >
          {/* Globe grid lines */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-300 opacity-30"></div>
          <div className="absolute inset-4 rounded-full border border-blue-300 opacity-20"></div>
          <div className="absolute inset-8 rounded-full border border-blue-300 opacity-10"></div>
          
          {/* Continents */}
          <div className="absolute top-12 left-16 w-8 h-6 bg-green-400 rounded opacity-70"></div>
          <div className="absolute top-20 right-12 w-6 h-8 bg-green-400 rounded opacity-70"></div>
          <div className="absolute bottom-16 left-20 w-10 h-4 bg-green-400 rounded opacity-70"></div>
        </motion.div>

        {/* Animated connection lines */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent"
            style={{
              height: '120px',
              left: '50%',
              top: '50%',
              transformOrigin: 'center bottom',
              transform: `rotate(${i * 60}deg) translateX(-50%)`
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scaleY: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Floating avatars */}
        {[
          { top: '10%', left: '20%', delay: 0 },
          { top: '20%', right: '15%', delay: 0.5 },
          { bottom: '25%', left: '15%', delay: 1 },
          { bottom: '15%', right: '20%', delay: 1.5 },
          { top: '50%', left: '5%', delay: 2 },
          { top: '50%', right: '5%', delay: 2.5 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
            style={pos}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              opacity: [0, 1, 0.8],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: pos.delay,
              repeatDelay: 3
            }}
          >
            👤
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
