import {  useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';  
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; 
import { orderService } from '../services/orderService';

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shippingAddress: ShippingAddress;
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'credit_card' | 'mobile_money';
}

interface MobileMoneyDetails {
  provider: 'mtn' | 'orange' | 'airtel';
  phoneNumber: string;
}
 

const CheckoutPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [paymentRedirect, setPaymentRedirect] = useState<string | null>(null);
  console.log('Payment Redirect:', paymentRedirect);
  console.log("User from checkout: ",user)

  if(cart.length == 0){
    navigate('/products')
  }
  
  const [formData, setFormData] = useState<FormData>({

    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    shippingAddress: {
      address: '',
      city: '',
      postalCode: '',
      country: 'US'
    },
    shippingMethod: 'standard',
    paymentMethod: 'credit_card'
  });

  const [mobileMoneyDetails, setMobileMoneyDetails] = useState<MobileMoneyDetails>({
    provider: 'mtn',
    phoneNumber: ''
  });

  const shippingCost = formData.shippingMethod === 'express' ? 15 : 0;
  const total = cartTotal + shippingCost;

  const { mutate: submitOrder, isPending: isSubmitting } = useMutation({
    mutationFn: async () => {
      if (formData.paymentMethod === 'mobile_money' && !mobileMoneyDetails.phoneNumber) {
        throw new Error('Please enter your mobile money phone number');
      }

      // Convert user id to string to meet the type requirement
      const orderData = {
        userId: user?.id ? user.id.toString() : '',
        items: cart.map(item => ({
          _id: item._id,
          name: item.title,
          price: item.price,
          quantity: item.quantity ?? 1, // default to 1 if undefined
          thumbnail: item.thumbnail,
          discountPercentage: item.discountPercentage ?? 0 // default to 0 if undefined
        })),
        shippingAddress: formData.shippingAddress,
        shippingMethod: formData.shippingMethod,
        paymentMethod: formData.paymentMethod,
        mobileMoneyDetails: formData.paymentMethod === 'mobile_money' ? mobileMoneyDetails : undefined
      };

      return await orderService.createOrder(orderData);
    },
    onSuccess: (data) => {
      if (data.paymentRedirect) {
        setPaymentRedirect(data.paymentRedirect);
        window.open(data.paymentRedirect, '_blank');
        clearCart();
      } else {
        clearCart();
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        navigate('/order-success', { state: { orderId: data.order._id } });
      }
    },
    onError: (error) => {
      console.error('Order submission failed:', error);
      alert(error.message || 'Order submission failed. Please try again.');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name in formData.shippingAddress) {
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    submitOrder();
  };

  const renderContactStep = () => (
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
  );

  const renderShippingStep = () => (
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
          value={formData.shippingAddress.address}
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
            value={formData.shippingAddress.city}
            onChange={handleChange}
            required
            className="w-full bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Country</label>
          <select
            name="country"
            value={formData.shippingAddress.country}
            onChange={handleChange}
            required
            className="w-full bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
          >
            <option value="US">United States</option>
            <option value="CM">Cameroon</option>
            <option value="NG">Nigeria</option>
            <option value="GH">Ghana</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={formData.shippingAddress.postalCode}
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
  );

  const renderPaymentStep = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
    >
      <h2 className="text-xl font-serif mb-6 text-indigo-900">Payment Method</h2>
      
      <div className="space-y-4">
        <label className="flex items-center gap-3 p-4 border border-gray-300 rounded hover:border-pink-500 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="credit_card"
            checked={formData.paymentMethod === 'credit_card'}
            onChange={handleChange}
            className="text-pink-500 focus:ring-pink-500"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-800">Credit Card</p>
            <p className="text-sm text-gray-500">Pay with Visa, Mastercard, etc.</p>
          </div>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </label>

        <label className="flex items-center gap-3 p-4 border border-gray-300 rounded hover:border-pink-500 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="mobile_money"
            checked={formData.paymentMethod === 'mobile_money'}
            onChange={handleChange}
            className="text-pink-500 focus:ring-pink-500"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-800">Mobile Money</p>
            <p className="text-sm text-gray-500">Pay with MTN, Orange, Airtel</p>
          </div>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </label>
      </div>

      {formData.paymentMethod === 'mobile_money' && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Mobile Network</label>
            <select
              value={mobileMoneyDetails.provider}
              onChange={(e) => setMobileMoneyDetails(prev => ({
                ...prev,
                provider: e.target.value as 'mtn' | 'orange' | 'airtel'
              }))}
              className="w-full bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
            >
              <option value="mtn">MTN Mobile Money</option>
              <option value="orange">Orange Money</option>
              <option value="airtel">Airtel Money</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
            <input
              type="tel"
              value={mobileMoneyDetails.phoneNumber}
              onChange={(e) => setMobileMoneyDetails(prev => ({
                ...prev,
                phoneNumber: e.target.value
              }))}
              placeholder="6XX XXX XXX"
              className="w-full bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>
        </div>
      )}

      {formData.paymentMethod === 'credit_card' && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">CVV</label>
              <input
                type="text"
                placeholder="123"
                className="w-full bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= stepNumber ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {step > stepNumber ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              <span className="text-xs mt-1">
                {stepNumber === 1 ? 'Information' : stepNumber === 2 ? 'Shipping' : 'Payment'}
              </span>
              {stepNumber < 3 && <div className="flex-1 h-px bg-gray-200"></div>}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && renderContactStep()}
              {step === 2 && renderShippingStep()}
              {step === 3 && renderPaymentStep()}

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
                  disabled={isSubmitting}
                  className={`ml-auto px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all text-white ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Processing...' : step < 3 ? 'Continue' : 'Complete Order'}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-serif mb-6 text-indigo-900">Order Summary</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cart.map((item: any) => (
                  <div key={item._id} className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.thumbnail} 
                        alt={`${item.title}`} 
                        className="w-12 h-12 object-cover rounded border border-gray-200"
                      />
                      <div>
                        <p className="text-sm text-gray-800">{item.title}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-gray-800">${(item.price * (Number(item.quantity) || 1)).toFixed(2)}</span>
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
      <Footer />
    </div>
  );
};

export default CheckoutPage;