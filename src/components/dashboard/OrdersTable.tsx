import React from 'react';
import { CreditCard, Package, Truck, Check, X, MoreVertical } from 'lucide-react';
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Order } from '../../types/dashboardTypes';
import { DataTableProps } from '../../types/dashboardTypes';

const statusIcons = {
    pending: <Package className="h-4 w-4 mr-1" />,
    shipped: <Truck className="h-4 w-4 mr-1" />,
    delivered: <Check className="h-4 w-4 mr-1" />,
    cancelled: <X className="h-4 w-4 mr-1" />
};

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
};

const OrdersTable: React.FC<DataTableProps<Order>> = ({ data }) => {
    if (data.length === 0) {
        return (
            <div className="text-center py-12">
                <CreditCard className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
                <p className="mt-1 text-gray-500">Customer orders will appear here</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((order) => (
                        <TableRow key={order.id} className="hover:bg-gray-50/50">
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>User #{order.userId}</TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <div className="flex -space-x-2">
                                        {order.products.slice(0, 3).map((product) => (
                                            <Avatar key={product.id} className="h-8 w-8 border-2 border-white">
                                                <AvatarImage src={product.thumbnail || ''} />
                                                <AvatarFallback>{product.title?.charAt(0) || 'P'}</AvatarFallback>
                                            </Avatar>
                                        ))}
                                    </div>
                                    {order.products.length > 3 && (
                                        <span className="ml-2 text-sm text-gray-500">
                                            +{order.products.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="font-semibold">
                                ${order.discountedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                {order.discountedTotal !== order.total && (
                                    <span className="ml-1 text-sm text-gray-500 line-through">
                                        ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge className={`${statusColors[order.status || 'pending']} flex items-center`}>
                                    {statusIcons[order.status || 'pending']}
                                    {order.status || 'pending'}
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
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">Cancel Order</DropdownMenuItem>
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

export default OrdersTable;