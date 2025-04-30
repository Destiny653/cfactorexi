import React from 'react';
import { Users, MoreVertical, Shield, Mail, Phone } from 'lucide-react';
import type { User } from '../../types/dashboardTypes';
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DataTableProps } from '../../types/dashboardTypes';

const UsersTable: React.FC<DataTableProps<User>> = ({ data = [] }) => {
    // Data normalization function
    const getSafeUsers = () => {
        return data.map(user => ({
            ...user,
            id: user._id || Math.random().toString(36).substring(2, 9),
            firstName: user.firstName || 'Unknown',
            lastName: user.lastName || 'User',
            username: user.username || `user${Math.floor(Math.random() * 1000)}`,
            email: user.email || 'no-email@example.com',
            phone: user.phone || 'N/A',
            image: user.image || '',
            role: ['admin', 'user'].includes(user.role || '') ? user.role : 'user',
            address: user.address ? {
                ...user.address,
                city: user.address.city || 'Unknown',
                state: user.address.state || ''
            } : {
                city: 'Unknown', 
                state: ''
            },
            company: user.company ? (() => {
                const { name, ...rest } = user.company;
                return { ...rest, name: name || '' };
            })() : null
        }));
    };

    const safeUsers = getSafeUsers();

    if (safeUsers.length === 0) {
        return (
            <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
                <p className="mt-1 text-gray-500">User accounts will appear here</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {safeUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-gray-50/50">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.image} alt={`${user.firstName} ${user.lastName}`} />
                                        <AvatarFallback>
                                                {(user.firstName.charAt(0) + user.lastName.charAt(0)) || 'UU'}
                                            </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">
                                            {user.firstName} {user.lastName}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            @{user.username}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    <div className="flex items-center text-sm">
                                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                                        <span className="truncate max-w-[180px]" title={user.email}>
                                            {user.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Phone className="h-4 w-4 mr-2" />
                                        {user.phone}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="text-sm">
                                    {user.address.city}{user.address.state ? `, ${user.address.state}` : ''}
                                </div>
                                {user.company?.name && (
                                    <div className="text-sm text-gray-500">
                                        {user.company.name}
                                    </div>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                    <Shield className="h-3 w-3 mr-1" />
                                    {user.role}
                                </Badge>
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
                                        <DropdownMenuItem>View Orders</DropdownMenuItem>
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

export default UsersTable;