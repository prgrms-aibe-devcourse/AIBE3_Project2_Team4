"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Award, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Profile = {
  nickname: string;
  introduction: string | null;
  averageRating: number;
  // 선택 필드 (API 응답에 있으면 사용)
  reviewCount?: number;
  profileImageUrl?: string | null;
  // 프리랜서 필드
  techStacks: string[];
  certificates: string[];
  careers: { position: string; companyName: string; term: string; description: string }[];
  portfolios: { title: string; description: string; link: string }[];
};

interface Props {
  params: { id: string };
}

export default function FreelancerProfile({ params }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const load = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/v1/profiles/freelancers/${params.id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`프로필을 불러오지 못했습니다. (${res.status})`);
        const data: Profile = await res.json();
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
                  <span className="font-semibold">{profile.averageRating.toFixed(2)}</span>
                  <span className="text-muted-foreground">({profile.reviewCount ?? 0}개 리뷰)</span>
                </div>
              </CardContent>
            </Card>

            {/* 기술 스택 */}
            {profile.techStacks?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>기술 스택</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.techStacks.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 자격증 */}
            {profile.certificates?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>자격증</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {profile.certificates.map((cert, idx) => (
                    <div key={idx} className="text-sm">
                      {cert}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6 lg:col-span-2">
            {/* 소개 */}
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

            {/* 경력 */}
            {profile.careers?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>경력</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profile.careers.map((c, index) => (
                    <div key={index}>
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{c.position}</h3>
                          <p className="text-muted-foreground">{c.companyName}</p>
                        </div>
                        <Badge variant="outline">{c.term}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {c.description}
                      </p>
                      {index < profile.careers.length - 1 && <Separator className="mt-6" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* 포트폴리오 */}
            {profile.portfolios?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>포트폴리오</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.portfolios.map((p, index) => (
                      <Link
                        key={index}
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:bg-accent hover:border-primary group flex items-center gap-3 rounded-lg border p-3 transition-colors"
                      >
                        <ExternalLink className="text-muted-foreground group-hover:text-primary h-5 w-5 flex-shrink-0 transition-colors" />
                        <div className="min-w-0 flex-1">
                          <p className="group-hover:text-primary truncate font-medium transition-colors">
                            {p.title}
                          </p>
                          <p className="text-muted-foreground truncate text-sm">{p.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
