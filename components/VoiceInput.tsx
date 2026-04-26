"use client";

import { FormEvent, useState } from "react";
import { useSpeechInput } from "@/lib/speech/useSpeechInput";

type VoiceButtonState = "idle" | "recording" | "processing" | "error";

interface VoiceInputProps {
  hasError?: boolean;
  isProcessing?: boolean;
  onSubmit: (text: string) => void | Promise<void>;
}

const buttonCopy: Record<VoiceButtonState, string> = {
  idle: "Klikněte a mluvte",
  recording: "Nahrávám...",
  processing: "Zpracovávám...",
  error: "Zkusit znovu",
};

const statusCopy: Record<VoiceButtonState, string> = {
  idle: "Připraveno k záznamu",
  recording: "Nahrávám...",
  processing: "Zpracovávám...",
  error: "Hlasové zadávání selhalo",
};

const MAX_INPUT_LENGTH = 300;

function MicrophoneIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-16 w-16 sm:h-20 sm:w-20"
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

// Voice and manual text input. Browser speech support is optional and safely detected in the hook.
export function VoiceInput({ hasError = false, isProcessing = false, onSubmit }: VoiceInputProps) {
  const [manualText, setManualText] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const {
    error: speechError,
    interimTranscript,
    isSupported,
    startListening,
    status,
    stopListening,
    transcript,
  } = useSpeechInput({
    onFinalTranscript: (text) => {
      const limitedText = text.slice(0, MAX_INPUT_LENGTH);
      setManualText(limitedText);
      void submitText(limitedText);
    },
  });

  const visibleState: VoiceButtonState = isProcessing
    ? "processing"
    : hasError || status === "error"
      ? "error"
      : status === "recording"
        ? "recording"
        : "idle";

  async function submitText(text: string) {
    const trimmedText = text.slice(0, MAX_INPUT_LENGTH).trim();

    if (!trimmedText) {
      setValidationError("Zadejte nebo nadiktujte nákupní požadavek.");
      return;
    }

    setValidationError(null);
    await onSubmit(trimmedText);
  }

  function handleManualSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitText(manualText);
  }

  function handleVoiceButtonClick() {
    if (isProcessing) {
      return;
    }

    if (status === "recording") {
      stopListening();
      return;
    }

    startListening();
  }

  const trimmedManualText = manualText.trim();
  const isSubmitDisabled = !trimmedManualText || isProcessing;
  const liveTranscript = transcript || interimTranscript;
  const supportMessage =
    isSupported === false
      ? "Hlasové zadávání není v tomto prohlížeči dostupné. Použijte textové pole."
      : null;
  const compactError = speechError || validationError || supportMessage;

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="flex flex-col items-center text-center">
        <button
          type="button"
          onClick={handleVoiceButtonClick}
          disabled={isProcessing}
          className={`relative isolate flex h-48 w-48 items-center justify-center rounded-full border text-white shadow-[0_22px_70px_rgba(22,163,74,0.28)] transition focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed sm:h-56 sm:w-56 lg:h-72 lg:w-72 ${
            visibleState === "recording"
              ? "animate-pulse border-rose-500 bg-rose-600 shadow-[0_22px_70px_rgba(225,29,72,0.25)]"
              : visibleState === "processing"
                ? "border-emerald-600 bg-emerald-600"
                : visibleState === "error"
                  ? "border-rose-500 bg-zinc-800 shadow-[0_22px_70px_rgba(225,29,72,0.18)]"
                  : "border-emerald-600 bg-emerald-600 hover:bg-emerald-700"
          }`}
          aria-label={buttonCopy[visibleState]}
        >
          <span className="absolute inset-[-14px] rounded-full bg-emerald-100/70 -z-10" />
          {visibleState === "processing" ? <SpinnerIcon /> : <MicrophoneIcon />}
        </button>
        <p className="mt-4 text-lg font-semibold text-zinc-950 sm:text-xl">{buttonCopy[visibleState]}</p>
        <p className="mt-1 text-sm text-zinc-500">
          {visibleState === "recording" ? "Po dokončení klepněte znovu." : "nebo napište text níže"}
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900">
          <span
            className={`h-2 w-2 rounded-full ${
              visibleState === "recording"
                ? "bg-rose-500"
                : visibleState === "error"
                  ? "bg-rose-600"
                  : "bg-emerald-600"
            }`}
          />
          {statusCopy[visibleState]}
        </div>
        <p className="mt-2 min-h-5 text-xs text-rose-700">{compactError}</p>
        {liveTranscript ? (
          <p className="mt-1 max-w-md truncate rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600">
            {liveTranscript}
          </p>
        ) : null}
      </div>

      <form onSubmit={handleManualSubmit} className="mt-3 sm:mt-5">
        <label htmlFor="manual-grocery-input" className="sr-only">
          Ruční zadání
        </label>
        <textarea
          id="manual-grocery-input"
          value={manualText}
          onChange={(event) => setManualText(event.target.value)}
          maxLength={MAX_INPUT_LENGTH}
          rows={2}
          className="h-20 w-full resize-none rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 sm:h-24"
          placeholder="Napište, co potřebujete..."
        />
        <div className="mt-1 flex items-center justify-between text-xs text-zinc-500">
          <span>{trimmedManualText ? "Připraveno k převodu" : "Text můžete zadat i bez mikrofonu"}</span>
          <span>
            {manualText.length} / {MAX_INPUT_LENGTH}
          </span>
        </div>
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="mt-3 w-full rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isProcessing ? "Zpracovávám..." : "Převést na nákupní seznam"}
        </button>
      </form>
    </div>
  );
}
