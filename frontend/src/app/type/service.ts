export interface ServiceCardDto {
  id: string;
  thumbnail: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  freelancerName: string;
}

export interface ServiceCardType {
  id: string;
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
