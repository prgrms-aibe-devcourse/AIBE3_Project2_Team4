export interface FreelancerDTO {
  id: number;
  nickname: string;
  email: string;
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

export interface components {
  schemas: {
    ServiceDTO: ServiceDTO;
    FreelancerDTO: FreelancerDTO;
  };
}
