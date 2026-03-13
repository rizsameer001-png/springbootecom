import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../api'
import { formatDate } from '../../utils/helpers'
import { PageLoader } from '../../components/common/LoadingSpinner'

export default function AdminUsers() {
  const [page, setPage] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => adminApi.getUsers({ page, size: 20 }).then(r => r.data),
  })

  const users = data?.content || []

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-gray-900">Users</h1>

      {isLoading ? <PageLoader /> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['User', 'Email', 'Roles', 'Status', 'Joined'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-gray-700 text-xs uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zulu-100 text-zulu-700 rounded-full flex items-center justify-center text-xs font-bold">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <span className="font-medium text-gray-900">{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map(role => (
                          <span key={role} className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            role === 'ROLE_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {role.replace('ROLE_', '')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data?.totalPages > 1 && (
            <div className="px-4 py-3 border-t flex justify-between">
              <span className="text-sm text-gray-500">{data.totalElements} users</span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(0,p-1))} disabled={page === 0} className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40">Prev</button>
                <button onClick={() => setPage(p => p+1)} disabled={page >= data.totalPages-1} className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
