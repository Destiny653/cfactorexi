import React, {  useState } from 'react';
import { FileText, Plus, ThumbsUp, ThumbsDown, MoreVertical, Tag, MessageCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Post} from '../../types/dashboardTypes';
import { DataTableProps } from '../../types/dashboardTypes';
import { cn } from '../../lib/utils';
import { commentService } from '../../services/commentService';

interface EnhancedPost extends Post {
  _id: any; 
  showComments?: boolean;
  commentsLoading?: boolean;
}

const PostsTable: React.FC<DataTableProps<Post>> = ({ data }) => {
  const [posts, setPosts] = useState<EnhancedPost[]>(data.map(post => ({
    ...post,
    showComments: false,
    commentsLoading: false,
    comments: undefined
  })));

  const fetchComments = async (postId: string) => {
    setPosts(prev => prev.map(post => 
      post._id === postId ? { ...post, commentsLoading: true } : post
    ));

    try {
      const comments = await commentService.getCommentsByPostId(Number(postId));
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, comments, commentsLoading: false }
          : post
      ));
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setPosts(prev => prev.map(post => 
        post._id === postId ? { ...post, commentsLoading: false } : post
      ));
    }
  };

  const toggleComments = (postId: string) => {
    setPosts(prev => {
      const post = prev.find(p => p._id === postId);
      if (!post) return prev;

      // Fetch comments if not already loaded
      if (!post.comments && !post.showComments) {
        fetchComments(postId);
      }

      return prev.map(p => 
        p._id === postId ? { ...p, showComments: !p.showComments } : p
      );
    });
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No posts found</h3>
        <p className="mt-1 text-gray-500">Create your first post to get started.</p>
        <Button className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <React.Fragment key={post._id}>
                <TableRow className="hover:bg-gray-50/50">
                  <TableCell className="font-medium">
                    <div className="line-clamp-1">{post.title}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={post.user?.avatar} />
                        <AvatarFallback>
                          {post.user?.name?.charAt(0) || post.user?.username?.charAt(0) || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <span>{post.user?.name || post.user?.username || 'Anonymous'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.published ? 'default' : 'secondary'}>
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {post.tags?.slice(0, 2).map((tag, i) => (
                        <Badge key={i} variant="secondary" className="flex items-center">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {post.tags?.length > 2 && (
                        <Badge variant="outline">+{post.tags.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-green-500">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>{post.reactions?.likes || 0}</span>
                      </div>
                      <div className="flex items-center text-red-500">
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        <span>{post.reactions?.dislikes || 0}</span>
                      </div>
                      <div className="flex items-center text-blue-500">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span>{post.comments?.length || '0'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleComments(post._id)}
                        className="h-8 w-8"
                      >
                        {post.commentsLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : post.showComments ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>
                            {post.published ? 'Unpublish' : 'Publish'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Comments Section */}
                {post.showComments && (
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableCell colSpan={7} className="p-0">
                      <div className={cn(
                        "p-4 transition-all duration-300",
                        post.showComments ? "opacity-100" : "opacity-0 h-0"
                      )}>
                        <h4 className="font-medium mb-3 flex items-center">
                          <MessageCircle className="h-4 w-4 mr-2 text-blue-500" />
                          Comments ({post.comments?.length || 0})
                        </h4>
                        
                        {post.commentsLoading ? (
                          <div className="flex justify-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                          </div>
                        ) : post.comments?.length ? (
                          <div className="space-y-4">
                            {post.comments.map(comment => (
                              <div key={comment._id} className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={comment.user?.avatar} />
                                  <AvatarFallback>
                                    {comment.user?.fullName?.charAt(0) || comment.user?.username?.charAt(0) || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {comment.user?.fullName || comment.user?.username || 'Anonymous'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(comment.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm mt-1">{comment.body}</p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <Button variant="ghost" size="sm" className="h-6 px-2">
                                      <ThumbsUp className="h-3 w-3 mr-1" />
                                      <span>{comment.likes || 0}</span>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No comments yet
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PostsTable;