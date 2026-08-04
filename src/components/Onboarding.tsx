"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { useStore } from "@/lib/store";
import { defaultPrefs } from "@/lib/scoring";
import type { DictKey } from "@/i18n/dictionaries";

type Answers = { q1?: "a" | "b"; q2?: "a" | "b"; q3?: "a" | "b" };

const QUESTIONS: { key: keyof Answers; q: DictKey; a: DictKey; b: DictKey }[] = [
  { key: "q1", q: "onboard.q1", a: "onboard.q1a", b: "onboard.q1b" },
  { key: "q2", q: "onboard.q2", a: "onboard.q2a", b: "onboard.q2b" },
  { key: "q3", q: "onboard.q3", a: "onboard.q3a", b: "onboard.q3b" },
];

export function Onboarding() {
  const { t } = useI18n();
  const store = useStore();
  const [show, setShow] = useState(false);
  const [ans, setAns] = useState<Answers>({});

  useEffect(() => {
    if (!store.ready) return;
    const done = window.localStorage.getItem("uc.onboarded");
    if (!done && store.saved.length === 0) setShow(true);
  }, [store.ready, store.saved.length]);

  const finish = (apply: boolean) => {
    if (apply) {
      store.setPrefs({
        ...defaultPrefs,
        cityNature: ans.q1 === "a" ? 100 : ans.q1 === "b" ? 0 : 50,
        warmth: ans.q2 === "a" ? 100 : ans.q2 === "b" ? 0 : 50,
        actionCalm: ans.q3 === "a" ? 0 : ans.q3 === "b" ? 100 : 50,
      });
    }
    window.localStorage.setItem("uc.onboarded", "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-surface p-5 shadow-xl">
        <h2 className="text-xl font-extrabold tracking-tight">{t("onboard.title")}</h2>
        <p className="mt-1 text-sm text-inksoft">{t("onboard.sub")}</p>

        <div className="mt-4 flex flex-col gap-4">
          {QUESTIONS.map((question) => (
            <div key={question.key}>
              <p className="mb-1.5 text-sm font-semibold">{t(question.q)}</p>
              <div className="grid grid-cols-2 gap-2">
                {(["a", "b"] as const).map((opt) => {
                  const active = ans[question.key] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setAns((p) => ({ ...p, [question.key]: opt }))}
                      className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                        active
                          ? "border-teal bg-tealsoft text-teal"
                          : "border-line hover:bg-surface2"
                      }`}
                    >
                      {t(opt === "a" ? question.a : question.b)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={() => finish(true)}
            className="flex-1 rounded-lg bg-teal px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            {t("prefs.apply")}
          </button>
          <button
            onClick={() => finish(false)}
            className="rounded-lg border border-line px-4 py-2.5 text-sm text-inksoft hover:bg-surface2"
          >
            {t("onboard.skip")}
          </button>
        </div>
      </div>
    </div>
  );
}
