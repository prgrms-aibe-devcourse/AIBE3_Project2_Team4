"use client";

import { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface ChatRoom {
  id: string;
  name: string;
}

interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  createdAt: string;
}

export default function ChatTab() {
  const [chatList, setChatList] = useState<ChatRoom[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const clientRef = useRef<Client | null>(null);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/chat/rooms")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched chat rooms:", data);
        if (!Array.isArray(data)) {
          throw new Error("API did not return an array");
        }
        setChatList(data);
        setLoadingRooms(false);
      })
      .catch((err) => {
        console.error("채팅방 불러오기 실패:", err);
        setError(err.message);
        setLoadingRooms(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedChat) return;

    setLoadingMessages(true);
    fetch(`http://localhost:8080/api/v1/chat/room/${selectedChat.id}/messages`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setLoadingMessages(false);
      })
      .catch((err) => {
        console.error("메시지 불러오기 실패:", err);
        setLoadingMessages(false);
      });
  }, [selectedChat]);

  // 웹소켓 연결
  useEffect(() => {
    if (!selectedChat) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws-stomp"),
      debug: (str) => {
        console.log(new Date(), str);
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("웹소켓 연결 성공!");
        client.subscribe(`/topic/room/${selectedChat.id}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      console.log("웹소켓 연결 해제됨.");
    };
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (chatMessage.trim() === "" || !clientRef.current?.connected || !selectedChat) {
      return;
    }
    clientRef.current.publish({
      destination: "/app/chat/sendMessage",
      body: JSON.stringify({
        roomId: selectedChat.id,
        sender: "User1", // TODO: 실제 사용자 이름으로 변경 필요
        content: chatMessage,
      }),
    });
    setChatMessage("");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem", height: "600px" }}>
      {/* 채팅목록*/}
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

      <div style={{ border: "1px solid #ccc", display: "flex", flexDirection: "column" }}>
        {selectedChat ? (
          <>
            <h2 style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>{selectedChat.name}</h2>

            <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
              {loadingMessages ? (
                <p>메시지를 불러오는 중...</p>
              ) : (
                <ul>
                  {messages.map((message) => (
                    <li key={message.id}>
                      <strong>{message.sender}:</strong> {message.content}
                      <span style={{ fontSize: "0.8em", marginLeft: "1rem", color: "gray" }}>
                        ({new Date(message.createdAt).toLocaleTimeString()})
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ padding: "1rem", borderTop: "1px solid #ccc" }}>
              <input
                type="text"
                placeholder="메시지를 입력하세요..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                style={{ width: "80%", marginRight: "1rem" }}
              />
              <button onClick={handleSendMessage}>전송</button>
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <p>채팅방을 선택해주세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
