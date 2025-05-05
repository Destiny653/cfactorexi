import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import Footer from '../components/Footer';
import Header from '../components/Header';

interface Product {
    category: string;
    _id: string;
    title: string;
    description: string;
    price: number;
    discountPercentage?: number;
    availabilityStatus: string;
    rating: number;
    brand: string;
    stock: number;
    sku: string;
    thumbnail: string;
    images: string[];
    tags: string;
    published: string;
    reviews: {
        reviewerName: string;
        rating: number;
        comment: string;
        date: string;
    }[];
}

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                if (!id) {
                    throw new Error('No product ID provided');
                }

                const fetchedProduct = await productService.getProductById(id);
                setProduct(fetchedProduct);
                setError(null);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to load product details');
                toast.error('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;

        if (quantity > product.stock) {
            toast.error(`Only ${product.stock} items available in stock`);
            return;
        }

        setIsAddingToCart(true);
        try {
            addToCart({
                _id: product._id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                stock: product.stock
            }, quantity);
            toast.success(`${quantity} ${product.title} added to cart`);
        } catch (error) {
            toast.error('Failed to add item to cart');
        } finally {
            setIsAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white text-gray-800">
                <div className="container mx-auto py-12 px-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
                    <p className="mt-4">Loading luxury item...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-white text-gray-800">
                <div className="container mx-auto py-12 px-4 text-center">
                    <svg className="w-12 h-12 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-4 text-xl">{error || 'Product not found'}</p>
                    <Link to="/" className="mt-4 inline-block px-6 py-2 bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors text-white">
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-800">
            <Header />
            <div className="container mx-auto py-12 px-4">
                <Link to="/products" className="inline-flex items-center text-indigo-600 mb-8 hover:text-pink-600 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Collection
                </Link>

                <div className="flex flex-col lg:flex-row gap-12 relative">
                    {/* Product Images */}
                    <div className="lg:w-1/2 h-fit sticky top-0 left-0">
                        <div className="mb-4 overflow-hidden rounded-xl border-2 border-gray-200">
                            <motion.img
                                key={selectedImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                src={product.images[selectedImage]}
                                alt={product.title}
                                className="w-full h-96 object-contain bg-gray-50"
                            />
                        </div>
                        <div className="flex gap-4 overflow-x-auto py-2">
                            {product.images.map((img, index) => (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`cursor-pointer flex-shrink-0 w-20 h-20 rounded border-2 ${selectedImage === index ? 'border-pink-500' : 'border-transparent'
                                        } overflow-hidden bg-gray-50`}
                                >
                                    <img
                                        src={img}
                                        alt={`${product.title} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="lg:w-1/2 space-y-6">
                        <h1 className="text-4xl font-serif text-indigo-900">{product.title}</h1>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                                            }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <span className="ml-2 text-sm text-gray-500">
                                    ({product.reviews.length} reviews)
                                </span>
                            </div>
                            <span
                                className={`text-sm px-2 py-1 rounded ${product.stock > 0
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                            >
                                {product.stock > 0
                                    ? `${product.stock} in stock`
                                    : 'Out of stock'}
                            </span>
                        </div>

                        <p className="text-xl text-gray-600">{product.description}</p>

                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-light text-indigo-900">${product.price.toFixed(2)}</span>
                            {product.discountPercentage && (
                                <span className="text-sm line-through text-gray-500">
                                    ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-300 rounded">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="px-3 py-1 text-xl hover:bg-gray-100 transition-colors text-gray-600"
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="px-4 py-1 text-gray-800">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="px-3 py-1 text-xl hover:bg-gray-100 transition-colors text-gray-600"
                                    disabled={quantity >= product.stock}
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0 || isAddingToCart}
                                className={`px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all text-white ${(product.stock <= 0 || isAddingToCart) ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isAddingToCart ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Adding...
                                    </span>
                                ) : (
                                    product.stock > 0 ? 'Add to Cart' : 'Out of Stock'
                                )}
                            </button>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-xl font-serif mb-4 text-indigo-900">Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Brand</p>
                                    <p className="text-gray-800">{product.brand}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Category</p>
                                    <p className="capitalize text-gray-800">{product.category}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">SKU</p>
                                    <p className="text-gray-800">{product.sku}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Availability</p>
                                    <p className="text-gray-800">{product.availabilityStatus}</p>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-xl font-serif mb-4 text-indigo-900">Customer Reviews</h3>
                            {product.reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {product.reviews.map((review, index) => (
                                        <div
                                            key={index}
                                            className="bg-gray-50 p-4 rounded-lg"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                                            }`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                                <span className="font-medium text-gray-800">{review.reviewerName}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{review.comment}</p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                {new Date(review.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No reviews yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetail;