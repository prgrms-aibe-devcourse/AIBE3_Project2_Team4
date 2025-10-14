export interface components {
  schemas: {
    ServiceDTO: {
      id: number;
      thumbnail: string;
      title: string;
      price: number;
      rating: number;
      reviewCount: number;
      freelancerName: string;
      category: string;
      tags: string[];
      content: string;
      createdAt: string;
    };
    FreelancerDTO: {
      /** Format: int64 */
      id: number;
      /** Format: date-time */
      createdAt: string;
      /** Format: date-time */
      updatedAt: string;
      nickname: string;
      email: string;
    };
  };
}
