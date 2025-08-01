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
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [roomCopied, setRoomCopied] = useState(false);
  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  // Refs
  const localVideoRef = useRef(null);
  const setupVideoRef = useRef(null);
  const remoteVideoRefs = useRef(new Map());
  const peerConnections = useRef(new Map());
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);

  // Languages with flags
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' }
  ];

  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };

  // Generate room ID when starting call
  const handleStartCall = () => {
    if (!roomId) {
      const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      setRoomId(randomId);
    }
    setCurrentPage('setup');
  };

  // Initialize media for setup page
  const initializeSetupMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (setupVideoRef.current) {
        setupVideoRef.current.srcObject = stream;
        setupVideoRef.current.play();
      }
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Unable to access camera/microphone. Please check permissions and try again.');
    }
  };

  // Initialize media for call (with constraints)
  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, max: 1280 },
          height: { ideal: 720, max: 720 },
          facingMode: 'user'
        },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      setLocalStream(stream);
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        try { await localVideoRef.current.play(); } catch (playError) {
          console.error('Error playing local video:', playError);
        }
      }
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      if (error.name === 'NotAllowedError') {
        alert('Camera and microphone access denied. Please allow access and refresh the page.');
      } else if (error.name === 'NotFoundError') {
        alert('No camera or microphone found. Please check your devices.');
      } else if (error.name === 'NotReadableError') {
        alert('Camera or microphone is already in use by another application.');
      } else {
        alert('Error accessing camera and microphone: ' + error.message);
      }
      throw error;
    }
  };

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch(console.error);
    }
  }, [localStream]);

  const createPeerConnection = (userId) => {
    const peerConnection = new RTCPeerConnection(configuration);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current);
      });
    }
    peerConnection.addEventListener('icecandidate', (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', {
          candidate: event.candidate,
          room: roomId,
          targetId: userId
        });
      }
    });
    peerConnection.addEventListener('track', (event) => {
      const [remoteStream] = event.streams;
      setRemoteStreams(prev => {
        const newStreams = new Map(prev);
        newStreams.set(userId, remoteStream);
        return newStreams;
      });
    });
    peerConnection.addEventListener('connectionstatechange', () => {
      if (peerConnection.connectionState === 'connected') {
        setIsCallActive(true);
      } else if (
        peerConnection.connectionState === 'disconnected' ||
        peerConnection.connectionState === 'failed'
      ) {
        handleUserDisconnected(userId);
      }
    });
    return peerConnection;
  };

  const handleUserDisconnected = (userId) => {
    const peerConnection = peerConnections.current.get(userId);
    if (peerConnection) {
      peerConnection.close();
      peerConnections.current.delete(userId);
    }
    setRemoteStreams(prev => {
      const newStreams = new Map(prev);
      newStreams.delete(userId);
      return newStreams;
    });
    setParticipants(prev => prev.filter(id => id !== userId));
    if (peerConnections.current.size === 0) {
      setIsCallActive(false);
    }
  };

  const joinRoom = async () => {
    if (!roomId.trim()) {
      alert('Please enter a room ID');
      return;
    }
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    try {
      setConnectionStatus('connecting');
      const stream = await initializeMedia();
      
      // Connect to socket server
      socketRef.current = io('http://localhost:5000');
      
      socketRef.current.on('connect', () => {
        console.log('Connected to server');
        setConnectionStatus('connected');
        setIsConnected(true);
      });
      
      socketRef.current.on('room-users', users => {
        console.log('Room users:', users);
        setParticipants(users);
      });
      
      socketRef.current.on('user-connected', async userId => {
        console.log('User connected:', userId);
        setParticipants(prev => [...prev, userId]);
        const peerConnection = createPeerConnection(userId);
        peerConnections.current.set(userId, peerConnection);
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socketRef.current.emit('offer', { offer, room: roomId, targetId: userId });
      });
      
      socketRef.current.on('offer', async data => {
        console.log('Received offer from:', data.senderId);
        const peerConnection = createPeerConnection(data.senderId);
        peerConnections.current.set(data.senderId, peerConnection);
        await peerConnection.setRemoteDescription(data.offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socketRef.current.emit('answer', { answer, room: roomId, targetId: data.senderId });
      });
      
      socketRef.current.on('answer', async data => {
        console.log('Received answer from:', data.senderId);
        const peerConnection = peerConnections.current.get(data.senderId);
        if (peerConnection) {
          await peerConnection.setRemoteDescription(data.answer);
        }
      });
      
      socketRef.current.on('ice-candidate', async data => {
        const peerConnection = peerConnections.current.get(data.senderId);
        if (peerConnection) {
          try {
            await peerConnection.addIceCandidate(data.candidate);
          } catch (error) {
            console.error('Error adding ICE candidate:', error);
          }
        }
      });
      
      socketRef.current.on('user-disconnected', userId => {
        console.log('User disconnected:', userId);
        handleUserDisconnected(userId);
      });
      
      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from server');
        setConnectionStatus('disconnected');
        setIsConnected(false);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setConnectionStatus('failed');
      });

      // Join the room
      socketRef.current.emit('join-room', roomId, userName);
      setCurrentPage('call');
      
    } catch (error) {
      console.error('Error joining room:', error);
      setConnectionStatus('failed');
      alert('Failed to join room. Please check your connection and try again.');
    }
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setRoomCopied(true);
      setTimeout(() => setRoomCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy room ID:', error);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = roomId;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setRoomCopied(true);
        setTimeout(() => setRoomCopied(false), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
        alert('Failed to copy room ID. Please copy it manually: ' + roomId);
      }
      document.body.removeChild(textArea);
    }
  };

  const leaveRoom = () => {
    console.log('Leaving room...');
    
    // Stop local media tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
    }
    
    // Close all peer connections
    peerConnections.current.forEach(peerConnection => {
      peerConnection.close();
    });
    peerConnections.current.clear();
    
    // Disconnect from socket
    if (socketRef.current) {
      socketRef.current.emit('leave-room', roomId);
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    
    // Reset states
    setLocalStream(null);
    setRemoteStreams(new Map());
    setIsConnected(false);
    setIsCallActive(false);
    setParticipants([]);
    setConnectionStatus('disconnected');
    setChatMessages([]);
    setNewMessage('');
    setIsChatOpen(false);
    localStreamRef.current = null;
    
    // Navigate back to home
    setCurrentPage('home');
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: userName || 'You',
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Emit message to other participants via socket if connected
      if (socketRef.current && isConnected) {
        socketRef.current.emit('chat-message', {
          room: roomId,
          message: message
        });
      }
    }
  };

  // Initialize setup media when entering setup page
  useEffect(() => {
    if (currentPage === 'setup') {
      initializeSetupMedia();
    }
    
    // Cleanup function
    return () => {
      // Only cleanup if we're unmounting the entire app
      if (currentPage === 'setup' || currentPage === 'call') {
        // Don't automatically leave room on component updates
      }
    };
  }, [currentPage]);

  // Socket event listeners for chat
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('chat-message', (data) => {
        setChatMessages(prev => [...prev, data.message]);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.off('chat-message');
        }
      };
    }
  }, [socketRef.current]);

  // Render Routes
  if (currentPage === 'home') {
    return (
      <HomePage
        onStartCall={handleStartCall}
      />
    );
  }
  
  if (currentPage === 'setup') {
    return (
      <SetupPage
        userName={userName}
        setUserName={setUserName}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        languages={languages}
        setupVideoEnabled={setupVideoEnabled}
        setupAudioEnabled={setupAudioEnabled}
        setSetupVideoEnabled={setSetupVideoEnabled}
        setSetupAudioEnabled={setSetupAudioEnabled}
        setupVideoRef={setupVideoRef}
        roomId={roomId}
        setRoomId={setRoomId} // Added this missing prop
        copyRoomId={copyRoomId}
        roomCopied={roomCopied}
        onJoin={joinRoom}
        onBack={() => setCurrentPage('home')}
      />
    );
  }
  
  // Video Call Page
  return (
    <VideoCallPage
      userName={userName}
      roomId={roomId}
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
    />
  );
};

export default App;
