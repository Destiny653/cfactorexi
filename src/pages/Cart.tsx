import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

interface CartPageProps {
  cart?: CartItem[];
  removeFromCart?: (id: string) => void;
  updateQuantity?: (id: string, quantity: number) => void;
}

const CartPage = ({  
}: CartPageProps): React.ReactElement => { 

  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal, 
  } = useCart();

  return (
    <div className="min-h-screen bg-white text-gray-800">
        <Header/>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-serif mb-8 text-indigo-900">Your Luxury Bag</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl mb-4">Your bag is empty</h2>
            <Link 
              to="/" 
              className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all text-white"
            >
              Discover Luxury
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200 hidden md:grid grid-cols-12 gap-4">
                  <div className="col-span-5 text-sm text-gray-600">Product</div>
                  <div className="col-span-2 text-sm text-gray-600">Price</div>
                  <div className="col-span-3 text-sm text-gray-600">Quantity</div>
                  <div className="col-span-2 text-sm text-gray-600 text-right">Total</div>
                </div>
                {cart.map(item => (
                  <motion.div 
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 border-b border-gray-200 last:border-0"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5 flex items-center gap-4">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title} 
                          className="w-20 h-20 object-cover rounded border border-gray-200"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-700">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="col-span-3">
                        <div className="flex items-center border border-gray-300 rounded w-24">
                          <button 
                            onClick={() => updateQuantity(item._id, (item.quantity ?? 0) - 1)}
                            className="px-2 py-1 hover:bg-gray-100 text-gray-600"
                          >
                            -
                          </button>
                          <span className="px-2 py-1 text-center text-gray-800">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, (item.quantity ?? 0) + 1)}
                            className="px-2 py-1 hover:bg-gray-100 text-gray-600"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="col-span-2 text-right">
                        <p className="text-gray-900">${(item.price * (item.quantity ?? 0)).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="text-sm text-pink-600 hover:text-pink-500 flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-serif mb-6 text-indigo-900">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">Free</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-4">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="font-medium text-indigo-900">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <Link 
                  to="/checkout"
                  className="mt-6 block w-full text-center px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all text-white"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer/>  
    </div>
  );
};

export default CartPage;