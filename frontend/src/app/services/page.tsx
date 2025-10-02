"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { ServiceCard } from "@/components/service-card";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import useCategory from "@/hooks/use-category";

// 더미 서비스 데이터 (더 많은 데이터)
const allServices = [
  {
    id: "1",
    thumbnail: "/-------.jpg",
    title: "반응형 웹사이트 개발해드립니다",
    price: 500000,
    rating: 4.9,
    reviewCount: 127,
    freelancerName: "김개발자",
    category: "development",
    tags: ["웹개발"],
    createdAt: "2025-01-15",
  },
  {
    id: "2",
    thumbnail: "/------.jpg",
    title: "브랜드 로고 디자인 작업",
    price: 150000,
    rating: 4.8,
    reviewCount: 89,
    freelancerName: "박디자이너",
    category: "design",
    tags: ["로고디자인", "브랜딩"],
    createdAt: "2025-01-14",
  },
  {
    id: "3",
    thumbnail: "/-----.jpg",
    title: "유튜브 영상 편집 및 썸네일 제작",
    price: 80000,
    rating: 4.7,
    reviewCount: 156,
    freelancerName: "이편집자",
    category: "video",
    tags: ["영상편집"],
    createdAt: "2025-01-13",
  },
  {
    id: "4",
    thumbnail: "/-----.jpg",
    title: "모바일 앱 개발 (iOS/Android)",
    price: 1200000,
    rating: 4.9,
    reviewCount: 43,
    freelancerName: "최앱개발",
    category: "development",
    tags: ["앱개발"],
    createdAt: "2025-01-12",
  },
  {
    id: "5",
    thumbnail: "/------.jpg",
    title: "SNS 마케팅 전략 수립 및 운영",
    price: 300000,
    rating: 4.6,
    reviewCount: 72,
    freelancerName: "정마케터",
    category: "marketing",
    tags: ["SNS마케팅", "브랜드마케팅"],
    createdAt: "2025-01-11",
  },
  {
    id: "6",
    thumbnail: "/translation-service.png",
    title: "전문 번역 서비스 (한↔영)",
    price: 50000,
    rating: 4.8,
    reviewCount: 234,
    freelancerName: "한번역가",
    category: "writing",
    tags: ["번역"],
    createdAt: "2025-01-10",
  },
  {
    id: "7",
    thumbnail: "/-------.jpg",
    title: "AI 챗봇 개발 서비스",
    price: 800000,
    rating: 4.9,
    reviewCount: 67,
    freelancerName: "AI개발자",
    category: "development",
    tags: ["AI/ML", "웹개발"],
    createdAt: "2025-01-09",
  },
  {
    id: "8",
    thumbnail: "/------.jpg",
    title: "UI/UX 디자인 및 프로토타입 제작",
    price: 400000,
    rating: 4.7,
    reviewCount: 98,
    freelancerName: "UX디자이너",
    category: "design",
    tags: ["UI/UX"],
    createdAt: "2025-01-08",
  },
  {
    id: "9",
    thumbnail: "/-----.jpg",
    title: "기업 홍보영상 제작",
    price: 600000,
    rating: 4.8,
    reviewCount: 45,
    freelancerName: "영상제작자",
    category: "video",
    tags: ["영상편집", "모션그래픽"],
    createdAt: "2025-01-07",
  },
  {
    id: "10",
    thumbnail: "/------.jpg",
    title: "콘텐츠 마케팅 전략 및 글쓰기",
    price: 250000,
    rating: 4.6,
    reviewCount: 123,
    freelancerName: "콘텐츠작가",
    category: "writing",
    tags: ["콘텐츠작성", "카피라이팅"],
    createdAt: "2025-01-06",
  },
  {
    id: "11",
    thumbnail: "/-------.jpg",
    title: "데이터 분석 및 시각화",
    price: 350000,
    rating: 4.8,
    reviewCount: 76,
    freelancerName: "데이터분석가",
    category: "development",
    tags: ["데이터분석"],
    createdAt: "2025-01-05",
  },
  {
    id: "12",
    thumbnail: "/------.jpg",
    title: "패키지 디자인 및 브랜딩",
    price: 200000,
    rating: 4.7,
    reviewCount: 54,
    freelancerName: "패키지디자이너",
    category: "design",
    tags: ["패키지디자인", "브랜딩"],
    createdAt: "2025-01-04",
  },
];

function ServicesPageContent() {
  const { categories, tagsByCategory } = useCategory();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredServices, setFilteredServices] = useState(allServices);

  const itemsPerPage = 9;

  // URL 파라미터에서 초기값 설정
  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    if (category) {
      setSelectedCategory(category);
    }
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  // 필터링 및 정렬 로직
  useEffect(() => {
    let filtered = allServices;

    // 검색어 필터링
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (service) =>
          service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.freelancerName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // 카테고리 필터링
    if (selectedCategory) {
      filtered = filtered.filter((service) => service.category === selectedCategory);
    }

    // 태그 필터링
    if (selectedTags.length > 0) {
      filtered = filtered.filter((service) =>
        selectedTags.some((tag) => service.tags.includes(tag)),
      );
    }

    // 정렬
    if (sortBy === "latest") {
      filtered = filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sortBy === "rating") {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredServices(filtered);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  }, [searchQuery, selectedCategory, selectedTags, sortBy]);

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setSelectedTags([]); // 카테고리 변경 시 태그 초기화

    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    // 검색어는 유지
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }
    // 카테고리는 유지
    if (selectedCategory) {
      params.set("category", selectedCategory);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentTags = selectedCategory
    ? tagsByCategory[selectedCategory as keyof typeof tagsByCategory]
    : [];

  // 페이지네이션
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-background min-h-screen">
      <Navigation />

      <div className="pt-16">
        {/* 검색 섹션 */}
        <section className="bg-card border-b py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* 검색창 */}
            <div className="mx-auto mb-6 max-w-2xl">
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
              <div className="mb-4 flex flex-wrap justify-center gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategorySelect(null)}
                  className="cursor-pointer transition-all duration-200 hover:scale-105"
                >
                  전체
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategorySelect(category.id)}
                    className="cursor-pointer transition-all duration-200 hover:scale-105"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* 태그 선택 (카테고리 선택 시에만 표시) */}
            {selectedCategory && currentTags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap justify-center gap-2">
                  {currentTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 서비스 목록 섹션 */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* 결과 정보 및 정렬 */}
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Filter className="text-muted-foreground h-5 w-5" />
                <span className="text-lg font-medium">
                  총 <span className="text-primary font-bold">{filteredServices.length}</span>개의
                  서비스
                </span>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="정렬 기준" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">최신순</SelectItem>
                  <SelectItem value="rating">평점순</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 서비스 목록 */}
            {currentServices.length > 0 ? (
              <>
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {currentServices.map((service) => (
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

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="py-16 text-center">
                <div className="mb-4 text-6xl">🔍</div>
                <h3 className="mb-2 text-xl font-semibold">검색 결과가 없습니다</h3>
                <p className="text-muted-foreground mb-6">다른 키워드나 카테고리로 검색해보세요</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                    setSelectedTags([]);
                    router.push(pathname);
                  }}
                >
                  전체 서비스 보기
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServicesPageContent />
    </Suspense>
  );
}
