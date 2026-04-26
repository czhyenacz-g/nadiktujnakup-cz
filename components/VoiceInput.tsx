"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useSpeechInput } from "@/lib/speech/useSpeechInput";

type VoiceInputMode = "idle" | "recording" | "reviewing" | "error";
type VisibleState = VoiceInputMode | "processing";

interface VoiceInputProps {
  hasError?: boolean;
  isProcessing?: boolean;
  onReset?: () => void;
  onSubmit: (text: string) => void | Promise<void>;
}

const MAX_INPUT_LENGTH = 300;

const statusCopy: Record<VisibleState, string> = {
  idle: "Připraveno k záznamu",
  recording: "Nahrávám...",
  reviewing: "Čeká na potvrzení",
  processing: "Zpracovávám...",
  error: "Hlasové zadávání selhalo",
};

function MicrophoneIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-14 w-14 sm:h-20 sm:w-20"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <path d="M12 19v3" />
      <path d="M8 22h8" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <span
      aria-hidden="true"
      className="h-14 w-14 animate-spin rounded-full border-4 border-white/40 border-t-white sm:h-16 sm:w-16"
    />
  );
}

function StatusPill({ state }: { state: VisibleState }) {
  const dotClass =
    state === "recording" || state === "error"
      ? "bg-rose-600"
      : state === "processing"
        ? "bg-amber-500"
        : "bg-emerald-600";

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900">
      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      {statusCopy[state]}
    </div>
  );
}

interface ReviewCardProps {
  errorMessage?: string | null;
  helper: string;
  isProcessing: boolean;
  onRecordAgain: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onTextChange: (value: string) => void;
  placeholder: string;
  recordAgainLabel: string;
  showRecordAgain: boolean;
  statusState: VisibleState;
  text: string;
  title: string;
}

function ReviewCard({
  errorMessage,
  helper,
  isProcessing,
  onRecordAgain,
  onSubmit,
  onTextChange,
  placeholder,
  recordAgainLabel,
  showRecordAgain,
  statusState,
  text,
  title,
}: ReviewCardProps) {
  const trimmedText = text.trim();

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto min-h-[18.75rem] w-full max-w-xl rounded-[1.5rem] border border-zinc-200 bg-white p-3.5 text-left shadow-[0_24px_80px_rgba(15,23,42,0.10)] transition sm:min-h-[22rem] sm:rounded-[2rem] sm:p-5"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950 sm:text-xl">{title}</h2>
          <p className="mt-1 text-sm leading-5 text-zinc-600 sm:leading-6">{helper}</p>
        </div>
        <StatusPill state={statusState} />
      </div>

      <label htmlFor="grocery-transcript" className="sr-only">
        Text nákupního požadavku
      </label>
      <textarea
        id="grocery-transcript"
        value={text}
        onChange={(event) => onTextChange(event.target.value.slice(0, MAX_INPUT_LENGTH))}
        disabled={isProcessing}
        maxLength={MAX_INPUT_LENGTH}
        rows={5}
        className="mt-3 h-28 w-full resize-none rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70 sm:mt-4 sm:h-36"
        placeholder={placeholder}
      />
      <div className="mt-2 flex items-center justify-between gap-3 text-xs text-zinc-500">
        <span className="min-h-5 text-rose-700">{errorMessage}</span>
        <span className="shrink-0">
          {text.length} / {MAX_INPUT_LENGTH}
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
        <button
          type="submit"
          disabled={!trimmedText || isProcessing}
          className="min-h-11 rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isProcessing ? "Zpracovávám..." : "Zpracovat nákup"}
        </button>
        {showRecordAgain ? (
          <button
            type="button"
            onClick={onRecordAgain}
            disabled={isProcessing}
            className="min-h-11 rounded-2xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {recordAgainLabel}
          </button>
        ) : null}
      </div>
    </form>
  );
}

