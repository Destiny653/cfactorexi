import React from 'react';
import { MessageCircle, MoreVertical } from 'lucide-react';
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Comment } from '../../types/dashboardTypes';
import { DataTableProps } from '../../types/dashboardTypes';

const CommentsTable: React.FC<DataTableProps<Comment>> = ({ data }) => {
    if (data.length === 0) {
        return (
            <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No comments found</h3>
                <p className="mt-1 text-gray-500">Comments will appear here when users post them.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
                <TableHeader>
                    <TableRow>
                        <TableHead>Comment</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Post</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((comment) => (
                        <TableRow key={comment.id} className="hover:bg-gray-50/50">
                            <TableCell className="max-w-[300px]">
                                <div className="line-clamp-2">{comment.body}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={comment.user?.avatar} />
                                        <AvatarFallback>{comment.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <span>{comment.user?.name || comment.user?.username || 'Anonymous'}</span>
                                </div>
                            </TableCell>
                            <TableCell className="max-w-[150px] truncate">
                                {comment.postTitle || 'Untitled Post'}
                            </TableCell>
                            <TableCell>
                                <Badge variant={comment.approved ? 'default' : 'secondary'}>
                                    {comment.approved ? 'Approved' : 'Pending'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {new Date(comment.date).toLocaleDateString('en-US', {
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
                                        <DropdownMenuItem>
                                            {comment.approved ? 'Unapprove' : 'Approved'}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>Reply</DropdownMenuItem>
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


export default CommentsTable;