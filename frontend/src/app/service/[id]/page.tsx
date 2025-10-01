"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Star, MessageCircle, Share2, Bookmark, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReviewCard } from "@/components/review-card"
import { Pagination } from "@/components/pagination"

// Mock data - 실제로는 API에서 가져올 데이터
const mockService = {
  id: "1",
  title: "프리미엄 웹사이트 디자인 및 개발",
  price: 500000,
  rating: 4.8,
  reviewCount: 127,
  images: [
    "/website-design-portfolio-1.jpg",
    "/website-design-portfolio-2.jpg",
    "/website-design-portfolio-3.jpg",
    "/website-design-portfolio-4.jpg",
  ],
  description: `안녕하세요! 5년 경력의 풀스택 개발자입니다.

✅ 제공 서비스
• 반응형 웹사이트 디자인
• 프론트엔드 개발 (React, Next.js)
• 백엔드 개발 (Node.js, Python)
• 데이터베이스 설계 및 구축
• SEO 최적화

✅ 작업 프로세스
1. 요구사항 분석 및 기획
2. 디자인 시안 제작
3. 개발 및 테스트
4. 배포 및 유지보수

✅ 포함 사항
• 무제한 수정
• 1개월 무료 유지보수
• 소스코드 제공
• 배포 지원

궁금한 점이 있으시면 언제든 채팅으로 문의해주세요!`,
  freelancer: {
    id: "freelancer-1",
    name: "김개발",
    avatar: "/developer-profile.png",
    rating: 4.9,
    completedProjects: 89,
  },
  tags: ["웹개발", "React", "Next.js", "디자인"],
  category: "웹개발",
}

const mockReviews = [
  {
    id: "1",
    rating: 5,
    content:
      "정말 만족스러운 결과물이었습니다. 요구사항을 완벽하게 이해하고 구현해주셨어요. 디자인도 깔끔하고 기능도 완벽하게 작동합니다. 다음에도 꼭 다시 의뢰하고 싶습니다!",
    images: ["/review-image-1.jpg", "/review-image-2.jpg"],
    authorName: "이클라이언트",
    authorId: "client-1",
    authorProfileImage: "/client-profile-1.jpg",
    createdAt: "2024.01.15",
  },
  {
    id: "2",
    rating: 5,
    content:
      "소통이 원활하고 작업 속도도 빨라서 좋았습니다. 중간중간 진행상황도 공유해주시고, 수정 요청에도 빠르게 대응해주셨어요. 추천합니다!",
    images: ["/review-image-3.jpg"],
    authorName: "박사장",
    authorId: "client-2",
    authorProfileImage: "/client-profile-2.jpg",
    createdAt: "2024.01.10",
  },
  {
    id: "3",
    rating: 4,
    content:
      "전반적으로 만족하지만 초기 소통에서 약간의 아쉬움이 있었습니다. 하지만 결과물은 기대 이상이었고, 애프터서비스도 좋았습니다.",
    images: [],
    authorName: "최대표",
    authorId: "client-3",
    authorProfileImage: "/client-profile-3.jpg",
    createdAt: "2024.01.05",
  },
  {
    id: "4",
    rating: 5,
    content:
      "프로젝트 완성도가 정말 높습니다. 세심한 부분까지 신경써주시고, 코드 품질도 우수해요. 유지보수도 편리하게 해주셨습니다.",
    images: ["/review-image-4.jpg", "/review-image-5.jpg", "/review-image-6.jpg"],
    authorName: "김기획",
    authorId: "client-4",
    authorProfileImage: "/client-profile-4.jpg",
    createdAt: "2023.12.28",
  },
]

export default function ServiceDetailPage() {
  const params = useParams()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [reviewSort, setReviewSort] = useState("latest")
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // 실제로는 auth context에서 가져올 값
  const [currentReviewPage, setCurrentReviewPage] = useState(1)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockService.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mockService.images.length) % mockService.images.length)
  }

  const handleChatClick = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.")
      return
    }
    // 채팅 생성 로직
    console.log("채팅 시작")
  }

  const handleBookmarkClick = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.")
      return
    }
    setIsBookmarked(!isBookmarked)
  }

  const handleShareClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert("링크가 복사되었습니다!")
    } catch (err) {
      console.error("링크 복사 실패:", err)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 서비스 소개 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 이미지 갤러리 */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={mockService.images[currentImageIndex] || "/placeholder.svg"}
                alt={`${mockService.title} - 이미지 ${currentImageIndex + 1}`}
                fill
                className="object-cover"
              />
              {mockService.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* 썸네일 이미지들 */}
            {mockService.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {mockService.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`썸네일 ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 서비스 정보 */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary">{mockService.category}</Badge>
                {mockService.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-2xl font-bold mb-4">{mockService.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{mockService.rating}</span>
                  <span className="text-muted-foreground">({mockService.reviewCount}개 리뷰)</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-primary mb-6">{mockService.price.toLocaleString()}원</div>
            </div>

            {/* 프리랜서 정보 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Link href={`/freelancer/${mockService.freelancer.id}`}>
                    <Avatar className="h-12 w-12 cursor-pointer hover:ring-2 hover:ring-primary">
                      <AvatarImage src={mockService.freelancer.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{mockService.freelancer.name[0]}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1">
                    <Link href={`/freelancer/${mockService.freelancer.id}`}>
                      <h3 className="font-medium hover:text-primary cursor-pointer">{mockService.freelancer.name}</h3>
                    </Link>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{mockService.freelancer.rating}</span>
                      </div>
                      <span>완료 프로젝트 {mockService.freelancer.completedProjects}개</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 인터랙션 버튼들 */}
            <div className="flex space-x-3">
              <Button onClick={handleChatClick} className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" />
                채팅하기
              </Button>
              <Button variant="outline" onClick={handleBookmarkClick}>
                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="outline" onClick={handleShareClick}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 서비스 상세 설명 */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">서비스 상세 설명</h2>
            <div className="whitespace-pre-line text-muted-foreground leading-relaxed">{mockService.description}</div>
          </CardContent>
        </Card>

        {/* 리뷰 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">리뷰</h2>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-lg">{mockService.rating}</span>
                </div>
                <span className="text-muted-foreground">총 {mockService.reviewCount}개 리뷰</span>
              </div>
            </div>
            <Select value={reviewSort} onValueChange={setReviewSort}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">최신순</SelectItem>
                <SelectItem value="rating">별점순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {mockReviews.map((review) => (
              <ReviewCard
                key={review.id}
                rating={review.rating}
                content={review.content}
                images={review.images}
                authorName={review.authorName}
                authorId={review.authorId}
                authorProfileImage={review.authorProfileImage}
                createdAt={review.createdAt}
              />
            ))}
          </div>

          <Pagination currentPage={currentReviewPage} totalPages={5} onPageChange={setCurrentReviewPage} />
        </div>
      </div>
    </div>
  )
}
