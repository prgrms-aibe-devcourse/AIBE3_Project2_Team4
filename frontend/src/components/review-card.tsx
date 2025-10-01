import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ReviewCardProps {
  rating: number
  content: string
  images?: string[]
  authorName: string
  authorId: string
  authorProfileImage: string
  createdAt: string
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
  return (
    <Card>
      <CardContent className="p-4">
        {/* 평점 */}
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
          ))}
        </div>

        {/* 리뷰 내용 */}
        <p className="text-sm mb-3 leading-relaxed">{content}</p>

        {/* 리뷰 이미지 */}
        {images.length > 0 && (
          <div className="flex space-x-2 mb-3">
            {images.map((image, index) => (
              <div key={index} className="w-16 h-16 relative">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`리뷰 이미지 ${index + 1}`}
                  fill
                  className="object-cover rounded"
                />
              </div>
            ))}
          </div>
        )}

        {/* 작성자 정보 */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 relative">
            <Image
              src={authorProfileImage || "/placeholder.svg"}
              alt={authorName}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <div>
            <Link href={`/user/${authorId}`} className="text-sm font-medium hover:text-primary transition-colors">
              {authorName}
            </Link>
            <p className="text-xs text-muted-foreground">{createdAt}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
