import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FreelancerCardProps {
  id: string;
  profileImage: string;
  name: string;
  rating: number;
  reviewCount: number;
  completedProjects: number;
}

export function FreelancerCard({
  id,
  profileImage,
  name,
  rating,
  reviewCount,
  completedProjects,
}: FreelancerCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardContent className="p-4 text-center">
        <Link href={`/freelancer/${id}`} className="block">
          <div className="relative mx-auto mb-3 h-16 w-16">
            <Image
              src={profileImage || "/placeholder.svg"}
              alt={name}
              fill
              className="rounded-full object-cover"
            />
          </div>

          <h3 className="hover:text-primary mb-2 font-medium transition-colors">{name}</h3>
        </Link>

        <div className="mb-1 flex items-center justify-center space-x-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          <span className="text-muted-foreground text-sm">({reviewCount})</span>
        </div>

        <p className="text-muted-foreground text-sm">작업 수: {completedProjects}개</p>
      </CardContent>
    </Card>
  );
}
