"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { findAnswer } from "@/lib/adunni-knowledge";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const GREETING =
  "Bawo ni! \u1eb8 k\u00e1\u00e0b\u1ecd\u0301! \u2728\n\nI'm \u00c0d\u00fann\u00ed (\u201csweet one\u201d in Yor\u00f9b\u00e1), your alumni platform guide. I can help you with:\n\n\ud83d\udfe1 Registration & Login\n\ud83d\udfe1 Voting & Elections\n\ud83d\udfe1 Attendance Records\n\ud83d\udfe1 Contributions & Payments\n\ud83d\udfe1 News & Updates\n\ud83d\udfe1 Platform Navigation\n\nWhat would you like to know? K\u00ed ni o f\u1eb9\u0301 m\u1ecd\u0300?";

export default function AdunniChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "bot", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);
  const [speakResponse, setSpeakResponse] = useState(true);
  const [listening, setListening] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [supported, setSupported] = useState({ speech: true, recognition: true });
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const msgIdRef = useRef(1);

  const [typingText, setTypingText] = useState("");
  const [typingIndex, setTypingIndex] = useState(-1);

  useEffect(() => {
    setMounted(true);
    const hasSpeech = typeof window !== "undefined" && "speechSynthesis" in window;
    const hasRecognition =
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
    setSupported({ speech: hasSpeech, recognition: hasRecognition });

    if (hasSpeech) {
      const loadVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  useEffect(() => {
    if (typingIndex >= 0 && typingIndex < messages.length) {
      const target = messages[typingIndex];
      if (!target || target.role !== "bot") return;
      let idx = 0;
      const fullText = target.text;
      setTypingText("");
      const interval = setInterval(() => {
        idx++;
        setTypingText(fullText.slice(0, idx));
        if (idx >= fullText.length) {
          clearInterval(interval);
          setTypingIndex(-1);
          setTypingText("");
          if (speakResponse && supported.speech) {
            speak(fullText);
          }
        }
      }, 15);
      return () => clearInterval(interval);
    }
  }, [typingIndex, messages, speakResponse, supported.speech]);

  const findNigerianFemaleVoice = useCallback((): SpeechSynthesisVoice | null => {
    const nigerian = voices.find(
      (v) =>
        (v.lang.includes("NG") || v.lang.includes("GH") || v.lang.includes("ZA")) &&
        (v.name.toLowerCase().includes("female") || v.name.includes("Zira") || v.name.includes("Hazel"))
    );
    if (nigerian) return nigerian;
    const anyFemale = voices.find(
      (v) =>
        v.name.toLowerCase().includes("female") ||
        v.name.includes("Zira") ||
        v.name.includes("Hazel") ||
        v.name.includes("Samantha") ||
        v.name.includes("Moira") ||
        v.name.includes("Tessa") ||
        v.name.includes("Karen")
    );
    return anyFemale || voices[0] || null;
  }, [voices]);

  const stripEmojis = (text: string): string => {
    return text.replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F8FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{27BF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{231A}-\u{23FA}\u{25AA}-\u{25FE}\u{2934}-\u{2935}\u{2B05}-\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}\u{2702}-\u{27B0}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{24C2}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2600}-\u{27BF}\u{2B55}\u{2B1B}-\u{2B1C}]/gu,
      ""
    ).trim();
  };

  const prepareForSpeech = (text: string): string => {
    return stripEmojis(text)
      .replace(/SJMUSSO(?: '07)?/g, "Saint John Mary's Unity Secondary School 2007 Alumni")
      .replace(/SJMUSSO/g, "Saint John Mary's Unity Secondary School")
      .replace(/GDPR/g, "G D P R")
      .replace(/NDPR/g, "N D P R")
      .replace(/TTS/g, "T T S")
      .replace(/\bAI\b/g, "A I");
  };

  const speak = useCallback(
    (text: string) => {
      if (!supported.speech) return;
      const clean = prepareForSpeech(text);
      if (!clean) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(clean);
      const voice = findNigerianFemaleVoice();
      if (voice) utterance.voice = voice;
      utterance.lang = "en-NG";
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    },
    [supported.speech, findNigerianFemaleVoice]
  );

  const startListening = useCallback(() => {
    if (!supported.recognition) return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-NG";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
      handleSend(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    setListening(true);
    recognition.start();
  }, [supported.recognition]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
  }, []);

  const sanitize = (text: string): string => {
    return text
      .replace(/<[^>]*>/g, "")
      .replace(/[<>{}\\]/g, "")
      .slice(0, 500);
  };

  const handleSend = useCallback(
    (rawInput: string) => {
      const text = sanitize(rawInput);
      if (!text.trim()) return;

      const userMsg: Message = { id: msgIdRef.current++, role: "user", text: text.trim() };
      setMessages((prev) => [...prev, userMsg]);

      const result = findAnswer(text.trim());
      const botMsg: Message = { id: msgIdRef.current++, role: "bot", text: result.answer };
      setMessages((prev) => [...prev, botMsg]);
      setTypingIndex(botMsg.id);
      setInput("");
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (listening) stopListening();
    handleSend(input);
  };

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  if (!mounted) return null;

  return (
    <>
      <button
        onClick={toggleOpen}
        className={`fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-110 hover:shadow-2xl active:scale-95 ${
          open ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"
        }`}
        style={{
          background: "linear-gradient(135deg, #054ea4, #e7b801)",
        }}
        aria-label="Chat with Adunni"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      </button>

      <div
        className={`fixed bottom-5 right-5 z-50 flex w-[380px] flex-col overflow-hidden rounded-2xl border border-white/20 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-75 translate-y-8 pointer-events-none"
        }`}
        style={{ height: "min(600px, 80vh)", background: "linear-gradient(180deg, #f8f9fc 0%, #ffffff 100%)" }}
      >
        <div
          className="relative shrink-0 px-5 py-4 text-white"
          style={{
            background: "linear-gradient(135deg, #054ea4, #043a7a)",
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
          <div className="flex items-center gap-3 relative">
            <div className="relative shrink-0">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="21" stroke="url(#a_grad)" strokeWidth="2" fill="white" />
                <defs>
                  <linearGradient id="a_grad" x1="0" y1="0" x2="44" y2="44">
                    <stop stopColor="#e7b801" />
                    <stop offset="1" stopColor="#054ea4" />
                  </linearGradient>
                </defs>
                {/* Gele (head tie) */}
                <path d="M12 20 C12 12, 18 10, 22 10 C26 10, 32 12, 32 20 L32 22 C32 24, 28 26, 22 26 C16 26, 12 24, 12 22 Z" fill="#054ea4" />
                <path d="M14 18 C14 14, 18 12, 22 12 C26 12, 30 14, 30 18 L30 19 C30 21, 26 23, 22 23 C18 23, 14 21, 14 19 Z" fill="#e7b801" />
                <path d="M20 10 Q22 6 24 10" stroke="#054ea4" strokeWidth="1.5" fill="none" />
                <path d="M18 10 Q16 7 14 9" stroke="#054ea4" strokeWidth="1" fill="none" />
                <path d="M26 10 Q28 7 30 9" stroke="#054ea4" strokeWidth="1" fill="none" />
                {/* Face */}
                <circle cx="18" cy="18" r="1.2" fill="#054ea4" />
                <circle cx="26" cy="18" r="1.2" fill="#054ea4" />
                <path d="M19 22 Q22 24 25 22" stroke="#054ea4" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                <ellipse cx="22" cy="14" rx="1.5" ry="0.8" fill="#054ea4" opacity="0.3" />
              </svg>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold tracking-tight">Adunni</h3>
              <p className="text-[10px] text-white/60 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
{`Online \u2022 Yor\u00f9b\u00e1 Guide`}
              </p>
            </div>
            <button
              onClick={toggleOpen}
              className="ml-auto p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} ${
                mounted ? "animate-enter" : "opacity-0"
              }`}
              style={{
                animationDelay: "0s",
                animationDuration: "0.3s",
              }}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-brand-blue text-white rounded-br-md"
                    : "bg-white border border-gray-100 text-gray-700 rounded-bl-md shadow-sm"
                }`}
              >
                {msg.role === "bot" && typingIndex === msg.id && typingText.length < msg.text.length ? (
                  <span>{typingText}<span className="inline-block w-1.5 h-4 bg-brand-blue/50 ml-0.5 animate-pulse" /></span>
                ) : (
                  msg.text.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < msg.text.split("\n").length - 1 && <br />}
                    </span>
                  ))
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="shrink-0 border-t border-gray-100 bg-white px-4 py-3">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            {supported.recognition && (
              <button
                type="button"
                onClick={listening ? stopListening : startListening}
                className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                  listening
                    ? "bg-brand-red text-white shadow-lg shadow-brand-red/30 animate-pulse"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
                aria-label={listening ? "Stop listening" : "Start voice input"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              </button>
            )}
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={listening ? "Listening..." : "Type or speak your question..."}
                className={`input pr-10 text-sm ${listening ? "border-brand-red/50 bg-red-50/50" : ""}`}
                disabled={listening}
                maxLength={500}
              />
              {input.length > 0 && (
                <button
                  type="button"
                  onClick={() => setInput("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!input.trim()}
              className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:bg-blue-700 hover:shadow-md active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-gray-400">{'\u2728'} Ask me anything, sister!</span>
            {supported.speech && (
              <button
                type="button"
                onClick={() => setSpeakResponse(!speakResponse)}
                className={`flex items-center gap-1 text-[10px] transition-colors ${
                  speakResponse ? "text-brand-blue" : "text-gray-300"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3 w-3">
                  {speakResponse ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  )}
                </svg>
                {speakResponse ? "Voice on" : "Voice off"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
