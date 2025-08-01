import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaVideo, 
  FaVideoSlash, 
  FaPhoneSlash, 
  FaComments,
  FaTimes,
  FaPaperPlane
} from "react-icons/fa";
import Logo from "./components/Logo";
import VideoGrid from "./components/VideoGrid";

export default function VideoCallPage({
  userName,
  roomId,
  localStream,
  localVideoRef,
  remoteStreams,
  remoteVideoRefs,
  participants,
  isCallActive,
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
}) {
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white flex flex-col relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-400 rounded-full opacity-5"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, 10],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm border-b border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo size={36} />
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-sm text-blue-300">Room ID</div>
            <div className="font-mono text-lg">{roomId}</div>
          </div>
          
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-green-400 animate-pulse"
                  : "bg-red-400"
              }`}
            />
            <span className="text-sm capitalize">{connectionStatus}</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "rgba(239, 68, 68, 0.9)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onLeave}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full font-medium transition-all duration-300"
        >
          <FaPhoneSlash />
          End Call
        </motion.button>
      </motion.header>

      {/* Video Grid */}
      <div className="flex-1 relative z-10">
        <VideoGrid
          localVideoRef={localVideoRef}
          remoteStreams={remoteStreams}
          remoteVideoRefs={remoteVideoRefs}
          participants={participants}
          userName={userName}
        />
      </div>

      {/* Controls */}
      <motion.div 
        className="relative z-10 flex items-center justify-center gap-6 p-6 bg-black/20 backdrop-blur-sm border-t border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleVideo}
          className={`p-4 rounded-full text-2xl transition-all duration-300 ${
            isVideoEnabled
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {isVideoEnabled ? <FaVideo /> : <FaVideoSlash />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleAudio}
          className={`p-4 rounded-full text-2xl transition-all duration-300 ${
            isAudioEnabled
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {isAudioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`p-4 rounded-full text-2xl transition-all duration-300 ${
            isChatOpen
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-gray-600 hover:bg-gray-700 text-white"
          }`}
        >
          <FaComments />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.9)" }}
          whileTap={{ scale: 0.9 }}
          onClick={onLeave}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white text-2xl transition-all duration-300"
        >
          <FaPhoneSlash />
        </motion.button>
      </motion.div>

      {/* Chat Sidebar */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed right-0 top-0 h-full w-80 bg-black/80 backdrop-blur-lg border-l border-white/20 z-50 flex flex-col"
          >
            {/* Chat header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <h3 className="text-lg font-bold">Chat</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsChatOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-all duration-300"
              >
                <FaTimes />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {chatMessages.length === 0 ? (
                  <motion.div 
                    className="text-center text-gray-400 py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No messages yet. Start the conversation!
                  </motion.div>
                ) : (
                  chatMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`max-w-[85%] ${
                        msg.sender === (userName || 'You') 
                          ? 'ml-auto bg-blue-600' 
                          : 'mr-auto bg-gray-700'
                      } rounded-2xl px-4 py-2`}
                    >
                      <div className="font-medium text-sm mb-1">{msg.sender}</div>
                      <div className="break-words">{msg.text}</div>
                      <div className="text-xs opacity-60 mt-1">{msg.timestamp}</div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-white/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all duration-300"
                >
                  <FaPaperPlane />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
