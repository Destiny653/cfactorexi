// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   Activity, ShoppingCart, FileText, MessageCircle, Grid, BarChart2, Layers, User, Settings, Loader2, ChevronLeft, ChevronRight, Search, Plus,
//   MoreVertical, Star, ThumbsUp, ThumbsDown, Bell, Calendar, Clock, Tag, CreditCard, Package, Users, ArrowUp, ArrowDown, Menu, ChevronDown
// } from 'lucide-react';
// import { Button } from "../components/ui/button";
// import { useAuth } from '../context/AuthContext';
// import { productService } from '../services/productService';
// import { postService } from '../services/postService';
// import { commentService } from '../services/commentService';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../components/ui/table";
// import { Badge } from "../components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
// import { Input } from "../components/ui/input";
// import { Progress } from "../components/ui/progress";
// import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "../components/ui/dropdown-menu";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
// import { Sheet, SheetTrigger } from "../components/ui/sheet";

// // Form interface

// interface ProductFormData {
//   title: string;
//   description: string;
//   price: number;
//   stock: number;
//   category: string;
//   brand?: string;
//   image?: File;
// }

// interface PostFormData {
//   title: string;
//   body: string;
//   tags: string[];
//   published: boolean;
// }

// // Type Definitions
// interface User {
//   id: string;
//   username: string;
//   email: string;
//   avatar: string | undefined;
//   name?: string;
// }

// interface Review {
//   rating: number;
//   comment: string;
//   date: string;
//   reviewerName: string;
//   reviewerEmail: string;
// }

// interface Product {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   thumbnail?: string;
//   stock: number;
//   rating?: number;
//   reviews?: Review[];
//   brand?: string;
//   category: string;
// }

// interface Post {
//   id: string;
//   title: string;
//   body: string;
//   date: string;
//   published: boolean;
//   tags: string[];
//   reactions: {
//     likes: number;
//     dislikes: number;
//   };
//   user: User;
//   views?: number;
// }

// interface Comment {
//   id: string;
//   body: string;
//   date: string;
//   approved: boolean;
//   user: User;
//   postId: string;
//   postTitle?: string;
//   likes?: number;
// }

// interface SidebarItem {
//   icon: React.ComponentType<{ size?: number; className?: string }>;
//   label: string;
//   view: string;
// }

// interface SidebarProps {
//   selectedView: string;
//   setSelectedView: (view: string) => void;
//   mobileOpen?: boolean;
//   setMobileOpen?: (open: boolean) => void;
// }

// interface DataTableProps<T> {
//   data: T[];
// }

// interface StatCardProps {
//   icon: React.ComponentType<{ size?: number; className?: string }>;
//   title: string;
//   value: string | number;
//   trend: number;
//   color?: 'blue' | 'green' | 'purple' | 'orange';
//   changeText?: string;
//   compact?: boolean;
// }

// interface Statistics {
//   totalProducts: number;
//   totalPosts: number;
//   totalComments: number;
//   totalUsers: number;
//   productRevenue: number;
//   viewRate: number;
//   engagementRate: number;
//   monthlyGrowth: number;
//   weeklySales: number;
// }

// // Components
// const Sidebar: React.FC<SidebarProps> = ({ selectedView, setSelectedView, mobileOpen, setMobileOpen }) => {
//   const { user, logout } = useAuth();
//   const sidebarItems: SidebarItem[] = [
//     { icon: Grid, label: 'Dashboard', view: 'dashboard' },
//     { icon: ShoppingCart, label: 'Products', view: 'products' },
//     { icon: FileText, label: 'Posts', view: 'posts' },
//     { icon: MessageCircle, label: 'Comments', view: 'comments' },
//     { icon: Users, label: 'Users', view: 'users' },
//     { icon: BarChart2, label: 'Analytics', view: 'analytics' },
//     { icon: CreditCard, label: 'Orders', view: 'orders' },
//     { icon: Layers, label: 'Integrations', view: 'integrations' },
//     { icon: Settings, label: 'Settings', view: 'settings' }
//   ];

