import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, FileText, MessageCircle, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useAuthFetchV1 from "@/hooks/use-fetch";
import Loading from "@/components/loading";
import useLogin from "@/hooks/use-Login";

interface ActionServiceDTO {
  id: string;
  thumbnail: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  partnerName: string;
  isFinished: boolean;
  memo: string;
  chatId: string;
}

interface ActionServiceCard {
  id: string;
  thumbnail: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  partnerName: string;
  status: string;
  memo: string;
  chatId: string;
}

interface ActiveServices {
  ongoing: ActionServiceCard[];
  completed: ActionServiceCard[];
}

const convert = (dto: ActionServiceDTO[]): ActiveServices => {
  const data: ActiveServices = {
    ongoing: [],
    completed: [],
  };

  dto.forEach((service) => {
    const newService: ActionServiceCard = {
      id: service.id,
      thumbnail: service.thumbnail,
      title: service.title,
      price: service.price,
      rating: service.rating,
      reviewCount: service.reviewCount,
      partnerName: service.partnerName,
      status: service.isFinished ? "completed" : "ongoing",
      memo: service.memo,
      chatId: service.chatId,
    };
    if (service.isFinished) data.completed.push(newService);
    else data.ongoing.push(newService);
  });

  return data;
};

export default function ServiceTab() {
  const { member } = useLogin();
  const {
    data: activeServices,
    setData: setActiveServices,
    isLoading,
  } = useAuthFetchV1<ActionServiceDTO[], ActiveServices>(
    "/api/v1/active-service",
    "활성 서비스 목록을 불러오지 못했습니다.",
    convert,
  );

  if (isLoading || activeServices == null || member == null) return <Loading />;

  const handleCompleteWork = (serviceId: string) => {
    if (confirm("작업을 완료하시겠습니까? 클라이언트에게 작업 완료 메시지가 전송됩니다.")) {
      // Find the service
      const service = activeServices.ongoing.find((s) => s.id === serviceId);
      if (!service) return;

      // Move service to completed 여기서 끝내면 안돼고, 채팅 쪽에서 accept해야 완료임.
      setActiveServices({
        ongoing: activeServices.ongoing.filter((s) => s.id !== serviceId),
        completed: [...activeServices.completed, { ...service, status: "completed" }],
      });
    }
  };

  return (
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
              {activeServices.ongoing.map((service) => (
                <Card
                  key={service.id}
                  className="overflow-hidden transition-shadow hover:shadow-lg"
                >
                  <div className="bg-muted relative h-48">
                    <img
                      src={service.thumbnail || "/placeholder-image.svg"}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 flex-1 text-lg font-bold">{service.title}</h3>
                      <Badge className="flex-shrink-0 bg-blue-500 hover:bg-blue-600">진행중</Badge>
                    </div>

                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{service.rating}</span>
                        <span>({service.reviewCount})</span>
                      </div>
                      <span>•</span>
                      <span className="truncate">{service.partnerName}</span>
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

                    {member.role === "freelancer" && (
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeServices.completed.map((service) => (
                <Card
                  key={service.id}
                  className="overflow-hidden transition-shadow hover:shadow-lg"
                >
                  <div className="bg-muted relative h-48">
                    <img
                      src={service.thumbnail || "/placeholder-image.svg"}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 flex-1 text-lg font-bold">{service.title}</h3>
                      <Badge className="flex-shrink-0 bg-green-500 hover:bg-green-600">완료</Badge>
                    </div>

                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{service.rating}</span>
                        <span>({service.reviewCount})</span>
                      </div>
                      <span>•</span>
                      <span className="truncate">{service.partnerName}</span>
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
  );
}

/*
const activeServicesss = {
  ongoing: [
    {
      id: "f1",
      thumbnail: "/responsive-design.png",
      title: "모바일 앱 백엔드 API 개발",
      price: 1500000,
      rating: 4.8,
      reviewCount: 5,
      partnerName: "김개발자",
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
      partnerName: "김개발자",
      status: "completed",
      memo: "React와 D3.js를 활용한 실시간 데이터 시각화",
      chatId: "2",
    },
  ],
};*/
