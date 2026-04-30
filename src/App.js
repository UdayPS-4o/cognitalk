import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import HomePage from './HomePage';
import SetupPage from './SetupPage';
import VideoCallPage from './VideoCallPage';

const App = () => {
  // Routing state
  const [currentPage, setCurrentPage] = useState('home');
  const [roomId, setRoomId] = useState('');
  // User setup state
  const [userName, setUserName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [setupVideoEnabled, setSetupVideoEnabled] = useState(true);
  const [setupAudioEnabled, setSetupAudioEnabled] = useState(true);
  // Video call state
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [roomCopied, setRoomCopied] = useState(false);
  const [socketId, setSocketId] = useState(null); // State for current user's socket ID
  // Chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  // Transcripts
  const [transcripts, setTranscripts] = useState([]);

  // Refs
  const localVideoRef = useRef(null);
  const setupVideoRef = useRef(null);
  const remoteVideoRefs = useRef(new Map());
  const peerConnections = useRef(new Map());
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);

  // --- NEW: Refs for robust audio playback ---
  const audioQueueRef = useRef([]);
  const isPlayingAudioRef = useRef(false);
  const audioObjectRef = useRef(null);

  useEffect(() => {
    // Create a single, persistent Audio object
    audioObjectRef.current = new Audio();
    const audio = audioObjectRef.current;
    
    // When one audio clip finishes, try to play the next one
    const handleAudioEnd = () => {
      isPlayingAudioRef.current = false;
      playNextInQueue();
    };
    
    audio.addEventListener('ended', handleAudioEnd);

    // Cleanup function
    return () => {
      audio.removeEventListener('ended', handleAudioEnd);
    };
  }, []);


  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' }
  ];

  const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  };

  // Effect for cleaning up connections on component unmount
  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      peerConnections.current.forEach(pc => pc.close());
    };
  }, []);

  // --- NEW: Function to play audio from a queue ---
  const playNextInQueue = () => {
    if (isPlayingAudioRef.current || audioQueueRef.current.length === 0) {
      return;
    }
    isPlayingAudioRef.current = true;
    const audioUrl = audioQueueRef.current.shift(); // Get the next URL
    audioObjectRef.current.src = audioUrl;
    
    audioObjectRef.current.play()
      .then(() => {
        console.log("Translation audio playback started successfully.");
      })
      .catch(error => {
        console.error("Audio playback failed:", error);
        // If it fails, we stop trying for this clip and allow the next one.
        isPlayingAudioRef.current = false; 
        playNextInQueue();
      });
  };

