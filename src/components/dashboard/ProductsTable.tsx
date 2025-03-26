import React from 'react';
import { Package, Plus, Star, MoreVertical } from 'lucide-react';
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Product } from '../../types/dashboardTypes';
import { DataTableProps } from '../../types/dashboardTypes';

const ProductsTable: React.FC<DataTableProps<Product>> = ({ data }) => {
    if (data.length === 0) {
        return (
            <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-gray-500">Get started by adding a new product.</p>
                <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Inventory</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Reviews</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((product) => (
                        <TableRow key={product.id} className="hover:bg-gray-50/50">
                            <TableCell>
                                <div className="w-12 h-12 rounded-md overflow-hidden border">
                                    <img
                                        src={product.thumbnail || 'https://via.placeholder.com/80'}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{product.title}</div>
                                <div className="text-sm text-gray-500 line-clamp-1">{product.brand || 'No brand'}</div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </Badge>
                            </TableCell>
                            <TableCell className="font-semibold">
                                ${product.price?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Progress value={(product.stock / 100) * 100} className="h-2 w-20" />
                                    <span className="text-sm text-gray-500">{product.stock}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                    <span>{product.rating?.toFixed(1) || '0.0'}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {product.reviews && Array.isArray(product.reviews) ? (
                                    <div className="text-sm text-gray-500">
                                        {product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''}
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500">No reviews</div>
                                )}
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
                                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
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


export default ProductsTable;