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
import { Edit, Save, X, Star, Bookmark, Plus, ExternalLink, Briefcase, Trash2 } from "lucide-react";
import ChatTab from "./ChatTab";
import useLogin from "@/hooks/use-Login";
import PaymentTab from "./PaymentTab";
import MyServiceTab from "@/app/mypage/MyServiceTab";
import ServiceTab from "./ServiceTab";

export default function MyPage() {
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

  useEffect(() => {
    setIsLoading(false);
  }, []);

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

  if (!isLoggedIn || member == null) {
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
            <ServiceTab member={member} />
          </TabsContent>

          {/* 내 서비스 탭 (프리랜서 전용) */}
          {userType === "freelancer" && (
            <TabsContent value="my-services">
              <MyServiceTab />
            </TabsContent>
          )}

          {/* 채팅 목록 탭 */}
          <TabsContent value="chat">
            <ChatTab />
          </TabsContent>

          {/* 결제 내역 탭 */}
          <TabsContent value="payments">
            <PaymentTab />
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
