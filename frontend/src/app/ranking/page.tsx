"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Star } from "lucide-react";
import Image from "next/image";
import useLogin from "@/hooks/use-Login";
import { rankingApi, FreelancerRankingResponse, RankingPageResponse } from "@/lib/api/profile";

interface RankedFreelancer {
  rank: number;
  nickname: string;
  averageRating: number;
  reviewCount: number;
}

interface RankingResponse {
  content: RankedFreelancer[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export default function RankingPage() {
  const { isLoggedIn, member } = useLogin();
  const userType = member?.role;
  const [freelancers, setFreelancers] = useState<RankedFreelancer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myRanking, setMyRanking] = useState<RankedFreelancer | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 초기 데이터 로드
  useEffect(() => {
    loadRankingData();
  }, []);

  const loadRankingData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/api/v1/freelancers/ranking?page=0`);

      if (!response.ok) {
        throw new Error("랭킹 데이터를 불러오는데 실패했습니다.");
      }

      const data: RankingResponse = await response.json();
      setFreelancers(data.content);

      // 로그인한 프리랜서의 랭킹 정보 찾기
      if (isLoggedIn && userType === "freelancer" && member?.nickname) {
        const userRanking = data.content.find(
          (freelancer) => freelancer.nickname === member.nickname,
        );
        setMyRanking(userRanking || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-15 w-15 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-15 w-15 text-gray-400" />;
    if (rank === 3) return <Award className="h-15 w-15 text-amber-600" />;
    return <span className="text-muted-foreground text-2xl font-bold">#{rank}</span>;
  };

  return (
    <div className="bg-background min-h-screen">
      <main className="pt-20 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-12 text-center">
            <h1 className="text-foreground mb-4 text-4xl font-bold">프리랜서 랭킹</h1>
            <p className="text-muted-foreground text-xl">최고의 프리랜서들을 만나보세요</p>
          </div>

          {/* 내 랭킹 섹션 (프리랜서인 경우만) */}
          {isLoggedIn && userType === "freelancer" && (
            <div className="mb-12">
              <h2 className="text-foreground mb-6 text-2xl font-bold">내 랭킹</h2>
              {myRanking ? (
                <Card className="from-primary/10 to-secondary/10 border-primary/20 bg-gradient-to-r">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-4">
                        {getRankIcon(myRanking.rank)}
                        <div className="relative h-16 w-16">
                          <Image
                            src="/placeholder-user.jpg"
                            alt={myRanking.nickname}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-foreground mb-2 text-xl font-bold">
                          {myRanking.nickname}
                        </h3>
                        <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>
                              {myRanking.averageRating.toFixed(1)} ({myRanking.reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-muted-foreground text-sm">순위</p>
                        <p className="text-foreground text-lg font-bold">{myRanking.rank}위</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-muted-foreground/20 border-2 border-dashed">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground text-lg">
                      아직 순위권에 진입하지 못했습니다. 더 많은 프로젝트를 완료해보세요!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* 상위 랭킹 프리랜서 목록 */}
          <div className="mb-8">
            <h2 className="text-foreground mb-6 text-2xl font-bold">프리랜서 랭킹</h2>

            {/* 에러 메시지 */}
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
                <p>{error}</p>
                <button
                  onClick={loadRankingData}
                  className="mt-2 text-sm underline hover:no-underline"
                >
                  다시 시도
                </button>
              </div>
            )}

            {/* 로딩 인디케이터 */}
            {loading && (
              <div className="py-8 text-center">
                <div className="border-primary inline-block h-8 w-8 animate-spin rounded-full border-b-2"></div>
                <p className="text-muted-foreground mt-2">로딩 중...</p>
              </div>
            )}

            {/* 데이터가 없을 때 */}
            {!loading && !error && freelancers.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">랭킹 데이터가 없습니다.</p>
              </div>
            )}

            {/* 상위 3명 특별 표시 */}
            {!loading && !error && freelancers.length > 0 && (
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {freelancers.slice(0, 3).map((freelancer) => (
                  <Card key={freelancer.rank} className="relative overflow-hidden">
                    <div className="absolute top-4 left-4 z-10">{getRankIcon(freelancer.rank)}</div>
                    <CardContent className="p-6 pt-16 text-center">
                      <div className="relative mx-auto mb-4 h-25 w-25">
                        <Image
                          src="/placeholder-user.jpg"
                          alt={freelancer.nickname}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <h3 className="text-foreground mb-2 text-lg font-bold">
                        {freelancer.nickname}
                      </h3>
                      <div className="mb-2 flex items-center justify-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {freelancer.averageRating.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          ({freelancer.reviewCount})
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* 4위부터 일반 목록 */}
            {!loading && !error && freelancers.length > 3 && (
              <div className="space-y-4">
                {freelancers.slice(3).map((freelancer) => (
                  <Card key={freelancer.rank} className="transition-shadow hover:shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex min-w-0 flex-1 items-center space-x-4">
                          <div className="flex h-12 w-12 items-center justify-center">
                            {getRankIcon(freelancer.rank)}
                          </div>
                          <div className="relative h-12 w-12">
                            <Image
                              src="/placeholder-user.jpg"
                              alt={freelancer.nickname}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-foreground truncate font-medium">
                              {freelancer.nickname}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">
                              {freelancer.averageRating.toFixed(1)}
                            </span>
                            <span className="text-muted-foreground">
                              ({freelancer.reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