//   return (
//     <aside className={`w-72 bg-gradient-to-b from-blue-900 to-blue-800 text-white h-screen flex flex-col fixed left-0 shadow-xl z-50 transition-transform duration-300 ease-in-out 
//       ${mobileOpen === false ? '-translate-x-full' : 'translate-x-0'} lg:translate-x-0`}>
//       <div className="p-6 border-b border-blue-700 flex items-center">
//         <div className="bg-white text-blue-600 p-2 rounded-lg mr-3">
//           <Activity size={20} />
//         </div>
//         <h2 className="text-xl font-bold">AdminPro</h2>
//       </div>
//       <nav className="flex-grow overflow-y-auto p-4">
//         {sidebarItems.map(({ icon: Icon, label, view }) => (
//           <button
//             key={view}
//             className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors mb-1 ${selectedView === view
//               ? 'bg-blue-700 text-white font-medium shadow-md'
//               : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'}
//             `}
//             onClick={() => {
//               setSelectedView(view);
//               if (setMobileOpen) setMobileOpen(false);
//             }}
//           >
//             <Icon className="mr-3" size={20} />
//             <span className="text-sm">{label}</span>
//             {view === 'orders' && (
//               <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
//             )}
//           </button>
//         ))}
//       </nav>
//       <div className="border-t border-blue-700 p-4">
//         <div className="flex items-center mb-3">
//           <Avatar className="mr-3">
//             <AvatarImage src={(user as any)?.avatar ?? ''} />
//             <AvatarFallback className="bg-blue-600">
//               {user?.username?.charAt(0).toUpperCase() || 'U'}
//             </AvatarFallback>
//           </Avatar>
//           <div>
//             <p className="text-sm font-semibold">{user?.username || 'User'}</p>
//             <p className="text-xs text-blue-200">{user?.email}</p>
//           </div>
//         </div>
//         <Button
//           variant="ghost"
//           size="sm"
//           className="w-full text-blue-100 hover:text-white hover:bg-blue-700/50"
//           onClick={logout}
//         >
//           Logout
//         </Button>
//       </div>
//     </aside>
//   );
// };
// const ProductsTable: React.FC<DataTableProps<Product>> = ({ data }) => {
//   if (data.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <Package className="h-12 w-12 mx-auto text-gray-400" />
//         <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
//         <p className="mt-1 text-gray-500">Get started by adding a new product.</p>
//         <Button className="mt-4">
//           <Plus className="h-4 w-4 mr-2" />
//           Add Product
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto">
//       <Table className="min-w-[800px]">
//         <TableHeader>
//           <TableRow>
//             <TableHead className="w-[80px]">Image</TableHead>
//             <TableHead>Product</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Price</TableHead>
//             <TableHead>Inventory</TableHead>
//             <TableHead>Rating</TableHead>
//             <TableHead>Reviews</TableHead>
//             <TableHead className="text-right">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {data.map((product) => (
//             <TableRow key={product.id} className="hover:bg-gray-50/50">
//               <TableCell>
//                 <div className="w-12 h-12 rounded-md overflow-hidden border">
//                   <img
//                     src={product.thumbnail || 'https://via.placeholder.com/80'}
//                     alt={product.title}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               </TableCell>
//               <TableCell>
//                 <div className="font-medium">{product.title}</div>
//                 <div className="text-sm text-gray-500 line-clamp-1">{product.brand || 'No brand'}</div>
//               </TableCell>
//               <TableCell>
//                 <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
//                   {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
//                 </Badge>
//               </TableCell>
//               <TableCell className="font-semibold">
//                 ${product.price?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
//               </TableCell>
//               <TableCell>
//                 <div className="flex items-center gap-2">
//                   <Progress value={(product.stock / 100) * 100} className="h-2 w-20" />
//                   <span className="text-sm text-gray-500">{product.stock}</span>
//                 </div>
//               </TableCell>
//               <TableCell>
//                 <div className="flex items-center">
//                   <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
//                   <span>{product.rating?.toFixed(1) || '0.0'}</span>
//                 </div>
//               </TableCell>
//               <TableCell>
//                 {product.reviews && Array.isArray(product.reviews) ? (
//                   <div className="text-sm text-gray-500">
//                     {product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''}
//                   </div>
//                 ) : (
//                   <div className="text-sm text-gray-500">No reviews</div>
//                 )}
//               </TableCell>
//               <TableCell className="text-right">
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="icon">
//                       <MoreVertical className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem>Edit</DropdownMenuItem>
//                     <DropdownMenuItem>Duplicate</DropdownMenuItem>
//                     <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// const PostsTable: React.FC<DataTableProps<Post>> = ({ data }) => {
//   if (data.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <FileText className="h-12 w-12 mx-auto text-gray-400" />
//         <h3 className="mt-2 text-lg font-medium text-gray-900">No posts found</h3>
//         <p className="mt-1 text-gray-500">Create your first post to get started.</p>
//         <Button className="mt-4">
//           <Plus className="h-4 w-4 mr-2" />
//           Create Post
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto">
//       <Table className="min-w-[800px]">
//         <TableHeader>
//           <TableRow>
//             <TableHead className="w-[200px]">Title</TableHead>
//             <TableHead>Author</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Tags</TableHead>
//             <TableHead>Engagement</TableHead>
//             <TableHead>Date</TableHead>
//             <TableHead className="text-right">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {data.map((post) => (
//             <TableRow key={post.id} className="hover:bg-gray-50/50">
//               <TableCell className="font-medium">
//                 <div className="line-clamp-1">{post.title}</div>
//               </TableCell>
//               <TableCell>
//                 <div className="flex items-center gap-2">
//                   <Avatar className="h-6 w-6">
//                     <AvatarImage src={post.user?.avatar} />
//                     <AvatarFallback>{post.user?.name?.charAt(0) || 'A'}</AvatarFallback>
//                   </Avatar>
//                   <span>{post.user?.name || 'Anonymous'}</span>
//                 </div>
//               </TableCell>
//               <TableCell>
//                 <Badge variant={post.published ? 'default' : 'secondary'}>
//                   {post.published ? 'Published' : 'Draft'}
//                 </Badge>
//               </TableCell>
//               <TableCell>
//                 <div className="flex flex-wrap gap-1">
//                   {post.tags?.slice(0, 2).map((tag, i) => (
//                     <Badge key={i} variant="secondary" className="flex items-center">
//                       <Tag className="h-3 w-3 mr-1" />
//                       {tag}
//                     </Badge>
//                   ))}
//                   {post.tags?.length > 2 && (
//                     <Badge variant="outline">+{post.tags.length - 2}</Badge>
//                   )}
//                 </div>
//               </TableCell>
//               <TableCell>
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center text-green-500">
//                     <ThumbsUp className="h-4 w-4 mr-1" />
//                     <span>{post.reactions?.likes || 0}</span>
//                   </div>
//                   <div className="flex items-center text-red-500">
//                     <ThumbsDown className="h-4 w-4 mr-1" />
//                     <span>{post.reactions?.dislikes || 0}</span>
//                   </div>
//                 </div>
//               </TableCell>
//               <TableCell>
//                 {new Date(post.date).toLocaleDateString('en-US', {
//                   year: 'numeric',
//                   month: 'short',
//                   day: 'numeric'
//                 })}
//               </TableCell>
//               <TableCell className="text-right">
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="icon">
//                       <MoreVertical className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem>Edit</DropdownMenuItem>
//                     <DropdownMenuItem>
//                       {post.published ? 'Unpublish' : 'Publish'}
//                     </DropdownMenuItem>
//                     <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// const CommentsTable: React.FC<DataTableProps<Comment>> = ({ data }) => {
//   if (data.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <MessageCircle className="h-12 w-12 mx-auto text-gray-400" />
//         <h3 className="mt-2 text-lg font-medium text-gray-900">No comments found</h3>
//         <p className="mt-1 text-gray-500">Comments will appear here when users post them.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto">
//       <Table className="min-w-[800px]">
//         <TableHeader>
//           <TableRow>
//             <TableHead>Comment</TableHead>
//             <TableHead>User</TableHead>
//             <TableHead>Post</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Date</TableHead>
//             <TableHead className="text-right">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {data.map((comment) => (
//             <TableRow key={comment.id} className="hover:bg-gray-50/50">
//               <TableCell className="max-w-[300px]">
//                 <div className="line-clamp-2">{comment.body}</div>
//               </TableCell>
//               <TableCell>
//                 <div className="flex items-center gap-2">
//                   <Avatar className="h-6 w-6">
//                     <AvatarImage src={comment.user?.avatar} />
//                     <AvatarFallback>{comment.user?.name?.charAt(0) || 'U'}</AvatarFallback>
//                   </Avatar>
//                   <span>{comment.user?.name || comment.user?.username || 'Anonymous'}</span>
//                 </div>
//               </TableCell>
//               <TableCell className="max-w-[150px] truncate">
//                 {comment.postTitle || 'Untitled Post'}
//               </TableCell>
//               <TableCell>
//                 <Badge variant={comment.approved ? 'default' : 'secondary'}>
//                   {comment.approved ? 'Approved' : 'Pending'}
//                 </Badge>
//               </TableCell>
//               <TableCell>
//                 {new Date(comment.date).toLocaleDateString('en-US', {
//                   month: 'short',
//                   day: 'numeric'
//                 })}
//               </TableCell>
//               <TableCell className="text-right">
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="icon">
//                       <MoreVertical className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem>
//                       {comment.approved ? 'Unapprove' : 'Approved'}
//                     </DropdownMenuItem>
//                     <DropdownMenuItem>Reply</DropdownMenuItem>
//                     <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// const RecentProducts: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const result = await productService.getAllProducts();
//         setProducts(result.slice(0, 5));
//       } catch (error) {
//         console.error('Failed to fetch products', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-32">
//         <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {products.map((product) => (
//         <div key={product.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
//           <div className="w-10 h-10 rounded-md overflow-hidden border">
//             <img
//               src={product.thumbnail || 'https://via.placeholder.com/80'}
//               alt={product.title}
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div className="flex-1 min-w-0">
//             <div className="font-medium truncate">{product.title}</div>
//             <div className="text-sm text-gray-500 truncate">{product.category}</div>
//           </div>
//           <div className="flex flex-col items-end">
//             <div className="font-semibold">${product.price?.toFixed(2) || '0.00'}</div>
//             <div className="flex items-center text-sm text-gray-500">
//               <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
//               <span>{product.rating?.toFixed(1) || '0.0'}</span>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// const StatCard: React.FC<StatCardProps> = ({
//   icon: Icon,
//   title,
//   value,
//   trend,
//   color = 'blue',
//   changeText = 'vs last month',
//   compact = false
// }) => {
//   const isPositive = trend >= 0;
//   const colorClasses = {
//     blue: { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'text-blue-500' },
//     green: { bg: 'bg-green-100', text: 'text-green-600', icon: 'text-green-500' },
//     purple: { bg: 'bg-purple-100', text: 'text-purple-600', icon: 'text-purple-500' },
//     orange: { bg: 'bg-orange-100', text: 'text-orange-600', icon: 'text-orange-500' },
//   };
//   const currentColor = colorClasses[color] || colorClasses.blue;

