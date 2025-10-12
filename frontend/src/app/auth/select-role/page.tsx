"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginStore } from "@/store/useLoginStore";
import { authorizedFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function SelectRolePage() {
  const router = useRouter();
  const member = useLoginStore((s) => s.member);
  const setMember = useLoginStore((s) => s.setMember);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const selectRole = async (role: "freelancer" | "client") => {
    if (!member) return;
    setLoading(true);
    setError("");

    try {
      const res = await authorizedFetch(`${baseUrl}/api/v1/auth/role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) throw new Error("역할 선택 실패");

      const updatedMember = await res.json();
      setMember(updatedMember); // member.role 업데이트

      router.replace("/"); // 홈으로 이동
    } catch (err: any) {
      setError(err?.message || "역할 선택 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-2xl font-bold">역할을 선택해주세요</h1>
      <p className="text-muted-foreground text-center">
        프리랜서와 클라이언트 중 하나를 선택해야 서비스 이용이 가능합니다.
      </p>

      {error && <p className="text-destructive">{error}</p>}

      <div className="mt-4 flex gap-4">
        <Button
          onClick={() => selectRole("freelancer")}
          disabled={loading}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          프리랜서
        </Button>
        <Button
          onClick={() => selectRole("client")}
          disabled={loading}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          클라이언트
        </Button>
      </div>
    </div>
  );
}
