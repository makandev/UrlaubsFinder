"use client";

import { useRef, useState } from "react";
import type { Destination } from "@/lib/types";
import { destinations } from "@/data/destinations";
import { localAnswer } from "@/lib/chatEngine";
import { useI18n } from "@/i18n/I18nProvider";

interface Msg {
  role: "user" | "coach";
  text: string;
}

export function ChatPanel({ d, secret }: { d: Destination; secret: number }) {
  const { t, locale } = useI18n();
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "coach", text: t("chat.intro") }]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const suggestions =
    locale === "de"
      ? [`Wie ist das Wetter?`, `Wo esse ich am besten?`, `Mit wenig Budget machbar?`, `Was ist geheim hier?`]
      : [`How's the weather?`, `Where to eat?`, `Doable on a budget?`, `What's hidden here?`];

  const ask = (question: string) => {
    const qq = question.trim();
    if (!qq) return;
    const answer = localAnswer(d, qq, secret, destinations, locale);
    setMsgs((m) => [...m, { role: "user", text: qq }, { role: "coach", text: answer }]);
    setInput("");
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <h2 className="flex items-center gap-2 font-bold">
        <span aria-hidden>🧠</span> {t("detail.chat")}
      </h2>
      <p className="mt-1 text-xs text-inksoft">{t("detail.chatHint")}</p>

      <div ref={listRef} className="mt-3 flex max-h-64 flex-col gap-2 overflow-y-auto">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${
              m.role === "user"
                ? "self-end bg-teal text-white"
                : "self-start border border-line bg-surface2 text-ink"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => ask(s)}
            className="rounded-full border border-dashed border-line px-2.5 py-1 text-xs text-inksoft hover:bg-surface2"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("chat.placeholder")}
          className="flex-1 rounded-lg border border-line bg-ground px-3 py-2 text-sm outline-none focus:border-teal"
        />
        <button
          type="submit"
          className="rounded-lg bg-teal px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          {t("chat.send")}
        </button>
      </form>

      <p className="mt-2 text-[11px] text-inkfaint">{t("chat.aiNote")}</p>
    </div>
  );
}
