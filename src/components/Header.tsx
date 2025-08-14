import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="relative z-20 bg-white text-gray-800 shadow-md">
            <div className="container mx-auto py-6 px-4 sm:px-8 flex justify-between items-center">
                <div className="flex items-center">
                    <Link to="/" className="text-2xl sm:text-3xl font-serif tracking-wider text-indigo-900">LUXE BEAUTÉ</Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-8 items-center text-lg font-medium">
                    <Link to="/" className="hover:text-pink-600 transition-colors">Home</Link>
                    <Link to="/products" className="hover:text-pink-600 transition-colors">Products</Link>
                    <Link to="/login" className="hover:text-pink-600 transition-colors">Login</Link>
                    <Link to="/cart" className="hover:text-pink-600 transition-colors flex items-center gap-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Cart</span>
                    </Link>
                </nav>

                {/* Mobile menu button */}
                <button
                    className="md:hidden text-indigo-900 focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <div
                className={`
                    absolute top-full left-0 w-full bg-white shadow-lg md:hidden 
                    transition-all duration-300 overflow-hidden
                    ${isMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}
                `}
            >
                <nav className="flex flex-col gap-4 py-4 px-8 text-lg">
                    <Link to="/" className="py-2 hover:text-pink-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/products" className="py-2 hover:text-pink-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Products</Link>
                    <Link to="/login" className="py-2 hover:text-pink-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Login</Link>
                    <Link to="/cart" className="py-2 hover:text-pink-600 transition-colors flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Cart</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}