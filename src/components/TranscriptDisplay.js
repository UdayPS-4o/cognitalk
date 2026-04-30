import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TranscriptDisplay({ transcripts, participants }) {
  const containerRef = useRef(null);

  // Scroll to bottom when new transcripts arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcripts]);
  
  // A helper function to find the participant name based on their ID
  const getParticipantName = (id) => {
    const participant = participants.find(p => p.id === id);
    return participant?.userName || 'Unknown User';
  };

  return (
    <div className="absolute bottom-28 left-0 right-0 z-40 p-4 pointer-events-none">
      <div
        ref={containerRef}
        className="max-h-48 overflow-y-auto w-full max-w-2xl mx-auto rounded-lg bg-black/50 backdrop-blur-lg shadow-lg"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <AnimatePresence>
          {transcripts.map((transcript) => (
            <motion.div
              key={transcript.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4 }}
              className="p-3 my-2 mx-4 rounded-lg bg-white/10 text-white"
            >
              <div className="font-semibold text-sm">
                {getParticipantName(transcript.senderId)}:
              </div>
              <div className="font-light mt-1">
                <p>
                  <span className="text-gray-300">Original:</span> {transcript.source}
                </p>
                <p className="font-medium text-lg mt-1">
                  <span className="text-blue-300">Translated:</span> {transcript.translation}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
