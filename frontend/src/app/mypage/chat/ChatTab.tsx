"use client";

import { useState, useEffect, useRef, useCallback, CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useLoginStore } from "@/store/useLoginStore";
import { Phone } from "lucide-react";

// --- Type Definitions ---

interface ChatRoom {
  id: string;
  name: string;
  clientId: number;
  freelancerId: number;
  clientNickname: string;
  freelancerNickname: string;
}

interface ChatMessage {
  id: number;
  sender: string;
  content: string; // 서비스명으로 사용
  memo?: string; // 메모 필드 추가
  createdAt: string;
  messageType: "TALK" | "PAYMENT_REQUEST" | "REVIEW_PROMPT" | "MEETING_REQUEST";
  amount?: number;
}

type UserRole = "freelancer" | "client" | "admin" | "unassigned" | undefined;

interface MenuItem {
  label: string;
  action: () => void;
  style?: CSSProperties;
}

// --- Prop Types ---

interface ChatTabProps {
  initialChatId?: string;
}

interface ChatMenuProps {
  userRole: UserRole;
  onBlock: () => void;
  onReport: () => void;
  onLeave: () => void;
  onRequestPayment: () => void;
}

interface PaymentRequestMessageProps {
  message: ChatMessage;
  onPay: () => void;
  isPayable: boolean;
}

interface MeetingRequestMessageProps {
  message: ChatMessage;
  onJoin: () => void;
}

interface PaymentRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (service: string, amount: number, memo: string) => void;
}

// --- Child Components ---

