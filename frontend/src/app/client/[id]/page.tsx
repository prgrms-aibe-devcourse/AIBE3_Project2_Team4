import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, Calendar, Building, Users, Mail, Phone, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface ClientProfileProps {
  params: {
    id: string
  }
}

// Mock data - 실제로는 API에서 가져올 데이터
const clientData = {
  id: "1",
  name: "박지영",
  title: "프로젝트 매니저",
  company: "테크이노베이션",
  team: "디지털 트랜스포메이션팀",
  profileImage: "/professional-business-woman-portrait.png",
  bio: "10년 이상의 IT 프로젝트 관리 경험을 보유한 프로젝트 매니저입니다. 다양한 규모의 디지털 트랜스포메이션 프로젝트를 성공적으로 이끌어왔으며, 프리랜서와의 협업을 통해 혁신적인 솔루션을 구현하는 것을 전문으로 합니다.",
  rating: 4.8,
  reviewCount: 89,
  completedProjects: 67,
  location: "서울, 대한민국",
  joinDate: "2019년 8월",
  companyInfo: {
    name: "테크이노베이션",
    industry: "IT 컨설팅",
    size: "100-500명",
    website: "https://techinnovation.com",
    description: "디지털 트랜스포메이션을 통해 기업의 혁신을 이끄는 IT 컨설팅 회사입니다.",
  },
  teamInfo: {
    name: "디지털 트랜스포메이션팀",
    size: "12명",
    focus: "웹 애플리케이션 개발, 클라우드 마이그레이션, 데이터 분석",
  },
  projectHistory: [
    {
      title: "전사 ERP 시스템 구축",
      period: "2023년 3월 - 2023년 12월",
      budget: "5억원",
      description: "기존 레거시 시스템을 현대적인 웹 기반 ERP 시스템으로 전환하는 프로젝트를 관리했습니다.",
      freelancersHired: 8,
      status: "완료",
    },
    {
      title: "고객 포털 리뉴얼",
      period: "2022년 6월 - 2022년 11월",
      budget: "2억원",
      description: "사용자 경험 개선을 위한 고객 포털 전면 리뉴얼 프로젝트를 진행했습니다.",
      freelancersHired: 5,
      status: "완료",
    },
    {
      title: "데이터 분석 플랫폼 구축",
      period: "2024년 1월 - 진행중",
      budget: "3억원",
      description: "실시간 데이터 분석 및 시각화를 위한 플랫폼 구축 프로젝트입니다.",
      freelancersHired: 6,
      status: "진행중",
    },
  ],
  preferredSkills: [
    "React",
    "Vue.js",
    "Node.js",
    "Python",
    "Java",
    "AWS",
    "Docker",
    "Kubernetes",
    "PostgreSQL",
    "MongoDB",
    "GraphQL",
  ],
  contact: {
    email: "jiyoung.park@techinnovation.com",
    phone: "+82-10-1234-5678",
  },
}

export default function ClientProfile({ params }: ClientProfileProps) {
  const client = clientData

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <Image
                    src={client.profileImage || "/placeholder.svg"}
                    alt={client.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <h1 className="text-2xl font-bold mb-2">{client.name}</h1>

                <div className="flex items-center justify-center space-x-1 mb-4">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{client.rating}</span>
                  <span className="text-muted-foreground">({client.reviewCount}개 리뷰)</span>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>가입일: {client.joinDate}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Building className="h-4 w-4" />
                    <span>완료 프로젝트: {client.completedProjects}개</span>
                  </div>
                </div>
                <Button className="w-full">채팅하기</Button>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>회사</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{client.companyInfo.description}</p>
              </CardContent>
            </Card>

            {/* Team Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>팀</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{client.teamInfo.focus}</p>
              </CardContent>
            </Card>

          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>소개</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{client.bio}</p>
              </CardContent>
            </Card>

            {/* Reviews Section Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>프리랜서 리뷰</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">아직 리뷰가 없습니다.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    이 클라이언트와 함께 작업한 경험이 있다면 리뷰를 남겨주세요.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
