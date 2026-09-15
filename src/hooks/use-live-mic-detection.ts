"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface LiveDetectionResult {
  spoof_prob: number;
  real_prob: number;
  spoof_logit: number;
  real_logit: number;
  classification: string;
  confidence: number;
  risk_score: number;
  is_deepfake: boolean;
  buffer_duration_sec: number;
}

export function useLiveMicDetection(serverWsUrl?: string) {
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<LiveDetectionResult | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Target Backend WebSocket URL resolution for local and hosted production
  const getWebSocketUrl = useCallback(() => {
    if (serverWsUrl) return serverWsUrl;
    if (process.env.NEXT_PUBLIC_WS_URL) return process.env.NEXT_PUBLIC_WS_URL;

    // Fallback based on browser environment protocol
    if (typeof window !== "undefined") {
      const isHttps = window.location.protocol === "https:";
      const protocol = isHttps ? "wss:" : "ws:";
      const host = window.location.hostname;
      if (host !== "localhost" && host !== "127.0.0.1") {
        return `${protocol}//${host}:8000/ws/live-detection`;
      }
    }
    return "ws://localhost:8000/ws/live-detection";
  }, [serverWsUrl]);

  const targetWsUrl = getWebSocketUrl();

  const stopListening = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsListening(false);
    setAudioLevel(0);
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    try {
      // 1. Establish WebSocket Connection
      const ws = new WebSocket(targetWsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("⚡ Live WebSocket Stream connected to Nes2Net backend");
      };

      ws.onmessage = (event) => {
        try {
          const payload: LiveDetectionResult = JSON.parse(event.data);
          setResult(payload);
        } catch (e) {
          console.error("Failed to parse websocket message:", e);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket connection error:", err);
        setError("Could not connect to live detection backend server.");
        stopListening();
      };

      ws.onclose = () => {
        setIsListening(false);
      };

      // 2. Request Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
        },
      });
      streamRef.current = stream;

      // 3. Set up Web Audio API Pipeline (16,000 Hz target sample rate)
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx({ sampleRate: 16000 });
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      // Process 4096 frames at a time
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(audioCtx.destination);

      processor.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          return;
        }

        const inputData = e.inputBuffer.getChannelData(0);
        
        // Calculate RMS audio level for waveform visualizer (0.0 to 1.0 scale)
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        setAudioLevel(Math.min(1, rms * 5)); // Scaled level

        // Send raw Float32 array buffer over WebSocket
        wsRef.current.send(inputData.buffer);
      };

      setIsListening(true);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setError(err.message || "Failed to access microphone.");
      stopListening();
    }
  }, [targetWsUrl, stopListening]);

  // Clean up audio streams on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isListening,
    result,
    audioLevel,
    error,
    startListening,
    stopListening,
  };
}
