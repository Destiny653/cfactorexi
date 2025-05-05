import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Product, productService } from '../services/productService';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const fetchedProducts = await productService.getAllProducts();
                setProducts(fetchedProducts);
                setError(null);

                // Calculate max price for range slider
                const maxPrice = Math.max(...fetchedProducts.map(p => p.price));
                setPriceRange([0, Math.ceil(maxPrice)]);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products');
                toast.error('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Get unique categories for filter
    const categories = ['all', ...new Set(products.map(product => product.category))];

    // Filter products based on all criteria
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        const matchesRating = selectedRating === null || Math.floor(product.rating) === selectedRating;

        return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });

    const handleAddToCart = (product: Product) => {
        try {
            addToCart({
                _id: product._id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                stock: product.stock
            }, 1);

            // Enhanced toast notification with product image
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
          max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <img
                                    className="h-10 w-10 rounded-md object-cover"
                                    src={product.thumbnail}
                                    alt={product.title}
                                />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                    Added to cart
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    {product.title}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-l border-gray-200">
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-pink-600 hover:text-pink-500 focus:outline-none"
                        >
                            Close
                        </button>
                    </div>
                </div>
            ));
        } catch (error) {
            toast.error('Failed to add item to cart');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white text-gray-800">
                <div className="container mx-auto py-12 px-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
                    <p className="mt-4">Loading luxury collection...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white text-gray-800">
                <div className="container mx-auto py-12 px-4 text-center">
                    <svg className="w-12 h-12 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-4 text-xl">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 inline-block px-6 py-2 bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors text-white"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-800">
            <Header />
            <div className="container mx-auto py-12 px-4 relative">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <h1 className="text-3xl font-serif text-indigo-900">Our Luxury Collection</h1>

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-1 focus:ring-pink-500"
                            />
                            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 relative">
                    {/* Sidebar Filters */}
                    <div className="lg:w-1/4 bg-white rounded-xl border border-gray-200 p-6 h-fit sticky left-0 top-0 shadow-sm">
                        <h2 className="text-xl font-serif mb-6 text-indigo-900">Filters</h2>

                        {/* Category Filter */}
                        <div className="mb-8">
                            <h3 className="text-lg font-medium mb-3">Categories</h3>
                            <div className="space-y-2">
                                {categories.map(category => (
                                    <label key={category} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={selectedCategory === category}
                                            onChange={() => setSelectedCategory(category)}
                                            className="text-pink-500 focus:ring-pink-500"
                                        />
                                        <span className="capitalize">{category}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div className="mb-8">
                            <h3 className="text-lg font-medium mb-3">Price Range</h3>
                            <div className="px-2">
                                <input
                                    type="range"
                                    min={priceRange[0]}
                                    max={priceRange[1]}
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between mt-2">
                                    <span>${priceRange[0]}</span>
                                    <span>${priceRange[1]}</span>
                                </div>
                            </div>
                        </div>

                        {/* Star Rating Filter */}
                        <div className="mb-8">
                            <h3 className="text-lg font-medium mb-3">Customer Rating</h3>
                            <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <label key={rating} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="rating"
                                            checked={selectedRating === rating}
                                            onChange={() => setSelectedRating(selectedRating === rating ? null : rating)}
                                            className="text-pink-500 focus:ring-pink-500"
                                        />
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                            <span className="text-xs text-gray-500 ml-1">& Up</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Reset Filters Button */}
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('all');
                                setPriceRange([0, Math.max(...products.map(p => p.price))]);
                                setSelectedRating(null);
                            }}
                            className="w-full px-4 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 transition-colors"
                        >
                            Reset All Filters
                        </button>
                    </div>

                    {/* Main Product Grid */}
                    <div className="lg:w-3/4">
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-20">
                                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h2 className="text-2xl mb-4">No products found</h2>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('all');
                                        setPriceRange([0, Math.max(...products.map(p => p.price))]);
                                        setSelectedRating(null);
                                    }}
                                    className="px-6 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 transition-colors"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map(product => (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        whileHover={{ y: -5 }}
                                        className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                                    >
                                        <Link to={`/products/${product._id}`} className="block">
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={product.thumbnail}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                                    loading="lazy"
                                                />
                                                {product.discountPercentage && (
                                                    <div className="absolute top-4 right-4 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                        -{Math.round(product.discountPercentage)}%
                                                    </div>
                                                )}
                                            </div>
                                        </Link>

                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <Link to={`/products/${product._id}`} className="hover:underline">
                                                    <h3 className="text-lg font-medium line-clamp-1 text-gray-900">{product.title}</h3>
                                                </Link>
                                                <span className={`text-xs px-2 py-1 rounded ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                                            <div className="flex items-center mb-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                                                            }`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                                <span className="text-xs text-gray-500 ml-1">({product.reviews.length})</span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className="text-xl font-light text-indigo-900">${product.price.toFixed(2)}</span>
                                                    {product.discountPercentage && (
                                                        <span className="text-sm line-through text-gray-500 ml-2">
                                                            ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={product.stock <= 0}
                                                    className={`p-2 rounded-full ${product.stock > 0
                                                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:shadow-pink-500/30 text-white'
                                                            : 'bg-gray-200 cursor-not-allowed text-gray-500'
                                                        } transition-all`}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default ProductsPage;