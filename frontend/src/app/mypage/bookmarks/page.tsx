"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark as BookmarkIcon } from "lucide-react";
import { ServiceCard } from "@/components/service-card";
import useLogin from "@/hooks/use-Login";

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

export default function Bookmark() {
  const { isLoggedIn, member } = useLogin();
  const userType = member ? member.role : null;

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
