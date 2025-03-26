import { api } from './api';

export interface Comment {
  id: number;
  body: string;
  postId: number;
  user: {
    id: number;
    username: string;
  };
}

export const commentService = {
  async getAllComments() {
    try {
      const response = await api.get('/comments');
      return response.data.comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  async getCommentsByPostId(postId: number) {
    try {
      const response = await api.get(`/comments/post/${postId}`);
      return response.data.comments;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  },
};
