import { useQuery } from '@tanstack/react-query'
import { Package, ShoppingCart, Users, TrendingUp, Clock, CheckCircle, Truck } from 'lucide-react'
import { adminApi, orderApi } from '../../api'
import { PageLoader } from '../../components/common/LoadingSpinner'

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
    </div>
    <p className="text-3xl font-bold text-gray-900 mb-1">{value ?? '—'}</p>
    <p className="text-sm font-medium text-gray-600">{title}</p>
    {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
  </div>
)

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi.getDashboardStats().then(r => r.data),
  })

  const { data: recentOrders } = useQuery({
    queryKey: ['admin-recent-orders'],
    queryFn: () => orderApi.adminGetAll({ page: 0, size: 5 }).then(r => r.data),
  })

  if (isLoading) return <PageLoader />

  const statCards = [
    { title: 'Total Products', value: stats?.totalProducts, icon: Package, color: 'bg-blue-500' },
    { title: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'bg-purple-500' },
    { title: 'Pending Orders', value: stats?.pendingOrders, icon: Clock, color: 'bg-yellow-500' },
    { title: 'Delivered Orders', value: stats?.deliveredOrders, icon: CheckCircle, color: 'bg-green-500' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome to ZuluGshop Admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Order status breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-5">Order Status Overview</h2>
          <div className="space-y-3">
            {[
              { label: 'Pending', value: stats?.pendingOrders || 0, color: 'bg-yellow-400', icon: Clock },
              { label: 'Confirmed', value: stats?.confirmedOrders || 0, color: 'bg-blue-400', icon: CheckCircle },
              { label: 'Delivered', value: stats?.deliveredOrders || 0, color: 'bg-green-400', icon: Truck },
            ].map(({ label, value, color, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <Icon size={14} className="text-gray-500" />
                <span className="text-sm text-gray-700 flex-1">{label}</span>
                <span className="font-bold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-5">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders?.content?.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{order.userName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">${order.total?.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            )) || <p className="text-sm text-gray-500">No orders yet</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
