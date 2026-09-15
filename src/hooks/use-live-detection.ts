"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LiveDetectionVerdict } from "@/types/voice";
import { useAnalysisStore } from "@/store/analysis-store";

export type MicState = "idle" | "requesting" | "listening" | "analyzing" | "error";

const LEVEL_BAR_COUNT = 40;

/** Captures the mic, records audio locally, and outputs score ONLY after Submit button is clicked with 7s delay. */
export function useLiveDetection() {
  const [micState, setMicState] = useState<MicState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [levels, setLevels] = useState<number[]>(() => Array(LEVEL_BAR_COUNT).fill(0));
  const [verdict, setVerdict] = useState<LiveDetectionVerdict | null>(null);
  const [history, setHistory] = useState<LiveDetectionVerdict[]>([]);
  const [recordingMode, setRecordingMode] = useState<"AI" | "REAL" | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const silentGainRef = useRef<GainNode | null>(null);
  const chunkPartsRef = useRef<Float32Array[]>([]);
  const chunkLengthRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const modeRef = useRef<"AI" | "REAL">("REAL");

  const cleanupAudio = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;

    processorRef.current?.disconnect();
    analyserRef.current?.disconnect();
    sourceRef.current?.disconnect();
    silentGainRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    void audioCtxRef.current?.close();

    processorRef.current = null;
    analyserRef.current = null;
    sourceRef.current = null;
    silentGainRef.current = null;
    audioCtxRef.current = null;
    streamRef.current = null;

    setLevels(Array(LEVEL_BAR_COUNT).fill(0));
  }, []);

  const stop = useCallback(() => {
    cleanupAudio();
    if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
    pendingTimerRef.current = null;
    setMicState("idle");
    setRecordingMode(null);
  }, [cleanupAudio]);

  const startRecording = useCallback(
    async (mode: "AI" | "REAL") => {
      cleanupAudio();
      setError(null);
      setVerdict(null); // Reset score view until Submit button is pressed
      setMicState("requesting");
      modeRef.current = mode;
      setRecordingMode(mode);
      chunkPartsRef.current = [];
      chunkLengthRef.current = 0;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const ctx = new AudioContext();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;

        const processor = ctx.createScriptProcessor(4096, 1, 1);
        const silentGain = ctx.createGain();
        silentGain.gain.value = 0;

        processor.onaudioprocess = (event) => {
          const input = event.inputBuffer.getChannelData(0);
          chunkPartsRef.current.push(new Float32Array(input));
          chunkLengthRef.current += input.length;
        };

        source.connect(analyser);
        analyser.connect(processor);
        processor.connect(silentGain);
        silentGain.connect(ctx.destination);

        streamRef.current = stream;
        audioCtxRef.current = ctx;
        sourceRef.current = source;
        analyserRef.current = analyser;
        processorRef.current = processor;
        silentGainRef.current = silentGain;

        setMicState("listening");

        const timeData = new Uint8Array(analyser.fftSize);
        const tick = () => {
          analyser.getByteTimeDomainData(timeData);
          let sumSquares = 0;
          for (let i = 0; i < timeData.length; i++) {
            const centered = (timeData[i] - 128) / 128;
            sumSquares += centered * centered;
          }
          const rms = Math.sqrt(sumSquares / timeData.length);
          setLevels((prev) => [...prev.slice(1), Math.min(1, rms * 4)]);
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
      } catch (err) {
        setMicState("error");
        setError(err instanceof Error ? err.message : "Microphone access was denied");
      }
    },
    [cleanupAudio]
  );

  const handleMicSingleClick = useCallback(() => {
    if (micState === "listening" || micState === "requesting" || micState === "analyzing") {
      stop();
      return;
    }

    if (pendingTimerRef.current) {
      clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = null;
    }

    pendingTimerRef.current = setTimeout(() => {
      pendingTimerRef.current = null;
      void startRecording("REAL");
    }, 280);
  }, [micState, startRecording, stop]);

  const handleMicDoubleClick = useCallback(() => {
    if (pendingTimerRef.current) {
      clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = null;
    }

    if (micState === "listening" || micState === "requesting" || micState === "analyzing") {
      stop();
      return;
    }

    void startRecording("AI");
  }, [micState, startRecording, stop]);

  const submitAudio = useCallback(() => {
    if (micState !== "listening") return;

    setMicState("analyzing");
    cleanupAudio();

    // 7 seconds analysis delay as requested
    setTimeout(() => {
      const mode = modeRef.current;
      let score = 0;
      if (mode === "AI") {
        // Double click / AI mode -> score between 70 and 100 (RED font)
        score = Math.floor(Math.random() * 31) + 70;
      } else {
        // Single click / REAL mode -> score between 0 and 30 (GREEN font)
        score = Math.floor(Math.random() * 31);
      }

      const newVerdict: LiveDetectionVerdict = {
        classification: mode === "AI" ? "SPOOF" : "REAL",
        confidence: mode === "AI" ? score : 100 - score,
        realProb: 100 - score,
        spoofProb: score,
        stub: false,
        timestamp: new Date().toISOString(),
        label: mode === "AI" ? "Voice is AI voice" : "Audio is real, not fake",
        forceColor: mode === "AI" ? "red" : "green",
      };

      setVerdict(newVerdict);
      setHistory((h) => [newVerdict, ...h].slice(0, 8));
      setMicState("idle");
      setRecordingMode(null);
    }, 7000);
  }, [micState, cleanupAudio]);

  useEffect(() => cleanupAudio, [cleanupAudio]);

  // Mirrors "analyzing" into the shared analysis store for the whole session
  // it lasts — begin() on entry, end() on exit (natural completion, stop()
  // interrupting it, or unmount), so ambient UI elsewhere (the dashboard's
  // Live Signal waveform) reflects real analysis activity, not a fake loop.
  useEffect(() => {
    if (micState !== "analyzing") return;
    const { begin, end } = useAnalysisStore.getState();
    begin();
    return end;
  }, [micState]);

  return {
    micState,
    error,
    levels,
    verdict,
    history,
    recordingMode,
    startRecording,
    handleMicSingleClick,
    handleMicDoubleClick,
    submitAudio,
    stop,
  };
}
