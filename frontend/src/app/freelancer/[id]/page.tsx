import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MapPin,
  Calendar,
  Award,
  Briefcase,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface FreelancerProfileProps {
  params: {
    id: string;
  };
}

// Mock data - 실제로는 API에서 가져올 데이터
const freelancerData = {
  id: "1",
  name: "김민수",
  title: "풀스택 개발자",
  profileImage: "/professional-developer-portrait.png",
  bio: "10년 이상의 경험을 가진 풀스택 개발자입니다. 사용자 중심의 웹 애플리케이션 개발에 열정을 가지고 있으며, 최신 기술 트렌드를 적극적으로 학습하고 적용합니다.",
  rating: 4.9,
  reviewCount: 127,
  completedProjects: 89,
  location: "서울, 대한민국",
  joinDate: "2020년 3월",
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Python",
    "PostgreSQL",
    "AWS",
    "Docker",
    "GraphQL",
    "MongoDB",
    "Vue.js",
    "Express.js",
  ],
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
      image: "/ecommerce-website-homepage.png",
      link: "https://example.com",
      tech: ["React", "Node.js", "PostgreSQL", "Stripe"],
    },
    {
      title: "프로젝트 관리 도구",
      description: "팀 협업을 위한 실시간 프로젝트 관리 애플리케이션",
      image: "/project-management-dashboard.png",
      link: "https://example.com",
      tech: ["Vue.js", "Express.js", "MongoDB", "Socket.io"],
    },
    {
      title: "데이터 시각화 대시보드",
      description: "비즈니스 인텔리전스를 위한 인터랙티브 대시보드",
      image: "/data-visualization-dashboard.png",
      link: "https://example.com",
      tech: ["Next.js", "D3.js", "Python", "FastAPI"],
    },
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023년 6월",
    },
    {
      name: "Google Cloud Professional Developer",
      issuer: "Google Cloud",
      date: "2022년 11월",
    },
  ],
  socialLinks: {
    github: "https://github.com/example",
    linkedin: "https://linkedin.com/in/example",
    email: "example@email.com",
  },
};

export default function FreelancerProfile({ params }: FreelancerProfileProps) {
  const freelancer = freelancerData;

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative mx-auto mb-4 h-32 w-32">
                  <Image
                    src={freelancer.profileImage || "/placeholder.svg"}
                    alt={freelancer.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h1 className="mb-2 text-2xl font-bold">{freelancer.name}</h1>
                <p className="text-muted-foreground mb-4 text-lg">{freelancer.title}</p>

                <div className="mb-4 flex items-center justify-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{freelancer.rating}</span>
                  <span className="text-muted-foreground">({freelancer.reviewCount}개 리뷰)</span>
                </div>

                <div className="text-muted-foreground mb-6 space-y-2 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>가입일: {freelancer.joinDate}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Briefcase className="h-4 w-4" />
                    <span>완료 프로젝트: {freelancer.completedProjects}개</span>
                  </div>
                </div>

                <Button className="w-full">채팅하기</Button>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>기술 스택</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>자격증</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {freelancer.certifications.map((cert, index) => (
                  <div key={index}>
                    <h4 className="font-medium">{cert.name}</h4>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>소개</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{freelancer.bio}</p>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle>경력</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {freelancer.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{exp.title}</h3>
                        <p className="text-muted-foreground">{exp.company}</p>
                      </div>
                      <Badge variant="outline">{exp.period}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {exp.description}
                    </p>
                    {index < freelancer.experience.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Portfolio */}
            <Card>
              <CardHeader>
                <CardTitle>포트폴리오</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {freelancer.portfolio.map((project, index) => (
                    <Link
                      key={index}
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:bg-accent hover:border-primary group flex items-center gap-3 rounded-lg border p-3 transition-colors"
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
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
