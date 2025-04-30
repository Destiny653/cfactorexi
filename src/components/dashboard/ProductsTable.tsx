import React, { useState, useMemo } from 'react';
import { Package, Plus, Star, MoreVertical, Filter, X, Search, Loader2 } from 'lucide-react';
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Product } from '../../types/dashboardTypes';
import { DataTableProps } from '../../types/dashboardTypes';
import ProductDetailsModal from './ProductDetailsModal';
import UpdateProductForm from './UpdateProductForm';
import { CreateProductDto, productService } from '../../services/productService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

const ProductsTable: React.FC<DataTableProps<Product>> = ({ data }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange] = useState<[number, number]>([0, 1000]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      await productService.deleteProduct(productId);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully!');
      setDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete product');
    }
  });

  // Get all unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    data.forEach(product => uniqueCategories.add(product.category));
    return Array.from(uniqueCategories);
  }, [data]);

  // Filter products based on search term, category, and price range
  const filteredProducts = useMemo(() => {
    return data.filter(product => {
      const matchesSearch = product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !selectedCategory || product.category === selectedCategory;

      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [data, searchTerm, selectedCategory, priceRange]);

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
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                {selectedCategory || 'All Categories'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                All Categories
              </DropdownMenuItem>
              {categories.map(category => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedCategory && (
            <Button
              variant="ghost"
              onClick={() => setSelectedCategory(null)}
              className="px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Products Table */}
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
            {filteredProducts.map((product) => (
              <TableRow
                key={product._id}
                className="hover:bg-gray-50/50 hover:cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
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
                  <div className="text-sm text-gray-500 line-clamp-1">
                    {product.brand || 'No brand'} • {product.category}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold">
                  ${product.price?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                  {product.discountPercentage && (
                    <span className="ml-2 text-xs text-green-600 line-through">
                      ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                    </span>
                  )}
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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                        }}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          setProductToEdit(product);
                          setEditDialogOpen(true);
                        }}
                      >
                        Edit
                      </DropdownMenuItem> 
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProductToDelete(product._id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Update Product Form */}
      {productToEdit && (
      <UpdateProductForm
      open={editDialogOpen}
      onClose={() => {
        setEditDialogOpen(false);
        setProductToEdit(null);
      }}
      product={productToEdit}
      onSubmit={async (productId, data) => {
        try {
          const formDataObj = Object.fromEntries(data.entries());
          await productService.updateProduct(productId, formDataObj as Partial<CreateProductDto>);
          queryClient.invalidateQueries({ queryKey: ['products'] });
          toast.success('Product updated successfully!');
        } catch (error:any) {
          toast.error(error.message || 'Failed to update product');
        }
      }}
    />
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (productToDelete) {
                  deleteProductMutation.mutate(productToDelete);
                }
              }}
              disabled={deleteProductMutation.isPending}
            >
              {deleteProductMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsTable;