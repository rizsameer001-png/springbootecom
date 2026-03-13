import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { formatPrice } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addItem } = useCartStore()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock === 0) return
    addItem(product)
    toast.success(`${product.name} added to cart!`)
  }

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null

  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50 aspect-square">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-800 font-medium text-sm px-3 py-1 rounded-full">Out of Stock</span>
            </div>
          )}
          {product.featured && (
            <span className="absolute top-2 right-2 bg-zulu-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1">{product.categoryName}</p>
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-zulu-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600">{product.rating?.toFixed(1)} ({product.reviewCount})</span>
            </div>
          )}

          {/* Price & Cart */}
          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="text-xs text-gray-400 line-through ml-1">{formatPrice(product.comparePrice)}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="p-2 bg-zulu-500 text-white rounded-lg hover:bg-zulu-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
