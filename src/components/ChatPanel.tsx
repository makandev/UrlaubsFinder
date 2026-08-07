"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Destination } from "@/lib/types";
import { destinations } from "@/data/destinations";
import { planReply, type AgentReply, type Block } from "@/lib/agentEngine";
import { heroPhoto, galleryPhotos } from "@/lib/photos";
import { SmartImage } from "@/components/SmartImage";
import { WeatherWidget } from "@/components/WeatherWidget";
import { useI18n } from "@/i18n/I18nProvider";

type Turn =
  | { role: "user"; text: string }
  | { role: "agent"; reply: AgentReply };

function RelatedChips({ ids }: { ids: string[] }) {
  const items = ids.map((id) => destinations.find((x) => x.id === id)).filter(Boolean) as Destination[];
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((x) => (
        <Link
          key={x.id}
          href={`/place/${x.id}`}
          className="flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium hover:bg-surface2"
        >
          <span aria-hidden>{x.countryEmoji}</span> {x.name}
        </Link>
      ))}
    </div>
  );
}

function BlockView({ d, block, de }: { d: Destination; block: Block; de: boolean }) {
  switch (block.kind) {
    case "text":
      return (
        <div className="rounded-xl border border-line bg-surface2 p-3 text-sm text-ink">
          {block.title && (
            <p className="mb-0.5 font-semibold">
              {block.icon && <span aria-hidden className="mr-1.5">{block.icon}</span>}
              {block.title}
            </p>
          )}
          <p className={block.title ? "text-inksoft" : ""}>
            {!block.title && block.icon && <span aria-hidden className="mr-1.5">{block.icon}</span>}
            {block.text}
          </p>
        </div>
      );
    case "secret":
      return (
        <div className="rounded-xl border border-amber/40 bg-amber/10 p-3 text-sm">
          <p className="mb-0.5 font-semibold text-amber">💎 {de ? "Geheimtipp" : "Hidden-gem take"}</p>
          <p className="text-ink">{block.text}</p>
        </div>
      );
    case "gallery": {
      const hero = heroPhoto(d.id);
      const extra = galleryPhotos(d.id).slice(1);
      return (
        <div className="flex flex-col gap-2">
          <SmartImage photo={hero} gradient={d.gradient} alt={d.name} className="aspect-[16/10] rounded-xl" />
          {extra.length > 0 && (
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 snap-x">
              {extra.map((p, i) => (
                <div key={i} className="w-32 flex-none snap-start">
                  <SmartImage photo={p} gradient={d.gradient} alt={`${d.name} ${i + 2}`} className="aspect-[4/3] rounded-lg" />
                </div>
              ))}
            </div>
          )}
          {!hero && (
            <p className="text-[11px] text-inkfaint">
              {de ? "Echte Fotos folgen automatisch aus der Bild-Pipeline." : "Real photos arrive automatically from the image pipeline."}
            </p>
          )}
        </div>
      );
    }
    case "weather":
      return <WeatherWidget lat={d.lat} lng={d.lng} />;
    case "facts":
      return (
        <div className="grid grid-cols-2 gap-2">
          {block.items.map(([k, v]) => (
            <div key={k} className="rounded-lg border border-line bg-surface p-2.5">
              <p className="text-[11px] text-inkfaint">{k}</p>
              <p className="text-sm font-semibold">{v}</p>
            </div>
          ))}
        </div>
      );
    case "related":
      return <RelatedChips ids={block.ids} />;
    case "links":
      return (
        <div className="grid grid-cols-2 gap-2">
          {block.items.map((it) => (
            <a
              key={it.label}
              href={it.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium hover:bg-surface2"
            >
              <span aria-hidden>{it.icon}</span> {it.label}
            </a>
          ))}
        </div>
      );
  }
}

function AgentTurn({ d, reply, de }: { d: Destination; reply: AgentReply; de: boolean }) {
  // Blöcke gestaffelt einblenden, damit die Aktionen sichtbar "passieren".
  const [shown, setShown] = useState(1);
  useEffect(() => {
    if (shown >= reply.blocks.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), 320);
    return () => clearTimeout(t);
  }, [shown, reply.blocks.length]);

  return (
    <div className="flex flex-col gap-2">
      <div className="self-start rounded-2xl border border-line bg-surface2 px-3 py-2 text-sm text-ink">{reply.intro}</div>
      <div className="flex flex-wrap gap-1">
        {reply.steps.map((s) => (
          <span key={s} className="rounded-full bg-tealsoft px-2 py-0.5 text-[11px] font-medium text-teal">
            {s} ✓
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {reply.blocks.slice(0, shown).map((b, i) => (
          <div key={i} className="rise">
            <BlockView d={d} block={b} de={de} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatPanel({ d, secret }: { d: Destination; secret: number }) {
  const { t, locale } = useI18n();
  const de = locale === "de";
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const suggestions = de
    ? [`Zeig mir alles`, `Wie ist das Wetter?`, `Was ist geheim hier?`, `Fotos & Videos`, `Was liegt in der Nähe?`]
    : [`Show me everything`, `How's the weather?`, `What's hidden here?`, `Photos & videos`, `What's nearby?`];

  const wikiUrl = heroPhoto(d.id)?.sourceUrl;

  const ask = (question: string) => {
    const qq = question.trim();
    if (!qq) return;
    const reply = planReply(d, qq, secret, destinations, locale, wikiUrl);
    setTurns((m) => [...m, { role: "user", text: qq }, { role: "agent", reply }]);
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
      <p className="mt-1 text-xs text-inksoft">
        {de
          ? "Stell eine Frage — der Coach führt mehrere Aktionen aus (Fotos, Fakten, Geheimtipp, Wetter, Links)."
          : "Ask a question — the coach performs several actions at once (photos, facts, hidden-gem, weather, links)."}
      </p>

      <div ref={listRef} className="mt-3 flex max-h-[28rem] flex-col gap-3 overflow-y-auto">
        {turns.length === 0 && (
          <div className="self-start rounded-2xl border border-line bg-surface2 px-3 py-2 text-sm text-ink">
            {t("chat.intro")}
          </div>
        )}
        {turns.map((turn, i) =>
          turn.role === "user" ? (
            <div key={i} className="max-w-[90%] self-end rounded-2xl bg-teal px-3 py-2 text-sm text-white">
              {turn.text}
            </div>
          ) : (
            <AgentTurn key={i} d={d} reply={turn.reply} de={de} />
          ),
        )}
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
