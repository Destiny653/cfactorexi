import { api } from './api';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
}

export const postService = {
  async getAllPosts() {
    try {
      const response = await api.get('/posts');
      return response.data.posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
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
