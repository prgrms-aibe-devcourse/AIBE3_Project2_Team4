import { authorizedFetch } from '../api';

// Profile API 타입 정의
export interface ProfileResponse {
  nickname: string;
  introduction: string;
  averageRating: number;
  profileType: 'CLIENT' | 'FREELANCER';
  reviewCount?: number;
  companyName?: string;
  teamName?: string;
  techStacks?: string[];
  certificates?: string[];
  careers?: CareerResponse[];
  portfolios?: PortfolioResponse[];
}

export interface ClientProfileResponse {
  nickname: string;
  introduction: string;
  averageRating: number;
  companyName: string;
  teamName: string;
}

export interface FreelancerProfileResponse {
  nickname: string;
  introduction: string;
  averageRating: number;
  techStacks: string[];
  certificates: string[];
  careers: CareerResponse[];
  portfolios: PortfolioResponse[];
}

export interface CareerResponse {
  position: string;
  companyName: string;
  term: string;
  description: string;
}

export interface PortfolioResponse {
  title: string;
  description: string;
  link: string;
}

export interface ProfileUpdateRequest {
  nickname: string;
  introduction: string;
  companyName?: string;
  teamName?: string;
  techStacks?: string[];
  certificates?: string[];
  careers?: CareerRequest[];
  portfolios?: PortfolioRequest[];
}

export interface CareerRequest {
  position: string;
  companyName: string;
  term: string;
  description: string;
}

export interface PortfolioRequest {
  title: string;
  description: string;
  link: string;
}

// 랭킹 API 타입 정의
export interface FreelancerRankingResponse {
  rank: number;
  nickname: string;
  averageRating: number;
  reviewCount: number;
}

export interface RankingPageResponse {
  content: FreelancerRankingResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

// API 클라이언트 함수들
const API_BASE_URL = 'http://localhost:8080/api/v1';


export const profileApi = {
  // 내 프로필 조회
  getMyProfile: async (): Promise<ProfileResponse> => {
    const response = await authorizedFetch(`${API_BASE_URL}/profiles/me`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`프로필 조회 실패: ${response.status}`);
    }

    return response.json();
  },

  // 특정 회원 프로필 조회
  getProfile: async (memberId: number): Promise<ProfileResponse> => {
    const response = await authorizedFetch(`${API_BASE_URL}/profiles/${memberId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`프로필 조회 실패: ${response.status}`);
    }

    return response.json();
  },

  // 클라이언트 프로필 상세 조회
  getClientProfile: async (id: number): Promise<ClientProfileResponse> => {
    const response = await authorizedFetch(`${API_BASE_URL}/profiles/clients/${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`클라이언트 프로필 조회 실패: ${response.status}`);
    }

    return response.json();
  },

  // 프리랜서 프로필 상세 조회
  getFreelancerProfile: async (id: number): Promise<FreelancerProfileResponse> => {
    const response = await authorizedFetch(`${API_BASE_URL}/profiles/freelancers/${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`프리랜서 프로필 조회 실패: ${response.status}`);
    }

    return response.json();
  },

  // 내 프로필 수정
  updateMyProfile: async (data: ProfileUpdateRequest): Promise<void> => {
    const response = await authorizedFetch(`${API_BASE_URL}/profiles/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`프로필 수정 실패: ${response.status}`);
    }
  },
};

// 랭킹 API 클라이언트 함수들
export const rankingApi = {
  // 프리랜서 랭킹 조회
  getFreelancerRanking: async (page: number = 0, size: number = 20): Promise<RankingPageResponse> => {
    // 임시로 인증 없이 호출 (백엔드에서 permitAll 설정 후)
    const response = await fetch(`${API_BASE_URL}/freelancers/ranking?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('랭킹 API 에러 응답:', errorText);
      throw new Error(`랭킹 조회 실패: ${response.status}`);
    }

    return response.json();
  },
};
