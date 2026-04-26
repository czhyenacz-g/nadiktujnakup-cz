"use client";

import { FormEvent, useState } from "react";
import { useSpeechInput } from "@/lib/speech/useSpeechInput";
import { StatusMessage } from "./StatusMessage";

type VoiceButtonState = "idle" | "recording" | "processing" | "error";

interface VoiceInputProps {
  hasError?: boolean;
  isProcessing?: boolean;
  onSubmit: (text: string) => void | Promise<void>;
}

const buttonCopy: Record<VoiceButtonState, string> = {
  idle: "Nahrávat",
  recording: "Poslouchám",
  processing: "Převádím",
  error: "Zkusit znovu",
};

function MicrophoneIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-10 w-10"
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
      setManualText(text);
      void submitText(text);
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
    const trimmedText = text.trim();

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

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <button
          type="button"
          onClick={handleVoiceButtonClick}
          disabled={isProcessing || isSupported === false}
          className={`flex h-32 w-32 items-center justify-center rounded-full border text-white shadow-sm transition focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60 ${
            visibleState === "recording"
              ? "border-rose-500 bg-rose-600"
              : visibleState === "processing"
                ? "border-amber-500 bg-amber-500"
                : visibleState === "error"
                  ? "border-zinc-500 bg-zinc-700"
                  : "border-emerald-600 bg-emerald-600 hover:bg-emerald-700"
          }`}
          aria-label={buttonCopy[visibleState]}
        >
          <MicrophoneIcon />
        </button>
        <p className="mt-4 text-base font-semibold text-zinc-950">{buttonCopy[visibleState]}</p>
        <p className="mt-1 min-h-6 text-sm text-zinc-500">
          {status === "recording" ? "Mluvte česky, po ukončení záznamu začnu převádět." : "Klikněte na mikrofon nebo napište text níže."}
        </p>
      </div>

      {isSupported === false ? (
        <div className="mt-5">
          <StatusMessage tone="warning">
            Váš prohlížeč nepodporuje hlasové zadávání. Demo můžete použít přes ruční textové pole.
          </StatusMessage>
        </div>
      ) : null}

      {speechError ? (
        <div className="mt-5">
          <StatusMessage tone="error">{speechError}</StatusMessage>
        </div>
      ) : null}

      {transcript || interimTranscript ? (
        <div className="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Přepis</p>
          <p className="mt-2 text-sm text-zinc-800">{transcript || interimTranscript}</p>
        </div>
      ) : null}

      <form onSubmit={handleManualSubmit} className="mt-5">
        <label htmlFor="manual-grocery-input" className="text-sm font-medium text-zinc-800">
          Ruční zadání
        </label>
        <textarea
          id="manual-grocery-input"
          value={manualText}
          onChange={(event) => setManualText(event.target.value)}
          rows={4}
          className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-3 text-sm text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          placeholder="Např. Chybí mi mléko, vajíčka, banány a něco rychlého k večeři."
        />
        {validationError ? <p className="mt-2 text-sm text-rose-700">{validationError}</p> : null}
        <button
          type="submit"
          disabled={isProcessing}
          className="mt-3 w-full rounded-md bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Převést na nákupní seznam
        </button>
      </form>
    </div>
  );
}
