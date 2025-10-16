"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark as BookmarkIcon } from "lucide-react";
import { ServiceCard } from "@/components/service-card";
import useLogin from "@/hooks/use-Login";
import useAuthFetchV1 from "@/hooks/use-fetch";
import { Page } from "@/app/type/service";
import Loading from "@/components/loading";

interface BookMarkServiceCardDto {
  id: string;
  thumbnail: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  freelancerName: string;
  category: string;
  tags: string[];
  content: string;
  createdAt: string;
}

interface BookmarkServiceCardType {
  id: string;
  thumbnail: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  freelancerName: string;
}

const convert = (dto: Page<BookMarkServiceCardDto>): BookmarkServiceCardType[] => {
  const contents = dto.content;
  return contents.map((content: BookMarkServiceCardDto) => ({
    id: content.id,
    thumbnail: content.thumbnail,
    title: content.title,
    price: content.price,
    rating: content.rating,
    reviewCount: content.reviewCount,
    freelancerName: content.freelancerName,
  }));
};

export default function Bookmark() {
  const { member } = useLogin();
  const userType = member ? member.role : null;

  const { data: bookmarkedServices, isLoading } = useAuthFetchV1<
    Page<BookMarkServiceCardDto>,
    BookmarkServiceCardType[]
  >("/api/v1/bookmarks/services", "북마크 리스트를 가져올 수 없습니다.", convert);

  if (isLoading || bookmarkedServices === null) return <Loading />;

  return (
    <>
      {userType === "client" && (
        <TabsContent value="bookmarks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookmarkIcon className="h-5 w-5" />
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
    </>
  );
}

/*
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
*/
