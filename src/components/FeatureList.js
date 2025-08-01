import React from "react";
import { motion } from "framer-motion";
import { FaGlobe, FaVideo, FaCommentDots, FaLock, FaLanguage, FaMobile } from "react-icons/fa";

export default function FeatureList() {
  const features = [
    { icon: <FaGlobe />, title: "Global Reach", description: "Connect worldwide" },
    { icon: <FaVideo />, title: "HD Video", description: "Crystal clear quality" },
    { icon: <FaCommentDots />, title: "Live Chat", description: "Real-time messaging" },
    { icon: <FaLock />, title: "Secure", description: "End-to-end encrypted" },
    { icon: <FaLanguage />, title: "Multi-Language", description: "12+ languages" },
    { icon: <FaMobile />, title: "Responsive", description: "Works on all devices" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
        >
          <div className="text-4xl mb-4 text-blue-400 group-hover:scale-110 transition-transform duration-300">
            {feature.icon}
          </div>
          <h3 className="font-bold text-xl mb-2 text-white">{feature.title}</h3>
          <p className="text-blue-200 text-sm">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
