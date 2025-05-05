import  { useState } from 'react'
import { Link } from 'react-router-dom';

export default function Header() { 
      const [isMenuOpen, setIsMenuOpen] = useState(false);
    
  return ( 
          <header className="relative z-10 py-6 px-4 sm:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl sm:text-3xl font-serif tracking-wider">LUXE BEAUTÉ</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-8 items-center">
              <Link to="/" className="hover:text-pink-300 transition-colors">Home</Link>
              <Link to="/products" className="hover:text-pink-300 transition-colors">Products</Link> 
              <Link to="/login" className="hover:text-pink-300 transition-colors">Login</Link>
              <Link to="/cart" className="hover:text-pink-300 transition-colors flex items-center gap-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Cart</span>
              </Link>
            </nav>
    
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </header>
  )
}
