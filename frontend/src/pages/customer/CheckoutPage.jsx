import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { orderApi } from '../../api'
import { useCartStore } from '../../store/cartStore'
import { formatPrice } from '../../utils/helpers'
import toast from 'react-hot-toast'

const schema = z.object({
  street: z.string().min(5, 'Street address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  zipCode: z.string().min(4, 'ZIP code required'),
  country: z.string().min(2, 'Country required'),
  paymentMethod: z.string(),
  notes: z.string().optional(),
})

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { country: 'US', paymentMethod: 'CASH_ON_DELIVERY' },
  })

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const createOrderMutation = useMutation({
    mutationFn: (data) => orderApi.create(data),
    onSuccess: (response) => {
      clearCart()
      toast.success('Order placed successfully!')
      navigate('/orders')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to place order')
    },
  })

  const onSubmit = (data) => {
    const orderData = {
      items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
      shippingAddress: {
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
      },
      paymentMethod: data.paymentMethod,
      notes: data.notes,
    }
    createOrderMutation.mutate(orderData)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Your cart is empty</p>
        <Link to="/products" className="text-zulu-600 mt-2 block">Start shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-5">Shipping Address</h2>
            <div className="space-y-4">
              <Field label="Street Address" error={errors.street}>
                <input {...register('street')} placeholder="123 Main Street" className={inputClass} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="City" error={errors.city}>
                  <input {...register('city')} placeholder="New York" className={inputClass} />
                </Field>
                <Field label="State" error={errors.state}>
                  <input {...register('state')} placeholder="NY" className={inputClass} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="ZIP Code" error={errors.zipCode}>
                  <input {...register('zipCode')} placeholder="10001" className={inputClass} />
                </Field>
                <Field label="Country" error={errors.country}>
                  <input {...register('country')} placeholder="US" className={inputClass} />
                </Field>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-5">Payment Method</h2>
            <div className="space-y-2">
              {[
                { value: 'CASH_ON_DELIVERY', label: '💵 Cash on Delivery' },
                { value: 'BANK_TRANSFER', label: '🏦 Bank Transfer' },
              ].map((method) => (
                <label key={method.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" value={method.value} {...register('paymentMethod')} className="accent-zulu-500" />
                  <span className="text-sm font-medium">{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-3">Order Notes</h2>
            <textarea
              {...register('notes')}
              placeholder="Special instructions for delivery..."
              className={`${inputClass} h-24 resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={createOrderMutation.isPending}
            className="w-full bg-zulu-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-zulu-700 disabled:opacity-60 transition-colors"
          >
            {createOrderMutation.isPending ? 'Placing Order...' : `Place Order • ${formatPrice(total)}`}
          </button>
        </form>

        {/* Order summary */}
        <div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-5">Order Summary</h2>
            <div className="space-y-3 mb-6 max-h-72 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image || 'https://via.placeholder.com/48?text=P'}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <dl className="space-y-2 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Shipping</dt>
                <dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Tax</dt>
                <dd>{formatPrice(tax)}</dd>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2 mt-2">
                <dt>Total</dt>
                <dd className="text-zulu-600">{formatPrice(total)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

const inputClass = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zulu-500 focus:border-transparent'

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
  )
}
