import { api } from './api';
import { User } from '../types/dashboardTypes';

export const userService = {
    async getAllUsers(): Promise<User[]> {
        try {
            const response = await api.get('/users');
            // Add data validation
            const users = response.data.users || response.data || [];
            return users.map((user: any) => ({
                id: user.id,
                firstName: user.firstName || user.name?.first || '',
                lastName: user.lastName || user.name?.last || '',
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                image: user.image || '',
                address: {
                    city: user.address?.city || '',
                    state: user.address?.state || '',
                    ...user.address
                },
                company: user.company ? {
                    name: user.company.name || ''
                } : undefined,
                role: user.role || 'user'
            }));
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }
}