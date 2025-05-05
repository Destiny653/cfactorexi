import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Product {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  shippingMethod: 'standard' | 'express';
  paymentMethod: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

interface CheckoutPageProps {
  cart?: Product[];
}

const CheckoutPage: React.FC<CheckoutPageProps> = ( ) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    shippingMethod: 'standard',
    paymentMethod: 'credit',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });

    const {
      cart, 
      cartTotal, 
    } = useCart(); 
  const shippingCost = formData.shippingMethod === 'express' ? 15 : 0;
  const total = cartTotal + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      alert('Order placed successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
        <Header/>
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {step >= 1 ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>1</span>
                  )}
                </div>
                <span className="text-xs mt-1">Information</span>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {step >= 2 ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>2</span>
                  )}
                </div>
                <span className="text-xs mt-1">Shipping</span>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {step >= 3 ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>3</span>
                  )}
                </div>
                <span className="text-xs mt-1">Payment</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                >
                  <h2 className="text-xl font-serif mb-6 text-indigo-900">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                >
                  <h2 className="text-xl font-serif mb-6 text-indigo-900">Shipping Information</h2>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Country</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="w-full bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      >
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className="w-full bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4 text-gray-800">Shipping Method</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-4 border border-gray-300 rounded hover:border-pink-500 cursor-pointer">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="standard"
                          checked={formData.shippingMethod === 'standard'}
                          onChange={handleChange}
                          className="text-pink-500 focus:ring-pink-500"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">Standard Shipping</p>
                          <p className="text-sm text-gray-500">Free - 5-7 business days</p>
                        </div>
                        <span className="text-gray-800">Free</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 border border-gray-300 rounded hover:border-pink-500 cursor-pointer">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="express"
                          checked={formData.shippingMethod === 'express'}
                          onChange={handleChange}
                          className="text-pink-500 focus:ring-pink-500"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">Express Shipping</p>
                          <p className="text-sm text-gray-500">2-3 business days</p>
                        </div>
                        <span className="text-gray-800">$15.00</span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                >
                  <h2 className="text-xl font-serif mb-6 text-indigo-900">Payment Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        required
                        className="w-full bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          required
                          className="w-full bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">CVC</label>
                        <input
                          type="text"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleChange}
                          placeholder="123"
                          required
                          className="w-full bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-between">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 transition text-gray-700"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all text-white"
                >
                  {step < 3 ? 'Continue to Shipping' : 'Complete Order'}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-serif mb-6 text-indigo-900">Order Summary</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {(cart || []).map(item => (
                  <div key={item._id} className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        className="w-12 h-12 object-cover rounded border border-gray-200"
                      />
                      <div>
                        <p className="text-sm text-gray-800">{item.title}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-gray-800">${(item.price * (item.quantity ?? 0)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4 mt-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-4">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="font-medium text-indigo-900">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default CheckoutPage;