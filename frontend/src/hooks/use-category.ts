// 카테고리 데이터
import { useEffect, useState } from "react";
import { Search, Code, Palette, BarChart, LockKeyholeIcon, Smartphone } from "lucide-react";

const categories_mock = [
  { id: "WEB_DEVELOPMENT", name: "웹 개발", icon: Code, color: "bg-blue-100 text-blue-700" },
  {
    id: "MOBILE_DEVELOPMENT",
    name: "앱 개발",
    icon: Smartphone,
    color: "bg-purple-100 text-purple-700",
  },
  { id: "DATA_SCIENCE", name: "데이터", icon: BarChart, color: "bg-green-100 text-green-700" },
  {
    id: "INFRA_SECURITY",
    name: "인프라 보안",
    icon: LockKeyholeIcon,
    color: "bg-orange-100 text-orange-700",
  },
  { id: "UIUX_DESIGN", name: "디자인", icon: Palette, color: "bg-red-100 text-red-700" },
  { id: "ETC", name: "기타", icon: Search, color: "bg-indigo-100 text-indigo-700" },
];

// 태그 데이터 (카테고리별)
const tagsByCategory_mock = {
  // WEB_DEVELOPMENT 웹 개발
  WEB_DEVELOPMENT: [
    { id: "FRONTEND", name: "프론트엔드" },
    { id: "BACKEND", name: "백엔드" },
    { id: "FULLSTACK", name: "풀스택" },
  ],

  // MOBILE_DEVELOPMENT 앱 개발
  MOBILE_DEVELOPMENT: [
    { id: "IOS", name: "iOS" },
    { id: "ANDROID", name: "안드로이드" },
    { id: "CROSS_PLATFORM", name: "크로스플랫폼" },
  ],

  // DATA_SCIENCE 데이터
  DATA_SCIENCE: [
    { id: "DATABASE", name: "데이터베이스" },
    { id: "DATA_ANALYSIS", name: "데이터 분석" },
    { id: "AI_MACHINE_LEARNING", name: "머신러닝 / AI" },
  ],

  // INFRA_SECURITY 인프라 보안
  INFRA_SECURITY: [
    { id: "CLOUD_SERVER", name: "클라우드 / 서버" },
    { id: "DEVOPS", name: "DevOps" },
    { id: "SECURITY", name: "보안" },
  ],

  // UIUX_DESIGN 디자인
  UIUX_DESIGN: [
    { id: "UI_DESIGN", name: "UI 디자인" },
    { id: "UX_DESIGN", name: "UX 디자인" },
    { id: "PROTOTYPING", name: "프로토타이핑" },
  ],

  // ETC 기타
  ETC: [
    { id: "PROJECT_MANAGEMENT", name: "프로젝트 관리" },
    { id: "QA_TESTING", name: "QA / 테스트" },
    { id: "TECHNICAL_WRITING", name: "문서화" },
  ],
};

export default function useCategory() {
  const categories = categories_mock;
  const tagsByCategory = tagsByCategory_mock;

  return { categories, tagsByCategory };
}
