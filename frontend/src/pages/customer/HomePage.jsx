import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react'
import { productApi, categoryApi } from '../../api'
import ProductCard from '../../components/common/ProductCard'
import { PageLoader } from '../../components/common/LoadingSpinner'

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: ShieldCheck, title: 'Secure Payment', desc: '100% secure checkout' },
  { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
]

export default function HomePage() {
  const { data: featuredData, isLoading: loadingFeatured } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productApi.getFeatured().then(r => r.data),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll().then(r => r.data),
  })

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-zulu-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-zulu-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-zulu-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-block bg-zulu-500/20 text-zulu-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-zulu-500/30">
              🛍️ New Collection 2024
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
              Discover Premium Products at
              <span className="text-zulu-400"> Great Prices</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Shop thousands of quality products from electronics to fashion. Enjoy fast shipping, easy returns, and exceptional service.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="flex items-center gap-2 bg-zulu-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-zulu-600 transition-colors"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link
                to="/products?featured=true"
                className="flex items-center gap-2 bg-white/10 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
              >
                Featured Items
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-zulu-50 text-zulu-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:border-zulu-300 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-zulu-50 rounded-lg mx-auto mb-2 flex items-center justify-center text-2xl group-hover:bg-zulu-100 transition-colors">
                  {getCategoryEmoji(cat.slug)}
                </div>
                <p className="text-sm font-medium text-gray-900">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="flex items-center gap-1 text-sm text-zulu-600 font-medium hover:underline">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {loadingFeatured ? (
          <PageLoader />
        ) : featuredData && featuredData.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredData.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p>No featured products yet.</p>
            <Link to="/products" className="text-zulu-600 mt-2 block">Browse all products</Link>
          </div>
        )}
      </section>
    </div>
  )
}

function getCategoryEmoji(slug) {
  const emojis = {
    electronics: '💻',
    fashion: '👗',
    'home-living': '🏠',
    sports: '⚽',
    books: '📚',
  }
  return emojis[slug] || '🛍️'
}
