"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoginStore } from "@/store/useLoginStore";
import { authorizedFetch, refreshAccessToken } from "@/lib/api";

export default function OAuthSuccessPage() {
  const router = useRouter();
  const setMember = useLoginStore((s) => s.setMember);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    async function fetchProfile() {
      try {
        await refreshAccessToken();
        const res = await authorizedFetch(`${baseUrl}/api/v1/auth/me`);
        if (!res.ok) throw new Error("프로필 조회 실패");
        const me = await res.json();

        setMember({
          email: me.email,
          nickname: me.nickname,
          profileImageUrl: me.profileImageUrl,
          role: me.role,
        });

        if (me.role === "unassigned") {
          router.replace("/auth/select-role");
        } else {
          router.replace("/");
        }
      } catch {
        router.replace("/auth/login");
      }
    }

    fetchProfile();
  }, [router, setMember]);

  return <div>로그인 처리 중...</div>;
}
