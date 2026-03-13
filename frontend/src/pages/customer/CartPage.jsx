import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { formatPrice } from '../../utils/helpers'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore()

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products to get started!</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-zulu-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-zulu-700 transition-colors"
        >
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">Shopping Cart ({items.length} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4">
              <img
                src={item.image || 'https://via.placeholder.com/80x80?text=No+Image'}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1">
                <Link to={`/products/${item.id}`} className="font-medium text-gray-900 hover:text-zulu-600 line-clamp-2">
                  {item.name}
                </Link>
                <p className="text-zulu-600 font-bold mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-gray-50"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="px-2 py-1 hover:bg-gray-50 disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-gray-700">{formatPrice(item.price * item.quantity)}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-auto text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd className="font-medium">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Shipping</dt>
                <dd className="font-medium">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Tax (8%)</dt>
                <dd className="font-medium">{formatPrice(tax)}</dd>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between text-base font-bold">
                <dt>Total</dt>
                <dd className="text-zulu-600">{formatPrice(total)}</dd>
              </div>
            </dl>

            {shipping > 0 && (
              <p className="text-xs text-gray-500 mt-3">
                Add {formatPrice(50 - subtotal)} more for free shipping!
              </p>
            )}

            <Link
              to="/checkout"
              className="block w-full text-center bg-zulu-600 text-white py-3.5 rounded-xl font-semibold hover:bg-zulu-700 transition-colors mt-6"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/products"
              className="block w-full text-center text-gray-600 py-2.5 text-sm hover:text-zulu-600 mt-2"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
