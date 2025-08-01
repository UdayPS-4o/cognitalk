import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCopy, FaArrowLeft, FaVideo, FaMicrophone, FaEdit, FaRandom } from "react-icons/fa";
import Logo from "./components/Logo";

export default function SetupPage({
  userName,
  setUserName,
  selectedLanguage,
  setSelectedLanguage,
  languages,
  setupVideoEnabled,
  setupAudioEnabled,
  setSetupVideoEnabled,
  setSetupAudioEnabled,
  setupVideoRef,
  roomId,
  setRoomId,
  copyRoomId,
  roomCopied,
  onJoin,
  onBack,
}) {
  const [isEditingRoomId, setIsEditingRoomId] = useState(false);
  const [tempRoomId, setTempRoomId] = useState(roomId);
  const [previewStream, setPreviewStream] = useState(null);

  // Initialize camera preview with proper error handling
  useEffect(() => {
    const initializePreview = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: setupVideoEnabled, 
          audio: setupAudioEnabled 
        });
        setPreviewStream(stream);
        if (setupVideoRef.current) {
          setupVideoRef.current.srcObject = stream;
          
          // **FIXED: Proper promise handling for play()**
          const playPromise = setupVideoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('Video preview started successfully');
              })
              .catch(error => {
                console.log('Video preview play interrupted:', error.message);
                // This is expected behavior, not an actual error
              });
          }
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Unable to access camera/microphone. Please check permissions.');
      }
    };

    initializePreview();

    // Cleanup function
    return () => {
      if (previewStream) {
        previewStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [setupVideoEnabled, setupAudioEnabled]);

  // Update video preview when video setting changes
  useEffect(() => {
    const updateVideoTrack = async () => {
      if (previewStream) {
        const videoTracks = previewStream.getVideoTracks();
        videoTracks.forEach(track => {
          track.enabled = setupVideoEnabled;
        });

        if (setupVideoEnabled && videoTracks.length === 0) {
          try {
            const newStream = await navigator.mediaDevices.getUserMedia({ 
              video: true, 
              audio: setupAudioEnabled 
            });
            setPreviewStream(newStream);
            if (setupVideoRef.current) {
              setupVideoRef.current.srcObject = newStream;
              
              // **FIXED: Proper promise handling here too**
              const playPromise = setupVideoRef.current.play();
              if (playPromise !== undefined) {
                playPromise.catch(error => {
                  console.log('Video preview play interrupted:', error.message);
                });
              }
            }
          } catch (error) {
            console.error('Error adding video track:', error);
          }
        }
      }
    };

    updateVideoTrack();
  }, [setupVideoEnabled, setupAudioEnabled]);

  // Update audio preview when audio setting changes
  useEffect(() => {
    if (previewStream) {
      const audioTracks = previewStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = setupAudioEnabled;
      });
    }
  }, [setupAudioEnabled]);

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
    if (!isEditingRoomId) {
      setRoomId(newRoomId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-5"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-30, 30],
              x: [-20, 20],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-4xl border border-white/20 shadow-2xl"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Logo size={40} />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-all duration-300"
          >
            <FaArrowLeft />
          </motion.button>
        </div>

        <motion.h2 
          className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Setup Your Call
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Video preview */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video shadow-xl">
              {setupVideoEnabled ? (
                <video
                  ref={setupVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="text-center text-gray-400">
                    <FaVideo className="text-4xl mb-2 mx-auto" />
                    <p>Camera is off</p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded-full text-white text-sm">
                {setupVideoEnabled ? "Camera On" : "Camera Off"}
              </div>
            </div>

            {/* Media controls */}
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSetupVideoEnabled(!setupVideoEnabled)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  setupVideoEnabled 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                <FaVideo />
                Video {setupVideoEnabled ? 'On' : 'Off'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSetupAudioEnabled(!setupAudioEnabled)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  setupAudioEnabled 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                <FaMicrophone />
                Audio {setupAudioEnabled ? 'On' : 'Off'}
              </motion.button>
            </div>

            {/* Preview info */}
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30">
              <h3 className="font-semibold text-blue-300 mb-2">Camera Preview</h3>
              <p className="text-sm text-blue-200">
                This is how others will see you during the call. You can toggle your camera and microphone on/off anytime.
              </p>
            </div>
          </motion.div>

          {/* Right column - Settings */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Name input */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">Your Display Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
              />
            </div>

            {/* Language selector */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">Preferred Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-gray-800">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Room ID - Editable */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">Room ID</label>
              <div className="space-y-3">
                {isEditingRoomId ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tempRoomId}
                      onChange={(e) => setTempRoomId(e.target.value.toUpperCase())}
                      placeholder="Enter room ID"
                      className="flex-1 px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRoomIdSave}
                      className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-300"
                    >
                      ✓
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRoomIdCancel}
                      className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-300"
                    >
                      ✕
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={roomId}
                      readOnly
                      className="flex-1 px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-mono text-lg"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditingRoomId(true)}
                      className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all duration-300 flex items-center gap-2"
                    >
                      <FaEdit />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyRoomId}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 flex items-center gap-2"
                    >
                      <FaCopy />
                      {roomCopied ? 'Copied!' : 'Copy'}
                    </motion.button>
                  </div>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generateNewRoomId}
                  className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaRandom />
                  Generate New Room ID
                </motion.button>
              </div>
              
              <div className="mt-3 p-3 bg-yellow-500/20 backdrop-blur-sm rounded-xl border border-yellow-400/30">
                <p className="text-sm text-yellow-200">
                  💡 <strong>Tip:</strong> Share this Room ID with others to invite them to your call. 
                  You can edit it or generate a new one anytime.
                </p>
              </div>
            </div>

            {/* Additional settings info */}
            <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30">
              <h3 className="font-semibold text-green-300 mb-2">Ready to Connect?</h3>
              <p className="text-sm text-green-200">
                All settings look good! Click "Join Call" when you're ready to start your conversation.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Join button */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.button
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" 
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onJoin}
            className="px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!userName.trim() || !roomId.trim()}
          >
            <span className="relative z-10">🚀 Join Call</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
          </motion.button>
          
          {(!userName.trim() || !roomId.trim()) && (
            <p className="text-red-300 text-sm mt-2">
              Please enter your name and ensure you have a Room ID to continue.
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
