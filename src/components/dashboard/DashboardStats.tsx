import React, { useState, useEffect } from 'react';
import {
    ShoppingCart, CreditCard, Users, BarChart2, Calendar, Clock, Bell, ChevronDown,
    Loader2
} from 'lucide-react';
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend
} from 'recharts';
import { productService } from '../../services/productService';
import { postService } from '../../services/postService';
import { commentService } from '../../services/commentService';
import StatCard from './StatCard';
import RecentProducts from './RecentProducts';
import { Statistics } from '../../types/dashboardTypes';

const DashboardStats: React.FC = () => {
    const [statistics, setStatistics] = useState<Statistics>({
        totalProducts: 0,
        totalPosts: 0,
        totalComments: 0,
        totalUsers: 0,
        productRevenue: 0,
        viewRate: 0,
        engagementRate: 0,
        monthlyGrowth: 0,
        weeklySales: 0
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [timeRange, setTimeRange] = useState<string>('week');

    // Mock sales data for the chart
    const salesData = [
        { name: 'Jan', sales: 4000, returns: 2400 },
        { name: 'Feb', sales: 3000, returns: 1398 },
        { name: 'Mar', sales: 2000, returns: 9800 },
        { name: 'Apr', sales: 2780, returns: 3908 },
        { name: 'May', sales: 1890, returns: 4800 },
        { name: 'Jun', sales: 2390, returns: 3800 },
        { name: 'Jul', sales: 3490, returns: 4300 },
    ];

    const weeklyData = [
        { name: 'Mon', sales: 1200, visitors: 800 },
        { name: 'Tue', sales: 1900, visitors: 1200 },
        { name: 'Wed', sales: 800, visitors: 500 },
        { name: 'Thu', sales: 1600, visitors: 1000 },
        { name: 'Fri', sales: 2400, visitors: 1500 },
        { name: 'Sat', sales: 1800, visitors: 900 },
        { name: 'Sun', sales: 2100, visitors: 1100 },
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [products, posts, comments] = await Promise.all([
                    productService.getAllProducts(),
                    postService.getAllPosts(),
                    commentService.getAllComments()
                ]); 
                
                setStatistics({
                    totalProducts: products?.length,
                    totalPosts: posts?.length,
                    totalComments: comments?.length,
                    totalUsers: 42, // Mock data
                    productRevenue: products?.reduce((sum: number, p: any) => sum + (p.price || 0), 0),
                    viewRate: posts?.length * 10,
                    engagementRate: comments?.length / (posts?.length || 1) * 100,
                    monthlyGrowth: 12.5,
                    weeklySales: 24
                });
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                    <p className="text-gray-500">Welcome back! Here's what's happening with your store.</p>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="hidden sm:flex">
                                <Calendar className="h-4 w-4 mr-2" />
                                {timeRange === 'week' ? 'Weekly' : 'Monthly'} View
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTimeRange('week')}>
                                Weekly
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTimeRange('month')}>
                                Monthly
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="sm">
                        <Clock className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="w-full overflow-x-auto">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            icon={ShoppingCart}
                            title="Total Products"
                            value={statistics.totalProducts}
                            trend={5}
                            color="blue"
                            changeText="vs last month"
                        />
                        <StatCard
                            icon={CreditCard}
                            title="Revenue"
                            value={`$${statistics.productRevenue.toLocaleString()}`}
                            trend={7}
                            color="green"
                            changeText="vs last month"
                        />
                        <StatCard
                            icon={Users}
                            title="Total Users"
                            value={statistics.totalUsers}
                            trend={3.2}
                            color="purple"
                            changeText="vs last month"
                        />
                        <StatCard
                            icon={BarChart2}
                            title="Monthly Growth"
                            value={`${statistics.monthlyGrowth}%`}
                            trend={statistics.monthlyGrowth}
                            color="orange"
                            changeText="vs last month"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="col-span-2">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>Sales Overview</CardTitle>
                                        <CardDescription>
                                            {timeRange === 'week' ? 'Weekly' : 'Monthly'} sales performance
                                        </CardDescription>
                                    </div>
                                    <Badge variant="outline" className="text-sm">
                                        {timeRange === 'week' ? 'This Week' : 'This Month'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        {timeRange === 'week' ? (
                                            <BarChart
                                                data={weeklyData}
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '6px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                                                />
                                                <Legend />
                                                <Bar dataKey="sales" fill="#3b82f6" name="Sales" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="visitors" fill="#8b5cf6" name="Visitors" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        ) : (
                                            <LineChart
                                                data={salesData}
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '6px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                                                />
                                                <Legend />
                                                <Line type="monotone" dataKey="sales" stroke="#3b82f6" name="Sales" strokeWidth={2} />
                                                <Line type="monotone" dataKey="returns" stroke="#ef4444" name="Returns" strokeWidth={2} />
                                            </LineChart>
                                        )}
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest system events</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3, 4].map((item) => (
                                        <div key={item} className="flex items-start gap-3">
                                            <div className="bg-blue-100 p-2 rounded-full">
                                                <Bell className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">New order received #{1000 + item}</p>
                                                <p className="text-xs text-gray-500">{item} hour{item !== 1 ? 's' : ''} ago</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Products</CardTitle>
                                <CardDescription>Best selling items this month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RecentProducts />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Engagement Metrics</CardTitle>
                                <CardDescription>User interaction statistics</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium">View Rate</span>
                                        <span className="text-sm font-medium">{statistics.viewRate.toFixed(1)}%</span>
                                    </div>
                                    <Progress value={statistics.viewRate} className="h-2" />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium">Engagement Rate</span>
                                        <span className="text-sm font-medium">{statistics.engagementRate.toFixed(1)}%</span>
                                    </div>
                                    <Progress value={statistics.engagementRate} className="h-2" />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium">Weekly Sales</span>
                                        <span className="text-sm font-medium">{statistics.weeklySales} items</span>
                                    </div>
                                    <Progress value={(statistics.weeklySales / 50) * 100} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="analytics">
                    <div className="h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Analytics dashboard coming soon</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DashboardStats;