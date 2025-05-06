import { api } from './api';
import { Order } from '../types/dashboardTypes';

interface CreateOrderResponse {
    orderId: string;
    // add other fields if needed
}

interface OrderItem {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    thumbnail: string;
    discountPercentage?: number;
}

export const orderService = {
    async createOrder(orderData: {
        userId: string;
        items: OrderItem[];
        shippingAddress: {
            address: string;
            city: string;
            postalCode: string;
            country: string;
        };
        shippingMethod: string;
        paymentMethod: string;
    }): Promise<CreateOrderResponse> {
        try {
            const response = await api.post('/orders', orderData);
            return response.data;
        } catch (error) {
            console.error('Order creation failed:', error);
            throw error;
        }
    },

    async getAllOrders(): Promise<Order[]> {
        try {
            const response = await api.get('/orders');
            return response.data.map((order: any) => this.transformOrder(order));
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    async getOrderById(id: string): Promise<Order> {
        try {
            const response = await api.get(`/orders/${id}`);
            return this.transformOrder(response.data);
        } catch (error) {
            console.error(`Error fetching order ${id}:`, error);
            throw error;
        }
    },

    transformOrder(order: any): Order {
        return {
    _id: order._id,
    user: order.user ? {
        _id: order.user._id,
        name: order.user.name || `User ${order.user._id}`,
        email: order.user.email || '',
        avatar: order.user.avatar || ''
    } : null,
    items: order.items.map((item: any) => ({
        _id: item._id,
        title: item.name || item.title || 'Unknown Product',
        price: item.price || 0,
        quantity: item.quantity || 1,
        total: (item.price || 0) * (item.quantity || 1),
        discountPercentage: item.discountPercentage || 0,
        discountedTotal: item.discountedPrice ||
            (item.price || 0) * (item.quantity || 1) * (1 - (item.discountPercentage || 0) / 100),
        thumbnail: item.thumbnail || ''
    })),
    subtotal: order.subtotal || 0,
    discountTotal: order.discountTotal || 0,
    total: order.total || 0,
    shippingAddress: order.shippingAddress || {
        address: '',
        city: '',
        postalCode: '',
        country: ''
    },
    shippingMethod: order.shippingMethod || 'standard',
    paymentMethod: order.paymentMethod || 'unknown',
    status: this.getValidStatus(order.status),
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: order.updatedAt || new Date().toISOString(),
    products: undefined
};
    },

    getValidStatus(status: string): Order['status'] {
        const validStatuses: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        return validStatuses.includes(status as any) ? status as Order['status'] : 'pending';
    }
};