//   return (
//     <Card className={compact ? '' : 'hover:shadow-md transition-shadow'}>
//       <CardContent className={`p-${compact ? '4' : '6'}`}>
//         <div className="flex justify-between items-start">
//           <div>
//             <p className={`text-sm font-medium ${compact ? 'text-gray-500' : currentColor.text}`}>
//               {title}
//             </p>
//             <p className={`text-${compact ? 'xl' : '2xl'} font-bold mt-1`}>{value}</p>
//           </div>
//           <div className={`p-${compact ? '2' : '3'} rounded-lg ${currentColor.bg}`}>
//             <Icon className={`${currentColor.icon}`} size={compact ? 18 : 20} />
//           </div>
//         </div>
//         <div className={`mt-3 flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
//           {isPositive ? (
//             <ArrowUp className="h-4 w-4 mr-1" />
//           ) : (
//             <ArrowDown className="h-4 w-4 mr-1" />
//           )}
//           <span className="font-medium">
//             {Math.abs(trend)}%
//           </span>
//           <span className="ml-1 text-gray-500">{changeText}</span>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   Legend
// } from 'recharts';

// const DashboardStats: React.FC = () => {
//   const [statistics, setStatistics] = useState<Statistics>({
//     totalProducts: 0,
//     totalPosts: 0,
//     totalComments: 0,
//     totalUsers: 0,
//     productRevenue: 0,
//     viewRate: 0,
//     engagementRate: 0,
//     monthlyGrowth: 0,
//     weeklySales: 0
//   });
//   const [loading, setLoading] = useState<boolean>(true);
//   const [timeRange, setTimeRange] = useState<string>('week');

