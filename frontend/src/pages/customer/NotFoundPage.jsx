import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="font-display text-9xl font-bold text-gray-100 select-none mb-4">404</div>
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-3">Page not found</h1>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 bg-zulu-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-zulu-700 transition-colors"
          >
            <Home size={18} /> Go Home
          </Link>
          <Link
            to="/products"
            className="flex items-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            <Search size={18} /> Browse Products
          </Link>
        </div>
      </div>
    </div>
  )
}
