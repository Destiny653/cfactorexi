import React, { useState, useEffect } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Product } from '../../types/dashboardTypes';
import { productService } from '../../services/productService';

const RecentProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await productService.getAllProducts();
                setProducts(result.slice(0, 5));
            } catch (error) {
                console.error('Failed to fetch products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {products.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-10 h-10 rounded-md overflow-hidden border">
                        <img
                            src={product.thumbnail || 'https://via.placeholder.com/80'}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{product.title}</div>
                        <div className="text-sm text-gray-500 truncate">{product.category}</div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="font-semibold">${product.price?.toFixed(2) || '0.00'}</div>
                        <div className="flex items-center text-sm text-gray-500">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                            <span>{product.rating?.toFixed(1) || '0.0'}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecentProducts;