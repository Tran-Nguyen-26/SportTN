export interface BrandAddRequest {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  active: boolean;
  color: string;
}

export interface BrandResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  active: boolean;
  totalProducts: number;
  color: string;
}
