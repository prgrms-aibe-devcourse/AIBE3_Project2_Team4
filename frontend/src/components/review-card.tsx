import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ReviewCardProps {
  rating: number;
  content: string;
  images?: string[];
  authorName: string;
  authorId: string;
  authorProfileImage: string;
  createdAt: string;
}

export function ReviewCard({
  rating,
  content,
  images = [],
  authorName,
  authorId,
  authorProfileImage,
  createdAt,
}: ReviewCardProps) {
  // TODO: derive authorType from props or user context
  const authorType = "client";
  const link = `/${authorType}/${authorId}`;
  return (
    <Card>
      <CardContent className="p-4">
        {/* 평점 */}
        <div className="mb-2 flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>

        {/* 리뷰 내용 */}
        <p className="mb-3 text-sm leading-relaxed">{content}</p>

        {/* 리뷰 이미지 */}
        {images.length > 0 && (
          <div className="mb-3 flex space-x-2">
            {images.map((image, index) => (
              <div key={index} className="relative h-16 w-16">
                <Image
                  src={image || "/placeholder-image.svg"}
                  alt={`리뷰 이미지 ${index + 1}`}
                  fill
                  className="rounded object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* 작성자 정보 */}
        <div className="flex items-center space-x-2">
          <div className="relative h-8 w-8">
            <Image
              src={authorProfileImage || "/placeholder.svg"}
              alt={authorName}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <Link href={link} className="hover:text-primary text-sm font-medium transition-colors">
              {authorName}
            </Link>
            <p className="text-muted-foreground text-xs">{createdAt}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
