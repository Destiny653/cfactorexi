import  { useState, useEffect } from 'react';
import { Comment, commentService } from '../../services/commentService';

interface CommentListProps {
  postId?: number; // Optional prop to fetch comments for a specific post
}

function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      // Only fetch comments if postId is provided
      if (!postId) {
        setError('No post ID provided');
        setLoading(false);
        return;
      }

      try {
        const fetchedComments = await commentService.getCommentsByPostId(postId);
        setComments(fetchedComments);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch comments');
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error}</div>;
  if (comments.length === 0) return <div>No comments found</div>;

  return (
    <div>
      <h3>Comments</h3>
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-card">
            <div className="comment-header">
              <strong>{comment.user.username}</strong>
            </div>
            <p>{comment.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentList;
