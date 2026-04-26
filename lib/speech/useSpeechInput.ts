"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SpeechInputStatus = "idle" | "recording" | "error";

interface BrowserSpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface BrowserSpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: BrowserSpeechRecognitionAlternative;
}

interface BrowserSpeechRecognitionResultList {
  readonly length: number;
  [index: number]: BrowserSpeechRecognitionResult;
}

interface BrowserSpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: BrowserSpeechRecognitionResultList;
}

interface BrowserSpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message?: string;
}

interface BrowserSpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onend: (() => void) | null;
  onerror: ((event: BrowserSpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  abort(): void;
  start(): void;
  stop(): void;
}

interface BrowserSpeechRecognitionConstructor {
  new (): BrowserSpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
  }
}

interface UseSpeechInputOptions {
  onFinalTranscript?: (transcript: string) => void;
}

export function useSpeechInput({ onFinalTranscript }: UseSpeechInputOptions = {}) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [status, setStatus] = useState<SpeechInputStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const finalTranscriptRef = useRef("");
  const onFinalTranscriptRef = useRef(onFinalTranscript);

  useEffect(() => {
    onFinalTranscriptRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  useEffect(() => {
    setIsSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const startListening = useCallback(() => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setStatus("error");
      setError("Prohlížeč nepodporuje hlasové zadávání. Použijte ruční textové pole.");
      return;
    }

    recognitionRef.current?.abort();
    const recognition = new Recognition();
    recognition.lang = "cs-CZ";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    finalTranscriptRef.current = "";
    setTranscript("");
    setInterimTranscript("");
    setError(null);
    setStatus("recording");

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcriptValue = result[0]?.transcript ?? "";

        if (result.isFinal) {
          finalText += transcriptValue;
        } else {
          interimText += transcriptValue;
        }
      }

      if (finalText.trim()) {
        finalTranscriptRef.current = `${finalTranscriptRef.current} ${finalText}`.trim();
        setTranscript(finalTranscriptRef.current);
      }

      setInterimTranscript(interimText.trim());
    };

    recognition.onerror = (event) => {
      setStatus("error");
      setError(event.message || `Hlasové zadávání selhalo (${event.error}).`);
    };

    recognition.onend = () => {
      const finalTranscript = finalTranscriptRef.current.trim();
      setStatus((currentStatus) => (currentStatus === "error" ? currentStatus : "idle"));
      setInterimTranscript("");

      if (finalTranscript) {
        onFinalTranscriptRef.current?.(finalTranscript);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const resetSpeechInput = useCallback(() => {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    finalTranscriptRef.current = "";
    setStatus("idle");
    setTranscript("");
    setInterimTranscript("");
    setError(null);
  }, []);

  return {
    error,
    interimTranscript,
    isSupported,
    resetSpeechInput,
    startListening,
    status,
    stopListening,
    transcript,
  };
}
