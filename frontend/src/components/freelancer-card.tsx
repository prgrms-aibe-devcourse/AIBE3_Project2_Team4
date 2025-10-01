import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface FreelancerCardProps {
  id: string
  profileImage: string
  name: string
  rating: number
  reviewCount: number
  completedProjects: number
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
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4 text-center">
        <Link href={`/freelancer/${id}`} className="block">
          <div className="w-16 h-16 mx-auto mb-3 relative">
            <Image src={profileImage || "/placeholder.svg"} alt={name} fill className="object-cover rounded-full" />
          </div>

          <h3 className="font-medium mb-2 hover:text-primary transition-colors">{name}</h3>
        </Link>

        <div className="flex items-center justify-center space-x-1 mb-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>

        <p className="text-sm text-muted-foreground">작업 수: {completedProjects}개</p>
      </CardContent>
    </Card>
  )
}
