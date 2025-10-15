"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Star, CheckCircle2, FileText, MessageCircle } from "lucide-react";
import useLogin from "@/hooks/use-Login";
import { useState } from "react";

export default function ActiveService() {
  const { isLoggedIn, member } = useLogin();
  const userType = member ? member.role : null;

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

  return (
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
                {(userType === "client" ? clientServices.ongoing : freelancerServices.ongoing).map(
                  (service) => (
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
                          <h3 className="line-clamp-2 flex-1 text-lg font-bold">{service.title}</h3>
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
                              <p className="text-muted-foreground text-xs font-semibold">메모</p>
                            </div>
                            <p className="line-clamp-2 text-sm leading-relaxed">{service.memo}</p>
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
                  ),
                )}
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
                        <h3 className="line-clamp-2 flex-1 text-lg font-bold">{service.title}</h3>
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
                            <p className="text-muted-foreground text-xs font-semibold">메모</p>
                          </div>
                          <p className="line-clamp-2 text-sm leading-relaxed">{service.memo}</p>
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
  );
}
