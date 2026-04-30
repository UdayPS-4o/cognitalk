// TranscriptionService.js (FULLY CORRECTED)

import { useEffect, useRef, useState, useCallback } from "react";
import Recorder from "recorder-js";

const API_URL = "http://192.168.8.94:5001/api/process";

// Helper function to check for silence
const isAudioSilent = (audioBuffer) => {
  const pcmData = audioBuffer.getChannelData(0);
  let sumSquares = 0.0;
  for (const sample of pcmData) {
    sumSquares += sample * sample;
  }
  const rms = Math.sqrt(sumSquares / pcmData.length);
  const SILENCE_THRESHOLD = 0.01;
  return rms < SILENCE_THRESHOLD;
};

export default function TranscriptionService({
  stream,
  sourceLanguage,
  targetLanguage,
  onTranscriptReceived,
  roomId,    // Accept roomId
  socketId,  // Accept socketId
}) {
  const recorderRef = useRef(null);
  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);
  const isProcessingRef = useRef(false);
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const bufferRef = useRef("");

  // NOTE: The socket connection for receiving translations is now handled in App.js

  const mergeSentence = (newText) => {
    if (!newText) return "";
    bufferRef.current += " " + newText.trim();
    if (/[.!?]$/.test(newText.trim())) {
      const fullSentence = bufferRef.current.trim();
      bufferRef.current = "";
      return fullSentence;
    }
    return "";
  };

  const sendChunkForTranscription = useCallback(
    async (audioBlob) => {
      const formData = new FormData();
      formData.append("audio", audioBlob, "chunk.wav");

      // Add room and socket IDs to the request payload
      if (roomId) formData.append("room_id", roomId);
      if (socketId) formData.append("socket_id", socketId);

      if (sourceLanguage) formData.append("source_lang", sourceLanguage);
      if (targetLanguage && targetLanguage !== sourceLanguage) {
        formData.append("target_lang", targetLanguage);
      }

      try {
        const res = await fetch(API_URL, { method: "POST", body: formData });
        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
        const data = await res.json();
        // 🔥 SEND TO NODE SOCKET (for other users)
if (window.socket) {
  window.socket.emit("send-text", {
    text: data.source_text,
    roomId: roomId
  });
}

        // This now only handles displaying the *sender's* own transcript
        const merged = mergeSentence(data?.source_text || "");
        if (merged) {
          onTranscriptReceived({
            id: crypto.randomUUID(),
            senderId: "local",
            source: merged,
            translation: data.translated_text || "",
          });
        }

        // Audio playback for the sender is removed, as the server now sends
        // the audio only to the other participant.

      } catch (err) {
        console.error("Failed to transcribe:", err);
        setError("Transcription failed: " + err.message);
      }
    },
    [onTranscriptReceived, sourceLanguage, targetLanguage, roomId, socketId]
  );

  useEffect(() => {
    if (!stream || !stream.active || !stream.getAudioTracks().find((t) => t.readyState === "live")) {
      return; // No valid stream, do nothing
    }

    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 44100 });
    }

    const recorder = new Recorder(audioContextRef.current);
    recorder.init(stream).then(() => {
        recorderRef.current = recorder;

        const startChunk = () => {
          recorderRef.current?.start().then(() => setIsRecording(true)).catch(console.error);
        };

        const createAndProcessChunk = () => {
            if (isProcessingRef.current) return;
            recorderRef.current.stop().then(async ({ blob }) => {
                if (blob.size < 1000) {
                    if (stream.active) startChunk();
                    return;
                }
                isProcessingRef.current = true;
                try {
                    const arrayBuffer = await blob.arrayBuffer();
                    const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
                    if (!isAudioSilent(audioBuffer)) {
                        await sendChunkForTranscription(blob);
                    }
                } catch(e) {
                    console.error("Error processing audio chunk:", e);
                } finally {
                    isProcessingRef.current = false;
                    if (stream.active) startChunk();
                }
            });
        };

        startChunk();
        // 🔹 FIXED: Increased chunk duration from 4s to 7s
        intervalRef.current = setInterval(createAndProcessChunk, 4000);
      })
      .catch((err) => setError("Recorder init failed: ".concat(err.message)));

    return () => {
      clearInterval(intervalRef.current);
      recorderRef.current?.stop();
      setIsRecording(false);
    };
  }, [stream, sendChunkForTranscription]);

  // UI indicators
  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded-lg z-50">
        {error}
      </div>
    );
  }
  if (isRecording) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg flex items-center z-50">
        <span className="relative flex h-3 w-3 mr-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        Live Transcription Active
      </div>
    );
  }
  return null;
}