import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Order } from '../../types/dashboardTypes';
import { Badge } from '../ui/badge';
import { Package, Truck, Check, X, CreditCard, MapPin } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

const statusIcons = {
  pending: <Package className="h-4 w-4 mr-1" />,
  processing: <Package className="h-4 w-4 mr-1" />,
  shipped: <Truck className="h-4 w-4 mr-1" />,
  delivered: <Check className="h-4 w-4 mr-1" />,
  cancelled: <X className="h-4 w-4 mr-1" />
};

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ open, onOpenChange, order }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Order Details #{order._id}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Customer Information
            </h3>
            {order.user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <img 
                      src={order.user.avatar || '/default-avatar.png'} 
                      alt={order.user.name}
                      className="h-10 w-10 rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{order.user.name}</p>
                    <p className="text-sm text-gray-500">{order.user.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p>No customer information available</p>
            )}

            <div className="space-y-2">
              <h4 className="font-medium">Shipping Address</h4>
              <p className="text-sm">
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Order Summary
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className="inline-flex items-center">
                  {statusIcons[order.status as keyof typeof statusIcons]}
                  {order.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium capitalize">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Shipping Method</p>
                <p className="font-medium capitalize">{order.shippingMethod}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>-${order.discountTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Order Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item:any) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.thumbnail || '/default-product.png'} 
                        alt={item.title}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium">{item.title}</p>
                        {item.discountPercentage > 0 && (
                          <span className="text-xs text-green-600">
                            {item.discountPercentage}% off
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    ${((item.price * item.quantity) * (1 - (item.discountPercentage || 0) / 100)).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;