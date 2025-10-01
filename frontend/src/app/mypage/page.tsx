"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ServiceCard } from "@/components/service-card"
import {
  Edit,
  Save,
  X,
  Star,
  MessageCircle,
  Bookmark,
  Plus,
  Send,
  Paperclip,
  ImageIcon,
  CreditCard,
  Calendar,
  ExternalLink,
  Briefcase,
  Trash2,
  CheckCircle2,
  FileText,
} from "lucide-react"

export default function MyPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [userType] = useState<"freelancer" | "client">("freelancer") // This would come from auth context
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [isPaymentRequestOpen, setIsPaymentRequestOpen] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMemo, setPaymentMemo] = useState("")
  const [isPortfolioDialogOpen, setIsPortfolioDialogOpen] = useState(false)
  const [editingPortfolioIndex, setEditingPortfolioIndex] = useState<number | null>(null)
  const [portfolioTitle, setPortfolioTitle] = useState("")
  const [portfolioDescription, setPortfolioDescription] = useState("")
  const [portfolioLink, setPortfolioLink] = useState("")
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false)
  const [newCertificate, setNewCertificate] = useState("")
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false)
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<number | null>(null)
  const [experienceTitle, setExperienceTitle] = useState("")
  const [experienceCompany, setExperienceCompany] = useState("")
  const [experiencePeriod, setExperiencePeriod] = useState("")
  const [experienceDescription, setExperienceDescription] = useState("")

  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      id: "1",
      type: "sent",
      content: "안녕하세요! 프로젝트 관련해서 문의드립니다.",
      timestamp: "오후 2:25",
    },
    {
      id: "2",
      type: "received",
      content: "네, 안녕하세요! 어떤 프로젝트인지 자세히 알려주세요.",
      timestamp: "오후 2:26",
    },
  ])

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
  })

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
  ]

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
  })

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
  })

  const chatList = [
    {
      id: "1",
      name: "박클라이언트",
      lastMessage: "프로젝트 일정 확인 부탁드립니다.",
      timestamp: "오후 2:30",
      unreadCount: 2,
      avatar: "/professional-business-woman-portrait.png",
    },
    {
      id: "2",
      name: "이개발자",
      lastMessage: "네, 내일까지 완료하겠습니다.",
      timestamp: "오전 11:15",
      unreadCount: 0,
      avatar: "/professional-developer-portrait.png",
    },
  ]

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
  ]

  const paymentHistory = [
    {
      id: "1",
      image: "/ecommerce-website-homepage.png",
      amount: 2000000,
      memo: "이커머스 웹사이트 구축 프로젝트 최종 결제",
      date: "2024.03.15",
      status: "completed",
    },
    {
      id: "2",
      image: "/data-visualization-dashboard.png",
      amount: 1200000,
      memo: "데이터 시각화 대시보드 개발 1차 결제",
      date: "2024.03.10",
      status: "completed",
    },
    {
      id: "3",
      image: "/project-management-dashboard.png",
      amount: 800000,
      memo: "API 서버 구축 및 배포",
      date: "2024.03.05",
      status: "completed",
    },
    {
      id: "4",
      image: "/responsive-design.png",
      amount: 500000,
      memo: "반응형 웹사이트 리뉴얼",
      date: "2024.02.28",
      status: "completed",
    },
  ]

  useEffect(() => {
    setIsLoggedIn(true) // Always set to true for v0 preview
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">로딩 중...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
              <p className="text-muted-foreground mb-6">마이페이지에 접근하려면 로그인해주세요.</p>
              <Button onClick={() => (window.location.href = "/auth/login")}>로그인하기</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleSaveProfile = () => {
    // Save profile logic here
    setIsEditMode(false)
    setIsEditing(false)
  }

  const handlePaymentRequest = () => {
    if (!paymentAmount || Number.parseFloat(paymentAmount) <= 0) {
      alert("결제 금액을 입력해주세요.")
      return
    }

    const newMessage = {
      id: Date.now().toString(),
      type: "payment-request",
      amount: Number.parseFloat(paymentAmount),
      memo: paymentMemo,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    }

    setChatMessages([...chatMessages, newMessage])
    setIsPaymentRequestOpen(false)
    setPaymentAmount("")
    setPaymentMemo("")
  }

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        type: "sent",
        content: chatMessage,
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      }
      setChatMessages([...chatMessages, newMessage])
      setChatMessage("")
    }
  }

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setUserProfile({ ...userProfile, skills: [...userProfile.skills, newSkill.trim()] })
      setNewSkill("")
      setIsSkillDialogOpen(false)
    }
  }

  const handleDeleteSkill = (index: number) => {
    if (confirm("이 기술 스택을 삭제하시겠습니까?")) {
      const updatedSkills = userProfile.skills.filter((_, i) => i !== index)
      setUserProfile({ ...userProfile, skills: updatedSkills })
    }
  }

  const handleAddCertificate = () => {
    if (newCertificate.trim()) {
      setUserProfile({ ...userProfile, certificates: [...userProfile.certificates, newCertificate.trim()] })
      setNewCertificate("")
      setIsCertificateDialogOpen(false)
    }
  }

  const handleDeleteCertificate = (index: number) => {
    if (confirm("이 자격증을 삭제하시겠습니까?")) {
      const updatedCertificates = userProfile.certificates.filter((_, i) => i !== index)
      setUserProfile({ ...userProfile, certificates: updatedCertificates })
    }
  }

  const handleOpenExperienceDialog = (index: number | null = null) => {
    if (index !== null) {
      const exp = userProfile.experience[index]
      setEditingExperienceIndex(index)
      setExperienceTitle(exp.title)
      setExperienceCompany(exp.company)
      setExperiencePeriod(exp.period)
      setExperienceDescription(exp.description)
    } else {
      setEditingExperienceIndex(null)
      setExperienceTitle("")
      setExperienceCompany("")
      setExperiencePeriod("")
      setExperienceDescription("")
    }
    setIsExperienceDialogOpen(true)
  }

  const handleSaveExperience = () => {
    if (!experienceTitle.trim() || !experienceCompany.trim() || !experiencePeriod.trim()) {
      alert("직책, 회사명, 기간을 입력해주세요.")
      return
    }

    const newExperience = {
      title: experienceTitle,
      company: experienceCompany,
      period: experiencePeriod,
      description: experienceDescription,
    }

    if (editingExperienceIndex !== null) {
      const updatedExperience = [...userProfile.experience]
      updatedExperience[editingExperienceIndex] = newExperience
      setUserProfile({ ...userProfile, experience: updatedExperience })
    } else {
      setUserProfile({ ...userProfile, experience: [...userProfile.experience, newExperience] })
    }

    setIsExperienceDialogOpen(false)
    setExperienceTitle("")
    setExperienceCompany("")
    setExperiencePeriod("")
    setExperienceDescription("")
    setEditingExperienceIndex(null)
  }

  const handleDeleteExperience = (index: number) => {
    if (confirm("이 경력을 삭제하시겠습니까?")) {
      const updatedExperience = userProfile.experience.filter((_, i) => i !== index)
      setUserProfile({ ...userProfile, experience: updatedExperience })
    }
  }

  const handleOpenPortfolioDialog = (index: number | null = null) => {
    if (index !== null) {
      const portfolio = userProfile.portfolio[index]
      setEditingPortfolioIndex(index)
      setPortfolioTitle(portfolio.title)
      setPortfolioDescription(portfolio.description)
      setPortfolioLink(portfolio.link)
    } else {
      setEditingPortfolioIndex(null)
      setPortfolioTitle("")
      setPortfolioDescription("")
      setPortfolioLink("")
    }
    setIsPortfolioDialogOpen(true)
  }

  const handleSavePortfolio = () => {
    if (!portfolioTitle.trim() || !portfolioLink.trim()) {
      alert("제목과 링크를 입력해주세요.")
      return
    }

    const newPortfolio = {
      title: portfolioTitle,
      description: portfolioDescription,
      link: portfolioLink,
    }

    if (editingPortfolioIndex !== null) {
      const updatedPortfolio = [...userProfile.portfolio]
      updatedPortfolio[editingPortfolioIndex] = newPortfolio
      setUserProfile({ ...userProfile, portfolio: updatedPortfolio })
    } else {
      setUserProfile({ ...userProfile, portfolio: [...userProfile.portfolio, newPortfolio] })
    }

    setIsPortfolioDialogOpen(false)
    setPortfolioTitle("")
    setPortfolioDescription("")
    setPortfolioLink("")
    setEditingPortfolioIndex(null)
  }

  const handleDeletePortfolio = (index: number) => {
    if (confirm("이 포트폴리오를 삭제하시겠습니까?")) {
      const updatedPortfolio = userProfile.portfolio.filter((_, i) => i !== index)
      setUserProfile({ ...userProfile, portfolio: updatedPortfolio })
    }
  }

  const handleCompleteWork = (serviceId: string) => {
    if (confirm("작업을 완료하시겠습니까? 클라이언트에게 작업 완료 메시지가 전송됩니다.")) {
      // Find the service
      const service = freelancerServices.ongoing.find((s) => s.id === serviceId)
      if (!service) return

      // Move service to completed
      setFreelancerServices({
        ongoing: freelancerServices.ongoing.filter((s) => s.id !== serviceId),
        completed: [...freelancerServices.completed, { ...service, status: "completed" }],
      })

      // Send work completion message to chat
      const newMessage = {
        id: Date.now().toString(),
        type: "work-completed",
        serviceTitle: service.title,
        servicePrice: service.price,
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      }

      setChatMessages([...chatMessages, newMessage])

      // Switch to chat tab if a chat is selected
      if (service.chatId) {
        setSelectedChat(service.chatId)
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">마이페이지</h1>

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
                    <Edit className="h-4 w-4 mr-2" />
                    프로필 수정
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      저장
                    </Button>
                    <Button onClick={() => setIsEditMode(false)} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
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
                      <Input defaultValue={userProfile.nickname} className="text-xl font-semibold" />
                    ) : (
                      <h2 className="text-xl font-semibold">{userProfile.nickname}</h2>
                    )}
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 font-medium">{userProfile.rating}</span>
                        <span className="text-muted-foreground ml-1">({userProfile.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">자기소개</label>
                  {isEditMode ? (
                    <Textarea defaultValue={userProfile.introduction} rows={4} />
                  ) : (
                    <p className="text-muted-foreground">{userProfile.introduction}</p>
                  )}
                </div>

                {userType === "freelancer" && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-2 block">완료 프로젝트</label>
                      <p className="text-muted-foreground">{userProfile.completedProjects}개</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">기술 스택</label>
                        {isEditMode && (
                          <Button
                            onClick={() => setIsSkillDialogOpen(true)}
                            size="sm"
                            variant="outline"
                            className="gap-2 h-8"
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
                              <button onClick={() => handleDeleteSkill(index)} className="ml-1 hover:text-destructive">
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">자격증</label>
                        {isEditMode && (
                          <Button
                            onClick={() => setIsCertificateDialogOpen(true)}
                            size="sm"
                            variant="outline"
                            className="gap-2 h-8"
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
                                className="ml-1 hover:text-destructive"
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
                      <div className="flex items-center justify-between mb-4">
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
                            <div className="flex justify-between items-start mb-2">
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
                                      className="h-8 w-8 text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                            {index < userProfile.experience.length - 1 && <Separator className="mt-6" />}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="flex items-center justify-between mb-4">
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
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors group"
                          >
                            <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium group-hover:text-primary transition-colors truncate">
                                {project.title}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">{project.description}</p>
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
                                  className="h-8 w-8 text-destructive hover:text-destructive"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">회사명</label>
                      {isEditMode ? (
                        <Input defaultValue={userProfile.companyName} />
                      ) : (
                        <p className="text-muted-foreground">{userProfile.companyName}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">팀명</label>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(userType === "client" ? clientServices.ongoing : freelancerServices.ongoing).map((service) => (
                        <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative h-48 bg-muted">
                            <img
                              src={service.thumbnail || "/placeholder.svg"}
                              alt={service.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-lg font-bold line-clamp-2 flex-1">{service.title}</h3>
                              <Badge className="bg-blue-500 hover:bg-blue-600 flex-shrink-0">진행중</Badge>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{service.rating}</span>
                                <span>({service.reviewCount})</span>
                              </div>
                              <span>•</span>
                              <span className="truncate">{service.freelancerName}</span>
                            </div>

                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-bold text-primary">{service.price.toLocaleString()}</span>
                              <span className="text-sm text-muted-foreground">원</span>
                            </div>

                            {service.memo && (
                              <div className="bg-muted/50 rounded-lg p-3 border">
                                <div className="flex items-center gap-2 mb-1">
                                  <FileText className="h-3 w-3 text-primary" />
                                  <p className="text-xs font-semibold text-muted-foreground">메모</p>
                                </div>
                                <p className="text-sm leading-relaxed line-clamp-2">{service.memo}</p>
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
                                <Button variant="outline" className="w-full gap-2 bg-transparent" size="sm">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(userType === "client" ? clientServices.completed : freelancerServices.completed).map(
                        (service) => (
                          <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48 bg-muted">
                              <img
                                src={service.thumbnail || "/placeholder.svg"}
                                alt={service.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <CardContent className="p-4 space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-lg font-bold line-clamp-2 flex-1">{service.title}</h3>
                                <Badge className="bg-green-500 hover:bg-green-600 flex-shrink-0">완료</Badge>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{service.rating}</span>
                                  <span>({service.reviewCount})</span>
                                </div>
                                <span>•</span>
                                <span className="truncate">{service.freelancerName}</span>
                              </div>

                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-primary">
                                  {service.price.toLocaleString()}
                                </span>
                                <span className="text-sm text-muted-foreground">원</span>
                              </div>

                              {service.memo && (
                                <div className="bg-muted/50 rounded-lg p-3 border">
                                  <div className="flex items-center gap-2 mb-1">
                                    <FileText className="h-3 w-3 text-primary" />
                                    <p className="text-xs font-semibold text-muted-foreground">메모</p>
                                  </div>
                                  <p className="text-sm leading-relaxed line-clamp-2">{service.memo}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ),
                      )}
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
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />새 서비스 등록
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>채팅 목록</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {chatList.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => setSelectedChat(chat.id)}
                        className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedChat === chat.id ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{chat.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{chat.name}</p>
                              <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                          </div>
                          {chat.unreadCount > 0 && (
                            <Badge
                              variant="destructive"
                              className="h-5 w-5 p-0 flex items-center justify-center text-xs"
                            >
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                {selectedChat ? (
                  <>
                    <CardHeader className="border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage
                              src={chatList.find((c) => c.id === selectedChat)?.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>{chatList.find((c) => c.id === selectedChat)?.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-semibold">{chatList.find((c) => c.id === selectedChat)?.name}</span>
                        </div>
                        {userType === "freelancer" && (
                          <Button onClick={() => setIsPaymentRequestOpen(true)} size="sm" className="gap-2">
                            <CreditCard className="h-4 w-4" />
                            결제 요청
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-4">
                      <div className="h-[400px] overflow-y-auto mb-4 space-y-4">
                        {chatMessages.map((message) => {
                          if (message.type === "work-completed") {
                            return (
                              <div key={message.id} className="flex justify-end animate-in slide-in-from-right">
                                <div className="max-w-sm w-full">
                                  <div className="relative overflow-hidden rounded-2xl border-2 border-green-500/30 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950 dark:via-slate-900 dark:to-emerald-950 shadow-lg hover:shadow-xl transition-all duration-300">
                                    {/* Decorative gradient overlay */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-3xl" />

                                    <div className="relative p-6 space-y-4">
                                      {/* Header */}
                                      <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-green-500/10 ring-2 ring-green-500/20">
                                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                          <h3 className="font-bold text-lg text-foreground">작업 완료</h3>
                                          <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                                        </div>
                                      </div>

                                      {/* Service Info */}
                                      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-green-500/10 shadow-sm space-y-3">
                                        <div>
                                          <p className="text-xs font-medium text-muted-foreground mb-1">서비스명</p>
                                          <p className="font-semibold text-foreground">{message.serviceTitle}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className="text-xs font-medium text-muted-foreground mb-1">결제 금액</p>
                                          <div className="flex items-baseline gap-1.5">
                                            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                              {message.servicePrice.toLocaleString()}
                                            </span>
                                            <span className="text-lg font-semibold text-muted-foreground">원</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Completion Message */}
                                      <div className="bg-green-50/60 dark:bg-green-900/20 backdrop-blur-sm rounded-xl p-4 border border-green-200 dark:border-green-800">
                                        <p className="text-sm leading-relaxed text-foreground text-center">
                                          ✨ 작업이 완료되었습니다! 확인 후 리뷰를 남겨주세요.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          }

                          if (message.type === "payment-request") {
                            return (
                              <div key={message.id} className="flex justify-end animate-in slide-in-from-right">
                                <div className="max-w-sm w-full">
                                  <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-slate-900 dark:to-purple-950 shadow-lg hover:shadow-xl transition-all duration-300">
                                    {/* Decorative gradient overlay */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />

                                    <div className="relative p-6 space-y-4">
                                      {/* Header */}
                                      <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-primary/10 ring-2 ring-primary/20">
                                          <CreditCard className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                          <h3 className="font-bold text-lg text-foreground">결제 요청</h3>
                                          <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                                        </div>
                                      </div>

                                      {/* Amount */}
                                      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-primary/10 shadow-sm">
                                        <p className="text-xs font-medium text-muted-foreground mb-1">결제 금액</p>
                                        <div className="flex items-baseline gap-1.5">
                                          <span className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                            {message.amount.toLocaleString()}
                                          </span>
                                          <span className="text-xl font-semibold text-muted-foreground">원</span>
                                        </div>
                                      </div>

                                      {/* Memo */}
                                      {message.memo && (
                                        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                                          <div className="flex items-center gap-2 mb-2">
                                            <div className="h-1 w-1 rounded-full bg-primary" />
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                              메모
                                            </p>
                                          </div>
                                          <p className="text-sm leading-relaxed text-foreground">{message.memo}</p>
                                        </div>
                                      )}

                                      {/* Payment Button */}
                                      {userType === "client" && (
                                        <Button
                                          onClick={() => {
                                            const params = new URLSearchParams({
                                              amount: message.amount.toString(),
                                              memo: message.memo || "",
                                              service: "프리랜서 서비스",
                                              chatId: selectedChat || "",
                                            })
                                            window.location.href = `/payment?${params.toString()}`
                                          }}
                                          className="w-full h-12 text-base font-semibold gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                                          size="lg"
                                        >
                                          <CreditCard className="h-5 w-5" />
                                          결제하기
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          }

                          return (
                            <div
                              key={message.id}
                              className={`flex ${message.type === "sent" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                            >
                              <div
                                className={`rounded-2xl px-4 py-2.5 max-w-xs shadow-sm ${
                                  message.type === "sent"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted border border-border"
                                }`}
                              >
                                <p className="text-sm leading-relaxed">{message.content}</p>
                                <p
                                  className={`text-xs mt-1.5 ${
                                    message.type === "sent" ? "text-primary-foreground/70" : "text-muted-foreground"
                                  }`}
                                >
                                  {message.timestamp}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Input
                          placeholder="메시지를 입력하세요..."
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>채팅방을 선택해주세요</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* 결제 내역 탭 */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>결제 내역</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paymentHistory.map((payment) => (
                    <Card key={payment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48 bg-muted">
                        <img
                          src={payment.image || "/placeholder.svg"}
                          alt="결제 항목"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-primary">{payment.amount.toLocaleString()}</span>
                            <span className="text-sm text-muted-foreground">원</span>
                          </div>
                          <Badge variant="secondary" className="gap-1">
                            <Calendar className="h-3 w-3" />
                            {payment.date}
                          </Badge>
                        </div>
                        {payment.memo && (
                          <div className="bg-muted/50 rounded-lg p-3 border">
                            <p className="text-sm text-muted-foreground mb-1">메모</p>
                            <p className="text-sm leading-relaxed">{payment.memo}</p>
                          </div>
                        )}
                        <Badge className="w-full justify-center bg-green-500 hover:bg-green-600">결제 완료</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <Briefcase className="h-5 w-5 text-primary" />
                {editingExperienceIndex !== null ? "경력 수정" : "경력 추가"}
              </DialogTitle>
              <DialogDescription>경력 정보를 입력해주세요. 직책, 회사명, 기간은 필수입니다.</DialogDescription>
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

        {/* 결제 요청 모달 */}
        <Dialog open={isPaymentRequestOpen} onOpenChange={setIsPaymentRequestOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                결제 요청
              </DialogTitle>
              <DialogDescription>클라이언트에게 결제를 요청합니다. 금액과 메모를 입력해주세요.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">결제 금액 *</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="pr-12 text-lg"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">원</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="memo">메모 (선택)</Label>
                <Textarea
                  id="memo"
                  placeholder="결제 내용에 대한 설명을 입력해주세요..."
                  value={paymentMemo}
                  onChange={(e) => setPaymentMemo(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsPaymentRequestOpen(false)}>
                취소
              </Button>
              <Button onClick={handlePaymentRequest} className="gap-2">
                <Send className="h-4 w-4" />
                요청하기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isPortfolioDialogOpen} onOpenChange={setIsPortfolioDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-primary" />
                {editingPortfolioIndex !== null ? "포트폴리오 수정" : "포트폴리오 추가"}
              </DialogTitle>
              <DialogDescription>포트폴리오 정보를 입력해주세요. 제목과 링크는 필수입니다.</DialogDescription>
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
  )
}
