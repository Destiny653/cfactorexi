// src/services/postService.ts
import { api } from './api';

export interface Post { 
  _id: string;
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

export const postService = {
  async getAllPosts(): Promise<Post[]> {
    try {
      const response = await api.get('/posts');
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  async createPost(postData: CreatePostDto): Promise<Post> {
    try {
      const response = await api.post('/posts', postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },


  async getPostById(id: number) {
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
      throw error;
    }
  }, 
};