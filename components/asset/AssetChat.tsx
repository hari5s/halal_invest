"use client";

import { useState } from "react";
import { Bot, SendHorizontal, UserRound } from "lucide-react";
import type { Asset } from "@/data/assets";
import { createMockChatResponse, type MockChatResponse } from "@/lib/mock-chat";

const examples = [
  "Quelle est la tendance actuelle sur " + "cet actif ?",
  "Quels sont les principaux risques ?",
  "Compare cet actif avec AMD",
  "Quelles actualités expliquent la variation récente ?",
  "Quels éléments de conformité faut-il vérifier ?"
];

type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
  response?: MockChatResponse;
};

export function AssetChat({ asset }: { asset: Asset }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Posez une question sur cet actif. L'IA répond à partir des données affichées, des actualités et des métriques du prototype."
    }
  ]);

  function send(question: string) {
    var cleaned = question.trim();
    if (!cleaned) return;
    var answer = createMockChatResponse(asset, cleaned);
    setMessages(function (current) {
      return current.concat([
        { id: Date.now(), role: "user", content: cleaned },
        { id: Date.now() + 1, role: "assistant", content: answer.shortAnswer, response: answer }
      ]);
    });
    setInput("");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[0.86fr_1.14fr]">
      <div className="surface-card p-4">
        <h3 className="font-semibold text-zinc-50">Questions rapides</h3>
        <div className="mt-4 flex flex-col gap-2">
          {examples.map(function (example) {
            return (
              <button key={example} type="button" onClick={function () { send(example); }} className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-left text-sm text-zinc-300 transition-colors hover:border-emerald-350/35 hover:text-zinc-50">
                {example}
              </button>
            );
          })}
        </div>
      </div>

      <div className="surface-panel overflow-hidden">
        <div className="custom-scrollbar flex max-h-[460px] flex-col gap-4 overflow-y-auto p-4">
          {messages.map(function (message) {
            var assistant = message.role === "assistant";
            return (
              <div key={message.id} className={assistant ? "mr-5 flex gap-3" : "ml-8 flex flex-row-reverse gap-3"}>
                <div className={assistant ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-350/25 bg-emerald-350/10 text-emerald-350" : "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gold-400/25 bg-gold-400/10 text-gold-300"}>
                  {assistant ? <Bot className="h-4 w-4" aria-hidden="true" /> : <UserRound className="h-4 w-4" aria-hidden="true" />}
                </div>
                <div className="rounded-lg border border-white/10 bg-black/25 p-3 text-sm leading-6 text-zinc-300">
                  <p>{message.content}</p>
                  {message.response ? (
                    <div className="mt-3 space-y-3 border-t border-white/10 pt-3">
                      <div>
                        <p className="data-label">Données utilisées</p>
                        <ul className="mt-2 space-y-1 text-xs text-zinc-400">
                          {message.response.dataUsed.map(function (item) { return <li key={item}>{item}</li>; })}
                        </ul>
                      </div>
                      <div>
                        <p className="data-label">Risques</p>
                        <ul className="mt-2 space-y-1 text-xs text-zinc-400">
                          {message.response.risks.map(function (item) { return <li key={item}>{item}</li>; })}
                        </ul>
                      </div>
                      <p className="rounded-lg border border-gold-400/25 bg-gold-400/10 p-2 text-xs text-gold-100/90">{message.response.disclaimer}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        <form
          className="flex gap-2 border-t border-white/10 p-3"
          onSubmit={function (event) {
            event.preventDefault();
            send(input);
          }}
        >
          <input value={input} onChange={function (event) { setInput(event.target.value); }} placeholder={"Question sur " + asset.ticker} aria-label={"Question sur " + asset.ticker} name="asset-chat-question" autoComplete="off" className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#071018]/80 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus-visible:border-emerald-350/60" />
          <button type="submit" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-350 text-ink-950 transition-colors hover:bg-emerald-300" aria-label="Envoyer">
            <SendHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}
