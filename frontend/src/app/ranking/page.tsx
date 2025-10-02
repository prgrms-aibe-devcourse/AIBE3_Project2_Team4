"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Star } from "lucide-react";
import Image from "next/image";
import useLogin from "@/hooks/use-Login";

interface RankedFreelancer {
  id: string;
  profileImage: string;
  name: string;
  rating: number;
  reviewCount: number;
  completedProjects: number;
  rank: number;
  totalEarnings: number;
}

export default function RankingPage() {
  const { isLoggedIn, member } = useLogin();
  const userType = member?.role;
  const [freelancers, setFreelancers] = useState<RankedFreelancer[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 내 랭킹 정보 (로그인한 프리랜서인 경우)
  const myRanking = {
    rank: 42,
    name: "김프리랜서",
    rating: 4.8,
    reviewCount: 156,
    completedProjects: 89,
    profileImage: "/professional-developer-portrait.png",
    totalEarnings: 15600000,
  };

  // 초기 데이터 로드
  useEffect(() => {
    loadFreelancers(1);
  }, []);

  const loadFreelancers = async (pageNum: number) => {
    setLoading(true);

    // 실제로는 API 호출
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newFreelancers: RankedFreelancer[] = Array.from({ length: 20 }, (_, i) => {
      const rank = (pageNum - 1) * 20 + i + 1;
      return {
        id: `freelancer-${rank}`,
        profileImage: `/professional-developer-portrait.png`,
        name: `프리랜서${rank}`,
        rating: Math.random() * 1 + 4, // 4.0 ~ 5.0
        reviewCount: Math.floor(Math.random() * 200) + 50,
        completedProjects: Math.floor(Math.random() * 150) + 20,
        rank,
        totalEarnings: Math.floor(Math.random() * 50000000) + 5000000,
      };
    });

    if (pageNum === 1) {
      setFreelancers(newFreelancers);
    } else {
      setFreelancers((prev) => [...prev, ...newFreelancers]);
    }

    setHasMore(pageNum < 5); // 최대 100명 (5페이지)
    setLoading(false);
  };

  // 무한 스크롤
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 &&
        !loading &&
        hasMore
      ) {
        const nextPage = page + 1;
        setPage(nextPage);
        loadFreelancers(nextPage);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
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
              <Card className="from-primary/10 to-secondary/10 border-primary/20 bg-gradient-to-r">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-4">
                      {getRankIcon(myRanking.rank)}
                      <div className="relative h-16 w-16">
                        <Image
                          src={myRanking.profileImage || "/placeholder.svg"}
                          alt={myRanking.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-foreground mb-2 text-xl font-bold">{myRanking.name}</h3>
                      <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>
                            {myRanking.rating.toFixed(1)} ({myRanking.reviewCount})
                          </span>
                        </div>
                        <span>작업 수: {myRanking.completedProjects}개</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-muted-foreground text-sm">총 수익</p>
                      <p className="text-foreground text-lg font-bold">
                        {myRanking.totalEarnings.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 상위 랭킹 프리랜서 목록 */}
          <div className="mb-8">
            <h2 className="text-foreground mb-6 text-2xl font-bold">상위 100명 프리랜서</h2>

            {/* 상위 3명 특별 표시 */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {freelancers.slice(0, 3).map((freelancer) => (
                <Card key={freelancer.id} className="relative overflow-hidden">
                  <div className="absolute top-4 left-4 z-10">{getRankIcon(freelancer.rank)}</div>
                  <CardContent className="p-6 pt-16 text-center">
                    <div className="relative mx-auto mb-4 h-20 w-20">
                      <Image
                        src={freelancer.profileImage || "/placeholder.svg"}
                        alt={freelancer.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <h3 className="text-foreground mb-2 text-lg font-bold">{freelancer.name}</h3>
                    <div className="mb-2 flex items-center justify-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{freelancer.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground text-sm">
                        ({freelancer.reviewCount})
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-2 text-sm">
                      작업 수: {freelancer.completedProjects}개
                    </p>
                    <p className="text-foreground text-sm font-medium">
                      총 수익: {freelancer.totalEarnings.toLocaleString()}원
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 4위부터 일반 목록 */}
            <div className="space-y-4">
              {freelancers.slice(3).map((freelancer) => (
                <Card key={freelancer.id} className="transition-shadow hover:shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex min-w-0 flex-1 items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center">
                          {getRankIcon(freelancer.rank)}
                        </div>
                        <div className="relative h-12 w-12">
                          <Image
                            src={freelancer.profileImage || "/placeholder.svg"}
                            alt={freelancer.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-foreground truncate font-medium">
                            {freelancer.name}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{freelancer.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">({freelancer.reviewCount})</span>
                        </div>
                        <span className="text-muted-foreground">
                          작업 {freelancer.completedProjects}개
                        </span>
                        <span className="text-foreground min-w-0 font-medium">
                          {freelancer.totalEarnings.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 로딩 인디케이터 */}
            {loading && (
              <div className="py-8 text-center">
                <div className="border-primary inline-block h-8 w-8 animate-spin rounded-full border-b-2"></div>
                <p className="text-muted-foreground mt-2">로딩 중...</p>
              </div>
            )}

            {/* 더 이상 데이터가 없을 때 */}
            {!hasMore && !loading && (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">모든 랭킹을 확인했습니다.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
