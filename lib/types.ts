export interface UserSession {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "CLIENT";
  companyName?: string;
}

export interface SalesMetricInput {
  date: string;
  totalSales: number;
  orderCount: number;
  newCustomers: number;
  repeatCustomers: number;
  netProfit: number;
}

export interface SalesMetricData {
  id: string;
  date: string;
  totalSales: number;
  orderCount: number;
  newCustomers: number;
  repeatCustomers: number;
  netProfit: number;
  avgBasketValue: number;
}

export interface CategoryData {
  id: string;
  name: string;
  icon: string;
  slug: string;
  order: number;
  _count?: { contents: number };
}

export interface ContentData {
  id: string;
  title: string;
  description: string;
  type: "VIDEO" | "PDF" | "LINK";
  url?: string;
  fileUrl?: string;
  isPublic: boolean;
  status: "PUBLISHED" | "DRAFT";
  categoryId: string;
  category?: CategoryData;
  createdAt: string;
}

export interface ClientData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  isActive: boolean;
  createdAt: string;
  _count?: { salesMetrics: number };
}
