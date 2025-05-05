import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  title: string;
  stock: number;
  price: number;
  thumbnail: string;
  quantity?: number;
  discountPercentage?: number;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  discountTotal: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          // Validate cart structure
          if (Array.isArray(parsedCart)) {
            setCart(parsedCart);
          } else {
            console.warn('Invalid cart data structure, resetting cart');
            localStorage.removeItem('cart');
          }
        }
      } catch (error) {
        console.error('Failed to load cart from localStorage', error);
        localStorage.removeItem('cart');
      } finally {
        setIsInitialized(true);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (quantity < 1) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      
      if (existingItem) {
        // Check stock availability
        const newQuantity = (existingItem.quantity || 1) + quantity;
        if (newQuantity > product.stock) {
          toast.error(`Only ${product.stock} items available in stock`);
          return prevCart;
        }

        toast.success(`Updated ${product.title} quantity to ${newQuantity}`);
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        if (quantity > product.stock) {
          toast.error(`Only ${product.stock} items available in stock`);
          return prevCart;
        }

        toast.success(`${product.title} added to cart`);
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const productToRemove = prevCart.find(item => item._id === productId);
      if (productToRemove) {
        toast.success(`${productToRemove.title} removed from cart`);
      }
      return prevCart.filter(item => item._id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const product = prevCart.find(item => item._id === productId);
      if (!product) return prevCart;

      if (quantity > product.stock) {
        toast.error(`Only ${product.stock} items available in stock`);
        return prevCart;
      }

      const updatedCart = prevCart.map(item =>
        item._id === productId ? { ...item, quantity } : item
      );
      const updatedItem = updatedCart.find(item => item._id === productId);
      if (updatedItem) {
        toast.success(`Updated ${updatedItem.title} quantity to ${quantity}`);
      }
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared');
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  const discountTotal = cart.reduce((total, item) => {
    const discount = item.discountPercentage || 0;
    return total + (item.price * (item.quantity || 1) * (discount / 100));
  }, 0);

  const cartTotal = subtotal - discountTotal;

  const itemCount = cart.reduce(
    (count, item) => count + (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        discountTotal,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};