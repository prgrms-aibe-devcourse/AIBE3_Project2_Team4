"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useLogin from "@/hooks/use-Login";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useState } from "react";

export default function MypageLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, member } = useLogin();
  const router = useRouter();
  const seg = useSelectedLayoutSegment();
  const userType = member ? member.role : null;
  const [isLoading, setIsLoading] = useState(true);

  const activeTab = seg ?? "profile"; // 세그먼트 없으면 profile을 탭 값으로

  useEffect(() => {
    if (seg === null) router.replace("/mypage/profile");

    setIsLoading(false);
  }, []);

  const handleTabChange = (v: string) => {
    router.push(`/mypage/${v}`);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">마이페이지</h1>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
            <TabsTrigger value="profile">내 프로필</TabsTrigger>
            <TabsTrigger value="services">서비스</TabsTrigger>
            {userType === "freelancer" && <TabsTrigger value="my-services">내 서비스</TabsTrigger>}
            <TabsTrigger value="chat">채팅 목록</TabsTrigger>
            <TabsTrigger value="payments">결제 내역</TabsTrigger>
            {userType === "client" && <TabsTrigger value="bookmarks">북마크</TabsTrigger>}
          </TabsList>

          {children}
        </Tabs>

        {/* 
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

        */}
      </div>
    </div>
  );
}
