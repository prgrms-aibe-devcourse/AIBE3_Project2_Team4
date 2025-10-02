// 카테고리 데이터
import { useEffect, useState } from "react";
import { Search, Code, Palette, Camera, PenTool, Megaphone, BarChart } from "lucide-react";

const categories_mock = [
  { id: "development", name: "개발·프로그래밍", icon: Code, color: "bg-blue-100 text-blue-700" },
  { id: "design", name: "디자인", icon: Palette, color: "bg-purple-100 text-purple-700" },
  { id: "video", name: "영상·사진·음향", icon: Camera, color: "bg-green-100 text-green-700" },
  {
    id: "writing",
    name: "번역·통역·글쓰기",
    icon: PenTool,
    color: "bg-orange-100 text-orange-700",
  },
  { id: "marketing", name: "마케팅", icon: Megaphone, color: "bg-red-100 text-red-700" },
  { id: "business", name: "비즈니스", icon: BarChart, color: "bg-indigo-100 text-indigo-700" },
];

// 태그 데이터 (카테고리별)
const tagsByCategory_mock = {
  development: ["웹개발", "앱개발", "AI/ML", "데이터분석", "게임개발"],
  design: ["로고디자인", "UI/UX", "브랜딩", "일러스트", "패키지디자인"],
  video: ["영상편집", "모션그래픽", "사진촬영", "음향편집", "애니메이션"],
  writing: ["번역", "콘텐츠작성", "카피라이팅", "교정·교열", "네이밍"],
  marketing: ["SNS마케팅", "SEO", "광고운영", "브랜드마케팅", "이벤트기획"],
  business: ["사업계획서", "재무관리", "법무자문", "HR컨설팅", "창업컨설팅"],
};

export default function useCategory() {
  const [categories, setCategories] = useState(categories_mock);
  const [tagsByCategory, setTagsByCategory] = useState(tagsByCategory_mock);

  useEffect(() => {
    // TODO : 카테고리 및 태그 불러오기
  }, []);

  return { categories, tagsByCategory };
}
