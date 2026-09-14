"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { encodeWavPCM16 } from "@/lib/wav-encoder";
import type { LiveDetectionVerdict } from "@/types/voice";

export type MicState = "idle" | "requesting" | "listening" | "error";

const CHUNK_DURATION_MS = 4000;
const LEVEL_BAR_COUNT = 40;

interface DetectionApiResult {
  classification: string;
  confidence: number;
  real_prob: number;
  spoof_prob: number;
  stub: boolean;
  error?: string;
}

/** Captures the mic, streams ~4s chunks to /api/live-detection, and tracks the rolling verdict feed. */
export function useLiveDetection() {
  const [micState, setMicState] = useState<MicState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [levels, setLevels] = useState<number[]>(() => Array(LEVEL_BAR_COUNT).fill(0));
  const [verdict, setVerdict] = useState<LiveDetectionVerdict | null>(null);
  const [history, setHistory] = useState<LiveDetectionVerdict[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const silentGainRef = useRef<GainNode | null>(null);
  const chunkPartsRef = useRef<Float32Array[]>([]);
  const chunkLengthRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const flushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stoppedRef = useRef(true);

  const flushChunk = useCallback(async () => {
    const ctx = audioCtxRef.current;
    if (!ctx || chunkLengthRef.current === 0) return;

    const merged = new Float32Array(chunkLengthRef.current);
    let offset = 0;
    for (const part of chunkPartsRef.current) {
      merged.set(part, offset);
      offset += part.length;
    }
    chunkPartsRef.current = [];
    chunkLengthRef.current = 0;

    const wavBlob = encodeWavPCM16(merged, ctx.sampleRate);
    const formData = new FormData();
    formData.append("audio", wavBlob, "chunk.wav");

    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/live-detection", { method: "POST", body: formData });
      const data: DetectionApiResult = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Detection failed");

      if (stoppedRef.current) return;
      const entry: LiveDetectionVerdict = {
        classification: data.classification.includes("SPOOF") ? "SPOOF" : "REAL",
        confidence: data.confidence,
        realProb: data.real_prob,
        spoofProb: data.spoof_prob,
        stub: data.stub,
        timestamp: new Date().toISOString(),
      };
      setVerdict(entry);
      setHistory((h) => [entry, ...h].slice(0, 8));
      setError(null);
    } catch (err) {
      if (!stoppedRef.current) setError(err instanceof Error ? err.message : "Detection failed");
    } finally {
      if (!stoppedRef.current) setIsAnalyzing(false);
    }
  }, []);

  const stop = useCallback(() => {
    stoppedRef.current = true;
    if (flushTimerRef.current) clearInterval(flushTimerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    flushTimerRef.current = null;
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
    chunkPartsRef.current = [];
    chunkLengthRef.current = 0;

    setIsAnalyzing(false);
    setMicState("idle");
    setLevels(Array(LEVEL_BAR_COUNT).fill(0));
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setMicState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;

      // ScriptProcessorNode only fires onaudioprocess once connected through
      // to the destination — route it through a zero-gain node so the mic
      // is never actually played back (no feedback loop for the speaker).
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
      stoppedRef.current = false;

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

      flushTimerRef.current = setInterval(flushChunk, CHUNK_DURATION_MS);
    } catch (err) {
      stoppedRef.current = true;
      setMicState("error");
      setError(err instanceof Error ? err.message : "Microphone access was denied");
    }
  }, [flushChunk]);

  useEffect(() => stop, [stop]);

  return { micState, error, levels, verdict, history, isAnalyzing, start, stop };
}
