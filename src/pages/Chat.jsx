// --- PART 1/4: Chat.jsx (Responsive-only additions; logic untouched) ---
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Smile, Users, Home, Search, Ban, UserPlus } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

// ✅ tiny hook to detect mobile (only style decisions use this)
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

// ✅ Connect to Flask-SocketIO backend (unchanged)
const socket = io("http://localhost:5000", { transports: ["websocket"] });

export default function Chat() {
  const isMobile = useIsMobile(); // ← only used for styles

  // Modes (unchanged)
  const [mode, setMode] = useState(localStorage.getItem("chatMode") || "private"); // private | room
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [receiver, setReceiver] = useState(localStorage.getItem("lastReceiver") || "");
  const [room, setRoom] = useState(localStorage.getItem("lastRoom") || "");

  // Core state (unchanged)
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [recentChats, setRecentChats] = useState({});
  const [userStatus, setUserStatus] = useState({});
  const [readReceipts, setReadReceipts] = useState({});
  const [roomUsers, setRoomUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingUser, setTypingUser] = useState("");

  // Friends / Block (unchanged)
  const [friends, setFriends] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [sidebarTab, setSidebarTab] = useState("friends"); // friends | search | blocked

  // Search users (unchanged)
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchDebounceRef = useRef(null);

  // UI candy (unchanged)
  const [toast, setToast] = useState(null);
  const chatEndRef = useRef(null);
  const pickerRef = useRef(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // ---------- Initialize Username (unchanged) ----------
  useEffect(() => {
    if (!username) {
      const name = prompt("Enter your username:");
      if (name) {
        setUsername(name);
        localStorage.setItem("username", name);
        socket.emit("register_user", { username: name });
        socket.emit("get_lists", { username: name });
      }
    } else {
      socket.emit("register_user", { username });
      socket.emit("get_lists", { username });
    }
  }, [username]);

  // ---------- Socket Setup (unchanged logic) ----------
  useEffect(() => {
    function onConnect() {
      if (username) {
        socket.emit("register_user", { username });
        socket.emit("get_lists", { username });
      }
      if (mode === "private" && receiver) {
        socket.emit("join_private", { user1: username, user2: receiver });
      } else if (mode === "room" && room) {
        socket.emit("join_room", { username, room });
        socket.emit("get_room_users", { room });
      }
    }

    socket.on("connect", onConnect);

    socket.off("user_list").on("user_list", (users) => setOnlineUsers(users || []));
    socket.off("room_user_list").on("room_user_list", (users) => setRoomUsers(users || []));
    socket.off("message_deleted").on("message_deleted", ({ msg_id }) => {
      if (!msg_id) return;
      setMessages((prev) => prev.filter((m) => String(m._id) !== String(msg_id)));
    });

    socket.off("chat_deleted").on("chat_deleted", ({ user1, user2 }) => {
      const isCurrentChat =
        mode === "private" &&
        ((user1?.toLowerCase?.() === username?.toLowerCase?.() &&
          user2?.toLowerCase?.() === receiver?.toLowerCase?.()) ||
          (user2?.toLowerCase?.() === username?.toLowerCase?.() &&
            user1?.toLowerCase?.() === receiver?.toLowerCase?.()));
      if (isCurrentChat) {
        setMessages([]);
        setReceiver("");
      }
      socket.emit("get_lists", { username });
    });

    // History for private and room
    socket.off("chat_history").on("chat_history", (data) => {
      if (!data?.messages) return;
      if (mode === "private" && receiver) {
        const relevant = data.messages
          .filter(
            (m) =>
              (m.sender === username && m.receiver === receiver) ||
              (m.sender === receiver && m.receiver === username)
          )
          .map((m) => ({
            ...m,
            _id: m._id || m.id || `${m.sender}-${m.timestamp}`, // fallback if _id missing
          }));
        setMessages(relevant);
        scrollToBottom();
      }
      const friend = data.sender === username ? data.receiver : data.sender;
      const isChatOpen =
        mode === "private" &&
        ((receiver === data.sender) || (receiver === data.receiver));
      setRecentChats((prev) => ({
        ...prev,
        [friend]: {
          message: data.message,
          timestamp: data.timestamp,
          sender: data.sender,
          read: isChatOpen && document.hasFocus(),
        },
      }));
    });

    socket.off("room_history").on("room_history", (data) => {
      if (data?.room === room) {
        setMessages(data.messages || []);
        scrollToBottom();
      }
    });

    // Incoming messages
    socket.off("receive_private_message").on("receive_private_message", (data) => {
      if (blockedUsers.includes(data.sender)) return;
      const relevant =
        (data.sender === username && data.receiver === receiver) ||
        (data.sender === receiver && data.receiver === username);
      if (relevant) {
        setMessages((prev) => [...prev, data]);
        if (!friends.includes(data.sender) && data.sender !== username) {
          setFriends((prev) => Array.from(new Set([...prev, data.sender])));
        }
        scrollToBottom();
      }
    });

    socket.off("receive_room_message").on("receive_room_message", (data) => {
      if (data.room === room || data.system) {
        setMessages((prev) => [...prev, data]);
        scrollToBottom();
      }
    });

    // Read receipts
    socket.off("update_read_status").on("update_read_status", ({ sender, receiver }) => {
      setReadReceipts((prev) => ({
        ...prev,
        [`${sender}-${receiver}`]: true,
      }));
    });

    // Typing indicator
    socket.off("user_typing").on("user_typing", (data) => {
      if (data.receiver === username && data.user === receiver) {
        setTypingUser(data.user);
        setTimeout(() => setTypingUser(""), 1000);
      }
    });

    // Lists
    socket.off("lists").on("lists", ({ friends = [], blocked = [] }) => {
      setFriends(friends);
      setBlockedUsers(blocked);
    });
    socket.off("friend_list").on("friend_list", (list) => setFriends(list || []));
    socket.off("blocked_list").on("blocked_list", (list) => setBlockedUsers(list || []));

    return () => {
      socket.off("connect", onConnect);
      socket.removeAllListeners("user_list");
      socket.removeAllListeners("room_user_list");
      socket.removeAllListeners("chat_history");
      socket.removeAllListeners("room_history");
      socket.removeAllListeners("receive_private_message");
      socket.removeAllListeners("receive_room_message");
      socket.removeAllListeners("user_typing");
      socket.removeAllListeners("lists");
      socket.removeAllListeners("friend_list");
      socket.removeAllListeners("blocked_list");
      socket.off("update_read_status");
    };
  }, [username, receiver, room, mode, blockedUsers, friends]);

  // Auto-clean system notices (unchanged)
  useEffect(() => {
    if (!messages.length) return;
    const t = setTimeout(() => {
      setMessages((prev) => prev.filter((m) => !m.system));
    }, 3000);
    return () => clearTimeout(t);
  }, [messages]);

  // ✅ Periodically fetch user status (unchanged)
  useEffect(() => {
    const fetchStatus = async () => {
      if (mode === "private" && receiver) {
        try {
          const res = await fetch(`http://localhost:5000/status/${receiver}`);
          if (!res.ok) return;
          const data = await res.json();
          setUserStatus((prev) => ({ ...prev, [receiver]: data.status }));
        } catch (e) {
          // silent
        }
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [receiver, mode]);

  // ---------- Helpers (unchanged logic) ----------
  const selectReceiver = (user) => {
    if (blockedUsers.includes(user)) {
      showToast("You blocked this user. Unblock to chat.");
      return;
    }
    setMode("private");
    setReceiver(user);
    setRoom("");
    setMessages([]);
    socket.emit("join_private", { user1: username, user2: user });
    socket.emit("mark_as_read", { sender: user, receiver: username });
    localStorage.setItem("lastReceiver", user);
    localStorage.setItem("chatMode", "private");
  };

  const joinRoom = () => {
    if (!room.trim()) return showToast("Enter room name!");
    setMode("room");
    setReceiver("");
    setMessages([]);
    socket.emit("join_room", { username, room });
    socket.emit("get_room_users", { room });
    localStorage.setItem("lastRoom", room);
    localStorage.setItem("chatMode", "room");
  };

  const handleTyping = () => {
    if (mode === "private" && receiver) socket.emit("typing", { user: username, receiver });
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    if (mode === "private" && receiver && blockedUsers.includes(receiver)) {
      showToast("Unblock the user to send messages.");
      return;
    }
    const msg = { sender: username, message, timestamp: new Date().toISOString() };
    if (mode === "private" && receiver) {
      msg.receiver = receiver;
      socket.emit("send_private_message", msg);
      if (!friends.includes(receiver)) {
        setFriends((prev) => Array.from(new Set([...prev, receiver])));
        socket.emit("auto_add_friend", { a: username, b: receiver });
      }
    } else if (mode === "room" && room) {
      msg.room = room;
      socket.emit("send_room_message", msg);
    }
    setMessage("");
    scrollToBottom();
  };

  const deleteMessage = (msgId) => {
    if (!msgId) return;
    if (window.confirm("Delete this message for everyone?")) {
      socket.emit("delete_message", {
        msg_id: msgId,
        type: mode === "private" ? "private" : "room",
        sender: username,
        receiver: receiver || null,
        room: mode === "room" ? room : null,
      });
    }
  };

  const formatTime = (t) => {
    if (!t) return "";
    const utcDate = new Date(t);
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(utcDate.getTime() + istOffset);
    return istDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const blockUser = (user) => {
    if (!user) return;
    socket.emit("block_user", { blocker: username, blocked: user });
    setBlockedUsers((prev) => Array.from(new Set([...prev, user])));
    setFriends((prev) => prev.filter((f) => f !== user));
    if (receiver === user) {
      setReceiver("");
      setMessages([]);
    }
    showToast(`🚫 Blocked ${user}`);
  };

  const unblockUser = (user) => {
    if (!user) return;
    socket.emit("unblock_user", { blocker: username, blocked: user });
    setBlockedUsers((prev) => prev.filter((u) => u !== user));
    showToast(`♻️ Unblocked ${user}`);
  };

  useEffect(() => {
    if (sidebarTab !== "search") return;
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(async () => {
      const q = searchQuery.trim();
      if (!q) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await fetch(
          `http://localhost:5000/search_users?q=${encodeURIComponent(q)}`
        );
        const data = await res.json();
        const list = (Array.isArray(data) ? data : []).map((u) => u.username || u);
        setSearchResults(list.filter((u) => u && u !== username));
      } catch {}
    }, 300);
    return () => clearTimeout(searchDebounceRef.current);
  }, [searchQuery, sidebarTab, username]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  // ---------- UI with responsive-only style changes ----------
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #c7d2fe, #a5f3fc, #e0e7ff)",
        display: "flex",
        justifyContent: "center",
        alignItems: isMobile ? "stretch" : "center",
        padding: isMobile ? 8 : 20,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : 1100,
          height: isMobile ? "100vh" : "85vh",
          background: "white",
          borderRadius: isMobile ? 0 : 18,
          boxShadow: isMobile ? "none" : "0 10px 40px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          overflow: "hidden",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: isMobile ? "100%" : 300,
            background: "linear-gradient(135deg, #2563eb, #38bdf8)",
            color: "white",
            padding: isMobile ? 12 : 18,
            display: "flex",
            flexDirection: "column",
            borderBottom: isMobile ? "1px solid rgba(255,255,255,0.2)" : "none",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            <h3 style={{ margin: 0, fontSize: isMobile ? 18 : 20 }}>ChatWave 💬</h3>
            {/* (optional) mobile compact badge could go here */}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 12,alignItems: "center", justifyContent: "center" }}>
            <button
              onClick={() => setMode("private")}
              style={{
                flex: 1,
                padding: isMobile ? 10 : 8,
                background: mode === "private" ? "#1e3a8a" : "rgba(255,255,255,0.3)",
                border: "none",
                borderRadius: 8,
                color: "white",
                cursor: "pointer",
                fontSize: isMobile ? 14 : 13,
                alignItems: "center", justifyContent: "center",
                
              }}
            >
              <Users size={16} /> Private
            </button>
            <button
              onClick={() => setMode("room")}
              style={{
                flex: 1,
                padding: isMobile ? 10 : 8,
               alignItems: "center", 
               justifyContent: "center",
                background: mode === "room" ? "#1e3a8a" : "rgba(255,255,255,0.3)",
                border: "none",
                borderRadius: 8,
                color: "white",
                cursor: "pointer",
                fontSize: isMobile ? 14 : 13,
               marginRight: isMobile ? 20 : 10,
               
              }}
            >
              <Home size={16} /> Room
            </button>
          </div>

          {/* (Friends/Search/Blocked tabs continue in PART 2/4 without logic changes) */}

  
          {mode === "private" && (
            <>
              {/* Tabs */}
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginTop: 14,
                  marginRight: isMobile ? 20 : 10,
                  flexWrap: isMobile ? "wrap" : "nowrap",
                }}
              >
                {["friends", "search", "blocked"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSidebarTab(tab)}
                    style={{
                      flex: 1,
                      padding: isMobile ? "8px 0" : "6px 0",
                      background:
                        sidebarTab === tab ? "#1e3a8a" : "rgba(255,255,255,0.2)",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: 600,
                      textTransform: "capitalize",
                      fontSize: isMobile ? 13 : 14,
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={sidebarTab}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    marginTop: 12,
                    flex: 1,
                    overflowY: "auto",
                    paddingRight: 4,
                    maxHeight: isMobile ? "calc(50vh - 120px)" : "auto",
                  }}
                >
                  {/* Friends */}
                  {sidebarTab === "friends" && (
                    <>
                      <h5
                        style={{
                          margin: "6px 0 8px",
                          fontSize: isMobile ? 15 : 16,
                        }}
                      >
                        Friends
                      </h5>
                      {friends.length ? (
                        friends.map((u) => (
                          <div
                            key={u}
                            onClick={() => selectReceiver(u)}
                            style={{
                              padding: isMobile ? 10 : 8,
                              paddingRight: isMobile ? 14 : 16,
                              borderRadius: 8,
                              background:
                                receiver === u
                                  ? "rgba(255,255,255,0.3)"
                                  : "transparent",
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <span style={{ fontSize: isMobile ? 14 : 15 }}>{u}</span>

                            <div style={{ display: "flex", gap: 6 }}>
                              {/* 🗑️ Delete Chat Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Delete all messages with ${u}?`)) {
                                    socket.emit("delete_chat", {
                                      user1: username,
                                      user2: u,
                                    });
                                    setMessages([]);
                                    if (receiver === u) setReceiver("");
                                  }
                                }}
                                title="Delete Chat"
                                style={{
                                  background: "white",
                                  color: "#ef4444",
                                  border: "none",
                                  borderRadius: 6,
                                  padding: "4px 8px",
                                  cursor: "pointer",
                                }}
                              >
                                🗑️
                              </button>

                              {/* 🚫 Block Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  blockUser(u);
                                }}
                                title="Block"
                                style={{
                                  background: "white",
                                  color: "#ef4444",
                                  border: "none",
                                  borderRadius: 6,
                                  padding: "4px 8px",
                                  cursor: "pointer",
                                }}
                              >
                                <Ban size={14} /> Block
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p style={{ opacity: 0.9, fontSize: isMobile ? 13 : 14 }}>
                          No friends yet. Start a chat!
                        </p>
                      )}

                      <h5
                        style={{
                          margin: "12px 0 8px",
                          fontSize: isMobile ? 15 : 16,
                        }}
                      >
                        Online
                      </h5>
                      {onlineUsers
                        .filter((u) => u !== username)
                        .map((u) => (
                          <div
                            key={u}
                            style={{
                              padding: isMobile ? 10 : 8,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              borderRadius: 8,
                              cursor: "pointer",
                            }}
                          >
                            <span
                              onClick={() => selectReceiver(u)}
                              style={{ fontSize: isMobile ? 14 : 15 }}
                            >
                              {u}
                            </span>
                            {!friends.includes(u) &&
                              !blockedUsers.includes(u) && (
                                <button
                                  onClick={() => selectReceiver(u)}
                                  style={{
                                    background: "white",
                                    color: "#2563eb",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "4px 8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    fontSize: isMobile ? 13 : 14,
                                  }}
                                >
                                  <UserPlus size={14} /> Chat
                                </button>
                              )}
                          </div>
                        ))}
                    </>
                  )}

                  {/* Search */}
                  {sidebarTab === "search" && (
                    <>
                      <div
                        style={{
                          background: "rgba(255,255,255,0.25)",
                          borderRadius: 8,
                          padding: 6,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Search size={16} />
                        <input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search registered users..."
                          style={{
                            flex: 1,
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            color: "white",
                            fontSize: isMobile ? 14 : 15,
                          }}
                        />
                      </div>

                      <div style={{ marginTop: 10 }}>
                        {searchResults.length ? (
                          searchResults.map((u) => (
                            <div
                              key={u}
                              style={{
                                padding: 8,
                                borderRadius: 8,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                background: "rgba(255,255,255,0.2)",
                                marginBottom: 6,
                                fontSize: isMobile ? 14 : 15,
                              }}
                            >
                              <span>{u}</span>
                              <div style={{ display: "flex", gap: 6 }}>
                                <button
                                  onClick={() => selectReceiver(u)}
                                  style={{
                                    background: "white",
                                    color: "#2563eb",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "4px 8px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Message
                                </button>
                                {!blockedUsers.includes(u) ? (
                                  <button
                                    onClick={() => blockUser(u)}
                                    style={{
                                      background: "white",
                                      color: "#ef4444",
                                      border: "none",
                                      borderRadius: 6,
                                      padding: "4px 8px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Block
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => unblockUser(u)}
                                    style={{
                                      background: "white",
                                      color: "#16a34a",
                                      border: "none",
                                      borderRadius: 6,
                                      padding: "4px 8px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Unblock
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p
                            style={{
                              opacity: 0.9,
                              marginTop: 8,
                              fontSize: isMobile ? 13 : 14,
                            }}
                          >
                            Type to search users…
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Blocked */}
                  {sidebarTab === "blocked" && (
                    <>
                      <h5
                        style={{
                          margin: "6px 0 8px",
                          fontSize: isMobile ? 15 : 16,
                        }}
                      >
                        Blocked Users
                      </h5>
                      {blockedUsers.length ? (
                        blockedUsers.map((u) => (
                          <div
                            key={u}
                            style={{
                              padding: 8,
                              background: "rgba(255,255,255,0.2)",
                              borderRadius: 8,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: 6,
                            }}
                          >
                            <span style={{ fontSize: isMobile ? 14 : 15 }}>{u}</span>
                            <button
                              onClick={() => unblockUser(u)}
                              style={{
                                background: "white",
                                color: "#2563eb",
                                border: "none",
                                borderRadius: 6,
                                padding: "4px 8px",
                                cursor: "pointer",
                              }}
                            >
                              Unblock ♻️
                            </button>
                          </div>
                        ))
                      ) : (
                        <p
                          style={{
                            opacity: 0.9,
                            fontSize: isMobile ? 13 : 14,
                          }}
                        >
                          No blocked users 🚫
                        </p>
                      )}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          )}

          {/* Room Join Section */}
          {mode === "room" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
                background: "rgba(255,255,255,0.2)",
                padding: 12,
                borderRadius: 10,
                 width: isMobile ? "85%" : "auto",
                marginLeft: isMobile ? "auto" : 0,
               marginRight: isMobile ? "auto" : 0,
              }}
            >
              <h5
                style={{
                  marginTop: 5,
                  marginBottom: 10,
                  color: "white",
                  fontSize: isMobile ? 15 : 16,
                }}
              >
                Join Room
              </h5>
              <input
                type="text"
                placeholder="Enter room name..."
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                style={{
                   width: isMobile ? "75%" : "auto",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.4)",
                  outline: "none",
                  marginBottom: 10,
                  fontSize: isMobile ? 14 : 15,
                }}
              />
              <button
                onClick={joinRoom}
                style={{
                  background: "white",
                  color: "#2563eb",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginBottom: 10,
                  fontSize: isMobile ? 14 : 15,
                   width: isMobile ? "80%" : "auto",
                   alignItems: "center",
                }}
              >
                Join 🚀
              </button>

              {roomUsers.length > 0 && (
                <div
                  style={{
                    marginTop: 12,
                    background: "rgba(255,255,255,0.15)",
                    padding: 8,
                    borderRadius: 8,
                  }}
                >
                  <h5 style={{ color: "white", fontSize: isMobile ? 15 : 16 }}>
                    Room Members
                  </h5>
                  {roomUsers.map((u) => (
                    <div
                      key={u}
                      style={{
                        fontSize: isMobile ? 13 : 14,
                        color: "white",
                        padding: "4px 0",
                      }}
                    >
                      {u === username ? <b>You</b> : u}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat Section */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: isMobile ? "100%" : "auto",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: isMobile ? "10px 12px" : "14px 18px",
              borderBottom: "1px solid #e2e8f0",
              background: "#f1f5f9",
              fontWeight: 600,
              display: "flex",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 6 : 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {mode === "private" ? (
                receiver ? (
                  <>
                    <span
                      style={{
                        fontSize: isMobile ? 15 : 16,
                        wordBreak: "break-word",
                      }}
                    >
                      Chatting with <b>{receiver}</b>{" "}
                      {typingUser === receiver ? "✍️ typing…" : ""}
                    </span>
                    <small
                      style={{
                        color: "#475569",
                        fontSize: isMobile ? 12 : 13,
                      }}
                    >
                      {userStatus[receiver]
                        ? userStatus[receiver].includes("online")
                          ? "🟢 " + userStatus[receiver]
                          : "🕓 " + userStatus[receiver]
                        : ""}
                    </small>
                  </>
                ) : (
                  <span style={{ fontSize: isMobile ? 15 : 16 }}>
                    Select a user 💬
                  </span>
                )
              ) : room ? (
                <span style={{ fontSize: isMobile ? 15 : 16 }}>Room: {room}</span>
              ) : (
                <span style={{ fontSize: isMobile ? 15 : 16 }}>Join a room 🏠</span>
              )}
            </div>

            {mode === "private" && receiver && (
              <div style={{ display: "flex", gap: 8, flexWrap: isMobile ? "wrap" : "nowrap" }}>
                {!blockedUsers.includes(receiver) ? (
                  <button
                    onClick={() => blockUser(receiver)}
                    style={{
                      border: "none",
                      background: "#ef4444",
                      color: "white",
                      borderRadius: 6,
                      padding: isMobile ? "4px 8px" : "6px 10px",
                      cursor: "pointer",
                      fontSize: isMobile ? 13 : 14,
                    }}
                  >
                    Block 🚫
                  </button>
                ) : (
                  <button
                    onClick={() => unblockUser(receiver)}
                    style={{
                      border: "none",
                      background: "#16a34a",
                      color: "white",
                      borderRadius: 6,
                      padding: isMobile ? "4px 8px" : "6px 10px",
                      cursor: "pointer",
                      fontSize: isMobile ? 13 : 14,
                    }}
                  >
                    Unblock ♻️
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: isMobile ? 10 : 18,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              height: isMobile ? "calc(100vh - 180px)" : "auto",
            }}
          >
            <AnimatePresence>
              {messages.map((m, i) => {
                const isMe = m.sender === username;
                const isSystem = m.system;
                return (
                  <motion.div
                    key={m._id || `${m.sender}-${m.timestamp}-${i}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 14 }}
                    transition={{ duration: 0.22 }}
                    style={{
                      alignSelf: isSystem
                        ? "center"
                        : isMe
                        ? "flex-end"
                        : "flex-start",
                      background: isSystem
                        ? "transparent"
                        : isMe
                        ? "#60a5fa"
                        : "#f3f4f6",
                      color: isSystem
                        ? "#1e293b"
                        : isMe
                        ? "white"
                        : "black",
                      padding: isSystem ? "4px 0" : isMobile ? "8px 10px" : "10px 12px",
                      borderRadius: isSystem ? 0 : 12,
                      fontStyle: isSystem ? "italic" : "normal",
                      fontSize: isSystem ? 13 : isMobile ? 14 : 15,
                      maxWidth: "80%",
                      textAlign: isSystem ? "center" : "left",
                      wordBreak: "break-word",
                    }}
                  >
                    {!isSystem && (
                      <strong
                        style={{
                          display: "block",
                          fontSize: isMobile ? 11 : 12,
                          opacity: 0.9,
                        }}
                      >
                        {isMe ? "You" : m.sender}
                      </strong>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        flexWrap: "wrap",
                      }}
                    >
                      <span>{m.message}</span>
                      {m.sender === username && (
                        <button
                          onClick={() => deleteMessage(m._id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: isMe ? "white" : "#ef4444",
                            cursor: "pointer",
                            fontSize: isMobile ? 12 : 13,
                          }}
                          title="Delete message"
                        >
                          🗑️
                        </button>
                      )}
                    </div>

                    {!isSystem && (
                      <div
                        style={{
                          fontSize: isMobile ? 10 : 11,
                          opacity: 0.7,
                          marginTop: 4,
                        }}
                      >
                        {formatTime(m.timestamp)}{" "}
                        {m.sender === username && (
                          <span style={{ marginLeft: 6 }}>
                            {m.read
                              ? "✓✓"
                              : readReceipts[`${username}-${receiver}`]
                              ? "✓✓"
                              : "✓"}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Input Section */}
          <div
            style={{
              padding: isMobile ? "8px 10px" : "10px 14px",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#f8fafc",
              flexShrink: 0,
            }}
          >
            {/* Emoji Picker Toggle */}
            <button
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Smile size={isMobile ? 20 : 22} color="#2563eb" />
            </button>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div
                style={{
                  position: "absolute",
                  bottom: isMobile ? "60px" : "80px",
                  left: isMobile ? "10px" : "30px",
                  zIndex: 20,
                }}
              >
                <EmojiPicker
                  theme="light"
                  onEmojiClick={(emojiData) =>
                    setMessage((prev) => prev + emojiData.emoji)
                  }
                />
              </div>
            )}

            {/* Text Input */}
            <input
              type="text"
              placeholder={
                mode === "private"
                  ? receiver
                    ? `Message ${receiver}…`
                    : "Type a message…"
                  : room
                  ? `Message #${room}…`
                  : "Join a room to chat…"
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                handleTyping();
                if (e.key === "Enter") sendMessage();
              }}
              style={{
                flex: 1,
                borderRadius: 20,
                padding: isMobile ? "8px 12px" : "10px 14px",
                border: "1px solid #cbd5e1",
                outline: "none",
                fontSize: isMobile ? 14 : 15,
              }}
            />

            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={sendMessage}
              style={{
                border: "none",
                borderRadius: "50%",
                width: isMobile ? 40 : 44,
                height: isMobile ? 40 : 44,
                background: "linear-gradient(135deg, #2563eb, #38bdf8)",
                color: "white",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <Send size={isMobile ? 16 : 18} />
            </motion.button>
          </div>
        </div>


      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              bottom: 26,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#1e3a8a",
              color: "white",
              padding: "10px 16px",
              borderRadius: 10,
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
              fontSize: isMobile ? 13 : 14,
              textAlign: "center",
              maxWidth: "80%",
              zIndex: 100,
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
       </motion.div> 
    </div> 
);
}
