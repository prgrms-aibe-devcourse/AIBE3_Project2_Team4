"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ServiceCard } from "@/components/service-card";
import {
  Edit,
  Save,
  X,
  Star,
  Bookmark,
  Plus,
  CreditCard,
  Calendar,
  ExternalLink,
  Briefcase,
  Trash2,
  CheckCircle2,
  FileText,
  MessageCircle,
} from "lucide-react";
import ChatTab from "./ChatTab";
import useLogin from "@/hooks/use-Login";
import { useRouter } from "next/navigation";
import { authorizedFetch } from "@/lib/api";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface PaymentHistory {
  paymentKey: string;
  freelancerId: number;
  serviceId: number;
  serviceTitle: string;
  price: number;
  memo?: string;
  approvedAt: string;
  paymentStatus:
    | "READY"
    | "IN_PROGRESS"
    | "WAITING_FOR_DEPOSIT"
    | "DONE"
    | "CANCELED"
    | "PARTIAL_CANCELED"
    | "ABORTED"
    | "EXPIRED";
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function MyPage() {
  const router = useRouter();
  const { isLoggedIn, member } = useLogin();
  const userType = member ? member.role : null;

  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPortfolioDialogOpen, setIsPortfolioDialogOpen] = useState(false);
  const [editingPortfolioIndex, setEditingPortfolioIndex] = useState<number | null>(null);
  const [portfolioTitle, setPortfolioTitle] = useState("");
  const [portfolioDescription, setPortfolioDescription] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const [newCertificate, setNewCertificate] = useState("");
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<number | null>(null);
  const [experienceTitle, setExperienceTitle] = useState("");
  const [experienceCompany, setExperienceCompany] = useState("");
  const [experiencePeriod, setExperiencePeriod] = useState("");
  const [experienceDescription, setExperienceDescription] = useState("");

  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [isEditingMemo, setIsEditingMemo] = useState<number | null>(null);
  const [editMemoText, setEditMemoText] = useState("");
  const MEMO_MAX_LENGTH = 200;

  const [userProfile, setUserProfile] = useState({
    nickname: "김개발자",
    avatar: "/professional-developer-portrait.png",
    introduction:
      "5년차 풀스택 개발자입니다. React, Node.js, Python을 주로 사용하며 사용자 경험을 중시하는 개발을 지향합니다.",
    rating: 4.8,
    reviewCount: 127,
    skills: ["React", "Node.js", "Python", "TypeScript", "AWS"],
    certificates: ["정보처리기사", "AWS Solutions Architect"],
    completedProjects: 89,
    experience: [
      {
        title: "시니어 풀스택 개발자",
        company: "테크스타트업 A",
        period: "2022년 1월 - 현재",
        description:
          "React와 Node.js를 활용한 SaaS 플랫폼 개발 및 유지보수를 담당했습니다. 팀 리드로서 5명의 개발자를 관리하며 프로젝트를 성공적으로 완료했습니다.",
      },
      {
        title: "풀스택 개발자",
        company: "IT 솔루션 B",
        period: "2020년 3월 - 2021년 12월",
        description:
          "Vue.js와 Python Django를 사용한 웹 애플리케이션 개발을 담당했습니다. 클라이언트 요구사항 분석부터 배포까지 전체 개발 프로세스를 경험했습니다.",
      },
    ],
    portfolio: [
      {
        title: "이커머스 플랫폼",
        description: "React와 Node.js로 구축한 완전한 이커머스 솔루션",
        link: "https://example.com/ecommerce",
      },
      {
        title: "프로젝트 관리 도구",
        description: "팀 협업을 위한 실시간 프로젝트 관리 애플리케이션",
        link: "https://example.com/project-manager",
      },
      {
        title: "데이터 시각화 대시보드",
        description: "비즈니스 인텔리전스를 위한 인터랙티브 대시보드",
        link: "https://example.com/dashboard",
      },
    ],
    companyName: "테크스타트업",
    teamName: "개발팀",
  });

  const myServices = [
    {
      id: "1",
      thumbnail: "/ecommerce-website-homepage.png",
      title: "React 웹사이트 개발해드립니다",
      price: 500000,
      rating: 4.9,
      reviewCount: 23,
      freelancerName: "김개발자",
      status: "active",
    },
    {
      id: "2",
      thumbnail: "/project-management-dashboard.png",
      title: "Node.js API 서버 구축",
      price: 800000,
      rating: 4.7,
      reviewCount: 15,
      freelancerName: "김개발자",
      status: "active",
    },
  ];

  // Updated service data structure to include memo field and chatId
  const [freelancerServices, setFreelancerServices] = useState({
    ongoing: [
      {
        id: "f1",
        thumbnail: "/responsive-design.png",
        title: "모바일 앱 백엔드 API 개발",
        price: 1500000,
        rating: 4.8,
        reviewCount: 5,
        freelancerName: "김개발자",
        status: "ongoing",
        memo: "클라이언트 요청사항: REST API 구현 및 데이터베이스 설계 포함",
        chatId: "1",
      },
    ],
    completed: [
      {
        id: "f2",
        thumbnail: "/data-visualization-dashboard.png",
        title: "데이터 분석 대시보드 구축",
        price: 2500000,
        rating: 4.9,
        reviewCount: 8,
        freelancerName: "김개발자",
        status: "completed",
        memo: "React와 D3.js를 활용한 실시간 데이터 시각화",
        chatId: "2",
      },
    ],
  });

  const [clientServices, setClientServices] = useState({
    ongoing: [
      {
        id: "3",
        thumbnail: "/data-visualization-dashboard.png",
        title: "데이터 시각화 대시보드 개발",
        price: 1200000,
        rating: 4.8,
        reviewCount: 8,
        freelancerName: "박데이터",
        status: "ongoing",
        memo: "주간 리포트 기능 추가 필요",
        chatId: "1",
      },
    ],
    completed: [
      {
        id: "4",
        thumbnail: "/ecommerce-website-homepage.png",
        title: "이커머스 웹사이트 구축",
        price: 2000000,
        rating: 4.9,
        reviewCount: 12,
        freelancerName: "이웹개발",
        status: "completed",
        memo: "결제 시스템 및 관리자 페이지 포함",
        chatId: "2",
      },
    ],
  });

  const bookmarkedServices = [
    {
      id: "5",
      thumbnail: "/project-management-dashboard.png",
      title: "모바일 앱 UI/UX 디자인",
      price: 600000,
      rating: 4.9,
      reviewCount: 34,
      freelancerName: "김디자이너",
    },
  ];

  const fetchPaymentHistory = async () => {
    if (!isLoggedIn || !member) return;

    setIsPaymentLoading(true);
    setPaymentError(null);

    try {
      const response = await authorizedFetch(`${baseUrl}/api/v1/auth/me/payments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("결제 내역을 불러오는데 실패했습니다.");
      }

      const data: PaymentHistory[] = await response.json();
      setPaymentHistory(data);
    } catch (error) {
      console.error("결제 내역 조회 오류:", error);
      setPaymentError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchPaymentHistory();
    }
  }, [isLoggedIn]);

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "READY":
        return "결제 준비";
      case "IN_PROGRESS":
        return "결제 진행중";
      case "WAITING_FOR_DEPOSIT":
        return "입금 대기";
      case "DONE":
        return "결제 완료";
      case "CANCELED":
        return "결제 취소";
      case "PARTIAL_CANCELED":
        return "부분 취소";
      case "ABORTED":
        return "결제 중단";
      case "EXPIRED":
        return "결제 만료";
      default:
        return status;
    }
  };

  // 결제 상태 뱃지 색상
  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case "DONE":
        return "bg-green-500 hover:bg-green-600";
      case "CANCELED":
      case "PARTIAL_CANCELED":
      case "ABORTED":
        return "bg-red-500 hover:bg-red-600";
      case "READY":
      case "IN_PROGRESS":
      case "WAITING_FOR_DEPOSIT":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "EXPIRED":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "yyyy.MM.dd", { locale: ko });
    } catch (error) {
      console.error("날짜 포맷 오류:", error);
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
              <p className="text-muted-foreground">로딩 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-bold">로그인이 필요합니다</h2>
              <p className="text-muted-foreground mb-6">마이페이지에 접근하려면 로그인해주세요.</p>
              <Button onClick={() => (window.location.href = "/auth/login")}>로그인하기</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    // Save profile logic here
    setIsEditMode(false);
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setUserProfile({
        ...userProfile,
        skills: [...userProfile.skills, newSkill.trim()],
      });
      setNewSkill("");
      setIsSkillDialogOpen(false);
    }
  };

  const handleDeleteSkill = (index: number) => {
    if (confirm("이 기술 스택을 삭제하시겠습니까?")) {
      const updatedSkills = userProfile.skills.filter((_, i) => i !== index);
      setUserProfile({ ...userProfile, skills: updatedSkills });
    }
  };

  const handleAddCertificate = () => {
    if (newCertificate.trim()) {
      setUserProfile({
        ...userProfile,
        certificates: [...userProfile.certificates, newCertificate.trim()],
      });
      setNewCertificate("");
      setIsCertificateDialogOpen(false);
    }
  };

  const handleDeleteCertificate = (index: number) => {
    if (confirm("이 자격증을 삭제하시겠습니까?")) {
      const updatedCertificates = userProfile.certificates.filter((_, i) => i !== index);
      setUserProfile({ ...userProfile, certificates: updatedCertificates });
    }
  };

  const handleOpenExperienceDialog = (index: number | null = null) => {
    if (index !== null) {
      const exp = userProfile.experience[index];
      setEditingExperienceIndex(index);
      setExperienceTitle(exp.title);
      setExperienceCompany(exp.company);
      setExperiencePeriod(exp.period);
      setExperienceDescription(exp.description);
    } else {
      setEditingExperienceIndex(null);
      setExperienceTitle("");
      setExperienceCompany("");
      setExperiencePeriod("");
      setExperienceDescription("");
    }
    setIsExperienceDialogOpen(true);
  };

  const handleSaveExperience = () => {
    if (!experienceTitle.trim() || !experienceCompany.trim() || !experiencePeriod.trim()) {
      alert("직책, 회사명, 기간을 입력해주세요.");
      return;
    }

    const newExperience = {
      title: experienceTitle,
      company: experienceCompany,
      period: experiencePeriod,
      description: experienceDescription,
    };

    if (editingExperienceIndex !== null) {
      const updatedExperience = [...userProfile.experience];
      updatedExperience[editingExperienceIndex] = newExperience;
      setUserProfile({ ...userProfile, experience: updatedExperience });
    } else {
      setUserProfile({
        ...userProfile,
        experience: [...userProfile.experience, newExperience],
      });
    }

    setIsExperienceDialogOpen(false);
    setExperienceTitle("");
    setExperienceCompany("");
    setExperiencePeriod("");
    setExperienceDescription("");
    setEditingExperienceIndex(null);
  };

  const handleDeleteExperience = (index: number) => {
    if (confirm("이 경력을 삭제하시겠습니까?")) {
      const updatedExperience = userProfile.experience.filter((_, i) => i !== index);
      setUserProfile({ ...userProfile, experience: updatedExperience });
    }
  };

  const handleOpenPortfolioDialog = (index: number | null = null) => {
    if (index !== null) {
      const portfolio = userProfile.portfolio[index];
      setEditingPortfolioIndex(index);
      setPortfolioTitle(portfolio.title);
      setPortfolioDescription(portfolio.description);
      setPortfolioLink(portfolio.link);
    } else {
      setEditingPortfolioIndex(null);
      setPortfolioTitle("");
      setPortfolioDescription("");
      setPortfolioLink("");
    }
    setIsPortfolioDialogOpen(true);
  };

  const handleSavePortfolio = () => {
    if (!portfolioTitle.trim() || !portfolioLink.trim()) {
      alert("제목과 링크를 입력해주세요.");
      return;
    }

    const newPortfolio = {
      title: portfolioTitle,
      description: portfolioDescription,
      link: portfolioLink,
    };

    if (editingPortfolioIndex !== null) {
      const updatedPortfolio = [...userProfile.portfolio];
      updatedPortfolio[editingPortfolioIndex] = newPortfolio;
      setUserProfile({ ...userProfile, portfolio: updatedPortfolio });
    } else {
      setUserProfile({
        ...userProfile,
        portfolio: [...userProfile.portfolio, newPortfolio],
      });
    }

    setIsPortfolioDialogOpen(false);
    setPortfolioTitle("");
    setPortfolioDescription("");
    setPortfolioLink("");
    setEditingPortfolioIndex(null);
  };

  const handleDeletePortfolio = (index: number) => {
    if (confirm("이 포트폴리오를 삭제하시겠습니까?")) {
      const updatedPortfolio = userProfile.portfolio.filter((_, i) => i !== index);
      setUserProfile({ ...userProfile, portfolio: updatedPortfolio });
    }
  };

  const handleCompleteWork = (serviceId: string) => {
    if (confirm("작업을 완료하시겠습니까? 클라이언트에게 작업 완료 메시지가 전송됩니다.")) {
      // Find the service
      const service = freelancerServices.ongoing.find((s) => s.id === serviceId);
      if (!service) return;

      // Move service to completed
      setFreelancerServices({
        ongoing: freelancerServices.ongoing.filter((s) => s.id !== serviceId),
        completed: [...freelancerServices.completed, { ...service, status: "completed" }],
      });
    }
  };

  // 메모 저장 함수
  const handleSaveMemo = async (paymentKey: string) => {
    try {
      await authorizedFetch(`${baseUrl}/api/v1/payments/${paymentKey}/memo`, {
        method: "PATCH",
        body: JSON.stringify({ memo: editMemoText }),
        headers: { "Content-Type": "application/json" },
      });

      // 로컬 상태 업데이트
      setPaymentHistory((prev) =>
        prev.map((payment) =>
          payment.paymentKey === paymentKey ? { ...payment, memo: editMemoText } : payment,
        ),
      );

      setIsEditingMemo(null);
      setEditMemoText("");
    } catch (error) {
      console.error("메모 저장 오류:", error);
      alert("메모 저장에 실패했습니다.");
    }
  };

  // 메모 편집 시작
  const handleStartEditMemo = (index: number, currentMemo?: string) => {
    setIsEditingMemo(index);
    setEditMemoText(currentMemo || "");
  };

  // 메모 편집 취소
  const handleCancelEditMemo = () => {
    setIsEditingMemo(null);
    setEditMemoText("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">마이페이지</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
            <TabsTrigger value="profile">내 프로필</TabsTrigger>
            <TabsTrigger value="services">서비스</TabsTrigger>
            {userType === "freelancer" && <TabsTrigger value="my-services">내 서비스</TabsTrigger>}
            <TabsTrigger value="chat">채팅 목록</TabsTrigger>
            <TabsTrigger value="payments">결제 내역</TabsTrigger>
            {userType === "client" && <TabsTrigger value="bookmarks">북마크</TabsTrigger>}
          </TabsList>

          {/* 내 프로필 탭 */}
          <TabsContent value="profile">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>내 프로필</CardTitle>
                {!isEditMode ? (
                  <Button onClick={() => setIsEditMode(true)} variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    프로필 수정
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} size="sm">
                      <Save className="mr-2 h-4 w-4" />
                      저장
                    </Button>
                    <Button onClick={() => setIsEditMode(false)} variant="outline" size="sm">
                      <X className="mr-2 h-4 w-4" />
                      취소
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userProfile.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{userProfile.nickname[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    {isEditMode ? (
                      <Input
                        defaultValue={userProfile.nickname}
                        className="text-xl font-semibold"
                      />
                    ) : (
                      <h2 className="text-xl font-semibold">{userProfile.nickname}</h2>
                    )}
                    <div className="mt-1 flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 font-medium">{userProfile.rating}</span>
                        <span className="text-muted-foreground ml-1">
                          ({userProfile.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">자기소개</label>
                  {isEditMode ? (
                    <Textarea defaultValue={userProfile.introduction} rows={4} />
                  ) : (
                    <p className="text-muted-foreground">{userProfile.introduction}</p>
                  )}
                </div>

                {userType === "freelancer" && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium">완료 프로젝트</label>
                      <p className="text-muted-foreground">{userProfile.completedProjects}개</p>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-sm font-medium">기술 스택</label>
                        {isEditMode && (
                          <Button
                            onClick={() => setIsSkillDialogOpen(true)}
                            size="sm"
                            variant="outline"
                            className="h-8 gap-2"
                          >
                            <Plus className="h-3 w-3" />
                            추가
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            {skill}
                            {isEditMode && (
                              <button
                                onClick={() => handleDeleteSkill(index)}
                                className="hover:text-destructive ml-1"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-sm font-medium">자격증</label>
                        {isEditMode && (
                          <Button
                            onClick={() => setIsCertificateDialogOpen(true)}
                            size="sm"
                            variant="outline"
                            className="h-8 gap-2"
                          >
                            <Plus className="h-3 w-3" />
                            추가
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.certificates.map((cert, index) => (
                          <Badge key={index} variant="outline" className="gap-1">
                            {cert}
                            {isEditMode && (
                              <button
                                onClick={() => handleDeleteCertificate(index)}
                                className="hover:text-destructive ml-1"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5" />
                          <label className="text-lg font-semibold">경력</label>
                        </div>
                        {isEditMode && (
                          <Button
                            onClick={() => handleOpenExperienceDialog()}
                            size="sm"
                            variant="outline"
                            className="gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            추가
                          </Button>
                        )}
                      </div>
                      <div className="space-y-6">
                        {userProfile.experience.map((exp, index) => (
                          <div key={index}>
                            <div className="mb-2 flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold">{exp.title}</h3>
                                <p className="text-muted-foreground">{exp.company}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{exp.period}</Badge>
                                {isEditMode && (
                                  <div className="flex gap-1">
                                    <Button
                                      onClick={() => handleOpenExperienceDialog(index)}
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      onClick={() => handleDeleteExperience(index)}
                                      size="icon"
                                      variant="ghost"
                                      className="text-destructive hover:text-destructive h-8 w-8"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {exp.description}
                            </p>
                            {index < userProfile.experience.length - 1 && (
                              <Separator className="mt-6" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <label className="text-lg font-semibold">포트폴리오</label>
                        {isEditMode && (
                          <Button
                            onClick={() => handleOpenPortfolioDialog()}
                            size="sm"
                            variant="outline"
                            className="gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            추가
                          </Button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {userProfile.portfolio.map((project, index) => (
                          <div
                            key={index}
                            className="hover:bg-accent group flex items-center gap-3 rounded-lg border p-3 transition-colors"
                          >
                            <ExternalLink className="text-muted-foreground group-hover:text-primary h-5 w-5 flex-shrink-0 transition-colors" />
                            <div className="min-w-0 flex-1">
                              <p className="group-hover:text-primary truncate font-medium transition-colors">
                                {project.title}
                              </p>
                              <p className="text-muted-foreground truncate text-sm">
                                {project.description}
                              </p>
                            </div>
                            {isEditMode && (
                              <div className="flex gap-1">
                                <Button
                                  onClick={() => handleOpenPortfolioDialog(index)}
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDeletePortfolio(index)}
                                  size="icon"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {userType === "client" && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">회사명</label>
                      {isEditMode ? (
                        <Input defaultValue={userProfile.companyName} />
                      ) : (
                        <p className="text-muted-foreground">{userProfile.companyName}</p>
                      )}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">팀명</label>
                      {isEditMode ? (
                        <Input defaultValue={userProfile.teamName} />
                      ) : (
                        <p className="text-muted-foreground">{userProfile.teamName}</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>서비스 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="ongoing" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ongoing">진행중인 서비스</TabsTrigger>
                    <TabsTrigger value="completed">완료된 서비스</TabsTrigger>
                  </TabsList>

                  <TabsContent value="ongoing">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {(userType === "client"
                        ? clientServices.ongoing
                        : freelancerServices.ongoing
                      ).map((service) => (
                        <Card
                          key={service.id}
                          className="overflow-hidden transition-shadow hover:shadow-lg"
                        >
                          <div className="bg-muted relative h-48">
                            <img
                              src={service.thumbnail || "/placeholder.svg"}
                              alt={service.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <CardContent className="space-y-3 p-4">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="line-clamp-2 flex-1 text-lg font-bold">
                                {service.title}
                              </h3>
                              <Badge className="flex-shrink-0 bg-blue-500 hover:bg-blue-600">
                                진행중
                              </Badge>
                            </div>

                            <div className="text-muted-foreground flex items-center gap-2 text-sm">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{service.rating}</span>
                                <span>({service.reviewCount})</span>
                              </div>
                              <span>•</span>
                              <span className="truncate">{service.freelancerName}</span>
                            </div>

                            <div className="flex items-baseline gap-1">
                              <span className="text-primary text-2xl font-bold">
                                {service.price.toLocaleString()}
                              </span>
                              <span className="text-muted-foreground text-sm">원</span>
                            </div>

                            {service.memo && (
                              <div className="bg-muted/50 rounded-lg border p-3">
                                <div className="mb-1 flex items-center gap-2">
                                  <FileText className="text-primary h-3 w-3" />
                                  <p className="text-muted-foreground text-xs font-semibold">
                                    메모
                                  </p>
                                </div>
                                <p className="line-clamp-2 text-sm leading-relaxed">
                                  {service.memo}
                                </p>
                              </div>
                            )}

                            {userType === "freelancer" && (
                              <div className="flex flex-col gap-2 pt-2">
                                <Button
                                  onClick={() => handleCompleteWork(service.id)}
                                  className="w-full gap-2 bg-green-600 hover:bg-green-700"
                                  size="sm"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                  작업 완료
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full gap-2 bg-transparent"
                                  size="sm"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                  채팅하기
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="completed">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {(userType === "client"
                        ? clientServices.completed
                        : freelancerServices.completed
                      ).map((service) => (
                        <Card
                          key={service.id}
                          className="overflow-hidden transition-shadow hover:shadow-lg"
                        >
                          <div className="bg-muted relative h-48">
                            <img
                              src={service.thumbnail || "/placeholder.svg"}
                              alt={service.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <CardContent className="space-y-3 p-4">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="line-clamp-2 flex-1 text-lg font-bold">
                                {service.title}
                              </h3>
                              <Badge className="flex-shrink-0 bg-green-500 hover:bg-green-600">
                                완료
                              </Badge>
                            </div>

                            <div className="text-muted-foreground flex items-center gap-2 text-sm">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{service.rating}</span>
                                <span>({service.reviewCount})</span>
                              </div>
                              <span>•</span>
                              <span className="truncate">{service.freelancerName}</span>
                            </div>

                            <div className="flex items-baseline gap-1">
                              <span className="text-primary text-2xl font-bold">
                                {service.price.toLocaleString()}
                              </span>
                              <span className="text-muted-foreground text-sm">원</span>
                            </div>

                            {service.memo && (
                              <div className="bg-muted/50 rounded-lg border p-3">
                                <div className="mb-1 flex items-center gap-2">
                                  <FileText className="text-primary h-3 w-3" />
                                  <p className="text-muted-foreground text-xs font-semibold">
                                    메모
                                  </p>
                                </div>
                                <p className="line-clamp-2 text-sm leading-relaxed">
                                  {service.memo}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 내 서비스 탭 (프리랜서 전용) */}
          {userType === "freelancer" && (
            <TabsContent value="my-services">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>내가 등록한 서비스</CardTitle>
                  <Button onClick={() => router.push("/services/register")}>
                    <Plus className="mr-2 h-4 w-4" />새 서비스 등록
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {myServices.map((service) => (
                      <ServiceCard key={service.id} {...service} variant="mypage" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* 채팅 목록 탭 */}
          <TabsContent value="chat">
            <ChatTab />
          </TabsContent>

          {/* 결제 내역 탭 */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>결제 내역</span>
                  </div>
                  <Button
                    onClick={fetchPaymentHistory}
                    variant="outline"
                    size="sm"
                    disabled={isPaymentLoading}
                  >
                    {isPaymentLoading ? "로딩 중..." : "새로고침"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isPaymentLoading ? (
                  <div className="flex h-64 items-center justify-center">
                    <div className="text-center">
                      <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
                      <p className="text-muted-foreground">결제 내역을 불러오는 중...</p>
                    </div>
                  </div>
                ) : paymentError ? (
                  <div className="flex h-64 items-center justify-center">
                    <div className="text-center">
                      <p className="text-destructive mb-4">{paymentError}</p>
                      <Button onClick={fetchPaymentHistory} variant="outline">
                        다시 시도
                      </Button>
                    </div>
                  </div>
                ) : paymentHistory.length === 0 ? (
                  <div className="flex h-64 items-center justify-center">
                    <div className="text-center">
                      <CreditCard className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                      <p className="text-muted-foreground">결제 내역이 없습니다.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {paymentHistory.map((payment, index) => (
                      <Card
                        key={`${payment.paymentKey}`}
                        className="overflow-hidden transition-shadow hover:shadow-lg"
                      >
                        <div className="bg-muted relative flex h-48 items-center justify-center">
                          <FileText className="text-muted-foreground h-16 w-16" />
                        </div>
                        <CardContent className="space-y-3 p-4">
                          <h3 className="line-clamp-2 text-lg font-bold">{payment.serviceTitle}</h3>

                          <div className="flex items-baseline justify-between">
                            <div className="flex items-baseline gap-1">
                              <span className="text-primary text-2xl font-bold">
                                {payment.price.toLocaleString()}
                              </span>
                              <span className="text-muted-foreground text-sm">원</span>
                            </div>
                            <Badge variant="secondary" className="gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(payment.approvedAt)}
                            </Badge>
                          </div>

                          <div className="bg-muted/50 rounded-lg border p-3">
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="text-primary h-3 w-3" />
                                <p className="text-muted-foreground text-xs font-semibold">메모</p>
                              </div>
                              {isEditingMemo === index ? (
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => handleSaveMemo(payment.paymentKey)}
                                  >
                                    <Save className="mr-1 h-3 w-3" />
                                    저장
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 px-2 text-xs"
                                    onClick={handleCancelEditMemo}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => handleStartEditMemo(index, payment.memo)}
                                >
                                  <Edit className="mr-1 h-3 w-3" />
                                  수정
                                </Button>
                              )}
                            </div>
                            {isEditingMemo === index ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editMemoText}
                                  onChange={(e) => setEditMemoText(e.target.value)}
                                  placeholder="메모를 입력하세요..."
                                  className="min-h-[60px] text-sm"
                                  maxLength={MEMO_MAX_LENGTH}
                                  autoFocus
                                />
                                <div className="flex items-center justify-between">
                                  <span
                                    className={`text-xs ${
                                      editMemoText.length >= MEMO_MAX_LENGTH
                                        ? "text-destructive font-semibold"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {editMemoText.length} / {MEMO_MAX_LENGTH}자
                                  </span>
                                  {editMemoText.length >= MEMO_MAX_LENGTH && (
                                    <span className="text-destructive text-xs">
                                      최대 글자 수에 도달했습니다
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : payment.memo ? (
                              <p className="text-sm leading-relaxed">{payment.memo}</p>
                            ) : (
                              <p className="text-muted-foreground/60 text-xs italic">
                                메모한 내용이 없습니다
                              </p>
                            )}
                          </div>

                          <Badge
                            className={`w-full justify-center ${getPaymentStatusVariant(payment.paymentStatus)}`}
                          >
                            {getPaymentStatusText(payment.paymentStatus)}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 북마크 탭 (클라이언트 전용) */}
          {userType === "client" && (
            <TabsContent value="bookmarks">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bookmark className="h-5 w-5" />
                    <span>북마크한 서비스</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {bookmarkedServices.map((service) => (
                      <ServiceCard key={service.id} {...service} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>기술 스택 추가</DialogTitle>
              <DialogDescription>새로운 기술 스택을 입력해주세요.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="skill">기술 스택</Label>
                <Input
                  id="skill"
                  placeholder="예: React, Node.js, Python"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsSkillDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleAddSkill}>추가</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isCertificateDialogOpen} onOpenChange={setIsCertificateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>자격증 추가</DialogTitle>
              <DialogDescription>새로운 자격증을 입력해주세요.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="certificate">자격증</Label>
                <Input
                  id="certificate"
                  placeholder="예: 정보처리기사, AWS Solutions Architect"
                  value={newCertificate}
                  onChange={(e) => setNewCertificate(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddCertificate()}
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsCertificateDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleAddCertificate}>추가</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isExperienceDialogOpen} onOpenChange={setIsExperienceDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Briefcase className="text-primary h-5 w-5" />
                {editingExperienceIndex !== null ? "경력 수정" : "경력 추가"}
              </DialogTitle>
              <DialogDescription>
                경력 정보를 입력해주세요. 직책, 회사명, 기간은 필수입니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="exp-title">직책 *</Label>
                <Input
                  id="exp-title"
                  placeholder="예: 시니어 풀스택 개발자"
                  value={experienceTitle}
                  onChange={(e) => setExperienceTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-company">회사명 *</Label>
                <Input
                  id="exp-company"
                  placeholder="예: 테크스타트업 A"
                  value={experienceCompany}
                  onChange={(e) => setExperienceCompany(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-period">기간 *</Label>
                <Input
                  id="exp-period"
                  placeholder="예: 2022년 1월 - 현재"
                  value={experiencePeriod}
                  onChange={(e) => setExperiencePeriod(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-description">설명</Label>
                <Textarea
                  id="exp-description"
                  placeholder="담당 업무와 성과를 입력해주세요..."
                  value={experienceDescription}
                  onChange={(e) => setExperienceDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsExperienceDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleSaveExperience} className="gap-2">
                <Save className="h-4 w-4" />
                {editingExperienceIndex !== null ? "수정" : "추가"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isPortfolioDialogOpen} onOpenChange={setIsPortfolioDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ExternalLink className="text-primary h-5 w-5" />
                {editingPortfolioIndex !== null ? "포트폴리오 수정" : "포트폴리오 추가"}
              </DialogTitle>
              <DialogDescription>
                포트폴리오 정보를 입력해주세요. 제목과 링크는 필수입니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="portfolio-title">제목 *</Label>
                <Input
                  id="portfolio-title"
                  placeholder="프로젝트 제목"
                  value={portfolioTitle}
                  onChange={(e) => setPortfolioTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio-description">설명</Label>
                <Textarea
                  id="portfolio-description"
                  placeholder="프로젝트에 대한 간단한 설명..."
                  value={portfolioDescription}
                  onChange={(e) => setPortfolioDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio-link">링크 *</Label>
                <Input
                  id="portfolio-link"
                  type="url"
                  placeholder="https://example.com"
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsPortfolioDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleSavePortfolio} className="gap-2">
                <Save className="h-4 w-4" />
                {editingPortfolioIndex !== null ? "수정" : "추가"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
