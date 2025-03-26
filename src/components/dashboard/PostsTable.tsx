import React from 'react';
import { FileText, Plus, ThumbsUp, ThumbsDown, MoreVertical, Tag } from 'lucide-react';
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Post } from '../../types/dashboardTypes';
import { DataTableProps } from '../../types/dashboardTypes';

const PostsTable: React.FC<DataTableProps<Post>> = ({ data }) => {
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
                    {data.map((post) => (
                        <TableRow key={post.id} className="hover:bg-gray-50/50">
                            <TableCell className="font-medium">
                                <div className="line-clamp-1">{post.title}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={post.user?.avatar} />
                                        <AvatarFallback>{post.user?.name?.charAt(0) || 'A'}</AvatarFallback>
                                    </Avatar>
                                    <span>{post.user?.name || 'Anonymous'}</span>
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
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
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
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default PostsTable;