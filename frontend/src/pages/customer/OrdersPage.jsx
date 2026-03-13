import { useQuery } from '@tanstack/react-query'
import { Package, ChevronRight } from 'lucide-react'
import { orderApi } from '../../api'
import { formatPrice, formatDate, getOrderStatusColor } from '../../utils/helpers'
import { PageLoader } from '../../components/common/LoadingSpinner'

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderApi.getMyOrders().then(r => r.data),
  })

  const orders = data?.content || []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

      {isLoading ? (
        <PageLoader />
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <Package size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-600 font-medium">No orders yet</p>
          <p className="text-sm text-gray-400 mt-1">Place your first order to see it here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-50">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-mono font-bold text-gray-900">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getOrderStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img
                        src={item.productImage || 'https://via.placeholder.com/48?text=P'}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                      <p className="text-sm font-bold">{formatPrice(item.total)}</p>
                    </div>
                  ))}
                </div>
                {order.trackingNumber && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Tracking: <span className="font-mono font-medium">{order.trackingNumber}</span></p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
