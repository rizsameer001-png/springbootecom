import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { orderApi } from '../../api'
import { formatPrice, formatDate, getOrderStatusColor } from '../../utils/helpers'
import { PageLoader } from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function AdminOrders() {
  const [page, setPage] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page],
    queryFn: () => orderApi.adminGetAll({ page, size: 20 }).then(r => r.data),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => orderApi.updateStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries(['admin-orders'])
      toast.success('Order updated')
    },
  })

  const orders = data?.content || []

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-gray-900">Orders</h1>

      {isLoading ? <PageLoader /> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-gray-700 text-xs uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-mono font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{order.userName}</p>
                      <p className="text-xs text-gray-500">{order.userEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{order.items?.length} items</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateMutation.mutate({ id: order.id, status: e.target.value })}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-zulu-500"
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-xs text-zulu-600 hover:underline font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data?.totalPages > 1 && (
            <div className="px-4 py-3 border-t flex justify-between">
              <span className="text-sm text-gray-500">{data.totalElements} orders</span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(0,p-1))} disabled={page === 0} className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40">Prev</button>
                <button onClick={() => setPage(p => p+1)} disabled={page >= data.totalPages-1} className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  )
}

function OrderDetailModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="font-semibold text-gray-900">{order.orderNumber}</h2>
            <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
          </div>
          <button onClick={onClose}><X size={20} className="text-gray-500" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Customer</p>
              <p className="text-sm font-medium">{order.userName}</p>
              <p className="text-xs text-gray-500">{order.userEmail}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Shipping</p>
              {order.shippingAddress && (
                <p className="text-sm">{order.shippingAddress.street}, {order.shippingAddress.city}</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Items</p>
            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span>{item.productName} × {item.quantity}</span>
                  <span className="font-medium">{formatPrice(item.total)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 space-y-1">
            {[
              ['Subtotal', order.subtotal],
              ['Shipping', order.shipping],
              ['Tax', order.tax],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-600">{label}</span>
                <span>{formatPrice(val)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-base pt-1 border-t">
              <span>Total</span>
              <span className="text-zulu-600">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
