// AudioRecorder.js
import React, { useEffect, useRef, useState } from "react";

export default function AudioRecorder() {
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const stoppedRef = useRef(false);

  const API_URL = (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL + "/process")
    || "http://localhost:8000/api/process";

  useEffect(() => {
    let recorder;
    stoppedRef.current = false;

    const startContinuousTranscription = async () => {
      setError("");
      setListening(false);
      setTranscript("Starting...");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = async (event) => {
          if (event.data.size > 0 && !stoppedRef.current) {
            await sendChunkForTranscription(event.data);
          }
        };

        recorder.onstart = () => setListening(true);
        recorder.onerror = (ev) => setError("Recorder error: " + ev?.error?.message || "unknown");
        recorder.start(2000);

      } catch (err) {
        setError("Microphone error: " + err.message);
      }
    };

    startContinuousTranscription();

    return () => {
      stoppedRef.current = true;
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const sendChunkForTranscription = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "chunk.webm");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`API ${res.status}: ${body}`);
      }
      const data = await res.json();
      setTranscript((prev) =>
        prev && data.source_text ? prev + " " + data.source_text.trim() : data.source_text?.trim() || prev
      );
    } catch (err) {
      setError("Failed to transcribe audio. " + err.message);
    }
  };

  return (
    <div style={{
      margin: 30, padding: 20, border: "2px solid #2096F3", borderRadius: 8,
      background: "#f0f9ff", color: "#222",
      minHeight: 120
    }}>
      <div>
        <strong>Status:</strong> {listening ? "Listening..." : "Starting..."}
        {error && <span style={{ color: "red", marginLeft: 10 }}>{error}</span>}
      </div>
      <div style={{
        minHeight: 40, marginTop: 14, padding: 10,
        border: "1px solid #aaa", borderRadius: 6,
        background: "#fff", fontFamily: "monospace"
      }}>
        {transcript || "Waiting for audio..."}
      </div>
      <div style={{marginTop: 20, fontSize:12, color: "#444"}}>
        This will continuously listen, chunk, and transcribe until you leave this page.
      </div>
    </div>
  );
}
