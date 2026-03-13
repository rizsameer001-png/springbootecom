import { useQuery } from '@tanstack/react-query'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts'
import { orderApi } from '../../api'
import { PageLoader } from '../../components/common/LoadingSpinner'

const STATUS_COLORS = {
  PENDING: '#f59e0b',
  CONFIRMED: '#3b82f6',
  SHIPPED: '#8b5cf6',
  DELIVERED: '#10b981',
  CANCELLED: '#ef4444',
}

export default function AdminAnalytics() {
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['admin-orders-all'],
    queryFn: () => orderApi.adminGetAll({ page: 0, size: 200 }).then(r => r.data),
  })

  if (isLoading) return <PageLoader />

  const orders = ordersData?.content || []

  // Status breakdown for pie chart
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {})
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

  // Revenue by day (last 14 days)
  const last14 = [...Array(14)].map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (13 - i))
    return d.toISOString().slice(0, 10)
  })

  const revenueByDay = last14.map(date => {
    const dayOrders = orders.filter(o => o.createdAt?.slice(0, 10) === date)
    return {
      date: date.slice(5),
      revenue: dayOrders.reduce((s, o) => s + (o.total || 0), 0),
      orders: dayOrders.length,
    }
  })

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0)
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-gray-900">Analytics</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, color: 'text-green-600' },
          { label: 'Total Orders', value: orders.length, color: 'text-blue-600' },
          { label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(2)}`, color: 'text-purple-600' },
          { label: 'Delivered', value: statusCounts['DELIVERED'] || 0, color: 'text-zulu-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-900 mb-5">Revenue — Last 14 Days</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={revenueByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, 'Revenue']} />
            <Bar dataKey="revenue" fill="#e16b09" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders per day */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-5">Orders — Last 14 Days</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status pie */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-5">Order Status Breakdown</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_COLORS[entry.name] || '#9ca3af'}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              No order data yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
