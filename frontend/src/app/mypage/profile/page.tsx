"use client";

import { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Edit, Save, X, Star, Plus, ExternalLink, Briefcase, Trash2, Camera } from "lucide-react";
import useLogin from "@/hooks/use-Login";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { profileApi, ProfileResponse, ProfileUpdateRequest } from "@/lib/api/profile";
import { authorizedFetch } from "@/lib/api";

export default function Profile() {
  const { isLoggedIn, member } = useLogin();
  const userType = member ? member.role : null;

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

  const [userProfile, setUserProfile] = useState<ProfileResponse | null>(null);
  const [profileImage, setProfileImage] = useState<string>("/placeholder-user.jpg");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // 프로필 데이터 로드
  useEffect(() => {
    const loadProfile = async () => {
      if (!member) {
        console.log('Member not found:', member);
        return;
      }
      
      console.log('Current member:', member);
      
      try {
        setLoading(true);
        const profile = await profileApi.getMyProfile();
        setUserProfile(profile);
        
        // 프로필 이미지 URL 설정
        if (profile.profileImageUrl) {
          setProfileImage(profile.profileImageUrl);
        } else {
          setProfileImage("/placeholder-user.jpg");
        }
      } catch (error) {
        console.error('프로필 로드 실패:', error);
        console.error('Error details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [member]);

  const handleSaveProfile = async () => {
    if (!userProfile || !member) return;
    
    try {
      setSaving(true);
      
      let profileImageUrl = userProfile.profileImageUrl;
      
      // 선택된 이미지 파일이 있으면 업로드
      if (selectedImageFile) {
        try {
          setUploadingImage(true);
          profileImageUrl = await profileApi.uploadProfileImage(selectedImageFile);
          console.log('이미지 업로드 완료:', profileImageUrl);
          
          // userProfile 상태에도 업로드된 이미지 URL 업데이트
          setUserProfile({
            ...userProfile,
            profileImageUrl: profileImageUrl
          });
        } catch (uploadError) {
          console.error('이미지 업로드 실패:', uploadError);
          alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
          return;
        } finally {
          setUploadingImage(false);
        }
      }
      
      const updateData: ProfileUpdateRequest = {
        nickname: userProfile.nickname,
        introduction: userProfile.introduction,
        profileImageUrl: profileImageUrl,
      };
      
      console.log('프로필 업데이트 데이터:', updateData);
      console.log('profileImageUrl 변수 값:', profileImageUrl);

      if (userProfile.profileType === 'CLIENT') {
        updateData.companyName = userProfile.companyName;
        updateData.teamName = userProfile.teamName;
      } else if (userProfile.profileType === 'FREELANCER') {
        updateData.techStacks = userProfile.techStacks || [];
        updateData.certificates = userProfile.certificates || [];
        updateData.careers = userProfile.careers || [];
        updateData.portfolios = userProfile.portfolios || [];
      }

      await profileApi.updateMyProfile(updateData);
      setIsEditMode(false);
      setIsEditing(false);
      
      // 선택된 파일 상태 초기화
      setSelectedImageFile(null);
      
      // 프로필 다시 로드
      const updatedProfile = await profileApi.getMyProfile();
      setUserProfile(updatedProfile);
      
      console.log('업데이트된 프로필:', updatedProfile);
      console.log('프로필 이미지 URL:', updatedProfile.profileImageUrl);
      
      // 프로필 이미지 URL 설정 (업로드된 URL 또는 기존 URL)
      if (updatedProfile.profileImageUrl) {
        setProfileImage(updatedProfile.profileImageUrl);
        console.log('프로필 이미지 설정됨:', updatedProfile.profileImageUrl);
      } else {
        setProfileImage("/placeholder-user.jpg");
        console.log('기본 프로필 이미지 설정됨');
      }
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      alert('프로필 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 프로필 이미지 선택 (업로드는 저장 시 실행)
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 이미지 파일 형식 확인
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    // 선택된 파일을 임시 저장
    setSelectedImageFile(file);
    
    // 미리보기를 위해 파일 URL 생성
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
    
    console.log('이미지 파일이 선택되었습니다. 저장 버튼을 눌러 업로드하세요.');
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && userProfile) {
      setUserProfile({
        ...userProfile,
        techStacks: [...(userProfile.techStacks || []), newSkill.trim()],
      });
      setNewSkill("");
      setIsSkillDialogOpen(false);
    }
  };

  const handleDeleteSkill = (index: number) => {
    if (confirm("이 기술 스택을 삭제하시겠습니까?") && userProfile) {
      const updatedSkills = (userProfile.techStacks || []).filter((_, i) => i !== index);
      setUserProfile({ ...userProfile, techStacks: updatedSkills });
    }
  };

  const handleAddCertificate = () => {
    if (newCertificate.trim() && userProfile) {
      setUserProfile({
        ...userProfile,
        certificates: [...(userProfile.certificates || []), newCertificate.trim()],
      });
      setNewCertificate("");
      setIsCertificateDialogOpen(false);
    }
  };

  const handleDeleteCertificate = (index: number) => {
    if (confirm("이 자격증을 삭제하시겠습니까?") && userProfile) {
      const updatedCertificates = (userProfile.certificates || []).filter((_, i) => i !== index);
      setUserProfile({ ...userProfile, certificates: updatedCertificates });
    }
  };

  const handleOpenExperienceDialog = (index: number | null = null) => {
    if (index !== null && userProfile?.careers) {
      const exp = userProfile.careers[index];
      setEditingExperienceIndex(index);
      setExperienceTitle(exp.position);
      setExperienceCompany(exp.companyName);
      setExperiencePeriod(exp.term);
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
    if (!experienceTitle.trim() || !experienceCompany.trim() || !experiencePeriod.trim() || !userProfile) {
      alert("직책, 회사명, 기간을 입력해주세요.");
      return;
    }

    const newExperience = {
      position: experienceTitle,
      companyName: experienceCompany,
      term: experiencePeriod,
      description: experienceDescription,
    };

    if (editingExperienceIndex !== null) {
      const updatedExperience = [...(userProfile.careers || [])];
      updatedExperience[editingExperienceIndex] = newExperience;
      setUserProfile({ ...userProfile, careers: updatedExperience });
    } else {
      setUserProfile({
        ...userProfile,
        careers: [...(userProfile.careers || []), newExperience],
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
    if (confirm("이 경력을 삭제하시겠습니까?") && userProfile) {
      const updatedExperience = (userProfile.careers || []).filter((_, i) => i !== index);
      setUserProfile({ ...userProfile, careers: updatedExperience });
    }
  };

  const handleOpenPortfolioDialog = (index: number | null = null) => {
    if (index !== null && userProfile?.portfolios) {
      const portfolio = userProfile.portfolios[index];
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
    if (!portfolioTitle.trim() || !portfolioLink.trim() || !userProfile) {
      alert("제목과 링크를 입력해주세요.");
      return;
    }

    const newPortfolio = {
      title: portfolioTitle,
      description: portfolioDescription,
      link: portfolioLink,
    };

    if (editingPortfolioIndex !== null) {
      const updatedPortfolio = [...(userProfile.portfolios || [])];
      updatedPortfolio[editingPortfolioIndex] = newPortfolio;
      setUserProfile({ ...userProfile, portfolios: updatedPortfolio });
    } else {
      setUserProfile({
        ...userProfile,
        portfolios: [...(userProfile.portfolios || []), newPortfolio],
      });
    }

    setIsPortfolioDialogOpen(false);
    setPortfolioTitle("");
    setPortfolioDescription("");
    setPortfolioLink("");
    setEditingPortfolioIndex(null);
  };

  const handleDeletePortfolio = (index: number) => {
    if (confirm("이 포트폴리오를 삭제하시겠습니까?") && userProfile) {
      const updatedPortfolio = (userProfile.portfolios || []).filter((_, i) => i !== index);
      setUserProfile({ ...userProfile, portfolios: updatedPortfolio });
    }
  };

  if (loading) {
    return (
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>내 프로필</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">프로필을 불러오는 중...</div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  if (!userProfile) {
    return (
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>내 프로필</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">프로필을 찾을 수 없습니다.</div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  return (
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
              <Button onClick={handleSaveProfile} size="sm" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "저장 중..." : "저장"}
              </Button>
              <Button onClick={() => {
                setIsEditMode(false);
                // 선택된 이미지 파일 초기화
                setSelectedImageFile(null);
                // 프로필 이미지를 원래대로 복원
                if (userProfile?.profileImageUrl) {
                  setProfileImage(userProfile.profileImageUrl);
                } else {
                  setProfileImage("/placeholder-user.jpg");
                }
              }} variant="outline" size="sm">
                <X className="mr-2 h-4 w-4" />
                취소
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileImage} />
                <AvatarFallback>{userProfile.nickname?.[0] || "U"}</AvatarFallback>
              </Avatar>
              {isEditMode && (
                <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer hover:bg-primary/80 transition-colors">
                  <Camera className="h-3 w-3" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={uploadingImage || saving}
                  />
                </label>
              )}
            </div>
            <div className="flex-1">
              {isEditMode ? (
                <Input 
                  value={userProfile.nickname || ""} 
                  onChange={(e) => setUserProfile({...userProfile, nickname: e.target.value})}
                  className="text-xl font-semibold" 
                />
              ) : (
                <h2 className="text-xl font-semibold">{userProfile.nickname || "닉네임 없음"}</h2>
              )}
              <div className="mt-1 flex items-center space-x-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-medium">{userProfile.averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground ml-1">({userProfile.reviewCount || 0})</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">자기소개</label>
            {isEditMode ? (
              <Textarea 
                value={userProfile.introduction || ""} 
                onChange={(e) => setUserProfile({...userProfile, introduction: e.target.value})}
                rows={4} 
                placeholder="자기소개를 입력해주세요..."
              />
            ) : (
              <p className="text-muted-foreground">{userProfile.introduction || ""}</p>
            )}
          </div>

          {userProfile.profileType === "FREELANCER" && (
            <>
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
                  {(userProfile.techStacks || []).map((skill, index) => (
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
                  {(!userProfile.techStacks || userProfile.techStacks.length === 0) && !isEditMode && (
                    <p className="text-muted-foreground text-sm"></p>
                  )}
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
                  {(userProfile.certificates || []).map((cert, index) => (
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
                  {(!userProfile.certificates || userProfile.certificates.length === 0) && !isEditMode && (
                    <p className="text-muted-foreground text-sm"></p>
                  )}
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
                  {(userProfile.careers || []).map((exp, index) => (
                    <div key={index}>
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{exp.position}</h3>
                          <p className="text-muted-foreground">{exp.companyName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{exp.term}</Badge>
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
                      {index < (userProfile.careers?.length || 0) - 1 && <Separator className="mt-6" />}
                    </div>
                  ))}
                  {(!userProfile.careers || userProfile.careers.length === 0) && !isEditMode && (
                    <p className="text-muted-foreground text-sm"></p>
                  )}
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
                  {(userProfile.portfolios || []).map((project, index) => (
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
                  {(!userProfile.portfolios || userProfile.portfolios.length === 0) && !isEditMode && (
                    <p className="text-muted-foreground text-sm"></p>
                  )}
                </div>
              </div>
            </>
          )}

          {userProfile.profileType === "CLIENT" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">회사명</label>
                {isEditMode ? (
                  <Input 
                    value={userProfile.companyName || ""} 
                    onChange={(e) => setUserProfile({...userProfile, companyName: e.target.value})}
                    placeholder="회사명을 입력해주세요..."
                  />
                ) : (
                  <p className="text-muted-foreground">{userProfile.companyName || ""}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">팀명</label>
                {isEditMode ? (
                  <Input 
                    value={userProfile.teamName || ""} 
                    onChange={(e) => setUserProfile({...userProfile, teamName: e.target.value})}
                    placeholder="팀명을 입력해주세요..."
                  />
                ) : (
                  <p className="text-muted-foreground">{userProfile.teamName || ""}</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
    </TabsContent>
  );
}
