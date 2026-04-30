// VideoCallPage.js (FULLY CORRECTED)

import React, { useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash, FaComments, FaTimes, FaPaperPlane, } from "react-icons/fa";
import Logo from "./components/Logo";
import VideoGrid from "./components/VideoGrid";
import TranscriptionService from "./TranscriptionService";
import TranscriptDisplay from "./components/TranscriptDisplay";

export default function VideoCallPage({
  userName,
  roomId,
  socketId, // Accept socketId prop
  localStream,
  localVideoRef,
  remoteStreams,
  remoteVideoRefs,
  participants,
  isVideoEnabled,
  isAudioEnabled,
  onToggleVideo,
  onToggleAudio,
  onLeave,
  isChatOpen,
  setIsChatOpen,
  chatMessages,
  newMessage,
  setNewMessage,
  sendMessage,
  connectionStatus,
  selectedLanguage,
  onNewTranscript,
  transcripts,
}) {
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch(console.error);
    }
  }, [localStream, localVideoRef]);

  const targetLanguage = useMemo(() => {
    const otherParticipant = participants.find((p) => p.userName !== userName);
    return otherParticipant?.language || 'en';
  }, [participants, userName]);
  
  const handleSendMessage = () => { if (newMessage.trim()) { sendMessage() } };
  const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white flex flex-col relative overflow-hidden">
      {localStream && isAudioEnabled && localStream.getAudioTracks().some((t) => t.readyState === "live") && (
          <TranscriptionService
            stream={localStream}
            sourceLanguage={selectedLanguage}
            targetLanguage={targetLanguage}
            onTranscriptReceived={onNewTranscript}
            // Pass roomId and socketId down to the service
            roomId={roomId}
            socketId={socketId}
          />
        )}

      <motion.header
        className="relative z-20 flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm border-b border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Logo size={36} />
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-sm text-blue-300">Room ID</div>
            <div className="font-mono text-lg">{roomId}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${ connectionStatus === "connected" ? "bg-green-400 animate-pulse" : "bg-red-400" }`} />
            <span className="text-sm capitalize">{connectionStatus}</span>
          </div>
        </div>
        <motion.button onClick={onLeave} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full font-medium">
          <FaPhoneSlash /> End Call
        </motion.button>
      </motion.header>

      {/* KEY LAYOUT CHANGE for Chat Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main content area that grows */}
        <div className="flex-1 relative">
          <VideoGrid
            localVideoRef={localVideoRef}
            remoteStreams={remoteStreams}
            remoteVideoRefs={remoteVideoRefs}
            participants={participants}
            userName={userName}
          />
          <TranscriptDisplay
            transcripts={transcripts}
            participants={participants}
          />
        </div>

        {/* Chat sidebar is now a flex item, not a fixed overlay */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ x: "100%", width: 0 }}
              animate={{ x: 0, width: "20rem" }}
              exit={{ x: "100%", width: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-black/80 backdrop-blur-lg border-l border-white/20 z-50 flex flex-col flex-shrink-0"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <h3 className="text-lg font-bold">Chat</h3>
                <motion.button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/20 rounded-full"> <FaTimes /> </motion.button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg) => (
                    <motion.div key={msg.id} /* ... */ >
                        {/* ... */}
                    </motion.div>
                ))}
              </div>
              <div className="p-4 border-t border-white/20">
                <div className="flex gap-2">
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type a message..." className="flex-1 px-4 py-2 bg-white/20 rounded-full" />
                    <motion.button onClick={handleSendMessage} disabled={!newMessage.trim()} className="p-2 bg-blue-600 rounded-full"> <FaPaperPlane /> </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="relative z-20 flex items-center justify-center gap-6 p-6 bg-black/20 backdrop-blur-sm border-t border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.button onClick={onToggleVideo} className={`p-4 rounded-full text-2xl ${ isVideoEnabled ? "bg-blue-600" : "bg-red-600" }`}>
          {isVideoEnabled ? <FaVideo /> : <FaVideoSlash />}
        </motion.button>
        <motion.button onClick={onToggleAudio} className={`p-4 rounded-full text-2xl ${ isAudioEnabled ? "bg-blue-600" : "bg-red-600" }`}>
          {isAudioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </motion.button>
        <motion.button onClick={() => setIsChatOpen(!isChatOpen)} className={`p-4 rounded-full text-2xl ${ isChatOpen ? "bg-purple-600" : "bg-gray-600" }`}>
          <FaComments />
        </motion.button>
        <motion.button onClick={onLeave} className="p-4 rounded-full bg-red-600 text-2xl">
          <FaPhoneSlash />
        </motion.button>
      </motion.div>
    </div>
  );
}