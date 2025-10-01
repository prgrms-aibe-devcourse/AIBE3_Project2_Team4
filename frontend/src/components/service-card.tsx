import Image from "next/image"
import Link from "next/link"
import { Star, Edit } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ServiceCardProps {
  id: string
  thumbnail: string
  title: string
  price: number
  rating: number
  reviewCount: number
  freelancerName: string
  variant?: "list" | "mypage"
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/service/${id}`} className="block">
        <div className="aspect-video relative">
          <Image src={thumbnail || "/placeholder.svg"} alt={title} fill className="object-cover" />
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/service/${id}`} className="block">
          <h3 className="font-medium text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">{title}</h3>
        </Link>

        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-primary">{price.toLocaleString()}원</span>

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
  )
}
