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
  _id: number;
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

interface DeleteProduct {
  success: boolean,
  message: string,
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
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  async updateProduct(
    id: string, 
    productData: Partial<CreateProductDto> | FormData
  ): Promise<Product> {
    try {
      const config = productData instanceof FormData 
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
  
      const response = await api.put(`/products/${id}`, productData, config);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },
  
  async deleteProduct(id: string): Promise<DeleteProduct> {
    try {
      await api.delete(`/products/${id}`);
      this.getAllProducts()
      return {
        success: true,
        message: `Product deleted sucessfully!`
      }
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      return {
        success: false,
        message: `Error deleting product ${id}: ${error}`
      }
    }
  }
};