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

import { components } from "@/app/services/backend/schemas";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  type ServiceDTO = components["schemas"]["ServiceDTO"];
  const [allServices, setAllServices] = useState<ServiceDTO[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceDTO[]>([]);

  const itemsPerPage = 9;

  // 서비스 목록 가져오기
  useEffect(() => {
    const fetchServices = async () => {
      let url = `${API_BASE_URL}/api/v1/service?page=0&size=10`;

      // 카테고리만 선택
      if (selectedCategory && selectedTags.length === 0) {
        url = `${API_BASE_URL}/api/v1/service/category?page=0&size=10&category=${selectedCategory}`;
      }

      // 태그 선택
      if (selectedTags.length > 0) {
        const tagQuery = selectedTags.map((tag) => `&tags=${encodeURIComponent(tag)}`).join("");
        url = `${API_BASE_URL}/api/v1/service/tags?page=0&size=10${tagQuery}`;
      }

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("서비스 목록 불러오기 실패");
        const data = await res.json();
        setAllServices(data);
        setFilteredServices(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchServices();
  }, [selectedCategory, selectedTags]);

  // 필터링 및 정렬 로직
  useEffect(() => {
    if (!allServices) return;

    let filtered = [...allServices];

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
        selectedTags.some((tag) => service.tags?.includes(tag)),
      );
    }

    // 정렬
    if (sortBy === "latest") {
      filtered = filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sortBy === "rating") {
      filtered = filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    setFilteredServices(filtered);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  }, [searchQuery, selectedCategory, selectedTags, sortBy, allServices]);

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
