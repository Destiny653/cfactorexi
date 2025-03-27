import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, Menu, Loader2 } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Sheet, SheetTrigger } from "../components/ui/sheet";
import { productService } from '../services/productService';
import { postService } from '../services/postService'; 
import Sidebar from '../components/dashboard/Sidebar';
import DashboardStats from '../components/dashboard/DashboardStats';
import ProductsTable from '../components/dashboard/ProductsTable';
import PostsTable from '../components/dashboard/PostsTable';
import AddProductForm from '../components/dashboard/AddProductForm';
import AddPostForm from '../components/dashboard/AddPostForm';
import { userService } from '../services/userService';
import { orderService } from '../services/orderService';
import UsersTable from '../components/dashboard/UsersTable';
import OrdersTable from '../components/dashboard/OrdersTable';
import { Product, Post, Comment, User, Order } from '../types/dashboardTypes';

const Dashboard: React.FC = () => {
  const [selectedView, setSelectedView] = useState<string>('dashboard');
  const [data, setData] = useState<Product[] | Post[] | Comment[] | User[] | Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [postFormOpen, setPostFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 13;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let result: Product[] | Post[] | Comment[] | User[] | Order[] = [];
      if (selectedView === 'products') {
        result = await productService.getAllProducts();
      } else if (selectedView === 'posts') {
        result = await postService.getAllPosts();
      } else if (selectedView === 'users') {
        result = await userService.getAllUsers();
      } else if (selectedView === 'orders') {
        result = await orderService.getAllOrders();
        console.log("Result: ", result);
      }
      setData(result);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError(`Failed to load ${selectedView}. Please try again.`);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      // Replace with your actual API call
      // await productService.createProduct(productData);
      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Failed to add product', error);
    }
  };

  const handleAddPost = async () => {
    try {
      // Replace with your actual API call
      // await postService.createPost(postData);
      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Failed to add post', error);
    }
  };


  useEffect(() => {
    if (['products', 'posts', 'orders', 'users'].includes(selectedView)) {
      fetchData();
    } else {
      setData([]);
    }
    setCurrentPage(1);
  }, [selectedView]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((item) => {
      if (selectedView === 'products') {
        const product = item as Product;
        return (
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (selectedView === 'posts') {
        const post = item as Post;
        return (
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      } else if (selectedView === 'users') {
        const user = item as User;
        return (
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (selectedView === 'orders') {
        const order = item as Order;
        return (
          order.id.toString().includes(searchTerm) ||
          order.userId.toString().includes(searchTerm) ||
          order.products.some(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      return true;
    });
  }, [data, searchTerm, selectedView]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="flex">
      <Sidebar
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="lg:ml-[15rem] w-full min-h-screen p-4 sm:p-8 bg-gray-50 overflow-auto">
        <div className="lg:hidden mb-4 flex items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>
          <h1 className="text-xl font-bold ml-2 capitalize">{selectedView}</h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        <AddProductForm
          open={productFormOpen}
          onClose={() => setProductFormOpen(false)}
          onSubmit={handleAddProduct}
        />

        <AddPostForm
          open={postFormOpen}
          onClose={() => setPostFormOpen(false)}
          onSubmit={handleAddPost}
        />

        {/* comments */}

        {selectedView === 'dashboard' ? (
          <DashboardStats />
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold capitalize">{selectedView}</h2>
                <p className="text-sm text-gray-500">
                  {selectedView === 'products' ? 'Manage your product inventory' :
                    selectedView === 'posts' ? 'View and manage all posts' :
                      selectedView === 'users' ? 'Manage user accounts' :
                        selectedView === 'orders' ? 'View and process customer orders' : ''}
                </p>
              </div>
              <div className="flex gap-3">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={`Search ${selectedView}...`}
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  className="hidden sm:flex bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    if (selectedView === 'products') setProductFormOpen(true);
                    if (selectedView === 'posts') setPostFormOpen(true);
                  }}
                >
                  <Plus size={16} className="mr-2" />
                  Add New
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64 text-red-500">
                {error}
              </div>
            ) : (
              <>
                {selectedView === 'products' ? (
                  <ProductsTable data={paginatedData as Product[]} />
                ) : selectedView === 'posts' ? (
                  <PostsTable data={paginatedData as Post[]} />
                ) : selectedView === 'users' ? (
                  <UsersTable data={paginatedData as User[]} />
                ) : selectedView === 'orders' ? (
                  <OrdersTable data={paginatedData as Order[]} />
                ) : null}

                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 gap-4">
                    <div className="text-sm text-gray-600">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                      {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
                      {filteredData.length} entries
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft size={16} className="mr-1" /> Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <>
                            <span className="px-2">...</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(totalPages)}
                            >
                              {totalPages}
                            </Button>
                          </>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next <ChevronRight size={16} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;