const ChatMenu = ({ userRole, onBlock, onReport, onLeave, onRequestPayment }: ChatMenuProps) => {
  const commonItems: MenuItem[] = [
    { label: "차단하기", action: onBlock },
    { label: "신고하기", action: onReport },
    { label: "채팅방 나가기", action: onLeave, style: { color: "red" } },
  ];

  const userSpecificItems: MenuItem[] = [];
  if (userRole === "freelancer") {
    userSpecificItems.push({ label: "결제 요청", action: onRequestPayment });
  }

  const finalMenuItems: MenuItem[] = [...userSpecificItems, ...commonItems];

  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        right: 0,
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "4px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        zIndex: 10,
        width: "150px",
      }}
    >
      <ul style={{ listStyle: "none", margin: 0, padding: "0.5rem 0" }}>
        {finalMenuItems.map((item) => (
          <li
            key={item.label}
            onClick={item.action}
            style={{ padding: "0.5rem 1rem", cursor: "pointer", ...item.style }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

const PaymentRequestModal = ({ isOpen, onClose, onSend }: PaymentRequestModalProps) => {
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  if (!isOpen) return null;

  const handleSend = () => {
    const numericAmount = parseFloat(amount);
    if (!service.trim()) {
      alert("서비스명을 입력해주세요.");
      return;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("유효한 금액을 입력해주세요.");
      return;
    }
    onSend(service, numericAmount, memo);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
      }}
    >
      <div style={{ background: "white", padding: "2rem", borderRadius: "8px", width: "400px" }}>
        <h2>결제 요청</h2>
        <div style={{ marginBottom: "1rem" }}>
          <label>서비스명</label>
          <input
            type="text"
            value={service}
            onChange={(e) => setService(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>요청 금액</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step={10000}
            min={0}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>메모</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", minHeight: "80px" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button onClick={onClose}>취소</button>
          <button
            onClick={handleSend}
            style={{
              background: "#007bff",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
            }}
          >
            요청하기
          </button>
        </div>
      </div>
    </div>
  );
};

const PaymentRequestMessage = ({ message, onPay, isPayable }: PaymentRequestMessageProps) => (
  <div
    style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "white",
      color: "black",
      padding: "1rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    }}
  >
    <h4
      style={{
        marginTop: 0,
        marginBottom: "1rem",
        borderBottom: "1px solid #ccc",
        paddingBottom: "0.5rem",
      }}
    >
      결제 요청
    </h4>
    <p style={{ margin: "0.5rem 0", fontSize: "0.9em" }}>
      <strong>서비스명:</strong> {message.content}
    </p>
    <p style={{ margin: "0.5rem 0", fontSize: "0.9em" }}>
      <strong>요청 금액:</strong> {message.amount?.toLocaleString()}원
    </p>
    {message.memo && (
      <p
        style={{
          margin: "0.5rem 0",
          fontSize: "0.9em",
          borderTop: "1px solid #eee",
          paddingTop: "0.5rem",
        }}
      >
        <strong>메모:</strong> {message.memo}
      </p>
    )}
    {isPayable && (
      <button
        onClick={onPay}
        style={{
          width: "100%",
          padding: "0.75rem",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "1rem",
        }}
      >
        결제
      </button>
    )}
  </div>
);

const MeetingRequestMessage = ({ message, onJoin }: MeetingRequestMessageProps) => (
  <div
    style={{
      border: "1px solid #4ade80",
      borderRadius: "8px",
      backgroundColor: "#f0fdf4",
      color: "black",
      padding: "1rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    }}
  >
    <h4
      style={{
        marginTop: 0,
        marginBottom: "1rem",
        borderBottom: "1px solid #a7f3d0",
        paddingBottom: "0.5rem",
        color: "#15803d",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Phone size={18} style={{ marginRight: "0.5rem" }} />
      화상회의 요청
    </h4>
    <p style={{ margin: "0.5rem 0", fontSize: "0.9em" }}>{message.content}</p>
    <button
      onClick={onJoin}
      style={{
        width: "100%",
        padding: "0.75rem",
        background: "#22c55e",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        marginTop: "1rem",
      }}
    >
      회의실로 이동
    </button>
  </div>
);

// --- Main Component ---

export default function ChatTab({ initialChatId }: ChatTabProps) {
  const router = useRouter();
  const [chatList, setChatList] = useState<ChatRoom[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const clientRef = useRef<Client | null>(null);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useLoginStore((s) => s.accessToken);
  const member = useLoginStore((s) => s.member);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // --- Effects ---

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  useEffect(() => {
    if (!accessToken) {
      setError("로그인 정보가 없습니다.");
      setLoadingRooms(false);
      return;
    }
    fetch("http://localhost:8080/api/v1/chats/rooms", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("API did not return an array");
        setChatList(data);
        if (initialChatId) {
          const chatToSelect = data.find((chat: ChatRoom) => chat.id === initialChatId);
          if (chatToSelect) {
            setSelectedChat(chatToSelect);
          }
        }
      })
      .catch((err) => {
        console.error("채팅방 불러오기 실패:", err);
        setError(err.message);
      })
      .finally(() => setLoadingRooms(false));
  }, [accessToken, initialChatId]);

  useEffect(() => {
    if (!selectedChat || !accessToken) return;
    setLoadingMessages(true);
    fetch(`http://localhost:8080/api/v1/chats/rooms/${selectedChat.id}/messages`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const messagesArray = Array.isArray(data) ? data : (data.messages ?? []);
        setMessages(messagesArray);
      })
      .catch((err) => console.error("메시지 불러오기 실패:", err))
      .finally(() => setLoadingMessages(false));
    setMenuOpen(false);
  }, [selectedChat, accessToken]);

  useEffect(() => {
    if (!selectedChat || !accessToken) return;
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws-stomp"),
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      onConnect: () => {
        client.subscribe(`/topic/rooms/${selectedChat.id}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, receivedMessage]);
        });
      },
    });
    client.activate();
    clientRef.current = client;
    return () => {
      client.deactivate();
    };
  }, [selectedChat, accessToken]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // --- Handlers ---
  const handleSendMessage = () => {
    if (chatMessage.trim() === "" || !clientRef.current?.connected || !selectedChat) return;
    clientRef.current.publish({
      destination: "/app/chats/sendMessage",
      body: JSON.stringify({
        roomId: selectedChat.id,
        content: chatMessage,
        messageType: "TALK",
      }),
    });
    setChatMessage("");
  };

  const handleSendMeetingRequest = () => {
    if (!clientRef.current?.connected || !selectedChat || !member) return;
    clientRef.current.publish({
      destination: "/app/chats/sendMeetingRequest",
      body: JSON.stringify({
        roomId: selectedChat.id,
        content: `${member.nickname}님이 화상회의를 요청했습니다.`,
        messageType: "MEETING_REQUEST",
      }),
    });
  };

  const handleRequestPayment = useCallback(() => {
    setMenuOpen(false);
    setPaymentModalOpen(true);
  }, []);

  const handleSendPaymentRequest = (service: string, amount: number, memo: string) => {
    if (!clientRef.current?.connected || !selectedChat || !member) return;

    clientRef.current.publish({
      destination: "/app/chats/sendPaymentRequest",
      body: JSON.stringify({
        roomId: selectedChat.id,
        messageType: "PAYMENT_REQUEST",
        content: service,
        amount: amount,
        memo: memo,
        sender: member.nickname,
      }),
    });

    setPaymentModalOpen(false);
  };

  const handlePay = (paymentMessage: ChatMessage) => {
    if (!selectedChat) return;
    const params = new URLSearchParams({
      amount: paymentMessage.amount?.toString() || "0",
      service: paymentMessage.content,
      memo: paymentMessage.memo || "",
      chatId: selectedChat.id,
    });
    router.push(`/payment?${params.toString()}`);
  };

  const handleJoinMeeting = () => {
    if (!selectedChat) return;
    router.push(`/mypage/chatcanvas/${selectedChat.id}`);
  };

  const handleBlock = useCallback(() => {
    console.log("Block user");
    setMenuOpen(false);
  }, []);
  const handleReport = useCallback(() => {
    console.log("Report user");
    setMenuOpen(false);
  }, []);
  const handleLeave = useCallback(() => {
    if (window.confirm("채팅방을 나가시겠습니까?")) {
      console.log("Leave room");
      setMenuOpen(false);
    }
  }, []);

  // --- Render ---
  return (
    <>
      <PaymentRequestModal
        isOpen={isPaymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSend={handleSendPaymentRequest}
      />
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem", height: "720px" }}
      >
        <div style={{ border: "1px solid #ccc", overflowY: "auto" }}>
          <h2>채팅 목록</h2>
          {loadingRooms ? (
            <p>채팅방을 불러오는 중...</p>
          ) : error ? (
            <p>오류: {error}</p>
          ) : chatList.length === 0 ? (
            <p>채팅방이 없습니다.</p>
          ) : (
            <ul>
              {chatList.map((chat) => (
                <li
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  style={{
                    padding: "1rem",
                    cursor: "pointer",
                    backgroundColor: selectedChat?.id === chat.id ? "#eee" : "transparent",
                  }}
                >
                  {chat.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            display: "flex",
            flexDirection: "column",
            height: "720px",
          }}
        >
          {selectedChat ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <h2>{selectedChat.name}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button
                    onClick={handleSendMeetingRequest}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      marginRight: "0.5rem",
                    }}
                  >
                    <Phone size={20} />
                  </button>
                  <div style={{ position: "relative" }} ref={menuRef}>
                    <button
                      onClick={() => setMenuOpen(!isMenuOpen)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1.5rem",
                      }}
                    >
                      &#x22EE;
                    </button>
                    {isMenuOpen && (
                      <ChatMenu
                        userRole={member?.role}
                        onBlock={handleBlock}
                        onReport={handleReport}
                        onLeave={handleLeave}
                        onRequestPayment={handleRequestPayment}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div
                ref={messageContainerRef}
                style={{ flex: 1, overflowY: "auto", padding: "1rem", minHeight: 0 }}
              >
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {messages.map((msg) => {
                    const isMyMessage = msg.sender === member?.nickname;

                    if (msg.messageType === "REVIEW_PROMPT" || msg.sender === "System") {
                      return (
                        <li
                          key={msg.id}
                          style={{
                            textAlign: "center",
                            margin: "1rem 0",
                            color: "gray",
                            fontSize: "0.9em",
                          }}
                        >
                          --- {msg.content} ---
                        </li>
                      );
                    }

                    return (
                      <li
                        key={msg.id}
                        style={{
                          display: "flex",
                          justifyContent: isMyMessage ? "flex-end" : "flex-start",
                          margin: "0.5rem 0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: isMyMessage ? "flex-end" : "flex-start",
                          }}
                        >
                          {!isMyMessage && (
                            <span
                              style={{
                                fontSize: "0.8em",
                                color: "#555",
                                marginLeft: "0.5rem",
                                marginBottom: "0.25rem",
                              }}
                            >
                              {msg.sender}
                            </span>
                          )}
                          <div
                            style={{
                              maxWidth: "100%",
                              padding: "0.5rem 1rem",
                              borderRadius: "1rem",
                              backgroundColor: isMyMessage ? "#007bff" : "#e9ecef",
                              color: isMyMessage ? "white" : "black",
                              wordBreak: "break-word",
                              marginLeft: isMyMessage ? "5rem" : "0",
                              marginRight: isMyMessage ? "0" : "5rem",
                            }}
                          >
                            {msg.messageType === "PAYMENT_REQUEST" ? (
                              <PaymentRequestMessage
                                message={msg}
                                onPay={() => handlePay(msg)}
                                isPayable={member?.role === "client"}
                              />
                            ) : msg.messageType === "MEETING_REQUEST" ? (
                              <MeetingRequestMessage message={msg} onJoin={handleJoinMeeting} />
                            ) : (
                              <div>{msg.content}</div>
                            )}
                            <div
                              style={{
                                fontSize: "0.75em",
                                color: isMyMessage ? "#e0e0e0" : "#555",
                                textAlign: "right",
                                marginTop: "0.25rem",
                              }}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div style={{ display: "flex", padding: "1rem", borderTop: "1px solid #ccc" }}>
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  style={{ flex: 1, padding: "0.5rem", marginRight: "0.5rem" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  전송
                </button>
              </div>
            </>
          ) : (
            <p style={{ padding: "1rem" }}>채팅방을 선택해주세요.</p>
          )}
        </div>
      </div>
    </>
  );
}
