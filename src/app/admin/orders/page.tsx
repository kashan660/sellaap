'use client';

import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '@/lib/actions/order';
import { retryCjFulfillment, refreshCjTracking } from '@/lib/actions/cj';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Search, Eye, ChevronDown, ChevronUp, Truck, RefreshCw } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [fulfilling, setFulfilling] = useState<number | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const result = await getOrders();
      if (result.success && result.orders) {
        setOrders(result.orders);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setUpdating(orderId);
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        setOrders(orders.map((o: any) => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleRetryFulfillment = async (orderId: number) => {
    setFulfilling(orderId);
    try {
      const result = await retryCjFulfillment(orderId);
      if (result.success) {
        loadOrders();
      } else {
        alert(result.error || 'Failed to submit order to CJ Dropshipping');
      }
    } finally {
      setFulfilling(null);
    }
  };

  const handleRefreshTracking = async (orderId: number) => {
    setFulfilling(orderId);
    try {
      const result = await refreshCjTracking(orderId);
      if (result.success) {
        loadOrders();
      } else {
        alert(result.error || 'Failed to fetch tracking');
      }
    } finally {
      setFulfilling(null);
    }
  };

  const filteredOrders = orders.filter((order: any) =>
    order.id.toString().includes(searchTerm) ||
    order.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage customer orders and payments.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No orders found.</p>
            ) : (
              filteredOrders.map((order: any) => (
                <div key={order.id} className="border rounded-lg overflow-hidden">
                  <div className="p-4 bg-white flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="font-mono text-sm font-bold">#{order.id}</div>
                      <div>
                        <div className="font-medium">{order.user?.name || 'Unknown User'}</div>
                        <div className="text-sm text-muted-foreground">{order.user?.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div>
                        <div className="text-sm text-muted-foreground">Date</div>
                        <div className="font-medium">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Total</div>
                        <div className="font-medium">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: order.currency }).format(order.total)}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">Payment</div>
                        <div className="font-medium uppercase text-sm">{order.paymentMethod || 'N/A'}</div>
                      </div>

                      <div>
                        <select
                          className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${getStatusColor(order.status)}`}
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          disabled={updating === order.id}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                        {updating === order.id && <Loader2 className="inline ml-2 h-3 w-3 animate-spin" />}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                      {expandedOrder === order.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="p-4 bg-muted/30 border-t">
                      <h4 className="font-semibold mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-sm p-2 bg-white rounded border">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.product.name}</span>
                              <span className="text-muted-foreground">x {item.quantity}</span>
                            </div>
                            <div className="font-mono">
                              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {(order.shippingAddress1 || order.cjOrderId) && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-semibold mb-3">Dropshipping Fulfillment</h4>
                          <div className="text-sm space-y-1 mb-3">
                            {order.shippingAddress1 && (
                              <div className="text-muted-foreground">
                                Ship to: {order.shippingName}, {order.shippingAddress1}
                                {order.shippingAddress2 ? `, ${order.shippingAddress2}` : ''}, {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}, {order.shippingCountry}
                              </div>
                            )}
                            <div>Fulfillment status: <span className="font-medium">{order.fulfillmentStatus}</span></div>
                            {order.cjOrderId && <div>CJ order id: <span className="font-mono">{order.cjOrderId}</span></div>}
                            {order.trackingNumber && (
                              <div>Tracking: <span className="font-mono">{order.trackingNumber}</span> ({order.trackingCarrier || 'unknown carrier'})</div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {order.fulfillmentStatus !== 'SHIPPED' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRetryFulfillment(order.id)}
                                disabled={fulfilling === order.id}
                              >
                                {fulfilling === order.id ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Truck className="w-3 h-3 mr-2" />}
                                Retry CJ fulfillment
                              </Button>
                            )}
                            {order.cjOrderId && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRefreshTracking(order.id)}
                                disabled={fulfilling === order.id}
                              >
                                {fulfilling === order.id ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <RefreshCw className="w-3 h-3 mr-2" />}
                                Refresh tracking
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