const handleStartCall = (room) => {
  const newRoom = typeof room === "string"
    ? room
    : Math.random().toString(36).substring(2, 8).toUpperCase();

  setRoomId(newRoom);
  setCurrentPage("setup");
};
  const createPeerConnection = (remoteUser) => {
    const pc = new RTCPeerConnection(configuration);
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current.emit('ice-candidate', { candidate: e.candidate, targetId: remoteUser.id });
      }
    };

    pc.ontrack = (e) => {
      setRemoteStreams(prev => new Map(prev).set(remoteUser.id, e.streams[0]));
    };
    
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setIsCallActive(true);
        setParticipants(prev => {
          if (prev.find(p => p.id === remoteUser.id)) return prev;
          return [...prev, remoteUser];
        });
      }
      if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) {
        handleUserDisconnected(remoteUser.id);
      }
    };

    peerConnections.current.set(remoteUser.id, pc);
    return pc;
  };

  const handleUserDisconnected = (userId) => {
    peerConnections.current.get(userId)?.close();
    peerConnections.current.delete(userId);
    setRemoteStreams(prev => {
      const newMap = new Map(prev);
      newMap.delete(userId);
      return newMap;
    });
    setParticipants(prev => prev.filter(p => p.id !== userId));
  };

  const joinRoom = async () => {
    if (!roomId.trim() || !userName.trim()) return;
    
if (!localStream) {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      localStreamRef.current = stream;
    } catch (err) {
      console.error("Camera/Mic access denied:", err);
      alert("Please allow camera and microphone access");
      return;
    }
  } else {
    alert("Camera/Microphone not supported on this device/browser.\nUse laptop or HTTPS.");
    return;
  }
} else {
  localStreamRef.current = localStream;
}
    
  socketRef.current = io(`https://${window.location.hostname}:5000`);
  window.socket = socketRef.current;

    socketRef.current.on("connect", () => {
      // 🎤 Speech Recognition Start

      setConnectionStatus("connected");
      setSocketId(socketRef.current.id);
      socketRef.current.emit("join-room", roomId, { userName, language: selectedLanguage });
      setCurrentPage("call");
    });

    socketRef.current.on("room-users", async (users) => {
      setParticipants(users);
      for (const user of users) {
        if (peerConnections.current.has(user.id)) continue;
        const pc = createPeerConnection(user);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current.emit("offer", { offer, targetId: user.id });
      }
    });

    socketRef.current.on("offer", async ({ offer, senderId }) => {
      const remoteUser = { id: senderId }; 
      const pc = createPeerConnection(remoteUser);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socketRef.current.emit("answer", { answer, targetId: senderId });
    });

    socketRef.current.on("answer", async ({ answer, senderId }) => {
      const pc = peerConnections.current.get(senderId);
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socketRef.current.on("ice-candidate", async ({ candidate, senderId }) => {
      const pc = peerConnections.current.get(senderId);
      if (pc) await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    // --- FINAL FIX FOR AUDIO PLAYBACK ---
    socketRef.current.on("new-translation", (data) => {
      handleNewTranscript({
  id: crypto.randomUUID(),
  senderId: "remote",
  source: data.source_text,
  translation: data.translated_text,
});
      console.log("Received 'new-translation' event:", data);

      if (!data || !data.translated_text || !data.translated_text.trim()) {
        return;
      }


      // --- Use the new audio queue system ---
      if (data.audio_url) {
        audioQueueRef.current.push(`https://${window.location.hostname}:5000${data.audio_url}`);
        playNextInQueue();
      }
    });

    socketRef.current.on("chat-message", (msg) => {
      setChatMessages(prev => [...prev, msg]);
    });

    socketRef.current.on("user-disconnected", (id) => {
      handleUserDisconnected(id);
    });
  };

  const handleNewTranscript = (msg) => {
    setTranscripts(prev => [...prev, msg]);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setRoomCopied(true);
    setTimeout(() => setRoomCopied(false), 2000);
  };

  const leaveRoom = () => {
    socketRef.current?.disconnect();
    peerConnections.current.forEach(pc => pc.close());
    peerConnections.current.clear();
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    setLocalStream(null);
    setRemoteStreams(new Map());
    setParticipants([]);
    setCurrentPage("home");
    setIsCallActive(false);
    setConnectionStatus("disconnected");
    setChatMessages([]);
    setTranscripts([]);
  };

  const toggleVideo = () => {
    localStreamRef.current.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
      setIsVideoEnabled(track.enabled);
    });
  };

  const toggleAudio = () => {
    localStreamRef.current.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
      setIsAudioEnabled(track.enabled);
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = { id: Date.now(), sender: userName, text: newMessage, timestamp: new Date().toLocaleTimeString() };
    socketRef.current.emit("chat-message", msg);
    setChatMessages(prev => [...prev, msg]);
    setNewMessage("");
  };

  if (currentPage === "home") {
    return <HomePage onStartCall={handleStartCall} />;
  }

  if (currentPage === "setup") {
    return (
      <SetupPage
        userName={userName}
        setUserName={setUserName}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        languages={languages}
        setupVideoEnabled={setupVideoEnabled}
        setSetupVideoEnabled={setSetupVideoEnabled}
        setupAudioEnabled={setupAudioEnabled}
        setSetupAudioEnabled={setSetupAudioEnabled}
        setupVideoRef={setupVideoRef}
        roomId={roomId}
        setRoomId={setRoomId}
        copyRoomId={copyRoomId}
        roomCopied={roomCopied}
        onJoin={joinRoom}
        onBack={() => setCurrentPage("home")}
        setLocalStream={setLocalStream}
      />
    );
  }

  return (
    <VideoCallPage
      userName={userName}
      roomId={roomId}
      socketId={socketId}
      localStream={localStream}
      localVideoRef={localVideoRef}
      remoteStreams={remoteStreams}
      remoteVideoRefs={remoteVideoRefs}
      participants={participants}
      isCallActive={isCallActive}
      isVideoEnabled={isVideoEnabled}
      isAudioEnabled={isAudioEnabled}
      onToggleVideo={toggleVideo}
      onToggleAudio={toggleAudio}
      onLeave={leaveRoom}
      isChatOpen={isChatOpen}
      setIsChatOpen={setIsChatOpen}
      chatMessages={chatMessages}
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      sendMessage={sendMessage}
      connectionStatus={connectionStatus}
      selectedLanguage={selectedLanguage}
      onNewTranscript={handleNewTranscript}
      transcripts={transcripts}
    />
  );
};

export default App;

