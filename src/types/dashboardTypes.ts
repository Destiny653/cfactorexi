import { ComponentType } from 'react';

// Form interfaces
export interface ProductFormData {
  published: boolean | undefined;
  tags: any;
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
  _id: string;
  username: string;
  email: string;
  avatar: string | undefined;
  name?: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  name?: string;
  image: string;
  role: 'admin' | 'customer' | 'editor';
  phone: string;
  address: {
    city: string;
    state: string;
  };
  company?: {
    name: string;
  };
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

 
export interface Product {
  published: boolean;
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  thumbnail?: string;
  images?: string[];
  stock: number;
  rating?: number;
  reviews?: Review[];
  brand?: string;
  category: string;
  sku?: string;
  shippingInformation?: string;
  returnPolicy?: string;
  tags?: string[];
  meta?: {
    createdAt: string;
    updatedAt: string;
    barcode?: string;
    qrCode?: string;
  };
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  weight?: number;
  warrantyInformation?: string;
  availabilityStatus?: string;
  minimumOrderQuantity?: number;
}

export interface Comment {
  _id: string;
  body: string;
  postId: string;
  likes?: number;
  user: {
    _id: string;
    username: string;
    fullName: string;
    avatar?: string;
  };
  date: string;
  approved: boolean;
}

export interface Post {
  _id: string;
  title: string;
  body: string;
  date: string;
  published: boolean;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
  user?: User; // Optional user details
  comments?: Comment[]; // Added comments array
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

// types/dashboardTypes.ts

export interface Order {
  products: any;
  _id: string;
  user?:any;
  items: {
    _id: string;
    title: string;
    price: number;
    quantity: number;
    discountPercentage?: number;
    thumbnail?: string;
  }[];
  subtotal: number;
  discountTotal: number;
  total: number;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  shippingMethod: string;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
export interface CreateProductDto {
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  published: boolean;
  stock: number;
  thumbnail?: File | string;
  images?: (File | string)[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  id: string;
  existingThumbnail?: string;
  existingImages?: string[];
}


// Add these to your existing types