//   // Mock sales data for the chart
//   const salesData = [
//     { name: 'Jan', sales: 4000, returns: 2400 },
//     { name: 'Feb', sales: 3000, returns: 1398 },
//     { name: 'Mar', sales: 2000, returns: 9800 },
//     { name: 'Apr', sales: 2780, returns: 3908 },
//     { name: 'May', sales: 1890, returns: 4800 },
//     { name: 'Jun', sales: 2390, returns: 3800 },
//     { name: 'Jul', sales: 3490, returns: 4300 },
//   ];

//   const weeklyData = [
//     { name: 'Mon', sales: 1200, visitors: 800 },
//     { name: 'Tue', sales: 1900, visitors: 1200 },
//     { name: 'Wed', sales: 800, visitors: 500 },
//     { name: 'Thu', sales: 1600, visitors: 1000 },
//     { name: 'Fri', sales: 2400, visitors: 1500 },
//     { name: 'Sat', sales: 1800, visitors: 900 },
//     { name: 'Sun', sales: 2100, visitors: 1100 },
//   ];

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const [products, posts, comments] = await Promise.all([
//           productService.getAllProducts(),
//           postService.getAllPosts(),
//           commentService.getAllComments()
//         ]);
//         setStatistics({
//           totalProducts: products.length,
//           totalPosts: posts.length,
//           totalComments: comments.length,
//           totalUsers: 42, // Mock data
//           productRevenue: products.reduce((sum: number, p: any) => sum + (p.price || 0), 0),
//           viewRate: posts.length * 10,
//           engagementRate: comments.length / (posts.length || 1) * 100,
//           monthlyGrowth: 12.5,
//           weeklySales: 24
//         });
//       } catch (error) {
//         console.error('Failed to fetch data', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDashboardData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold">Dashboard Overview</h1>
//           <p className="text-gray-500">Welcome back! Here's what's happening with your store.</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="sm" className="hidden sm:flex">
//                 <Calendar className="h-4 w-4 mr-2" />
//                 {timeRange === 'week' ? 'Weekly' : 'Monthly'} View
//                 <ChevronDown className="ml-2 h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => setTimeRange('week')}>
//                 Weekly
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setTimeRange('month')}>
//                 Monthly
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//           <Button variant="outline" size="sm">
//             <Clock className="h-4 w-4 mr-2" />
//             Refresh
//           </Button>
//         </div>
//       </div>

//       <Tabs defaultValue="overview" className="space-y-6">
//         <TabsList className="w-full overflow-x-auto">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="analytics">Analytics</TabsTrigger>
//           <TabsTrigger value="reports">Reports</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             <StatCard
//               icon={ShoppingCart}
//               title="Total Products"
//               value={statistics.totalProducts}
//               trend={5}
//               color="blue"
//               changeText="vs last month"
//             />
//             <StatCard
//               icon={CreditCard}
//               title="Revenue"
//               value={`$${statistics.productRevenue.toLocaleString()}`}
//               trend={7}
//               color="green"
//               changeText="vs last month"
//             />
//             <StatCard
//               icon={Users}
//               title="Total Users"
//               value={statistics.totalUsers}
//               trend={3.2}
//               color="purple"
//               changeText="vs last month"
//             />
//             <StatCard
//               icon={BarChart2}
//               title="Monthly Growth"
//               value={`${statistics.monthlyGrowth}%`}
//               trend={statistics.monthlyGrowth}
//               color="orange"
//               changeText="vs last month"
//             />
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <Card className="col-span-2">
//               <CardHeader>
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <CardTitle>Sales Overview</CardTitle>
//                     <CardDescription>
//                       {timeRange === 'week' ? 'Weekly' : 'Monthly'} sales performance
//                     </CardDescription>
//                   </div>
//                   <Badge variant="outline" className="text-sm">
//                     {timeRange === 'week' ? 'This Week' : 'This Month'}
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-[300px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     {timeRange === 'week' ? (
//                       <BarChart
//                         data={weeklyData}
//                         margin={{
//                           top: 5,
//                           right: 30,
//                           left: 20,
//                           bottom: 5,
//                         }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Tooltip
//                           contentStyle={{ backgroundColor: '#fff', borderRadius: '6px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
//                         />
//                         <Legend />
//                         <Bar dataKey="sales" fill="#3b82f6" name="Sales" radius={[4, 4, 0, 0]} />
//                         <Bar dataKey="visitors" fill="#8b5cf6" name="Visitors" radius={[4, 4, 0, 0]} />
//                       </BarChart>
//                     ) : (
//                       <LineChart
//                         data={salesData}
//                         margin={{
//                           top: 5,
//                           right: 30,
//                           left: 20,
//                           bottom: 5,
//                         }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Tooltip
//                           contentStyle={{ backgroundColor: '#fff', borderRadius: '6px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
//                         />
//                         <Legend />
//                         <Line type="monotone" dataKey="sales" stroke="#3b82f6" name="Sales" strokeWidth={2} />
//                         <Line type="monotone" dataKey="returns" stroke="#ef4444" name="Returns" strokeWidth={2} />
//                       </LineChart>
//                     )}
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Recent Activity</CardTitle>
//                 <CardDescription>Latest system events</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {[1, 2, 3, 4].map((item) => (
//                     <div key={item} className="flex items-start gap-3">
//                       <div className="bg-blue-100 p-2 rounded-full">
//                         <Bell className="h-4 w-4 text-blue-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium">New order received #{1000 + item}</p>
//                         <p className="text-xs text-gray-500">{item} hour{item !== 1 ? 's' : ''} ago</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Top Products</CardTitle>
//                 <CardDescription>Best selling items this month</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <RecentProducts />
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Engagement Metrics</CardTitle>
//                 <CardDescription>User interaction statistics</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div>
//                   <div className="flex justify-between mb-2">
//                     <span className="text-sm font-medium">View Rate</span>
//                     <span className="text-sm font-medium">{statistics.viewRate.toFixed(1)}%</span>
//                   </div>
//                   <Progress value={statistics.viewRate} className="h-2" />
//                 </div>
//                 <div>
//                   <div className="flex justify-between mb-2">
//                     <span className="text-sm font-medium">Engagement Rate</span>
//                     <span className="text-sm font-medium">{statistics.engagementRate.toFixed(1)}%</span>
//                   </div>
//                   <Progress value={statistics.engagementRate} className="h-2" />
//                 </div>
//                 <div>
//                   <div className="flex justify-between mb-2">
//                     <span className="text-sm font-medium">Weekly Sales</span>
//                     <span className="text-sm font-medium">{statistics.weeklySales} items</span>
//                   </div>
//                   <Progress value={(statistics.weeklySales / 50) * 100} className="h-2" />
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="analytics">
//           <div className="h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
//             <p className="text-gray-500">Analytics dashboard coming soon</p>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };
// const AddProductForm: React.FC<{
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: ProductFormData & { image?: File }) => Promise<void>;
// }> = ({ open, onClose, onSubmit }) => {
//   const [formData, setFormData] = useState<ProductFormData>({
//     title: '',
//     description: '',
//     price: 0,
//     stock: 0,
//     category: '',
//     brand: ''
//   });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
//     }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setImageFile(file);

//       // Create preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await onSubmit({
//         ...formData,
//         image: imageFile || undefined
//       });
//       onClose();
//       // Reset form after successful submission
//       setFormData({
//         title: '',
//         description: '',
//         price: 0,
//         stock: 0,
//         category: '',
//         brand: ''
//       });
//       setImageFile(null);
//       setImagePreview(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl min-w-[600px]">
//         <div className="p-8">
//           <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-6">Add New Product</h3>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-4">
//                 <div>
//                   <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//                     Product Title*
//                   </label>
//                   <Input
//                     type="text"
//                     name="title"
//                     id="title"
//                     required
//                     value={formData.title}
//                     onChange={handleChange}
//                     className="w-full"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                     Description*
//                   </label>
//                   <textarea
//                     name="description"
//                     id="description"
//                     rows={4}
//                     required
//                     value={formData.description}
//                     onChange={handleChange}
//                     className="mt-1 block w-full rounded-md border border-input shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 min-h-[120px]"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
//                       Price*
//                     </label>
//                     <Input
//                       type="number"
//                       name="price"
//                       id="price"
//                       min="0"
//                       step="0.01"
//                       required
//                       value={formData.price}
//                       onChange={handleChange}
//                       className="w-full"
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
//                       Stock*
//                     </label>
//                     <Input
//                       type="number"
//                       name="stock"
//                       id="stock"
//                       min="0"
//                       required
//                       value={formData.stock}
//                       onChange={handleChange}
//                       className="w-full"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
//                     Product Image
//                   </label>
//                   <div className="mt-1 flex flex-col items-center">
//                     {imagePreview ? (
//                       <>
//                         <div className="relative w-full h-48 rounded-md overflow-hidden border border-gray-300 mb-2">
//                           <img
//                             src={imagePreview}
//                             alt="Preview"
//                             className="w-full h-full object-contain"
//                           />
//                         </div>
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           onClick={() => {
//                             setImageFile(null);
//                             setImagePreview(null);
//                           }}
//                         >
//                           Remove Image
//                         </Button>
//                       </>
//                     ) : (
//                       <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-md bg-gray-50">
//                         <div className="flex items-center justify-center text-gray-400 mb-2">
//                           <svg
//                             className="h-12 w-12"
//                             stroke="currentColor"
//                             fill="none"
//                             viewBox="0 0 48 48"
//                             aria-hidden="true"
//                           >
//                             <path
//                               d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                               strokeWidth={2}
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         </div>
//                         <div className="flex text-sm text-gray-600">
//                           <label
//                             htmlFor="file-upload"
//                             className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
//                           >
//                             <span>Upload an image</span>
//                             <input
//                               id="file-upload"
//                               name="file-upload"
//                               type="file"
//                               accept="image/*"
//                               className="sr-only"
//                               onChange={handleImageChange}
//                             />
//                           </label>
//                           <p className="pl-1">or drag and drop</p>
//                         </div>
//                         <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
//                     Category*
//                   </label>
//                   <Input
//                     type="text"
//                     name="category"
//                     id="category"
//                     required
//                     value={formData.category}
//                     onChange={handleChange}
//                     className="w-full"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
//                     Brand (Optional)
//                   </label>
//                   <Input
//                     type="text"
//                     name="brand"
//                     id="brand"
//                     value={formData.brand || ''}
//                     onChange={handleChange}
//                     className="w-full"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={onClose}
//                 disabled={loading}
//                 className="px-6"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="px-6"
//               >
//                 {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
//                 Add Product
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AddPostForm: React.FC<{
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: PostFormData) => Promise<void>;
// }> = ({ open, onClose, onSubmit }) => {
//   const [formData, setFormData] = useState<PostFormData>({
//     title: '',
//     body: '',
//     tags: [],
//     published: true
//   });
//   const [tagInput, setTagInput] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleAddTag = () => {
//     if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         tags: [...prev.tags, tagInput.trim()]
//       }));
//       setTagInput('');
//     }
//   };

//   const handleRemoveTag = (tagToRemove: string) => {
//     setFormData(prev => ({
//       ...prev,
//       tags: prev.tags.filter(tag => tag !== tagToRemove)
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await onSubmit(formData);
//       onClose();
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
//         <div className="p-6">
//           <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Create New Post</h3>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//                 Post Title
//               </label>
//               <Input
//                 type="text"
//                 name="title"
//                 id="title"
//                 required
//                 value={formData.title}
//                 onChange={handleChange}
//                 className="mt-1"
//               />
//             </div>

//             <div>
//               <label htmlFor="body" className="block text-sm font-medium text-gray-700">
//                 Content
//               </label>
//               <textarea
//                 name="body"
//                 id="body"
//                 rows={6}
//                 required
//                 value={formData.body}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-md border border-input shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
//               />
//             </div>

//             <div>
//               <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
//                 Tags
//               </label>
//               <div className="mt-1 flex gap-2">
//                 <Input
//                   type="text"
//                   value={tagInput}
//                   onChange={(e) => setTagInput(e.target.value)}
//                   onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
//                   className="flex-1"
//                   placeholder="Add tag and press Enter"
//                 />
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={handleAddTag}
//                 >
//                   Add
//                 </Button>
//               </div>
//               {formData.tags.length > 0 && (
//                 <div className="mt-2 flex flex-wrap gap-2">
//                   {formData.tags.map(tag => (
//                     <Badge key={tag} className="flex items-center">
//                       {tag}
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveTag(tag)}
//                         className="ml-1 text-gray-400 hover:text-gray-600"
//                       >
//                         &times;
//                       </button>
//                     </Badge>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="published"
//                 name="published"
//                 checked={formData.published}
//                 onChange={(e) => setFormData(prev => ({
//                   ...prev,
//                   published: e.target.checked
//                 }))}
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
//                 Publish immediately
//               </label>
//             </div>

//             <div className="flex justify-end gap-3 pt-4">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={onClose}
//                 disabled={loading}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={loading}
//               >
//                 {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
//                 Create Post
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };


// const Dashboard: React.FC = () => {
//   const [selectedView, setSelectedView] = useState<string>('dashboard');
//   const [data, setData] = useState<Product[] | Post[] | Comment[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [mobileOpen, setMobileOpen] = useState<boolean>(false);
//   const [productFormOpen, setProductFormOpen] = useState(false);
//   const [postFormOpen, setPostFormOpen] = useState(false);
//   const itemsPerPage = 13;

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       let result: Product[] | Post[] | Comment[] = [];
//       if (selectedView === 'products') {
//         result = await productService.getAllProducts();
//       } else if (selectedView === 'posts') {
//         result = await postService.getAllPosts();
//       } else if (selectedView === 'comments') {
//         result = await commentService.getAllComments();
//       }
//       setData(result);
//     } catch (error) {
//       console.error('Failed to fetch data:', error);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddProduct = async () => {
//     try {
//       // Replace with your actual API call
//       // await productService.createProduct(productData);
//       fetchData(); // Refresh the data
//     } catch (error) {
//       console.error('Failed to add product', error);
//     }
//   };

//   const handleAddPost = async () => {
//     try {
//       // Replace with your actual API call
//       // await postService.createPost(postData);
//       fetchData(); // Refresh the data
//     } catch (error) {
//       console.error('Failed to add post', error);
//     }
//   };


//   useEffect(() => {
//     if (['products', 'posts', 'comments'].includes(selectedView)) {
//       fetchData();
//     } else {
//       setData([]);
//     }
//     setCurrentPage(1);
//   }, [selectedView]);

//   const filteredData = useMemo(() => {
//     if (!searchTerm) return data;
//     return data.filter((item) => {
//       if (selectedView === 'products') {
//         const product = item as Product;
//         return (
//           product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           product.category.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       } else if (selectedView === 'posts') {
//         const post = item as Post;
//         return (
//           post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           post.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
//         );
//       } else if (selectedView === 'comments') {
//         const comment = item as Comment;
//         return (
//           comment.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           (comment.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
//         );
//       }
//       return true;
//     });
//   }, [data, searchTerm, selectedView]);

//   const paginatedData = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filteredData.slice(startIndex, startIndex + itemsPerPage);
//   }, [filteredData, currentPage, itemsPerPage]);

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   return (
//     <div className="flex">
//       <Sidebar
//         selectedView={selectedView}
//         setSelectedView={setSelectedView}
//         mobileOpen={mobileOpen}
//         setMobileOpen={setMobileOpen}
//       />

//       <main className="lg:ml-72 w-full min-h-screen p-4 sm:p-8 bg-gray-50 overflow-auto">
//         <div className="lg:hidden mb-4 flex items-center justify-between">
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="shrink-0"
//                 onClick={() => setMobileOpen(true)}
//               >
//                 <Menu className="h-5 w-5" />
//               </Button>
//             </SheetTrigger>
//           </Sheet>
//           <h1 className="text-xl font-bold ml-2 capitalize">{selectedView}</h1>
//           <div className="w-8"></div> {/* Spacer for alignment */}
//         </div>

//         <AddProductForm
//           open={productFormOpen}
//           onClose={() => setProductFormOpen(false)}
//           onSubmit={handleAddProduct}
//         />

//         <AddPostForm
//           open={postFormOpen}
//           onClose={() => setPostFormOpen(false)}
//           onSubmit={handleAddPost}
//         />

//         {selectedView === 'dashboard' ? (
//           <DashboardStats />
//         ) : (
//           <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
//               <div>
//                 <h2 className="text-xl sm:text-2xl font-bold capitalize">{selectedView}</h2>
//                 <p className="text-sm text-gray-500">
//                   {selectedView === 'products' ? 'Manage your product inventory' :
//                     selectedView === 'posts' ? 'View and manage all posts' :
//                       selectedView === 'comments' ? 'Moderate user comments' : ''}
//                 </p>
//               </div>
//               <div className="flex gap-3">
//                 <div className="relative w-full md:w-64">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <Input
//                     placeholder={`Search ${selectedView}...`}
//                     className="pl-10"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>
//                 <Button
//                   className="hidden sm:flex bg-blue-600 hover:bg-blue-700"
//                   onClick={() => {
//                     if (selectedView === 'products') setProductFormOpen(true);
//                     if (selectedView === 'posts') setPostFormOpen(true);
//                   }}
//                 >
//                   <Plus size={16} className="mr-2" />
//                   Add New
//                 </Button>
//               </div>
//             </div>

//             {loading ? (
//               <div className="flex justify-center items-center h-64">
//                 <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
//               </div>
//             ) : (
//               <>
//                 {selectedView === 'products' ? (
//                   <ProductsTable data={paginatedData as Product[]} />
//                 ) : selectedView === 'posts' ? (
//                   <PostsTable data={paginatedData as Post[]} />
//                 ) : selectedView === 'comments' ? (
//                   <CommentsTable data={paginatedData as Comment[]} />
//                 ) : null}

//                 {totalPages > 1 && (
//                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 gap-4">
//                     <div className="text-sm text-gray-600">
//                       Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
//                       {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
//                       {filteredData.length} entries
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                         disabled={currentPage === 1}
//                       >
//                         <ChevronLeft size={16} className="mr-1" /> Previous
//                       </Button>
//                       <div className="flex items-center gap-1">
//                         {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                           let pageNum;
//                           if (totalPages <= 5) {
//                             pageNum = i + 1;
//                           } else if (currentPage <= 3) {
//                             pageNum = i + 1;
//                           } else if (currentPage >= totalPages - 2) {
//                             pageNum = totalPages - 4 + i;
//                           } else {
//                             pageNum = currentPage - 2 + i;
//                           }
//                           return (
//                             <Button
//                               key={pageNum}
//                               variant={currentPage === pageNum ? 'default' : 'outline'}
//                               size="sm"
//                               onClick={() => setCurrentPage(pageNum)}
//                             >
//                               {pageNum}
//                             </Button>
//                           );
//                         })}
//                         {totalPages > 5 && currentPage < totalPages - 2 && (
//                           <>
//                             <span className="px-2">...</span>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => setCurrentPage(totalPages)}
//                             >
//                               {totalPages}
//                             </Button>
//                           </>
//                         )}
//                       </div>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                         disabled={currentPage === totalPages}
//                       >
//                         Next <ChevronRight size={16} className="ml-1" />
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Dashboard;