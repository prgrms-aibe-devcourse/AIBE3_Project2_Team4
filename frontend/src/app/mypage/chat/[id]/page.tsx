"use client";

import { use } from "react";
import ChatTab from "../ChatTab";

// /mypage/chat/123와 같은 동적 경로를 처리합니다.
// URL의 동적 부분(id)을 params로 받습니다.
export default function ChatRoomPage({ params }: { params: Promise<{ id: string }> }) {
  // 기존 ChatTab 컴포넌트를 그대로 사용하되,
  // URL에서 받은 id를 initialChatId라는 prop으로 전달합니다.
  const { id } = use(params); // Next15/React19: params는 Promise
  return <ChatTab initialChatId={id} />;
}
