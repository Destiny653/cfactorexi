import { api } from './api';
import { Order } from '../types/dashboardTypes';

export const orderService = {
    async getAllOrders(): Promise<Order[]> {
        try {
            const response = await api.get('/carts');
            const carts = await response.data.carts || await response.data || [];

            return carts.map((cart: any) => ({
                id: cart.id || 0,
                products: (cart.products || []).map((product: any) => ({
                    _id: product._id || 0,
                    title: product.title || 'Unknown Product',
                    price: product.price || 0,
                    quantity: product.quantity || 1,
                    total: product.total || 0,
                    discountPercentage: product.discountPercentage || 0,
                    discountedTotal: product.discountedTotal || 0,
                    thumbnail: product.thumbnail || ''
                })),
                total: cart.total || 0,
                discountedTotal: cart.discountedTotal || 0,
                userId: cart.userId || 0,
                totalProducts: cart.totalProducts || 0,
                totalQuantity: cart.totalQuantity || 0,
                status: this.getValidStatus(cart.status),
                date: cart.date || new Date().toISOString()
            }));
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    getValidStatus(status: string): Order['status'] {
        const validStatuses: Order['status'][] = ['pending', 'shipped', 'delivered', 'cancelled'];
        return validStatuses.includes(status as any) ? status as Order['status'] : 'pending';
    },

    async getOrderById(id: number): Promise<Order> {
        try {
            const response = await api.get(`/carts/${id}`); // Note the endpoint change to /carts
            const cart = response.data;

            return {
                _id: cart._id,
                products: cart.products.map((product: any) => ({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    quantity: product.quantity,
                    total: product.total,
                    discountPercentage: product.discountPercentage,
                    discountedTotal: product.discountedTotal,
                    thumbnail: product.thumbnail
                })),
                total: cart.total,
                discountedTotal: cart.discountedTotal,
                userId: cart.userId,
                totalProducts: cart.totalProducts,
                totalQuantity: cart.totalQuantity,
                status: this.getRandomStatus(),
                date: new Date().toISOString()
            };
        } catch (error) {
            console.error(`Error fetching order ${id}:`, error);
            throw error;
        }
    },

    getRandomStatus(): Order['status'] {
        const statuses: Order['status'][] = ['pending', 'shipped', 'delivered', 'cancelled'];
        return statuses[Math.floor(Math.random() * statuses.length)];
    }
};