import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Filter, Search } from 'lucide-react'
import { productApi, categoryApi } from '../../api'
import ProductCard from '../../components/common/ProductCard'
import { PageLoader } from '../../components/common/LoadingSpinner'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(0)

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')

  useEffect(() => {
    setPage(0)
  }, [search, category])

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', { page, search, category, sortBy, sortDir }],
    queryFn: () => productApi.getAll({ page, size: 12, search, category, sortBy, sortDir }).then(r => r.data),
    keepPreviousData: true,
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll().then(r => r.data),
  })

  const products = productsData?.content || []
  const totalPages = productsData?.totalPages || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Filter size={16} />
              Filters
            </h3>

            {/* Categories */}
            <div className="mb-6">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Category</p>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => { searchParams.delete('category'); setSearchParams(searchParams) }}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${!category ? 'bg-zulu-50 text-zulu-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    All Categories
                  </button>
                </li>
                {categories?.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => { searchParams.set('category', cat.id); setSearchParams(searchParams) }}
                      className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${category === cat.id ? 'bg-zulu-50 text-zulu-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sort */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Sort by</p>
              <select
                value={`${sortBy}-${sortDir}`}
                onChange={(e) => {
                  const [sb, sd] = e.target.value.split('-')
                  setSortBy(sb)
                  setSortDir(sd)
                }}
                className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-zulu-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display text-xl font-bold text-gray-900">
              {search ? `Results for "${search}"` : category ? categories?.find(c => c.id === category)?.name || 'Products' : 'All Products'}
            </h1>
            {productsData && (
              <span className="text-sm text-gray-500">{productsData.totalElements} products</span>
            )}
          </div>

          {isLoading ? (
            <PageLoader />
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
              <Search size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No products found</p>
              <p className="text-sm text-gray-400 mt-1">Try different filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`px-4 py-2 text-sm border rounded-lg transition-colors ${page === i ? 'bg-zulu-600 text-white border-zulu-600' : 'hover:bg-gray-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
