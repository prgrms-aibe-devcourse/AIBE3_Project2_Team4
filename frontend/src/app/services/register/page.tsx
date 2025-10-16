"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Star } from "lucide-react";
import useCategory from "@/hooks/use-category";
import { useLoginStore } from "@/store/useLoginStore";

// 카테고리와 태그 데이터
const categories = useCategory().categories;
const tagsByCategory = useCategory().tagsByCategory;

// const mockServiceData = {
//   id: "1",
//   category: "development",
//   tags: ["웹개발", "프론트엔드"],
//   serviceName: "반응형 웹사이트 개발",
//   serviceDescription:
//     "최신 기술을 활용한 반응형 웹사이트를 개발해드립니다. React, Next.js를 사용하여 빠르고 안정적인 웹사이트를 제작합니다.",
//   price: "500000",
//   images: ["/web-development-concept.png", "/responsive-design.png"],
//   mainImageIndex: 0,
// };

export default function ServiceRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isEditMode = searchParams.get("mode") === "edit";
  const serviceId = searchParams.get("id");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { accessToken, member } = useLoginStore();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // useEffect(() => {
  //   if (isEditMode && serviceId) {
  //     const serviceData = mockServiceData;
  //     setSelectedCategory(serviceData.category);
  //     setSelectedTags(serviceData.tags);
  //     setServiceName(serviceData.serviceName);
  //     setServiceDescription(serviceData.serviceDescription);
  //     setPrice(serviceData.price);
  //     setImagePreviews(serviceData.images);
  //     setMainImageIndex(serviceData.mainImageIndex);
  //   }
  // }, [isEditMode, serviceId]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) {
      alert("최대 10장까지 업로드 가능합니다.");
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    if (imagePreviews.length === 0) {
      setMainImageIndex(0);
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);

    if (newPreviews.length === 0) {
      setMainImageIndex(0);
    } else if (index === mainImageIndex) {
      setMainImageIndex(0);
    } else if (index < mainImageIndex) {
      setMainImageIndex(mainImageIndex - 1);
    }
  };

  const handleImageClick = (index: number) => {
    setMainImageIndex(index);
  };

  const handleSubmit = async () => {
    if (
      !selectedCategory ||
      selectedTags.length === 0 ||
      !serviceName ||
      !serviceDescription ||
      !price
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    if (images.length === 0) {
      alert("최소 1장의 이미지를 업로드해주세요.");
      return;
    }

    try {
      // --------------------------
      // 1️⃣ 이미지 업로드
      // --------------------------
      const formData = new FormData();
      images.forEach((file) => formData.append("files", file));
      formData.append("fileCategory", "SERVICE_IMAGE");

      const uploadRes = await fetch(`${API_BASE_URL}/api/v1/uploads/multi`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!uploadRes.ok) throw new Error(`이미지 업로드 실패 (${uploadRes.status})`);

      const uploadedFiles = await uploadRes.json(); // [{ url: "https://..." }, ...]
      const imageUrls = uploadedFiles.map((f: any) => f.s3Url);

      // --------------------------
      // 2️⃣ 서비스 등록
      // --------------------------
      const serviceBody = {
        title: serviceName,
        content: serviceDescription,
        price: Number(price),
        tagNames: selectedTags,
        imageUrls: imageUrls,
        mainImageUrl: imageUrls[mainImageIndex],
      };

      const serviceRes = await fetch(`${API_BASE_URL}/api/v1/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(serviceBody),
      });

      if (!serviceRes.ok) {
        const text = await serviceRes.text(); // body가 없을 수도 있으니 text로
        console.log(text);
        throw new Error(`서비스 등록 실패 (${serviceRes.status}): ${text}`);
      }

      const data = await serviceRes.json(); // 여기서 JSON parse 가능

      if (!serviceRes.ok) throw new Error(`서비스 등록 실패 (${serviceRes.status})`);

      alert("서비스가 성공적으로 등록되었습니다!");

      window.location.href = `/service/${data.id}`;
    } catch (err: any) {
      console.error("서비스 등록 오류:", err);
      alert(`오류 발생: ${err.message}`);
    }
  };

  const availableTags = selectedCategory
    ? tagsByCategory[selectedCategory as keyof typeof tagsByCategory] || []
    : [];

  const getTagNameById = (tagId: string) => {
    if (!selectedCategory) return tagId;
    const tags = tagsByCategory[selectedCategory as keyof typeof tagsByCategory] || [];
    const tag = tags.find((t) => t.id === tagId);
    return tag ? tag.name : tagId;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* 헤더 */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {isEditMode ? "서비스 수정" : "새 서비스 등록"}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            {isEditMode
              ? "등록된 서비스 정보를 수정하여 더 나은 서비스를 제공하세요"
              : "전문적인 서비스를 등록하여 고객들과 연결되세요"}
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* 카테고리 및 태그 선택 */}
              <div className="space-y-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    1
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">카테고리 및 태그 선택</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                      카테고리 <span className="text-red-500">*</span>
                    </Label>
                    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="카테고리를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedCategory && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">
                        세부 태그 <span className="text-red-500">*</span>
                        <span className="ml-2 text-xs text-gray-500">(여러 개 선택 가능)</span>
                      </Label>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {availableTags.map((tag) => (
                          <Button
                            key={tag.id}
                            type="button"
                            variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                            className={`h-11 ${
                              selectedTags.includes(tag.id)
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                            onClick={() => toggleTag(tag.id)}
                          >
                            {tag.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {selectedCategory && selectedTags.length > 0 && (
                  <div className="space-y-3 rounded-lg bg-blue-50 p-4">
                    <span className="text-sm font-medium text-gray-700">선택된 분야:</span>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="border-0 bg-gray-200 text-gray-700">
                        {categories.find((c) => c.id === selectedCategory)?.name}
                      </Badge>
                      {selectedTags.map((tag) => (
                        <Badge key={tag} className="bg-blue-600 pr-1 text-white hover:bg-blue-700">
                          {getTagNameById(tag)}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1.5 rounded-full p-0.5 hover:bg-blue-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <hr className="border-gray-200" />

              {/* 서비스 기본 정보 */}
              <div className="space-y-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    2
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">서비스 기본 정보</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="serviceName" className="text-sm font-medium text-gray-700">
                      서비스명 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="serviceName"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      placeholder="예: 반응형 웹사이트 개발 서비스"
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                      서비스 금액 <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="100000"
                        className="h-12 border-gray-300 pr-12 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span className="absolute top-1/2 right-4 -translate-y-1/2 transform font-medium text-gray-500">
                        원
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="serviceDescription"
                      className="text-sm font-medium text-gray-700"
                    >
                      서비스 상세 설명 <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="serviceDescription"
                      value={serviceDescription}
                      onChange={(e) => setServiceDescription(e.target.value)}
                      placeholder="서비스에 대한 자세한 설명을 작성해주세요. 제공하는 서비스의 특징, 진행 과정, 결과물 등을 포함해주세요."
                      rows={6}
                      className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* 서비스 이미지 */}
              <div className="space-y-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    3
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">서비스 이미지</h2>
                </div>

                <div className="space-y-6">
                  {/* 이미지 업로드 영역 */}
                  <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-blue-400">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                          <Upload className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-gray-900">이미지 업로드</h3>
                        <p className="mb-1 text-gray-600">
                          클릭하여 이미지를 선택하거나 드래그하여 업로드하세요
                        </p>
                        <p className="text-sm text-gray-500">
                          최대 10장까지 업로드 가능 (JPG, PNG, GIF)
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* 업로드된 이미지 미리보기 */}
                  {imagePreviews.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3">
                        <Star className="h-5 w-5 text-amber-500" />
                        <p className="text-sm text-amber-800">
                          <strong>대표 이미지:</strong> 이미지를 클릭하여 대표 이미지로 설정할 수
                          있습니다. 대표 이미지는 서비스 목록에서 먼저 표시됩니다.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="group relative">
                            <div
                              className={`relative cursor-pointer transition-all duration-200 ${
                                index === mainImageIndex
                                  ? "shadow-lg ring-4 ring-amber-400 ring-offset-2"
                                  : "hover:shadow-md"
                              }`}
                              onClick={() => handleImageClick(index)}
                            >
                              <img
                                src={preview || "/placeholder-image.svg"}
                                alt={`서비스 이미지 ${index + 1}`}
                                className="h-32 w-full rounded-lg border border-gray-200 object-cover"
                              />

                              {/* 대표 이미지 배지 */}
                              {index === mainImageIndex && (
                                <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-1 text-xs text-white shadow-sm">
                                  <Star className="h-3 w-3" />
                                  대표
                                </div>
                              )}

                              {/* 삭제 버튼 */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeImage(index);
                                }}
                                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-red-600"
                              >
                                <X className="h-4 w-4" />
                              </button>

                              {/* 클릭 힌트 */}
                              {index !== mainImageIndex && (
                                <div className="bg-opacity-0 group-hover:bg-opacity-20 absolute inset-0 flex items-center justify-center rounded-lg bg-black opacity-0 transition-all group-hover:opacity-100">
                                  <div className="rounded bg-white px-2 py-1 text-xs text-gray-900 shadow-sm">
                                    클릭하여 대표 이미지로 설정
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* 하단 버튼 */}
              <div className="flex flex-col justify-end gap-4 pt-6 sm:flex-row">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.back()}
                  className="h-12 border-gray-300 px-8 text-gray-700 hover:bg-gray-50"
                >
                  취소하기
                </Button>
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  className="h-12 bg-blue-600 px-8 text-white hover:bg-blue-700"
                >
                  {isEditMode ? "수정 완료" : "서비스 등록"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
