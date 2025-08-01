import React from "react";
import { motion } from "framer-motion";

export default function VideoGrid({ localVideoRef, remoteStreams, remoteVideoRefs, participants, userName }) {
  const remoteEntries = Array.from(remoteStreams.entries());
  const totalVideos = remoteEntries.length + 1;
  
  const getGridClass = () => {
    if (totalVideos === 1) return "grid-cols-1";
    if (totalVideos === 2) return "grid-cols-1 lg:grid-cols-2";
    if (totalVideos <= 4) return "grid-cols-2";
    return "grid-cols-2 lg:grid-cols-3";
  };

  return (
    <motion.div 
      className={`grid ${getGridClass()} gap-4 p-4 flex-1 max-w-6xl mx-auto`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Local video */}
      <motion.div 
        className="relative bg-gray-900 rounded-xl overflow-hidden shadow-xl aspect-video group"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <video
          ref={localVideoRef}
          autoPlay
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded-full text-white text-sm font-medium">
          {userName || "You"}
        </div>
        <div className="absolute top-4 right-4 bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
      </motion.div>

      {/* Remote videos */}
      {remoteEntries.map(([userId, stream], index) => (
        <motion.div 
          key={userId}
          className="relative bg-gray-900 rounded-xl overflow-hidden shadow-xl aspect-video group"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <video
            ref={el => {
              if (el && remoteVideoRefs.current) {
                remoteVideoRefs.current.set(userId, el);
                if (el.srcObject !== stream) el.srcObject = stream;
              }
            }}
            autoPlay
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded-full text-white text-sm font-medium">
            User {userId.slice(-4)}
          </div>
          <div className="absolute top-4 right-4 bg-blue-500 w-3 h-3 rounded-full animate-pulse"></div>
        </motion.div>
      ))}
    </motion.div>
  );
}
