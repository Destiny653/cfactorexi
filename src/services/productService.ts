import { api } from './api'; 

export interface Product { 
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  images: string[];
  category: string;
  tags: string[];
  published: boolean;
}

export interface CreateProductDto {
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  published: boolean;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  published: boolean;
  userId: number;
}

export interface CreatePostDto {
  title: string;
  body: string;
  tags?: string[];
  published?: boolean;
  userId: number;
} 



export const productService = {

  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }, 
    async createProduct(formData: FormData): Promise<Product> {
      try {
        const response = await api.post('/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error creating product:', error);
        throw new Error('Failed to create product');
      }
    },
  async getProductById(id: number): Promise<Product> {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }, 

  async updateProduct(id: number, productData: Partial<CreateProductDto>): Promise<Product> {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  async deleteProduct(id: number): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }
};