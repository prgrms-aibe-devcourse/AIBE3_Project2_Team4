"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, Calendar, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientProfileProps {
  params: { id: string };
}

type ClientProfile = {
  nickname: string;
  introduction: string | null;
  averageRating: number;
  companyName: string | null;
  teamName: string | null;
  // 선택적으로 올 수 있는 필드
  profileImageUrl?: string | null;
};

export default function ClientProfile({ params }: ClientProfileProps) {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const load = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/v1/profiles/clients/${params.id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`프로필을 불러오지 못했습니다. (${res.status})`);
        const data: ClientProfile = await res.json();
        setProfile(data);
      } catch (e: any) {
        setError(e.message ?? "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id]);

  if (loading) return <div className="p-10 text-center">로딩 중...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!profile) return <div className="p-10 text-center">프로필이 없습니다.</div>;

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative mx-auto mb-4 h-32 w-32">
                  <Image
                    src={profile.profileImageUrl || "/placeholder-user.jpg"}
                    alt={profile.nickname}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h1 className="mb-2 text-2xl font-bold">{profile.nickname}</h1>
                <div className="mb-4 flex items-center justify-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {profile.averageRating?.toFixed(2) ?? "0.00"}
                  </span>
                </div>
                <div className="text-muted-foreground mb-6 space-y-2 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>회사: {profile.companyName ?? "-"}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Building className="h-4 w-4" />
                    <span>팀: {profile.teamName ?? "-"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 클라이언트는 기술 스택 섹션을 표시하지 않습니다 */}
          </div>

          <div className="space-y-6 lg:col-span-2">
            {profile.introduction && (
              <Card>
                <CardHeader>
                  <CardTitle>소개</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {profile.introduction}
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>리뷰</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">아직 리뷰가 없습니다.</p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    이 클라이언트와 함께 작업한 경험이 있다면 리뷰를 남겨주세요.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
