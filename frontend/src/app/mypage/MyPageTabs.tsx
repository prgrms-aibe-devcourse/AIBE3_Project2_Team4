"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useLogin from "@/hooks/use-Login";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";

export default function MyPageTabs({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, member } = useLogin();
  const router = useRouter();
  const seg = useSelectedLayoutSegment();
  const userType = member ? member.role : null;
  const [isLoading, setIsLoading] = useState(true);

  const activeTab = seg ?? "profile";

  useEffect(() => {
    if (seg === null) router.replace("/mypage/profile");

    setIsLoading(false);
  }, []);

  const handleTabChange = (v: string) => {
    router.push(`/mypage/${v}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
              <p className="text-muted-foreground">로딩 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-bold">로그인이 필요합니다</h2>
              <p className="text-muted-foreground mb-6">마이페이지에 접근하려면 로그인해주세요.</p>
              <Button onClick={() => (window.location.href = "/auth/login")}>로그인하기</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">마이페이지</h1>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
            <TabsTrigger value="profile">내 프로필</TabsTrigger>
            <TabsTrigger value="services">서비스</TabsTrigger>
            {userType === "freelancer" && <TabsTrigger value="my-services">내 서비스</TabsTrigger>}
            <TabsTrigger value="chat">채팅 목록</TabsTrigger>
            <TabsTrigger value="payments">결제 내역</TabsTrigger>
            {userType === "client" && <TabsTrigger value="bookmarks">북마크</TabsTrigger>}
          </TabsList>

          {children}
        </Tabs>
      </div>
    </div>
  );
}
