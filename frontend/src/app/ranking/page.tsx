"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Star } from "lucide-react"
import Image from "next/image"

interface RankedFreelancer {
  id: string
  profileImage: string
  name: string
  rating: number
  reviewCount: number
  completedProjects: number
  rank: number
  specialty: string
  totalEarnings: number
}

export default function RankingPage() {
  const [isLoggedIn] = useState(true) // 실제로는 auth context에서 가져올 값
  const [userType] = useState<"freelancer" | "client">("freelancer")
  const [freelancers, setFreelancers] = useState<RankedFreelancer[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // 내 랭킹 정보 (로그인한 프리랜서인 경우)
  const myRanking = {
    rank: 42,
    name: "김프리랜서",
    rating: 4.8,
    reviewCount: 156,
    completedProjects: 89,
    profileImage: "/professional-developer-portrait.png",
    specialty: "웹 개발",
    totalEarnings: 15600000,
  }

  // 초기 데이터 로드
  useEffect(() => {
    loadFreelancers(1)
  }, [])

  const loadFreelancers = async (pageNum: number) => {
    setLoading(true)

    // 실제로는 API 호출
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newFreelancers: RankedFreelancer[] = Array.from({ length: 20 }, (_, i) => {
      const rank = (pageNum - 1) * 20 + i + 1
      return {
        id: `freelancer-${rank}`,
        profileImage: `/professional-developer-portrait.png`,
        name: `프리랜서${rank}`,
        rating: Math.random() * 1 + 4, // 4.0 ~ 5.0
        reviewCount: Math.floor(Math.random() * 200) + 50,
        completedProjects: Math.floor(Math.random() * 150) + 20,
        rank,
        specialty: ["웹 개발", "모바일 앱", "UI/UX 디자인", "데이터 분석", "마케팅"][Math.floor(Math.random() * 5)],
        totalEarnings: Math.floor(Math.random() * 50000000) + 5000000,
      }
    })

    if (pageNum === 1) {
      setFreelancers(newFreelancers)
    } else {
      setFreelancers((prev) => [...prev, ...newFreelancers])
    }

    setHasMore(pageNum < 5) // 최대 100명 (5페이지)
    setLoading(false)
  }

  // 무한 스크롤
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000 &&
        !loading &&
        hasMore
      ) {
        const nextPage = page + 1
        setPage(nextPage)
        loadFreelancers(nextPage)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loading, hasMore, page])

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />
    return <span className="text-2xl font-bold text-muted-foreground">#{rank}</span>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={isLoggedIn} userType={userType} newMessageCount={3} />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">프리랜서 랭킹</h1>
            <p className="text-xl text-muted-foreground">최고의 프리랜서들을 만나보세요</p>
          </div>

          {/* 내 랭킹 섹션 (프리랜서인 경우만) */}
          {isLoggedIn && userType === "freelancer" && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">내 랭킹</h2>
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-4">
                      {getRankIcon(myRanking.rank)}
                      <div className="w-16 h-16 relative">
                        <Image
                          src={myRanking.profileImage || "/placeholder.svg"}
                          alt={myRanking.name}
                          fill
                          className="object-cover rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">{myRanking.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>
                            {myRanking.rating.toFixed(1)} ({myRanking.reviewCount})
                          </span>
                        </div>
                        <span>작업 수: {myRanking.completedProjects}개</span>
                        <Badge variant="secondary">{myRanking.specialty}</Badge>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">총 수익</p>
                      <p className="text-lg font-bold text-foreground">{myRanking.totalEarnings.toLocaleString()}원</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 상위 랭킹 프리랜서 목록 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">상위 100명 프리랜서</h2>

            {/* 상위 3명 특별 표시 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {freelancers.slice(0, 3).map((freelancer) => (
                <Card key={freelancer.id} className="relative overflow-hidden">
                  <div className="absolute top-4 left-4 z-10">{getRankIcon(freelancer.rank)}</div>
                  <CardContent className="p-6 text-center pt-16">
                    <div className="w-20 h-20 mx-auto mb-4 relative">
                      <Image
                        src={freelancer.profileImage || "/placeholder.svg"}
                        alt={freelancer.name}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{freelancer.name}</h3>
                    <Badge variant="secondary" className="mb-3">
                      {freelancer.specialty}
                    </Badge>
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{freelancer.rating.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">({freelancer.reviewCount})</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">작업 수: {freelancer.completedProjects}개</p>
                    <p className="text-sm font-medium text-foreground">
                      총 수익: {freelancer.totalEarnings.toLocaleString()}원
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 4위부터 일반 목록 */}
            <div className="space-y-4">
              {freelancers.slice(3).map((freelancer) => (
                <Card key={freelancer.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <div className="w-12 h-12 flex items-center justify-center">{getRankIcon(freelancer.rank)}</div>
                        <div className="w-12 h-12 relative">
                          <Image
                            src={freelancer.profileImage || "/placeholder.svg"}
                            alt={freelancer.name}
                            fill
                            className="object-cover rounded-full"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-foreground truncate">{freelancer.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {freelancer.specialty}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{freelancer.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">({freelancer.reviewCount})</span>
                        </div>
                        <span className="text-muted-foreground">작업 {freelancer.completedProjects}개</span>
                        <span className="font-medium text-foreground min-w-0">
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
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground mt-2">로딩 중...</p>
              </div>
            )}

            {/* 더 이상 데이터가 없을 때 */}
            {!hasMore && !loading && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">모든 랭킹을 확인했습니다.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
