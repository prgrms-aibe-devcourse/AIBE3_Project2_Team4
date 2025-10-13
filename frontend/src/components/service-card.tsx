import Image from "next/image";
import Link from "next/link";
import { Star, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  id: number;
  thumbnail: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  freelancerName: string;
  variant?: "list" | "mypage";
}

export function ServiceCard({
  id,
  thumbnail,
  title,
  price,
  rating,
  reviewCount,
  freelancerName,
  variant = "list",
}: ServiceCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/service/${id}`} className="block">
        <div className="relative aspect-video">
          <Image src={thumbnail || "/placeholder.svg"} alt={title} fill className="object-cover" />
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/service/${id}`} className="block">
          <h3 className="hover:text-primary mb-2 line-clamp-2 text-sm font-medium transition-colors">
            {title}
          </h3>
        </Link>

        <div className="mb-2 flex items-center justify-between">
          <span className="text-primary text-lg font-bold">{price.toLocaleString()}원</span>

          {variant === "mypage" && (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({reviewCount})</span>
          </div>

          <span className="text-muted-foreground">{freelancerName}</span>
        </div>
      </CardContent>
    </Card>
  );
}
