// src/components/VideoGrid.js

import React, { useEffect } from 'react'; // ✅ FIX: Added useEffect to the import

const VideoPlayer = ({ videoRef, stream, userName, isMuted }) => {
  // Use an effect to attach the stream to the video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  return (
    <div className="relative aspect-video bg-gray-800/50 rounded-2xl overflow-hidden border-2 border-transparent">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMuted}
        // Flip the video horizontally for a mirror effect, common for local previews
        className={`w-full h-full object-cover ${isMuted ? 'transform scale-x-[-1]' : ''}`}
      />
      <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg">
        <p className="text-white font-medium text-sm">{userName}</p>
      </div>
    </div>
  );
};

export default function VideoGrid({
  localVideoRef,
  remoteStreams,
  remoteVideoRefs,
  participants,
  userName,
}) {
  const remoteStreamsArray = Array.from(remoteStreams.entries());

  const getParticipantName = (id) => {
    // Find participant based on their socket ID
    const participant = participants.find(p => p.id === id);
    return participant ? participant.userName : 'Guest';
  };

  return (
    <div className="p-4 w-full h-full">
      <div className={`grid gap-4 w-full h-full grid-cols-1 md:grid-cols-2`}>
        {/* Local Video Player */}
        <VideoPlayer
          videoRef={localVideoRef}
          userName={`${userName} (You)`}
          isMuted={true}
        />

        {/* Remote Video Players */}
        {remoteStreamsArray.map(([id, stream]) => {
          // Create or get a ref for this remote stream
          if (!remoteVideoRefs.current.has(id)) {
            remoteVideoRefs.current.set(id, React.createRef());
          }
          const remoteVideoRef = remoteVideoRefs.current.get(id);
          
          return (
            <VideoPlayer
              key={id}
              videoRef={remoteVideoRef}
              stream={stream}
              userName={getParticipantName(id)}
              isMuted={false}
            />
          );
        })}
      </div>
    </div>
  );
}