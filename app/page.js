"use client";

import { useEffect, useRef, useState } from "react";

const now = () =>
  new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

/* ---------- Data ---------- */

const contacts = [
  { id: 1, name: "Ayesha Khan", bg: "#d9f0ff", fg: "#1a7bb8", status: "last seen today at 10:21 PM", favorite: true },
  { id: 2, name: "Zara Store", bg: "#111b21", fg: "#f5c542", status: "business account" },
  { id: 3, name: "Design Team", bg: "#ffe3d6", fg: "#c4491f", status: "Hamza, Sana, You", group: true },
  { id: 4, name: "Amna", bg: "#e6defa", fg: "#5b3fc4", status: "last seen today at 8:07 PM" },
  { id: 5, name: "Mom", bg: "#fde0ec", fg: "#c2306b", status: "online", favorite: true },
  { id: 6, name: "Hamza", bg: "#dcf5ec", fg: "#13805f", status: "last seen yesterday at 11:40 PM" },
  { id: 7, name: "Study Group", bg: "#fff1c9", fg: "#a06a00", status: "Ali, Sara, Bilal, You", group: true },
];

// Dummy starting messages (fixed data, nobody replies to new ones)
const initialMessages = [
  { id: 1, chatId: 1, from: "them", text: "Hey! Are we still meeting tonight?", time: "12:44 PM" },
  { id: 2, chatId: 1, from: "them", text: "I can book a table if you want.", time: "12:45 PM" },
  { id: 3, chatId: 1, from: "me", text: "Yes, 8 works. Any place you prefer?", time: "12:45 PM", status: "read" },
  { id: 4, chatId: 1, from: "them", text: "The new cafe near the park.", time: "12:46 PM" },
  { id: 5, chatId: 1, from: "me", text: "Perfect, see you there!", time: "12:46 PM", status: "read" },
  { id: 6, chatId: 1, from: "them", text: "Ok 👍", time: "12:46 PM" },

  { id: 7, chatId: 2, from: "them", text: "Flat 25% off on your favorite styles with code SAVE25", time: "9:17 PM" },
  { id: 8, chatId: 2, from: "them", text: "Sale ends tonight. Don't miss out!", time: "9:18 PM" },

  { id: 9, chatId: 3, from: "them", text: "New mockups are in the shared folder.", time: "5:40 PM" },
  { id: 10, chatId: 3, from: "me", text: "Thanks, I'll review them this afternoon.", time: "5:52 PM", status: "read" },
  { id: 11, chatId: 3, from: "them", text: "Hamza: Updated the header too.", time: "6:18 PM" },

  { id: 12, chatId: 4, from: "them", text: "Did you see the new episode?", time: "7:55 PM" },
  { id: 13, chatId: 4, from: "me", text: "Not yet, tonight!", time: "8:07 PM", status: "delivered" },

  { id: 14, chatId: 5, from: "them", text: "Don't forget to eat dinner.", time: "6:34 PM" },
  { id: 15, chatId: 5, from: "me", text: "Okay Mom, I will.", time: "6:40 PM", status: "read" },

  { id: 16, chatId: 6, from: "them", text: "Call me when you're free.", time: "Yesterday" },

  { id: 17, chatId: 7, from: "them", text: "Ali: Who has the notes for chapter 4?", time: "Yesterday" },
  { id: 18, chatId: 7, from: "them", text: "Sara: I'll upload them tonight.", time: "Yesterday" },
];

/* ---------- Small components ---------- */

const ICONS = {
  chat: "M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  status: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  channels: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9 12h.01 M12 12h.01 M15 12h.01",
  people: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M3 19a6 6 0 0 1 12 0 M16 11a2.5 2.5 0 1 0 0-5 M17 14a5 5 0 0 1 4 5",
  ai: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
  media: "M4 5h16v14H4z M4 16l5-5 4 4 3-3 4 4 M9 9.5h.01",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-4-4",
  video: "M3 7h11v10H3z M14 11l7-4v10l-7-4",
  clip: "M20 11l-8 8a5 5 0 0 1-7-7l8-8a3.5 3.5 0 0 1 5 5l-8 8a2 2 0 0 1-3-3l7-7",
  emoji: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M8.5 14a4 4 0 0 0 7 0 M9 9.5h.01 M15 9.5h.01",
  mic: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z M5 11a7 7 0 0 0 14 0 M12 18v3",
  newchat: "M20 12v6a2 2 0 0 1-2 2H6l-3 3V6a2 2 0 0 1 2-2h7 M18 3v6 M15 6h6",
  back: "M15 5l-7 7 7 7",
  plus: "M12 5v14 M5 12h14",
};

