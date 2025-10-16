"use client";

import type React from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Star, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLoginStore } from "@/store/useLoginStore";

export default function ReviewRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const serviceName = searchParams.get("serviceName") || "서비스";

  const { accessToken } = useLoginStore();

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files); // 새로 선택된 파일들
    setSelectedFiles((prev) => [...prev, ...newFiles].slice(0, 5)); // ✅ 실제 File 객체 저장

    const newImages: string[] = [];
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        if (newImages.length === newFiles.length) {
          setImages((prev) => [...prev, ...newImages].slice(0, 5)); // ✅ base64 미리보기용
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || rating === 0) {
      alert("별점, 제목, 내용을 모두 입력해주세요.");
      return;
    }

    try {
      // ✅ 1️⃣ 실제 파일 업로드
      let uploadedImageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        const formDataToSend = new FormData();

        // ✅ 'files' 필드로 File 객체들을 추가
        selectedFiles.forEach((file) => formDataToSend.append("files", file));

        // ✅ fileCategory 필드 추가
        formDataToSend.append("fileCategory", "REVIEW_IMAGE");

        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/uploads/multi`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formDataToSend,
          },
        );

        if (!uploadRes.ok) throw new Error(`이미지 업로드 실패 (${uploadRes.status})`);

        const uploadedFiles = await uploadRes.json();
        uploadedImageUrls = uploadedFiles.map((f: any) => f.s3Url);
      }

      // ✅ 2️⃣ 리뷰 작성 요청
      const reviewBody = {
        rating,
        title: formData.title,
        content: formData.content,
        imageUrls: uploadedImageUrls,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/reviews/${serviceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(reviewBody),
        },
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`리뷰 작성 실패 (${res.status}): ${text}`);
      }

      alert("리뷰가 성공적으로 등록되었습니다!");
      router.push(`/service/${serviceId}`);
    } catch (err: any) {
      console.error("리뷰 등록 오류:", err);
      alert(`오류 발생: ${err.message}`);
    }
  };

  const renderStarRating = (
    currentRating: number,
    onRate: (rating: number) => void,
    label: string,
  ) => (
    <div className="space-y-2">
      <Label>{label} *</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:ring-primary rounded focus:ring-2 focus:outline-none"
          >
            <Star
              className={cn(
                "h-8 w-8 transition-colors",
                star <= (hoveredRating || currentRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-background min-h-screen">
      <Navigation />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2 text-3xl font-bold">리뷰 작성</h1>
          <p className="text-muted-foreground">
            <span className="font-medium">{serviceName}</span>에 대한 솔직한 리뷰를 남겨주세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <Card>
            <CardHeader>
              <CardTitle>전체 평가</CardTitle>
              <CardDescription>서비스에 대한 전반적인 만족도를 평가해주세요</CardDescription>
            </CardHeader>
            <CardContent>
              {renderStarRating(rating, setRating, "전체 평점")}
              {rating > 0 && (
                <p className="text-muted-foreground mt-2 text-sm">
                  {rating === 5 && "최고예요!"}
                  {rating === 4 && "좋아요!"}
                  {rating === 3 && "보통이에요"}
                  {rating === 2 && "별로예요"}
                  {rating === 1 && "실망이에요"}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Detailed Ratings AI추천 추후 추가사항?
          <Card>
            <CardHeader>
              <CardTitle>세부 평가</CardTitle>
              <CardDescription>각 항목별로 평가해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderStarRating(formData.communication, () => {}, "의사소통", "communication")}
              {renderStarRating(formData.serviceQuality, () => {}, "서비스 품질", "serviceQuality")}
              {renderStarRating(formData.recommendation, () => {}, "추천 의향", "recommendation")}
            </CardContent>
          </Card> */}

          {/* Review Content */}
          <Card>
            <CardHeader>
              <CardTitle>리뷰 내용</CardTitle>
              <CardDescription>서비스 이용 경험을 자세히 작성해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">리뷰 제목 *</Label>
                <Input
                  id="title"
                  placeholder="예: 빠르고 정확한 작업이었습니다"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">상세 리뷰 *</Label>
                <Textarea
                  id="content"
                  placeholder="서비스를 이용하면서 좋았던 점, 개선이 필요한 점 등을 자유롭게 작성해주세요"
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  rows={8}
                  required
                />
                <p className="text-muted-foreground text-xs">최소 50자 이상 작성해주세요</p>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>이미지 첨부</CardTitle>
              <CardDescription>
                서비스 결과물이나 관련 이미지를 첨부하세요 (선택사항, 최대 5개)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {images.length < 5 && (
                  <div className="border-border hover:border-primary rounded-lg border-2 border-dashed p-6 text-center transition-colors">
                    <input
                      type="file"
                      id="images"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="images" className="cursor-pointer">
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="text-muted-foreground h-10 w-10" />
                        <p className="text-muted-foreground text-sm">클릭하여 이미지 업로드</p>
                        <p className="text-muted-foreground text-xs">PNG, JPG (최대 5개)</p>
                      </div>
                    </label>
                  </div>
                )}

                {images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {images.map((image, index) => (
                      <div key={index} className="group relative">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Review image ${index + 1}`}
                          className="h-32 w-full rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== index))}
                          className="bg-destructive text-destructive-foreground absolute top-2 right-2 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              취소
            </Button>
            <Button type="submit" size="lg" disabled={rating === 0}>
              리뷰 등록하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
