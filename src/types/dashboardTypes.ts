import { ComponentType } from 'react';

// Form interfaces
export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand?: string;
  image?: File;
}

export interface PostFormData {
  title: string;
  body: string;
  tags: string[];
  published: boolean;
}

// Type Definitions
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string | undefined;
  name?: string;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail?: string;
  stock: number;
  rating?: number;
  reviews?: Review[];
  brand?: string;
  category: string;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  date: string;
  published: boolean;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  user: User;
  views?: number;
}

export interface Comment {
  id: string;
  body: string;
  date: string;
  approved: boolean;
  user: User;
  postId: string;
  postTitle?: string;
  likes?: number;
}

export interface SidebarItem {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  view: string;
}

export interface SidebarProps {
  selectedView: string;
  setSelectedView: (view: string) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export interface DataTableProps<T> {
  data: T[];
}

export interface StatCardProps {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  value: string | number;
  trend: number;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  changeText?: string;
  compact?: boolean;
}

export interface Statistics {
  totalProducts: number;
  totalPosts: number;
  totalComments: number;
  totalUsers: number;
  productRevenue: number;
  viewRate: number;
  engagementRate: number;
  monthlyGrowth: number;
  weeklySales: number;
}