function Icon({ name, className = "size-6" }) {
  if (name === "more")
    return (
      <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden="true">
        <circle cx="12" cy="5" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="12" cy="19" r="1.8" />
      </svg>
    );
  if (name === "send")
    return (
      <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden="true">
        <path d="M3 20l18-8L3 4v6l11 2-11 2z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className={`fill-none stroke-current ${className}`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function Avatar({ contact, size = 49 }) {
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full font-medium"
      style={{ background: contact.bg, color: contact.fg, width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      {contact.name[0]}
    </div>
  );
}

// sending (clock) -> sent (1 grey tick) -> delivered (2 grey ticks) -> read (2 blue ticks)
function Ticks({ status }) {
  if (status === "sending")
    return (
      <svg viewBox="0 0 24 24" aria-label="Sending" className="size-3.5 fill-none stroke-[#667781]" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
      </svg>
    );
  const double = status === "delivered" || status === "read";
  return (
    <svg
      viewBox="0 0 18 12"
      aria-label={status}
      className={`h-[11px] w-4 fill-none transition-colors duration-300 ${status === "read" ? "stroke-[#53bdeb]" : "stroke-[#667781]"}`}
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M1 6.5l3.5 3.5L11 2.5" />
      {double && <path d="M7 9.5l1 .9L15 2.5" />}
    </svg>
  );
}

function RailButton({ icon, active, dot, label }) {
  return (
    <button
      aria-label={label}
      className={`relative grid size-11 cursor-pointer place-items-center rounded-full text-[#3b4a54] ${active ? "bg-[#d9dbd8]" : "hover:bg-black/5"}`}
    >
      <Icon name={icon} className="size-[26px]" />
      {dot && <span className="absolute top-1 right-1 size-2.5 rounded-full border-2 border-[#f7f5f3] bg-[#1da855]" />}
    </button>
  );
}

/* Send animation with Tailwind only: a new message mounts hidden, then transitions in.
   Messages that already exist (e.g. when you switch chats) render instantly. */
function Pop({ fresh, mine, className = "", children }) {
  const [shown, setShown] = useState(!fresh);

  useEffect(() => {
    if (shown) return;
    const t = setTimeout(() => setShown(true), 20);
    return () => clearTimeout(t);
  }, [shown]);

  return (
    <div
      className={`${className} ${mine ? "origin-bottom-right" : "origin-bottom-left"} transition duration-300 ease-[cubic-bezier(0.2,0.9,0.3,1.15)] ${
        shown ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-75 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

/* ---------- Page ---------- */

export default function Page() {
  // All messages (dummy + the ones you send) are stored in this array. Each one points to its chat via chatId.
  const [messages, setMessages] = useState(initialMessages);
  const [unread, setUnread] = useState({ 2: 2, 3: 1, 7: 2 }); // dummy unread badges
  const [activeId, setActiveId] = useState(1);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [showChat, setShowChat] = useState(false); // mobile: list or conversation
  const nextId = useRef(100);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const active = contacts.find((c) => c.id === activeId);
  const activeMessages = messages.filter((m) => m.chatId === activeId);
  const hasText = draft.trim().length > 0;

  // Selecting a chat jumps straight to the bottom (no scrolling animation)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto" });
  }, [activeId]);

  // Sending a message scrolls smoothly to it
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages.length]);

  const patch = (id, changes) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...changes } : m)));

  const openChat = (id) => {
    setActiveId(id);
    setShowChat(true);
    setUnread((u) => ({ ...u, [id]: 0 }));
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    const id = nextId.current++;

    // push the new message into the array
    setMessages((prev) => [
      ...prev,
      { id, chatId: activeId, from: "me", text, time: now(), status: "sending", fresh: true },
    ]);
    setDraft("");
    inputRef.current?.focus();

    // tick states (UI only, nobody replies)
    setTimeout(() => patch(id, { status: "sent", fresh: false }), 400);
    setTimeout(() => patch(id, { status: "delivered" }), 1100);
    setTimeout(() => patch(id, { status: "read" }), 1900);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Chat list keeps a fixed order: sending a message never moves a chat
  const unreadChats = contacts.filter((c) => unread[c.id] > 0).length;
  const list = contacts
    .map((c) => ({ ...c, last: messages.findLast((m) => m.chatId === c.id), unread: unread[c.id] || 0 }))
    .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    .filter(
      (c) =>
        filter === "All" ||
        (filter === "Unread" && c.unread > 0) ||
        (filter === "Favorites" && c.favorite) ||
        (filter === "Groups" && c.group)
    );

  return (
    <div className="grid h-dvh bg-white font-sans text-[#111b21] antialiased md:grid-cols-[64px_minmax(320px,410px)_1fr]">
      {/* Left rail */}
      <nav className="hidden flex-col items-center gap-1 bg-[#f7f5f3] py-3 md:flex">
        <RailButton icon="chat" label="Chats" active />
        <RailButton icon="phone" label="Calls" />
        <RailButton icon="status" label="Status" dot />
        <RailButton icon="channels" label="Channels" dot />
        <RailButton icon="people" label="Communities" />
        <div className="my-2 h-px w-8 bg-[#d1d7db]" />
        <span className="grid size-11 place-items-center text-[#9b5de5]"><Icon name="ai" className="size-6" /></span>
        <div className="mt-auto flex flex-col items-center gap-3">
          <RailButton icon="media" label="Media" />
          <div className="grid size-8 place-items-center rounded-full bg-[#d9f0ff] text-sm font-medium text-[#1a7bb8]">Y</div>
        </div>
      </nav>

      {/* Chat list */}
      <aside className={`${showChat ? "hidden" : "flex"} min-h-0 flex-col border-r border-[#e9edef] bg-white md:flex`}>
        <header className="flex h-[68px] items-center justify-between px-4 pt-2">
          <h1 className="text-[22px] font-bold tracking-tight text-[#1da855]">WhatsApp</h1>
          <div className="flex items-center gap-2 text-[#54656f]">
            <button aria-label="New chat" className="grid size-10 cursor-pointer place-items-center rounded-full bg-[#1da855] text-white hover:bg-[#158a45]">
              <Icon name="newchat" className="size-5" />
            </button>
            <button aria-label="Menu" className="grid size-10 cursor-pointer place-items-center rounded-full hover:bg-black/5">
              <Icon name="more" className="size-5" />
            </button>
          </div>
        </header>

        <div className="px-3 pt-1 pb-2">
          <label className="flex h-10 items-center gap-4 rounded-full bg-[#f0f2f5] px-4 text-[#54656f] focus-within:ring-2 focus-within:ring-[#1da855]/40">
            <Icon name="search" className="size-[18px]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search or start a new chat"
              aria-label="Search chats"
              className="w-full bg-transparent text-[15px] text-[#111b21] placeholder:text-[#667781] focus:outline-none"
            />
          </label>
        </div>

        <div className="flex gap-2 px-3 pb-2">
          {["All", "Unread", "Favorites", "Groups"].map((name) => (
            <button
              key={name}
              onClick={() => setFilter(name)}
              className={`cursor-pointer rounded-full border px-3 py-1 text-sm ${
                filter === name
                  ? "border-[#d9fdd3] bg-[#d9fdd3] font-medium text-[#0a6e3d]"
                  : "border-[#e0e3e5] text-[#54656f] hover:bg-[#f0f2f5]"
              }`}
            >
              {name}
              {name === "Unread" && unreadChats > 0 && <span className="ml-1">{unreadChats}</span>}
            </button>
          ))}
          <button aria-label="Add filter" className="grid size-[30px] cursor-pointer place-items-center rounded-full border border-[#e0e3e5] text-[#54656f] hover:bg-[#f0f2f5]">
            <Icon name="plus" className="size-4" />
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto px-2">
          {list.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => openChat(c.id)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left ${
                  c.id === activeId ? "bg-[#f0f2f5]" : "hover:bg-[#f7f8f8]"
                }`}
              >
                <Avatar contact={c} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[17px]">{c.name}</span>
                    <span className={`shrink-0 text-xs ${c.unread ? "font-medium text-[#1da855]" : "text-[#667781]"}`}>{c.last?.time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1 text-sm text-[#667781]">
                      {c.last?.from === "me" && <Ticks status={c.last.status} />}
                      <span className="truncate">{c.last ? c.last.text : "No messages yet"}</span>
                    </span>
                    {c.unread > 0 && (
                      <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-[#1da855] px-1.5 text-xs font-semibold text-white">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </li>
          ))}
          {list.length === 0 && <li className="px-4 py-6 text-sm text-[#667781]">No chats found.</li>}
        </ul>
      </aside>

      {/* Conversation */}
      <main className={`${showChat ? "flex" : "hidden"} min-h-0 min-w-0 flex-col bg-[#efeae2] bg-[radial-gradient(rgba(0,0,0,0.07)_1.5px,transparent_1.5px)] bg-[length:22px_22px] md:flex`}>
        <header className="flex h-[60px] shrink-0 items-center gap-3 border-b border-[#e9edef] bg-white px-4">
          <button onClick={() => setShowChat(false)} aria-label="Back to chats" className="grid size-8 cursor-pointer place-items-center md:hidden">
            <Icon name="back" />
          </button>
          <Avatar contact={active} size={40} />
          <div className="flex min-w-0 flex-1 flex-col leading-tight">
            <strong className="truncate text-[16px] font-normal">{active.name}</strong>
            <span className="truncate text-[13px] text-[#667781]">{active.status}</span>
          </div>
          <div className="flex items-center gap-4 text-[#54656f] sm:gap-6">
            <button aria-label="Video call" className="cursor-pointer"><Icon name="video" /></button>
            <button aria-label="Voice call" className="cursor-pointer"><Icon name="phone" className="size-[22px]" /></button>
            <button aria-label="Search in chat" className="cursor-pointer"><Icon name="search" className="size-[22px]" /></button>
            <button aria-label="Menu" className="cursor-pointer"><Icon name="more" className="size-5" /></button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-4 md:px-[7%]">
          {activeMessages.length > 0 && (
            <div className="mx-auto my-2 rounded-lg bg-white px-3 py-1 text-xs text-[#54656f] shadow-sm">TODAY</div>
          )}

          {activeMessages.map((m) => {
            const mine = m.from === "me";
            return (
              <Pop
                key={m.id}
                fresh={m.fresh}
                mine={mine}
                className={`relative max-w-[80%] sm:max-w-[560px] ${mine ? "self-end" : "self-start"}`}
              >
                <div className={`rounded-lg px-2.5 pt-1.5 pb-1 text-[14.5px] leading-snug shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${mine ? "bg-[#d9fdd3]" : "bg-white"}`}>
                  <div className="flex flex-wrap items-end justify-end gap-x-3">
                    <span className="whitespace-pre-wrap [overflow-wrap:anywhere]">{m.text}</span>
                    <span className="ml-auto flex translate-y-0.5 items-center gap-1 text-[11px] text-[#667781]">
                      {m.time}
                      {mine && <Ticks status={m.status} />}
                    </span>
                  </div>
                </div>
              </Pop>
            );
          })}
          <div ref={endRef} />
        </div>

        <footer className="shrink-0 px-3 pt-1 pb-3 md:px-4 md:pb-4">
          <div className="flex h-[52px] items-center gap-1 rounded-full bg-white px-3 shadow-sm">
            <button aria-label="Attach" className="grid size-10 cursor-pointer place-items-center text-[#54656f]"><Icon name="clip" className="size-[22px]" /></button>
            <button aria-label="Emoji" className="grid size-10 cursor-pointer place-items-center text-[#54656f]"><Icon name="emoji" className="size-[22px]" /></button>
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type a message"
              aria-label="Message"
              className="min-w-0 flex-1 bg-transparent px-2 text-[15px] placeholder:text-[#667781] focus:outline-none"
            />
            {/* mic <-> send swap */}
            <button
              onClick={hasText ? sendMessage : undefined}
              aria-label={hasText ? "Send message" : "Voice message"}
              className="relative grid size-10 cursor-pointer place-items-center"
            >
              <Icon name="mic" className={`absolute size-[22px] text-[#54656f] transition duration-200 ${hasText ? "scale-50 rotate-45 opacity-0" : "scale-100 opacity-100"}`} />
              <Icon name="send" className={`absolute size-6 text-[#1da855] transition duration-200 ${hasText ? "scale-100 opacity-100" : "scale-50 -rotate-45 opacity-0"}`} />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}