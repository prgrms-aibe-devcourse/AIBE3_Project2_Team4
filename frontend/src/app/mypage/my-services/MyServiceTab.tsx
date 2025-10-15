import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ServiceCard } from "@/components/service-card";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import useAuthFetchV1 from "@/hooks/use-fetch";
import { Page, ServiceCardDto, ServiceCardType } from "../../type/service";

const convert = (dto: Page<ServiceCardDto>) => ({
  ...dto,
  content: dto.content.map((content) => ({
    id: content.id,
    thumbnail: content.thumbnail,
    title: content.title,
    price: content.price,
    rating: content.rating,
    reviewCount: content.reviewCount,
    freelancerName: content.freelancerName,
  })),
});

export default function MyServiceTab() {
  const { data: myServices, isLoading } = useAuthFetchV1<
    Page<ServiceCardDto>,
    Page<ServiceCardType>
  >("/api/v1/services/me", "내 서비스 불러오기에서 오류 발생", convert);

  const router = useRouter();

  if (isLoading || myServices == null) return <Loading />;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>내가 등록한 서비스</CardTitle>
        <Button onClick={() => router.push("/services/register")}>
          <Plus className="mr-2 h-4 w-4" />새 서비스 등록
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myServices.content.map((service) => (
            <ServiceCard key={service.id} {...service} variant="mypage" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
