export interface FreelancerDTO {
  id: number;
  nickname: string;
  email: string;
  profileImageUrl: string;
}

export interface ServiceDTO {
  id: number;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  freelancer: FreelancerDTO;
  category: string;
  tags: string[];
}

export interface ServiceReviewDTO {
  id: number;
  rating: number;
  content: string;
  images: string[];
  freelancerName: string;
  freelancerEmail: string;
  freelancerProfileImage: string;
  createdAt: string;
}

export interface components {
  schemas: {
    ServiceDTO: ServiceDTO;
    FreelancerDTO: FreelancerDTO;
    ServiceReviewDTO: ServiceReviewDTO;
  };
}
