import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaCopy, FaArrowLeft, FaVideo, FaMicrophone, FaEdit, FaRandom,
  FaCheck, FaTimes, FaVideoSlash, FaMicrophoneSlash, FaUser, FaLanguage,
  FaRocket, FaCheckCircle
} from "react-icons/fa";
import Logo from "./components/Logo";

// Floating background elements
const FloatingElements = () => (
  <>
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute opacity-10"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: Math.random() * 5 + 5,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      >
        <div className="w-6 h-6 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 blur-sm"></div>
      </motion.div>
    ))}
  </>
);

export default function SetupPage({
  userName = '',
  setUserName,
  selectedLanguage,
  setSelectedLanguage,
  languages = [],
  setupVideoEnabled,
  setSetupVideoEnabled,
  setupAudioEnabled,
  setSetupAudioEnabled,
  setupVideoRef,
  roomId,
  setRoomId,
  copyRoomId,
  roomCopied,
  onJoin,
  onBack,
  setLocalStream, // ✅ new prop
}) {
  const [isEditingRoomId, setIsEditingRoomId] = useState(false);
  const [tempRoomId, setTempRoomId] = useState(roomId);

  const streamRef = useRef(null);
  const timeoutRef = useRef(null);
  const playPromiseRef = useRef(null);
  const isUpdatingRef = useRef(false);
  const providedToParentRef = useRef(false);

  useEffect(() => {
    let isCancelled = false;

    const updateMediaStream = async () => {
      if (isUpdatingRef.current) return;
      isUpdatingRef.current = true;

      try {
        if (playPromiseRef.current) {
          playPromiseRef.current.catch(() => {});
          playPromiseRef.current = null;
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        if (setupVideoRef.current) {
          setupVideoRef.current.srcObject = null;
          setupVideoRef.current.load();
        }

        if ((!setupVideoEnabled && !setupAudioEnabled) || isCancelled) {
          isUpdatingRef.current = false;
          return;
        }

        const constraints = {
          video: setupVideoEnabled,
          audio: setupAudioEnabled,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (isCancelled) {
          stream.getTracks().forEach(track => track.stop());
          isUpdatingRef.current = false;
          return;
        }

        streamRef.current = stream;

        // ✅ Pass stream up
        if (typeof setLocalStream === "function") {
          setLocalStream(stream);
          providedToParentRef.current = true;
        }

        if (setupVideoRef.current && !isCancelled) {
          setupVideoRef.current.srcObject = stream;
          setupVideoRef.current.play().catch(() => {});
        }
      } catch (error) {
        console.error("Media error:", error);
      } finally {
        if (!isCancelled) isUpdatingRef.current = false;
      }
    };

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(updateMediaStream, 200);

    return () => {
      isCancelled = true;
      isUpdatingRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [setupVideoEnabled, setupAudioEnabled, setupVideoRef, setLocalStream]);

  useEffect(() => {
    return () => {
      if (streamRef.current && !providedToParentRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleRoomIdSave = () => {
    setRoomId(tempRoomId);
    setIsEditingRoomId(false);
  };

  const handleRoomIdCancel = () => {
    setTempRoomId(roomId);
    setIsEditingRoomId(false);
  };

  const generateNewRoomId = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setTempRoomId(newRoomId);
    if (!isEditingRoomId) setRoomId(newRoomId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white relative overflow-hidden">

      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        <FloatingElements />

        {/* Gradient Mesh */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Modern Header */}
      <motion.header
        className="relative z-50 backdrop-blur-xl bg-white/5 border-b border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={onBack}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft size={20} />
            </motion.button>
            <Logo />
            <div className="w-14"></div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >

          {/* Page Title */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Setup Your Call
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Configure your settings and test your camera before joining
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Video Preview Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative w-full aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <video
                  ref={setupVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover transform ${setupVideoEnabled ? 'scale-x-[-1]' : ''}`}
                />

                {/* Video Disabled Overlay */}
                {!setupVideoEnabled && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <FaVideoSlash size={60} className="text-gray-500 mx-auto mb-4" />
                      </motion.div>
                      <p className="text-gray-400 text-lg">Camera is disabled</p>
                    </div>
                  </motion.div>
                )}

                {/* Control Buttons Overlay */}
                <motion.div
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <motion.button
                    onClick={() => setSetupAudioEnabled((prev) => !prev)}
                    className={`p-4 rounded-2xl backdrop-blur-xl border border-white/20 transition-all duration-300 ${
                      setupAudioEnabled
                        ? "bg-green-500/20 text-green-400 shadow-lg shadow-green-500/20"
                        : "bg-red-500/20 text-red-400 shadow-lg shadow-red-500/20"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {setupAudioEnabled ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
                  </motion.button>

                  <motion.button
                    onClick={() => setSetupVideoEnabled((prev) => !prev)}
                    className={`p-4 rounded-2xl backdrop-blur-xl border border-white/20 transition-all duration-300 ${
                      setupVideoEnabled
                        ? "bg-green-500/20 text-green-400 shadow-lg shadow-green-500/20"
                        : "bg-red-500/20 text-red-400 shadow-lg shadow-red-500/20"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {setupVideoEnabled ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>

            {/* Controls and Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-6"
            >

              {/* Ready Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-6"
              >
                <FaRocket className="text-purple-400" />
                <span className="text-sm font-medium">Ready to connect</span>
              </motion.div>

              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Almost there!
              </h2>

              {/* Name Input */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <FaUser className="text-purple-400" />
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your display name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-4 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300"
                />
              </motion.div>

              {/* Language Select */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <FaLanguage className="text-purple-400" />
                  Preferred Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full p-4 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl text-white focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-gray-800">
                      {lang.name}
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Room ID Section */}
              <motion.div
                className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-300">Room ID</span>
                  {!isEditingRoomId ? (
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {roomId}
                      </span>
                      <div className="flex gap-2">
                        <motion.button
                          onClick={copyRoomId}
                          title="Copy Room ID"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaCopy className={`${roomCopied ? "text-green-400" : "text-gray-400"} transition-colors duration-300`} />
                        </motion.button>
                        <motion.button
                          onClick={() => setIsEditingRoomId(true)}
                          title="Edit Room ID"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaEdit className="text-gray-400" />
                        </motion.button>
                        <motion.button
                          onClick={generateNewRoomId}
                          title="Generate New Room ID"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaRandom className="text-gray-400" />
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={tempRoomId}
                        onChange={(e) => setTempRoomId(e.target.value.toUpperCase())}
                        className="w-32 p-2 bg-white/10 border border-white/20 rounded-xl font-mono text-white focus:outline-none focus:border-purple-400"
                      />
                      <motion.button
                        onClick={handleRoomIdSave}
                        className="p-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaCheck />
                      </motion.button>
                      <motion.button
                        onClick={handleRoomIdCancel}
                        className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaTimes />
                      </motion.button>
                    </div>
                  )}
                </div>

                {roomCopied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-green-400 mt-2"
                  >
                    <FaCheckCircle />
                    Room ID copied to clipboard!
                  </motion.div>
                )}
              </motion.div>

              {/* Join Button */}
              <motion.button
                onClick={onJoin}
                disabled={!userName.trim()}
                className="group relative w-full py-4 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl font-bold text-lg shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 overflow-hidden disabled:from-gray-600 disabled:to-gray-700 disabled:shadow-none disabled:cursor-not-allowed"
                whileHover={userName.trim() ? { scale: 1.02, y: -2 } : {}}
                whileTap={userName.trim() ? { scale: 0.98 } : {}}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-3">
                  <FaRocket />
                  {userName.trim() ? "Join the Call" : "Enter your name to continue"}
                </span>
              </motion.button>

              {/* Features List */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-400" />
                  HD Video Quality
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-400" />
                  Real-time Translation
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-400" />
                  Secure Connection
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
