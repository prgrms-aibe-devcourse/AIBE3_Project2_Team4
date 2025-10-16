"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Star, MessageCircle, Share2, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReviewCard } from "@/components/review-card";
import { Pagination } from "@/components/pagination";
import { components } from "@/app/service/backend/schemas";
import { useLoginStore } from "@/store/useLoginStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params?.id;
  const router = useRouter();

  type ServiceReviewDTO = components["schemas"]["ServiceReviewDTO"];
  type ServiceDTO = components["schemas"]["ServiceDTO"];
  const [service, setService] = useState<ServiceDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviewSort, setReviewSort] = useState("latest");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 실제로는 auth context에서 가져올 값
  const [reviews, setReviews] = useState<ServiceReviewDTO[]>([]);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [totalReviewPage, setTotalReviewPage] = useState(1);
  const { member, accessToken } = useLoginStore();

  // 서비스 상세 정보
  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/v1/services/${serviceId}`);
        if (!res.ok) throw new Error(`서비스 정보를 불러오지 못했습니다. (${res.status})`);
        const data: ServiceDTO = await res.json();
        setService(data);
      } catch (err: any) {
        console.error("서비스 상세 조회 실패:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetail();
  }, [serviceId]);

  // 북마크 여부 조회
  useEffect(() => {
    if (!member || !accessToken) return; // 토큰 준비되면 실행
    const fetchBookmark = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/bookmarks/services/${serviceId}/bookmark`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });
        if (!res.ok) throw new Error(`북마크 정보를 불러오지 못했습니다. (${res.status})`);

        // 유연한 불리언 파싱
        const text = await res.text();
        let parsed = false as boolean;
        try {
          const json = JSON.parse(text);
          if (typeof json === "boolean") parsed = json;
          else if (typeof json?.content === "boolean") parsed = json.content;
          else if (typeof json?.bookmarked === "boolean") parsed = json.bookmarked;
          else if (typeof json?.data === "boolean") parsed = json.data;
          else parsed = String(json).toLowerCase() === "true";
        } catch {
          parsed = text.toLowerCase() === "true";
        }
        setIsBookmarked(parsed);
      } catch (err: any) {
        console.error("북마크 정보 조회 실패:", err);
        setError(err.message);
      }
    };

    fetchBookmark();
  }, [serviceId, member, accessToken]);

  // 북마크 토글 함수 (버튼 클릭 시 실행)
  const handleBookmarkClick = async () => {
    if (!member) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    try {
      const method = isBookmarked ? "DELETE" : "POST";
      const res = await fetch(`${API_BASE_URL}/api/v1/bookmarks/services/${serviceId}`, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error(`북마크 ${isBookmarked ? "삭제" : "등록"} 실패 (${res.status})`);

      // 성공 시 상태 반전
      setIsBookmarked((prev) => !prev);
    } catch (err: any) {
      console.error("북마크 요청 실패:", err);
      setError(err.message);
    }
  };

  const reviewSize = 5;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/reviews/${serviceId}?page=${currentReviewPage - 1}&?size=${reviewSize}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );

        if (!res.ok) throw new Error(`서비스 정보를 불러오지 못했습니다. (${res.status})`);

        const data = await res.json();
        setReviews(data.content);
        setTotalReviewPage(data.totalPages);
      } catch (err: any) {
        console.error("서비스 상세 조회 실패:", err);
        setError(err.message);
      }
    };

    fetchReviews();
  }, [currentReviewPage]);

  const nextImage = () => {
    if (!service || !service.images?.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % service.images.length);
  };

  const prevImage = () => {
    if (!service || !service.images?.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + service.images.length) % service.images.length);
  };

  const handleChatClick = async () => {
    if (!member) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }
    if (!service || !service.freelancer?.id) {
      alert("프리랜서 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/chats/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ freelancerId: service.freelancer.id }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "채팅방 생성에 실패했습니다.");
      }

      const room = await res.json();
      router.push(`/mypage/chat/${room.id}`);
    } catch (err: any) {
      console.error("채팅 시작 실패:", err);
      alert(err.message);
    }
  };

  const handleShareClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었습니다!");
    } catch (err) {
      console.error("링크 복사 실패:", err);
    }
  };

  // --- 렌더링 가드 ---
  if (loading) return <div className="p-10 text-center">로딩 중...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!service) return <div className="p-10 text-center">서비스를 찾을 수 없습니다.</div>;

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* 서비스 소개 섹션 */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* 이미지 갤러리 */}
          <div className="space-y-4">
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={service.images[currentImageIndex] || "/placeholder-image.svg"}
                alt={`${service.title} - 이미지 ${currentImageIndex + 1}`}
                fill
                className="object-cover"
              />
              {service.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* 썸네일 이미지들 */}
            {service.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {service.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                      currentImageIndex === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder-image.svg"}
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
              <div className="mb-2 flex items-center space-x-2">
                <Badge variant="secondary">{service.category}</Badge>
                {service.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="mb-4 text-2xl font-bold">{service.title}</h1>
              <div className="mb-4 flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{service?.rating?.toFixed(2) || 0}</span>
                  <span className="text-muted-foreground">({service.reviewCount}개 리뷰)</span>
                </div>
              </div>
              <div className="text-primary mb-6 text-3xl font-bold">
                {service.price.toLocaleString()}원
              </div>
            </div>

            {/* 프리랜서 정보 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Link href={`/freelancer/${service.freelancer.id}`}>
                    <Avatar className="hover:ring-primary h-12 w-12 cursor-pointer hover:ring-2">
                      {/* <AvatarImage src={service.freelancer.avatar || "/placeholder.svg"} /> */}
                      <AvatarImage src={service.freelancer.profileImageUrl} />
                      <AvatarFallback>{service.freelancer.nickname}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1">
                    <Link href={`/freelancer/${service.freelancer.id}`}>
                      <h3 className="hover:text-primary cursor-pointer font-medium">
                        {service.freelancer.nickname}
                      </h3>
                    </Link>
                    <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {/* <span>{service.freelancer.rating}</span> */}
                        <span>4.9</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 인터랙션 버튼들 */}
            <div className="flex space-x-3">
              {member?.role === "client" && (
                <Button onClick={handleChatClick} className="flex-1">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  채팅하기
                </Button>
              )}
              <Button variant="outline" onClick={handleBookmarkClick}>
                <Bookmark
                  className={`h-4 w-4 ${isBookmarked ? "text-primary" : ""}`}
                  fill={isBookmarked ? "currentColor" : "none"}
                />
              </Button>
              <Button variant="outline" onClick={handleShareClick}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Button
          onClick={() => router.push(`/reviews/register?serviceId=${serviceId}`)}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          리뷰 작성하기 (임시버튼)
        </Button>

        {/* 서비스 상세 설명 */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-bold">서비스 상세 설명</h2>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {service.description}
            </div>
          </CardContent>
        </Card>

        {/* 리뷰 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">리뷰</h2>
              <div className="mt-2 flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-medium">{service?.rating?.toFixed(2) || 0}</span>
                </div>
                <span className="text-muted-foreground">총 {service.reviewCount}개 리뷰</span>
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
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                rating={review.rating}
                content={review.content}
                images={review.images}
                authorName={review.freelancerName}
                authorId={review.freelancerEmail}
                authorProfileImage={review.freelancerProfileImage}
                createdAt={review.createdAt}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentReviewPage}
            totalPages={totalReviewPage}
            onPageChange={setCurrentReviewPage}
          />
        </div>
      </div>
    </div>
  );
}