// Voice-first input. Speech fills one editable transcript state; parsing starts only after confirmation.
export function VoiceInput({ hasError = false, isProcessing = false, onReset, onSubmit }: VoiceInputProps) {
  const [mode, setMode] = useState<VoiceInputMode>("idle");
  const [transcriptText, setTranscriptText] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const wasRecordingRef = useRef(false);
  const {
    error: speechError,
    interimTranscript,
    isSupported,
    resetSpeechInput,
    startListening,
    status,
    stopListening,
    transcript,
  } = useSpeechInput({
    onFinalTranscript: (text) => {
      const limitedText = text.slice(0, MAX_INPUT_LENGTH);
      setTranscriptText(limitedText);
      setMode("reviewing");
      setValidationError(null);
    },
  });

  useEffect(() => {
    if (isSupported === false && mode === "idle") {
      setMode("error");
    }
  }, [isSupported, mode]);

  useEffect(() => {
    if (status === "recording") {
      wasRecordingRef.current = true;
      setMode("recording");
      return;
    }

    if (status === "error") {
      wasRecordingRef.current = false;
      setMode("error");
      return;
    }

    if (status === "idle" && wasRecordingRef.current && mode === "recording") {
      wasRecordingRef.current = false;
      const capturedText = (transcript || interimTranscript).slice(0, MAX_INPUT_LENGTH).trim();

      if (capturedText) {
        setTranscriptText(capturedText);
        setMode("reviewing");
      } else {
        setMode("error");
        setValidationError("Nepodařilo se rozpoznat text. Požadavek můžete napsat ručně.");
      }
    }
  }, [interimTranscript, mode, status, transcript]);

  useEffect(() => {
    if (hasError && !isProcessing) {
      setMode((currentMode) => (currentMode === "idle" ? "error" : currentMode));
    }
  }, [hasError, isProcessing]);

  function clearResultContext() {
    onReset?.();
    setValidationError(null);
  }

  function handleStartRecording() {
    if (isProcessing) {
      return;
    }

    if (isSupported === false) {
      setMode("error");
      return;
    }

    clearResultContext();
    setTranscriptText("");
    resetSpeechInput();
    setMode("recording");
    startListening();
  }

  function handleStopRecording() {
    stopListening();
  }

  function handleRecordAgain() {
    clearResultContext();
    setTranscriptText("");
    resetSpeechInput();
    setMode(isSupported === false ? "error" : "idle");
  }

  async function handleReviewSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedText = transcriptText.slice(0, MAX_INPUT_LENGTH).trim();

    if (!trimmedText) {
      setValidationError("Zadejte nebo nadiktujte nákupní požadavek.");
      return;
    }

    setTranscriptText(trimmedText);
    setValidationError(null);
    await onSubmit(trimmedText);
    setMode("reviewing");
  }

  const visibleState: VisibleState = isProcessing ? "processing" : mode;
  const fallbackMessage =
    isSupported === false
      ? "Hlasové zadávání není dostupné. Požadavek můžete napsat ručně."
      : speechError || "Požadavek můžete napsat ručně nebo zkusit hlas znovu.";
  const shouldShowReview = mode === "reviewing" || mode === "error" || isProcessing;
  const reviewTitle = mode === "error" && !transcriptText ? "Napište požadavek" : "Zkontrolujte text";
  const reviewHelper =
    mode === "error" && !transcriptText
      ? fallbackMessage
      : "Text můžete před zpracováním upravit.";
  const recordAgainLabel = mode === "error" && !transcriptText ? "Zkusit hlas znovu" : "Nahrát znovu";

  if (shouldShowReview) {
    return (
      <ReviewCard
        errorMessage={validationError}
        helper={reviewHelper}
        isProcessing={isProcessing}
        onRecordAgain={handleRecordAgain}
        onSubmit={handleReviewSubmit}
        onTextChange={(value) => {
          setTranscriptText(value);
          setValidationError(null);
        }}
        placeholder="Např. Chybí mi mléko, vajíčka, banány a něco rychlého k večeři."
        recordAgainLabel={recordAgainLabel}
        showRecordAgain={isSupported !== false}
        statusState={visibleState}
        text={transcriptText}
        title={reviewTitle}
      />
    );
  }

  return (
    <div className="mx-auto flex min-h-[18.75rem] w-full max-w-xl flex-col items-center justify-center text-center transition sm:min-h-[22rem]">
      <button
        type="button"
        onClick={handleStartRecording}
        disabled={isProcessing}
        className={`relative isolate flex h-44 w-44 items-center justify-center rounded-full border text-white shadow-[0_22px_70px_rgba(22,163,74,0.28)] transition focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed sm:h-56 sm:w-56 lg:h-72 lg:w-72 ${
          visibleState === "recording"
            ? "animate-pulse border-rose-500 bg-rose-600 shadow-[0_22px_70px_rgba(225,29,72,0.25)]"
            : "border-emerald-600 bg-emerald-600 hover:bg-emerald-700"
        }`}
        aria-label={visibleState === "recording" ? "Nahrávám" : "Klikněte a mluvte"}
      >
        <span className="absolute inset-[-14px] -z-10 rounded-full bg-emerald-100/70" />
        {visibleState === "processing" ? <SpinnerIcon /> : <MicrophoneIcon />}
      </button>

      <p className="mt-4 text-lg font-semibold text-zinc-950 sm:text-xl">
        {visibleState === "recording" ? "Nahrávám..." : "Klikněte a mluvte"}
      </p>
      <p className="mt-1 text-sm text-zinc-500">
        {visibleState === "recording" ? "Mluvte přirozeně." : "Po dokončení zkontrolujete text."}
      </p>
      <div className="mt-3">
        <StatusPill state={visibleState} />
      </div>

      {visibleState === "recording" ? (
        <button
          type="button"
          onClick={handleStopRecording}
          className="mt-3 min-h-11 rounded-full border border-rose-200 bg-rose-50 px-5 py-2.5 text-xs font-semibold text-rose-800 transition hover:bg-rose-100"
        >
          Zastavit nahrávání
        </button>
      ) : null}
    </div>
  );
}
