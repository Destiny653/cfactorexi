import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Order } from '../../types/dashboardTypes';
import { Badge } from '../ui/badge';
import { Package, Truck, Check, X, CreditCard, MapPin, Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'; 
import { Separator } from '../ui/separator';

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

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ open, onOpenChange, order }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] lg:max-w-[1200px] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="border-b pb-4 mb-6">
          <DialogTitle className="flex items-center gap-4 text-2xl">
            <CreditCard className="h-6 w-6 text-primary" />
            <span>Order #{order._id}</span>
            <Badge 
              className={`ml-auto ${statusColors[order.status as keyof typeof statusColors]} flex items-center px-3 py-1 text-sm`}
            >
              {statusIcons[order.status as keyof typeof statusIcons]}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Customer Information - Wider column */}
          <div className="xl:col-span-1 space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>Shipping Information</span>
              </h3>
              
              {order.user ? (
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={order.user.avatar || '/default-avatar.png'} 
                        alt={order.user.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-base">{order.user.name}</p>
                      <p className="text-sm text-muted-foreground">{order.user.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
                  No customer information available
                </p>
              )}

              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <h4 className="font-medium text-base mb-2">Shipping Address</h4>
                <address className="text-sm not-italic text-muted-foreground leading-relaxed">
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                  {order.shippingAddress.country}
                </address>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>Order Timeline</span>
              </h3>
              
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Order Date:</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-medium capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Shipping Method:</span>
                  <span className="font-medium capitalize">{order.shippingMethod}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary and Items - Wider main content area */}
          <div className="xl:col-span-3 space-y-8">
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="font-semibold text-xl mb-5">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-green-600">-${order.discountTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${
                    order.shippingMethod === 'express' ? 
                    '15.00' : 
                    '0.00'
                  }</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-4">Order Items ({order.items.length})</h3>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[400px] min-w-[400px] text-base">Product</TableHead>
                      <TableHead className="text-right text-base">Price</TableHead>
                      <TableHead className="text-right text-base">Qty</TableHead>
                      <TableHead className="text-right text-base">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item: any) => (
                      <TableRow key={item._id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <img 
                              src={item.thumbnail || '/default-product.png'} 
                              alt={item.title}
                              className="h-14 w-14 rounded-md object-cover border"
                            />
                            <div>
                              <p className="font-medium text-base">{item.title}</p>
                              {item.discountPercentage > 0 && (
                                <span className="text-sm text-green-600">
                                  {item.discountPercentage}% off
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-base">
                          ${item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-base">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right font-medium text-base">
                          ${((item.price * item.quantity) * 
                            (1 - (item.discountPercentage || 0) / 100)).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;