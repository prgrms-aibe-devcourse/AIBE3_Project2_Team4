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
import { Search, Filter, AlertCircle } from "lucide-react";
import useCategory from "@/hooks/use-category";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import type { components } from "@/app/services/backend/schemas";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const MOCK_SERVICES = [
  {
    id: 1,
    thumbnail: "/web-design-mockup.png",
    title: "프로페셔널 웹사이트 디자인",
    price: 500000,
    rating: 4.8,
    reviewCount: 24,
    freelancerName: "김디자이너",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    thumbnail: "/mobile-app-development.png",
    title: "모바일 앱 개발 서비스",
    price: 1200000,
    rating: 4.9,
    reviewCount: 18,
    freelancerName: "박개발자",
    createdAt: "2024-01-14T10:00:00Z",
  },
  {
    id: 3,
    thumbnail: "/generic-logo-design.png",
    title: "브랜드 로고 디자인",
    price: 300000,
    rating: 4.7,
    reviewCount: 32,
    freelancerName: "이크리에이터",
    createdAt: "2024-01-13T10:00:00Z",
  },
  {
    id: 4,
    thumbnail: "/seo-marketing-concept.png",
    title: "SEO 최적화 컨설팅",
    price: 800000,
    rating: 4.6,
    reviewCount: 15,
    freelancerName: "최마케터",
    createdAt: "2024-01-12T10:00:00Z",
  },
  {
    id: 5,
    thumbnail: "/video-editing-workspace.png",
    title: "영상 편집 및 제작",
    price: 600000,
    rating: 4.9,
    reviewCount: 28,
    freelancerName: "정크리에이터",
    createdAt: "2024-01-11T10:00:00Z",
  },
  {
    id: 6,
    thumbnail: "/content-writing-concept.png",
    title: "블로그 콘텐츠 작성",
    price: 200000,
    rating: 4.5,
    reviewCount: 21,
    freelancerName: "강작가",
    createdAt: "2024-01-10T10:00:00Z",
  },
];

function ServicesPageContent() {
  const { categories, tagsByCategory } = useCategory();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category"),
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  type ServiceDTO = components["schemas"]["ServiceDTO"];
  const [allServices, setAllServices] = useState<ServiceDTO[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  const itemsPerPage = 9;

  const fetchServices = async () => {
    if (!API_BASE_URL) {
      console.warn("[v0] API_BASE_URL not set, using mock data");
      setUseMockData(true);
      setAllServices(MOCK_SERVICES as any);
      setFilteredServices(MOCK_SERVICES as any);
      setTotalElements(MOCK_SERVICES.length);
      setTotalPages(1);
      return;
    }

    setIsLoading(true);
    setError(null);

    // If there's a search query, use the /search endpoint
    if (searchQuery.trim()) {
      const url = `${API_BASE_URL}/api/v1/services/search?keyword=${encodeURIComponent(searchQuery)}&page=${currentPage - 1}&size=${itemsPerPage}&sort=id&direction=DESC`;
      console.log("[v0] Fetching from:", url);

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`검색 실패: ${res.status} ${res.statusText}`);
        const data = await res.json();
        setAllServices(data.content);
        setFilteredServices(data.content);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
        setUseMockData(false);
        console.log("[v0] Fetched services:", data.content);
      } catch (err) {
        console.error("[v0] Fetch error:", err);
        setUseMockData(true);
        const filtered = MOCK_SERVICES.filter((s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()),
        ) as any;
        setAllServices(filtered);
        setFilteredServices(filtered);
        setTotalElements(filtered.length);
        setTotalPages(1);
        setError(`백엔드 연결 실패 (${err instanceof Error ? err.message : "알 수 없는 오류"})`);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    let url = `${API_BASE_URL}/api/v1/services?page=${currentPage - 1}&size=${itemsPerPage}`;

    // 카테고리만 선택
    if (selectedCategory && selectedTags.length === 0) {
      url = `${API_BASE_URL}/api/v1/services/category?page=${currentPage - 1}&size=${itemsPerPage}&category=${selectedCategory}`;
    }

    // 태그 선택
    if (selectedTags.length > 0) {
      const tagQuery = selectedTags.map((tag) => `&tags=${encodeURIComponent(tag)}`).join("");
      url = `${API_BASE_URL}/api/v1/services/tags?page=${currentPage - 1}&size=${itemsPerPage}${tagQuery}`;
    }

    console.log("[v0] Fetching from:", url);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`서비스 목록 불러오기 실패: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setAllServices(data.content);
      setFilteredServices(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
      setUseMockData(false);
      console.log("[v0] Fetched services:", data.content);
    } catch (err) {
      console.error("[v0] Fetch error:", err);
      setUseMockData(true);
      setAllServices(MOCK_SERVICES as any);
      setFilteredServices(MOCK_SERVICES as any);
      setTotalElements(MOCK_SERVICES.length);
      setTotalPages(1);
      setError(`백엔드 연결 실패 (${err instanceof Error ? err.message : "알 수 없는 오류"})`);
    } finally {
      setIsLoading(false);
    }
  };

  // 서비스 목록 가져오기
  useEffect(() => {
    fetchServices();
  }, [currentPage, selectedCategory, selectedTags]);

  // 필터링 및 정렬 로직
  useEffect(() => {
    if (!allServices) return;

    let filtered = [...allServices];

    // 정렬 (검색 시에는 백엔드에서 정렬되므로 검색어가 없을 때만 적용)
    if (!searchQuery.trim()) {
      if (sortBy === "latest") {
        filtered = filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      } else if (sortBy === "rating") {
        filtered = filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      }
    }

    setFilteredServices(filtered);
  }, [sortBy, allServices, searchQuery]);

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setSelectedTags([]);

    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
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
    setCurrentPage(1);
    setSelectedCategory(null);
    setSelectedTags([]);

    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    router.push(`${pathname}?${params.toString()}`);

    // 검색 실행
    fetchServices();
  };

  const currentTags = selectedCategory
    ? tagsByCategory[selectedCategory as keyof typeof tagsByCategory]
    : [];

  const currentServices = filteredServices;

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
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                      className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                      onClick={() => handleTagToggle(tag.id)}
                    >
                      {tag.name}
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
                  총 <span className="text-primary font-bold">{totalElements}</span>
                  개의 서비스
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

            {isLoading ? (
              <div className="py-16 text-center">
                <div className="mb-4 text-4xl">⏳</div>
                <p className="text-muted-foreground">로딩 중...</p>
              </div>
            ) : currentServices.length > 0 ? (
              <>
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {currentServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      id={service.id.toString()}
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
