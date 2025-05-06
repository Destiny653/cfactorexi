import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../services/productService';
import { toast } from 'sonner';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Footer from '../components/Footer';
import Header from '../components/Header';

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    discountPercentage?: number;
    images: string[];
    thumbnail: string;
    availabilityStatus: string;
}

const HomePage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    console.log(products)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const fetchedProducts = await productService.getAllProducts();
                setProducts(fetchedProducts);
                setFeaturedProducts(
                    [...fetchedProducts]
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 4)
                );
            } catch (err) {
                toast.error('Failed to load products');
            }
        };

        fetchProducts();
    }, []);

    const heroImages = [
        {
            url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
            title: 'Luxury Beauty Collection',
            subtitle: 'Discover our premium selection of beauty products'
        },
        {
            url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            title: 'New Arrivals',
            subtitle: 'Explore our latest additions to the collection'
        },
        {
            url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1588&q=80',
            title: 'Special Offers',
            subtitle: 'Limited time discounts on selected items'
        }
    ];

    const brandLogos = [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/NARS_Logo.svg/2560px-NARS_Logo.svg.png',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/MAC_Cosmetics_logo.svg/1200px-MAC_Cosmetics_logo.svg.png',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Estee_Lauder_logo.svg/2560px-Estee_Lauder_logo.svg.png',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Clinique_logo.svg/1200px-Clinique_logo.svg.png',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Charlotte_Tilbury_logo.svg/1200px-Charlotte_Tilbury_logo.svg.png'
    ];

    const beautyTips = [
        {
            image: 'https://images.unsplash.com/photo-1526758097130-bab247274f58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1588&q=80',
            title: 'Skincare Routine',
            description: 'Discover the perfect skincare routine for your skin type'
        },
        {
            image: 'https://images.unsplash.com/photo-1596704017256-e0ef4a2e4a54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
            title: 'Makeup Trends',
            description: 'Explore the latest makeup trends for this season'
        },
        {
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            title: 'Hair Care',
            description: 'Professional tips for maintaining healthy hair'
        }
    ];

    return (
        <div className="min-h-screen bg-white text-gray-800 overflow-hidden">
            <Header />

            {/* Hero Carousel */}
            <div className="relative">
                <Carousel
                    showArrows={true}
                    infiniteLoop={true}
                    showThumbs={false}
                    showStatus={false}
                    autoPlay={true}
                    interval={5000}
                    transitionTime={800}
                    className="shadow-xl"
                >
                    {heroImages.map((slide, index) => (
                        <div key={index} className="relative h-[70vh] max-h-[800px]">
                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20"></div>
                            <img
                                src={slide.url}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center px-4 text-white max-w-4xl mx-auto">
                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6 }}
                                        className="text-4xl sm:text-6xl font-serif mb-6 font-bold"
                                    >
                                        {slide.title}
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                        className="text-xl sm:text-2xl mb-8 font-light"
                                    >
                                        {slide.subtitle}
                                    </motion.p>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                    >
                                        <Link
                                            to="/products"
                                            className="inline-block px-10 py-4 bg-gradient-to-r from-pink-600 to-purple-700 rounded-full font-medium hover:shadow-2xl hover:shadow-pink-500/40 transition-all text-white text-lg"
                                        >
                                            Shop Now
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>

            {/* Brand Showcase */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h3 className="text-center text-gray-500 uppercase text-sm tracking-wider mb-8">Trusted By Premium Brands</h3>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                        {brandLogos.map((logo, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="opacity-70 hover:opacity-100 transition-opacity"
                            >
                                <img
                                    src={logo}
                                    alt={`Brand ${index + 1}`}
                                    className="h-12 object-contain" 
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 px-4 sm:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-serif text-gray-900 mb-4">Featured Products</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Discover our carefully curated selection of premium beauty products
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map(product => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all"
                            >
                                <Link to={`/products/${product._id}`} className="block group">
                                    <div className="relative h-72 overflow-hidden">
                                        <img
                                            src={product.thumbnail}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {product.discountPercentage && (
                                            <div className="absolute top-4 right-4 bg-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                                -{Math.round(product.discountPercentage)}%
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-medium mb-2 text-gray-900 group-hover:text-pink-600 transition-colors">{product.title}</h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="text-xl font-semibold text-indigo-900">${product.price.toFixed(2)}</span>
                                                {product.discountPercentage && (
                                                    <span className="text-sm line-through text-gray-500 ml-2">
                                                        ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                            <span className={`text-xs px-2.5 py-1 rounded-full ${product.availabilityStatus === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {product.availabilityStatus}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-center mt-16">
                        <Link
                            to="/products"
                            className="inline-flex items-center px-8 py-3 border-2 border-indigo-900 rounded-full font-medium hover:bg-indigo-900 hover:text-white transition-all text-indigo-900 group"
                        >
                            View All Products
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Beauty Tips Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-serif text-gray-900 mb-4">Beauty Tips & Trends</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Expert advice to help you look and feel your best
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {beautyTips.map((tip, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                            >
                                <div className="relative h-60 overflow-hidden">
                                    <img
                                        src={tip.image}
                                        alt={tip.title}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-medium mb-2 text-gray-900">{tip.title}</h3>
                                    <p className="text-gray-600 mb-4">{tip.description}</p>
                                    <Link
                                        to="/blog"
                                        className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium"
                                    >
                                        Read More
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
                    <h2 className="text-4xl font-serif text-gray-900 mb-12">What Our Customers Say</h2>
                    <div className="relative">
                        <div className="absolute -top-8 -left-8 text-8xl text-gray-100 font-serif">"</div>
                        <blockquote className="text-xl text-gray-600 italic mb-8 relative z-10">
                            "The quality of these products exceeded my expectations. My skin has never looked better since I started using this brand."
                        </blockquote>
                        <div className="flex items-center justify-center gap-4">
                            <img
                                src="https://randomuser.me/api/portraits/women/43.jpg"
                                alt="Customer"
                                className="w-12 h-12 rounded-full object-cover border-2 border-pink-200"
                            />
                            <div className="text-left">
                                <p className="font-medium text-gray-900">Sarah Johnson</p>
                                <p className="text-sm text-gray-500">Verified Customer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-20 bg-gradient-to-r from-indigo-900 to-purple-800 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
                    <h2 className="text-4xl font-serif mb-6">Join Our Beauty Community</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Subscribe to receive exclusive offers, beauty tips, and early access to new products
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 justify-center">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-1 max-w-md bg-white/10 border border-white/20 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-white/70"
                            required
                        />
                        <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                        >
                            Subscribe
                        </button>
                    </form>
                    <p className="text-sm mt-4 text-white/70">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HomePage;