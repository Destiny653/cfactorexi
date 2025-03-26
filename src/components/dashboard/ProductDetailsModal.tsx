 // components/dashboard/ProductDetailsModal.tsx
import React from 'react';
import { X, Star, Package, Tag, Box, ShieldCheck, Truck, ChevronRight, Heart, Share2 } from 'lucide-react';
import { Button } from "../ui/button";
import { Product } from '../../types/dashboardTypes';
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  // Calculate discount price if available
  const originalPrice = product.discountPercentage 
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Header with close button */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-100 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-50 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
            {/* Product Images Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden group">
                <img
                  src={product.thumbnail || 'https://via.placeholder.com/600'}
                  alt={product.title}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white">
                    <Heart className="h-4 w-4 text-rose-500" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white">
                    <Share2 className="h-4 w-4 text-blue-500" />
                  </Button>
                </div>
              </div>

              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.slice(0, 4).map((img, index) => (
                    <div 
                      key={index} 
                      className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
                  <Badge variant="outline" className="text-sm font-medium">
                    {product.category}
                  </Badge>
                </div>
                
                <div className="flex items-center mt-2">
                  <div className="flex items-center mr-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-sm font-medium text-gray-700">
                      {product.rating?.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.reviews?.length || 0} reviews
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price?.toFixed(2)}
                  </span>
                  {originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      ${originalPrice}
                    </span>
                  )}
                  {product.discountPercentage && (
                    <Badge className="bg-green-100 text-green-800">
                      Save {product.discountPercentage}%
                    </Badge>
                  )}
                </div>
                
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Availability</span>
                      <span className={product.stock > 0 ? 'text-green-600 font-medium' : 'text-red-600'}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                    <Progress 
                      value={(product.stock / 100) * 100} 
                      className={product.stock > 0 ? "h-2 bg-green-500" : "h-2 bg-red-500"}
                    />
                  </div>
                </div>
              </div>
 
              {/* Description */}
              <div className="prose prose-sm text-gray-600">
                <p>{product.description}</p>
              </div>

              {/* Specifications */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 flex items-center">
                  <ChevronRight className="h-5 w-5 text-blue-500 mr-1" />
                  Specifications
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Brand</p>
                      <p className="font-medium">{product.brand || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Tag className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">SKU</p>
                      <p className="font-medium">{product.sku || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {product.weight && (
                    <div className="flex items-center">
                      <Box className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Weight</p>
                        <p className="font-medium">{product.weight} kg</p>
                      </div>
                    </div>
                  )}
                  
                  {product.dimensions && (
                    <div className="flex items-center">
                      <Box className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Dimensions</p>
                        <p className="font-medium">
                          {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Policies */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 flex items-center">
                  <ChevronRight className="h-5 w-5 text-blue-500 mr-1" />
                  Policies
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Truck className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Shipping</h4>
                        <p className="text-sm text-gray-600">
                          {product.shippingInformation || 'Standard shipping available'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Returns</h4>
                        <p className="text-sm text-gray-600">
                          {product.returnPolicy || '30 days return policy'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-900 flex items-center">
                    <ChevronRight className="h-5 w-5 text-blue-500 mr-1" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-sm font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
                <Button variant="outline">Write a Review</Button>
              </div>
              
              <div className="space-y-6">
                {product.reviews.map((review, index) => (
                  <div key={index} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{review.reviewerName}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;