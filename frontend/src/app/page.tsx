"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ServiceCard } from "@/components/service-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Search } from "lucide-react";
import useCategory from "@/hooks/use-category";

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
];

export default function HomePage() {
  const { categories } = useCategory();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleCategorySelect = (categoryId: string) => {
    router.push(`/services?category=${categoryId}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/services");
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* 플랫폼 소개 섹션 */}
      <section className="relative flex h-80 flex-col items-center justify-center overflow-hidden">
        <div className="from-primary/10 to-secondary/10 absolute inset-0 flex justify-center bg-gradient-to-br">
          <Image
            src={"/main_banner.jpg"}
            width={1240}
            height={320}
            alt={"대표 이미지"}
            className="absolute"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-foreground mb-6 text-4xl font-bold text-balance md:text-6xl">
            전문가와 함께하는
            <br />
            <span className="text-primary">프리랜서 매칭 플랫폼</span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl text-pretty">
            다양한 분야의 전문 프리랜서들과 연결되어 당신의 프로젝트를 성공으로 이끌어보세요
          </p>
        </div>
      </section>

      {/* 검색 섹션 */}
      <section className="bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* 검색창 */}
          <div className="mx-auto mb-8 max-w-2xl">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
              <Input
                type="text"
                placeholder="어떤 서비스를 찾고 계신가요?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="h-12 pl-10 text-lg"
              />
              <Button
                className="absolute top-1/2 right-2 -translate-y-1/2 transform"
                onClick={handleSearch}
              >
                검색
              </Button>
            </div>
          </div>

          {/* 카테고리 선택 */}
          <div className="mb-6">
            <h3 className="mb-4 text-center text-lg font-semibold">카테고리</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant="outline"
                    className="hover:bg-primary hover:text-primary-foreground flex h-auto cursor-pointer flex-col items-center space-y-2 bg-transparent p-4 transition-colors"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <div className={`rounded-lg p-2 ${category.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium">{category.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 추천 서비스 섹션 */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold">추천 서비스</h2>
            <p className="text-muted-foreground text-lg">인기 있는 서비스들을 만나보세요</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" onClick={() => router.push("/services")}>
              더 많은 서비스 보기
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
