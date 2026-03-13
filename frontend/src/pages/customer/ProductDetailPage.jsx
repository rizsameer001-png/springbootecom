import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ShoppingCart, Star, ArrowLeft, Package, Truck, Shield, Minus, Plus } from 'lucide-react'
import { productApi } from '../../api'
import { useCartStore } from '../../store/cartStore'
import { formatPrice } from '../../utils/helpers'
import { PageLoader } from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addItem } = useCartStore()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getById(id).then(r => r.data),
  })

  if (isLoading) return <PageLoader />
  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <p className="text-red-500">Product not found</p>
      <Link to="/products" className="text-zulu-600 mt-2 block">← Back to products</Link>
    </div>
  )

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/products" className="flex items-center gap-2 text-sm text-gray-600 hover:text-zulu-600 mb-6">
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3">
            <img
              src={product.images?.[selectedImage] || 'https://via.placeholder.com/600x600?text=No+Image'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-zulu-500' : 'border-gray-200'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-zulu-600 font-medium mb-2">{product.categoryName}</p>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={16} className={s <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
              <span className="text-sm text-gray-600">{product.rating?.toFixed(1)} ({product.reviewCount} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-xl text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
            )}
            {discount && (
              <span className="bg-red-100 text-red-700 text-sm font-bold px-2 py-0.5 rounded-full">-{discount}%</span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Details */}
          {product.details && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Specifications</h3>
              <dl className="grid grid-cols-2 gap-2">
                {Object.entries(product.details).map(([key, val]) =>
                  val ? (
                    <div key={key}>
                      <dt className="text-xs text-gray-500 capitalize">{key}</dt>
                      <dd className="text-sm font-medium text-gray-900">{val}</dd>
                    </div>
                  ) : null
                )}
              </dl>
            </div>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <Package size={16} className={product.stock > 0 ? 'text-green-500' : 'text-red-500'} />
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity & Cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 font-medium min-w-[40px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-zulu-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-zulu-700 transition-colors"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
          )}

          {/* Trust badges */}
          <div className="flex gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Truck size={16} className="text-zulu-500" />
              Free shipping over $50
            </div>
            <div className="flex items-center gap-1.5">
              <Shield size={16} className="text-zulu-500" />
              Secure checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
