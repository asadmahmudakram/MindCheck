"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import dynamic from "next/dynamic";
import { Message, MoodData, CheckinEntry } from "@/lib/types";
import { parseMoodData, cleanResponse } from "@/lib/gemini";
import { Send, BarChart2, MessageCircle, Sparkles, LogOut } from "lucide-react";
import clsx from "clsx";

const MoodChart = dynamic(() => import("@/components/MoodChart"), { ssr: false });

const STARTER_PROMPTS = [
  { text: "Hari ini aku merasa sangat lelah dan overwhelmed 😔", color: "#E8A04C" },
  { text: "Mood ku lagi bagus banget hari ini! Mau cerita nih 🌟", color: "#4A9B6F" },
  { text: "Aku cemas soal sesuatu dan butuh didengarkan 💭", color: "#7B8FD4" },
  { text: "Aku mau refleksi diri hari ini, apa yang bisa aku lakukan?", color: "#C9A84C" },
];

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function getMoodEmoji(score: number) {
  if (score >= 9) return "🤩";
  if (score >= 7) return "😊";
  if (score >= 5) return "😐";
  if (score >= 3) return "😔";
  return "😢";
}

function MoodBadge({ data }: { data: MoodData }) {
  return (
    <div className="mt-3 p-3 rounded-2xl border space-y-2.5" style={{ background: `${data.color}10`, borderColor: `${data.color}30` }}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{getMoodEmoji(data.score)}</span>
        <span className="text-xs font-semibold" style={{ color: data.color }}>{data.emotion}</span>
        <div className="flex-1 bg-black/10 rounded-full h-1.5 ml-1">
          <div className="mood-fill h-1.5 rounded-full transition-all duration-1000" style={{ width: `${data.score * 10}%`, backgroundColor: data.color }} />
        </div>
        <span className="text-xs font-mono font-medium text-[#5C4F3A]">{data.score}/10</span>
      </div>
      {data.activities?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.activities.map((act, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${data.color}20`, color: data.color }}>
              {act}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MindCheckApp() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <img src="/logo/logo-mindcheck.png" alt="MindCheck" className="w-12 h-12 object-contain animate-pulse" />
          <div className="flex gap-1">
            <span className="typing-dot w-2 h-2 bg-[#4A6741] rounded-full" />
            <span className="typing-dot w-2 h-2 bg-[#4A6741] rounded-full" />
            <span className="typing-dot w-2 h-2 bg-[#4A6741] rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return <MindCheckUI user={user} logout={logout} />;
}

function MindCheckUI({
  user,
  logout,
}: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
  logout: () => Promise<void>;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content: `Hai${user.displayName ? ", " + user.displayName.split(" ")[0] : ""}! Selamat datang di MindCheck 💚\n\nAku di sini untuk menemanimu, mendengarkan ceritamu, dan membantu kamu refleksi diri setiap hari.\n\nBagaimana perasaanmu sekarang?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "history">("chat");
  const [entries, setEntries] = useState<CheckinEntry[]>([]);
  const [latestMood, setLatestMood] = useState<MoodData | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`mindcheck-entries-${user.uid}`);
    if (saved) setEntries(JSON.parse(saved));
  }, [user.uid]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const moodData = parseMoodData(data.text);
      const cleanText = cleanResponse(data.text);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: cleanText, timestamp: new Date(), moodData: moodData || undefined };
      setMessages((prev) => [...prev, aiMsg]);
      if (moodData) {
        setLatestMood(moodData);
        const newEntry: CheckinEntry = { id: Date.now().toString(), date: new Date().toISOString(), score: moodData.score, emotion: moodData.emotion, color: moodData.color, summary: text.trim().slice(0, 80) };
        setEntries((prev) => {
          const updated = [...prev, newEntry];
          localStorage.setItem(`mindcheck-entries-${user.uid}`, JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi ya! 🌿", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isLoading, user.uid]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const todayEntries = entries.filter((e) => new Date(e.date).toDateString() === new Date().toDateString());
  const avgMood = entries.length ? (entries.reduce((a, b) => a + b.score, 0) / entries.length).toFixed(1) : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F7F4EE" }}>

      {/* ── HEADER ── */}
      <header style={{ background: "rgba(247,244,238,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(74,103,65,0.1)" }}
        className="sticky top-0 z-20 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <img src="/logo/logo-mindcheck.png" alt="MindCheck" className="w-8 h-8 object-contain" />
            <div>
              <div className="font-bold text-[#2C2416] text-sm leading-none" style={{ fontFamily: "'Instrument Serif', serif" }}>
                MindCheck
              </div>
              <div className="text-[10px] text-[#7A9B70] mt-0.5">Check-in harian kesehatan mental</div>
            </div>
          </div>

          {/* Right: mood pill + user */}
          <div className="flex items-center gap-2.5">
            {latestMood && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border"
                style={{ background: `${latestMood.color}15`, borderColor: `${latestMood.color}30`, color: latestMood.color }}>
                <span>{getMoodEmoji(latestMood.score)}</span>
                {latestMood.emotion} · {latestMood.score}/10
              </div>
            )}
            <div className="flex items-center gap-2 pl-2 border-l border-[#d4e0d4]">
              {user.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt={user.displayName ?? "avatar"} className="w-7 h-7 rounded-full border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#4A6741] flex items-center justify-center text-white text-xs font-bold">
                  {(user.displayName ?? user.email ?? "U")[0].toUpperCase()}
                </div>
              )}
              <div className="hidden sm:block">
                <div className="text-xs font-medium text-[#2C2416] leading-none">{user.displayName?.split(" ")[0] ?? "Pengguna"}</div>
              </div>
              <button onClick={logout} className="ml-1 p-1.5 rounded-lg hover:bg-[#E8EFE6] transition-colors text-[#7A9B70] hover:text-[#4A6741]">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── TABS ── */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-4">
        <div className="flex gap-1 p-1 rounded-2xl w-fit" style={{ background: "rgba(74,103,65,0.08)" }}>
          {(["chat", "history"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={clsx("flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-medium transition-all",
                activeTab === tab ? "bg-white text-[#2C2416] shadow-sm" : "text-[#7A9B70] hover:text-[#4A6741]")}>
              {tab === "chat" ? <><MessageCircle size={14} /> Curhat</> : <><BarChart2 size={14} /> Riwayat</>}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 pb-6 pt-3 flex flex-col gap-3">

        {/* ══ HISTORY TAB ══ */}
        {activeTab === "history" && (
          <div className="space-y-4 animate-[fadeUp_0.3s_ease_forwards]">

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total Sesi", value: entries.length.toString(), icon: "📝" },
                { label: "Rata-rata Mood", value: avgMood ? `${avgMood}/10` : "-", icon: "📊" },
                { label: "Hari Ini", value: todayEntries.length.toString(), icon: "🌱" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-[#e8ede8] text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-lg font-bold text-[#2C2416]" style={{ fontFamily: "'Instrument Serif', serif" }}>{s.value}</div>
                  <div className="text-xs text-[#7A9B70]">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl border border-[#e8ede8] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={15} className="text-[#C9A84C]" />
                <h2 className="text-sm font-semibold text-[#2C2416]">Grafik Mood 7 Hari Terakhir</h2>
              </div>
              <MoodChart entries={entries} />
            </div>

            {/* Today */}
            <div className="bg-white rounded-2xl border border-[#e8ede8] p-5">
              <h2 className="text-sm font-semibold text-[#2C2416] mb-3 flex items-center gap-2">
                🗓️ Hari Ini
              </h2>
              {todayEntries.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">🌱</div>
                  <p className="text-sm text-[#7A9B70]">Belum ada check-in hari ini</p>
                  <p className="text-xs text-[#a8c2a8] mt-1">Yuk mulai curhat!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {todayEntries.map((e) => (
                    <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${e.color}10` }}>
                      <span className="text-lg">{getMoodEmoji(e.score)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold" style={{ color: e.color }}>{e.emotion}</span>
                          <span className="text-xs text-[#a8c2a8]">{e.score}/10</span>
                        </div>
                        <p className="text-xs text-[#5C4F3A] mt-0.5 truncate">{e.summary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* All history */}
            {entries.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#e8ede8] p-5">
                <h2 className="text-sm font-semibold text-[#2C2416] mb-3">📋 Semua Riwayat</h2>
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {[...entries].reverse().map((e) => (
                    <div key={e.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#f4f7f4] transition-colors">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{getMoodEmoji(e.score)}</span>
                        <div>
                          <span className="text-xs font-semibold text-[#2C2416]">{e.emotion}</span>
                          <p className="text-xs text-[#a8c2a8] truncate max-w-[180px]">{e.summary}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-mono font-medium text-[#4A6741]">{e.score}/10</div>
                        <div className="text-[10px] text-[#a8c2a8]">{new Date(e.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ CHAT TAB ══ */}
        {activeTab === "chat" && (
          <>
            <div className="flex-1 space-y-4 min-h-[300px]">
              {messages.map((msg) => (
                <div key={msg.id} className={clsx("flex gap-3 bubble-enter", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>

                  {/* AI Avatar */}
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mt-1 border-2 border-white shadow-sm">
                      <img src="/logo/logo-mindcheck.png" alt="MindCheck" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* User Avatar */}
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full flex-shrink-0 mt-1 overflow-hidden border-2 border-white shadow-sm">
                      {user.photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full bg-[#4A6741] flex items-center justify-center text-white text-xs font-bold">
                          {(user.displayName ?? "U")[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                  )}

                  <div className={clsx("max-w-[78%] space-y-1", msg.role === "user" ? "items-end" : "items-start")}>
                    <div className={clsx("px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                      msg.role === "user"
                        ? "text-white rounded-tr-sm"
                        : "bg-white border border-[#e8ede8] text-[#2C2416] rounded-tl-sm shadow-sm ai-message")}
                      style={msg.role === "user" ? { background: "linear-gradient(135deg, #2C2416, #4A6741)" } : {}}>
                      {msg.content}
                    </div>
                    {msg.moodData && <MoodBadge data={msg.moodData} />}
                    <p className="text-[10px] text-[#a8c2a8] px-1">{formatTime(msg.timestamp)}</p>
                  </div>
                </div>
              ))}

              {/* Typing */}
              {isLoading && (
                <div className="flex gap-3 bubble-enter">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                    <img src="/logo/logo-mindcheck.png" alt="MindCheck" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-white border border-[#e8ede8] px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center shadow-sm">
                    <span className="typing-dot w-2 h-2 bg-[#4A6741] rounded-full" />
                    <span className="typing-dot w-2 h-2 bg-[#4A6741] rounded-full" />
                    <span className="typing-dot w-2 h-2 bg-[#4A6741] rounded-full" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Starter prompts */}
            {messages.length <= 1 && (
              <div className="grid grid-cols-2 gap-2">
                {STARTER_PROMPTS.map((p, i) => (
                  <button key={i} onClick={() => sendMessage(p.text)}
                    className="text-left text-xs bg-white border border-[#e8ede8] text-[#5C4F3A] px-3 py-3 rounded-2xl hover:border-[#a8c2a8] hover:bg-[#f4f7f4] transition-all leading-relaxed shadow-sm">
                    {p.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="sticky bottom-4">
              <div className="bg-white border border-[#d4e0d4] rounded-2xl shadow-md flex items-end gap-2 p-2 focus-within:border-[#4A6741] focus-within:shadow-lg transition-all">
                <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder="Ceritakan perasaanmu hari ini..." rows={1} disabled={isLoading}
                  className="flex-1 bg-transparent resize-none text-sm text-[#2C2416] placeholder-[#c8d8c8] px-2 py-1.5 outline-none max-h-32 leading-relaxed"
                  style={{ fieldSizing: "content" } as React.CSSProperties} />
                <button onClick={() => sendMessage(input)} disabled={!input.trim() || isLoading}
                  className={clsx("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                    input.trim() && !isLoading ? "text-white hover:opacity-90 active:scale-95" : "bg-[#e8ede8] text-[#a8c2a8] cursor-not-allowed")}
                  style={input.trim() && !isLoading ? { background: "linear-gradient(135deg, #2C2416, #4A6741)" } : {}}>
                  <Send size={15} />
                </button>
              </div>
              <p className="text-center text-[10px] text-[#c8d8c8] mt-2">Enter untuk kirim · Shift+Enter baris baru</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}