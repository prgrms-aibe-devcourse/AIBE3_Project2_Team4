export interface ServiceCardDto {
  id: number;
  freelancer: {
    id: number;
    nickname: string;
    thumbnail: string;
    email: string;
  };
  title: string;
  content: string;
  price: number;
}

export interface ServiceCardType {
  id: number;
  thumbnail: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  freelancerName: string;
}

export type Page<T> = {
  content: T[];
  number: number; // 현재 페이지 (0-base)
  size: number; // 페이지 크기
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  sort?: unknown;
};
