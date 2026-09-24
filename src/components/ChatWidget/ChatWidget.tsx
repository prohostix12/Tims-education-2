"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./ChatWidget.module.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const INITIAL_GREETING =
  "Hi! I'm TIMS AI — your advisor for TIMS Education. How can I assist you today?";

const QUICK_ACTIONS = [
  "Distance Education",
  "SSLC / Plus Two",
  "Degree & PG Admissions",
];

function BotIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g filter="url(#bubble-shadow)">
        <path
          d="M 28 19 H 72 C 79.7 19 86 25.3 86 33 V 55 C 86 62.7 79.7 69 72 69 H 68 L 74.8 82.5 C 75.3 83.5 74.2 84.3 73.4 83.6 L 59.5 69 H 28 C 20.3 69 14 62.7 14 55 V 33 C 14 25.3 20.3 19 28 19 Z"
          fill="#ffffff"
        />
      </g>
      <circle cx="37" cy="42" r="8" fill="#6b21a8" />
      <circle cx="40" cy="39" r="2.8" fill="#ffffff" />
      <circle cx="63" cy="42" r="8" fill="#6b21a8" />
      <circle cx="66" cy="39" r="2.8" fill="#ffffff" />
      <rect x="43" y="55" width="14" height="5" rx="2.5" fill="#6b21a8" />
      <defs>
        <filter id="bubble-shadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="1" dy="3" stdDeviation="2" floodColor="#3b0764" floodOpacity="0.25" />
        </filter>
      </defs>
    </svg>
  );
}

function MinimizeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
        fill="currentColor"
      />
    </svg>
  );
}

function renderFormattedText(rawText: string) {
  const lines = rawText.split("\n");

  return lines.map((line, lineIndex) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={`empty-${lineIndex}`} style={{ height: "6px" }} />;
    }

    const isBullet = /^(?:[\-*•]|(?:\d+\.))\s+/.test(trimmed);
    const cleanContent = isBullet ? trimmed.replace(/^(?:[\-*•]|(?:\d+\.))\s+/, "") : trimmed;

    const parts = cleanContent.split(/(\*\*.*?\*\*)/g);
    const formattedParts = parts.map((part, pIndex) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return <strong key={pIndex}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    if (isBullet) {
      return (
        <li key={lineIndex} className={styles.listItem}>
          {formattedParts}
        </li>
      );
    }

    return (
      <p key={lineIndex} className={styles.paragraph}>
        {formattedParts}
      </p>
    );
  });
}

export default function ChatWidget() {
  // Initially open by default when page opens
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      role: "assistant",
      text: INITIAL_GREETING,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isLoading]);

  const sendMessageText = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    const historyPayload = updatedMessages.map((m) => ({
      role: m.role,
      text: m.text,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          history: historyPayload.slice(0, -1),
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      const assistantReplyText =
        data.reply ||
        "I'm having trouble reaching the assistant right now — please try again in a moment.";

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: assistantReplyText,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Failed to send chat message:", err);
      const fallbackMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text:
          "I'm having trouble reaching the assistant right now — please try again in a moment.",
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    sendMessageText(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        type="button"
        className={styles.launcherButton}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close TIMS Chat" : "Open TIMS Chat"}
      >
        <div className={styles.launcherIconWrapper}>
          {isOpen ? <MinimizeIcon size={22} /> : <BotIcon size={46} />}
        </div>
      </button>

      {/* Floating Chat Panel */}
      {isOpen && (
        <div className={styles.panel} role="dialog" aria-label="TIMS AI Advisor Chat">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <div className={styles.avatarWrapper}>
                <div className={styles.avatar}>
                  <BotIcon size={22} />
                </div>
                <span className={styles.onlineBadge} />
              </div>
              <div className={styles.headerText}>
                <span className={styles.headerTitle}>TIMS AI</span>
                <span className={styles.headerSubtitle}>
                  AI guide · usually replies instantly
                </span>
              </div>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Minimize Chat"
            >
              <MinimizeIcon />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className={styles.messagesList}>
            {messages.map((msg, idx) => (
              <React.Fragment key={msg.id}>
                <div
                  className={`${styles.messageRow} ${
                    msg.role === "user" ? styles.userRow : styles.assistantRow
                  }`}
                >
                  <div
                    className={`${styles.messageBubble} ${
                      msg.role === "user" ? styles.userBubble : styles.assistantBubble
                    }`}
                  >
                    {msg.role === "assistant"
                      ? renderFormattedText(msg.text)
                      : msg.text}
                  </div>
                </div>

                {/* Quick Action Suggestion Pills shown under initial assistant message */}
                {idx === 0 && msg.role === "assistant" && (
                  <div className={styles.quickActionsRow}>
                    {QUICK_ACTIONS.map((actionText) => (
                      <button
                        key={actionText}
                        type="button"
                        className={styles.quickActionPill}
                        onClick={() => sendMessageText(actionText)}
                        disabled={isLoading}
                      >
                        {actionText}
                      </button>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className={`${styles.messageRow} ${styles.assistantRow}`}>
                <div className={styles.typingIndicator} aria-label="Assistant is typing">
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className={styles.inputArea}>
            <div className={styles.inputWrapper}>
              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                placeholder="Ask TIMS AI..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                maxLength={2000}
              />
              <button
                type="button"
                className={styles.sendButton}
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                aria-label="Send Message"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

