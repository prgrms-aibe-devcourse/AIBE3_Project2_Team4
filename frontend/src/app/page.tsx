"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ServiceCard } from "@/components/service-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image";
import { Search } from "lucide-react"
import banner from "@/public/main_banner.jpg"
import useCategory from "@/hooks/use-catetory";

// 추천 서비스 더미 데이터
const recommendedServices = [
  {
    id: "1",
    thumbnail: "/-------.jpg",
    title: "반응형 웹사이트 개발해드립니다",
    price: 500000,
    rating: 4.9,
    reviewCount: 127,
    freelancerName: "김개발자",
  },
  {
    id: "2",
    thumbnail: "/------.jpg",
    title: "브랜드 로고 디자인 작업",
    price: 150000,
    rating: 4.8,
    reviewCount: 89,
    freelancerName: "박디자이너",
  },
  {
    id: "3",
    thumbnail: "/-----.jpg",
    title: "유튜브 영상 편집 및 썸네일 제작",
    price: 80000,
    rating: 4.7,
    reviewCount: 156,
    freelancerName: "이편집자",
  },
  {
    id: "4",
    thumbnail: "/-----.jpg",
    title: "모바일 앱 개발 (iOS/Android)",
    price: 1200000,
    rating: 4.9,
    reviewCount: 43,
    freelancerName: "최앱개발",
  },
  {
    id: "5",
    thumbnail: "/------.jpg",
    title: "SNS 마케팅 전략 수립 및 운영",
    price: 300000,
    rating: 4.6,
    reviewCount: 72,
    freelancerName: "정마케터",
  },
  {
    id: "6",
    thumbnail: "/translation-service.png",
    title: "전문 번역 서비스 (한↔영)",
    price: 50000,
    rating: 4.8,
    reviewCount: 234,
    freelancerName: "한번역가",
  },
]

export default function HomePage() {
  const { categories } = useCategory();
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleCategorySelect = (categoryId: string) => {
    router.push(`/services?category=${categoryId}`)
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery)}`)
    } else {
      router.push("/services")
    }
  }

  return (
    <div className="min-h-screen bg-background">

      {/* 플랫폼 소개 섹션 */}
      <section className="relative h-80 overflow-hidden flex flex-col justify-center items-center">
        <div
          className="absolute flex justify-center inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"
        >
          <Image src={banner} alt={"대표 이미지"} className="absolute" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            전문가와 함께하는
            <br />
            <span className="text-primary">프리랜서 매칭 플랫폼</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            다양한 분야의 전문 프리랜서들과 연결되어 당신의 프로젝트를 성공으로 이끌어보세요
          </p>
        </div>
      </section>

      {/* 검색 섹션 */}
      <section className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 검색창 */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="어떤 서비스를 찾고 계신가요?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 h-12 text-lg"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={handleSearch}>
                검색
              </Button>
            </div>
          </div>

          {/* 카테고리 선택 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-center">카테고리</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.id}
                    variant="outline"
                    className="cursor-pointer h-auto p-4 flex flex-col items-center space-y-2 hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium">{category.name}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 추천 서비스 섹션 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">추천 서비스</h2>
            <p className="text-lg text-muted-foreground">인기 있는 서비스들을 만나보세요</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedServices.map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                thumbnail={service.thumbnail}
                title={service.title}
                price={service.price}
                rating={service.rating}
                reviewCount={service.reviewCount}
                freelancerName={service.freelancerName}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" onClick={() => router.push("/services")}>
              더 많은 서비스 보기
            </Button>
          </div>
        </div>
      </section>


    </div>
  )
}
