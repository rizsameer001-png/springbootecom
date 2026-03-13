import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Search, X } from 'lucide-react'
import { productApi, categoryApi } from '../../api'
import { formatPrice } from '../../utils/helpers'
import { PageLoader } from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const [page, setPage] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: () => productApi.adminGetAll({ page, size: 20 }).then(r => r.data),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll().then(r => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => productApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries(['admin-products'])
      toast.success('Product deleted')
    },
  })

  const products = data?.content || []

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = (id, name) => {
    if (confirm(`Delete "${name}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => { setEditingProduct(null); setShowForm(true) }}
          className="flex items-center gap-2 bg-zulu-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-zulu-700 transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {isLoading ? <PageLoader /> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-gray-700 text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0] || 'https://via.placeholder.com/40?text=P'}
                          className="w-10 h-10 rounded-lg object-cover"
                          alt=""
                        />
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                          {product.featured && (
                            <span className="text-xs text-zulu-600 font-medium">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{product.categoryName}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
                      {product.comparePrice && (
                        <span className="text-xs text-gray-400 line-through ml-1">{formatPrice(product.comparePrice)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${product.stock === 0 ? 'text-red-500' : product.stock < 10 ? 'text-yellow-600' : 'text-gray-900'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(product)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDelete(product.id, product.name)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data?.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm text-gray-500">{data.totalElements} products</span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page === 0} className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40">Prev</button>
                <button onClick={() => setPage(p => p+1)} disabled={page >= data.totalPages-1} className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <ProductFormModal
          product={editingProduct}
          categories={categories || []}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false)
            qc.invalidateQueries(['admin-products'])
          }}
        />
      )}
    </div>
  )
}

function ProductFormModal({ product, categories, onClose, onSuccess }) {
  const isEdit = !!product
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    comparePrice: product?.comparePrice || '',
    stock: product?.stock || 0,
    categoryId: product?.categoryId || categories[0]?.id || '',
    featured: product?.featured || false,
    images: product?.images?.join(',') || '',
    tags: product?.tags?.join(',') || '',
  })

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? productApi.update(product.id, data) : productApi.create(data),
    onSuccess: () => {
      toast.success(isEdit ? 'Product updated!' : 'Product created!')
      onSuccess()
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate({
      ...form,
      price: parseFloat(form.price),
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
      stock: parseInt(form.stock),
      images: form.images ? form.images.split(',').map(s => s.trim()) : [],
      tags: form.tags ? form.tags.split(',').map(s => s.trim()) : [],
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-semibold text-gray-900">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose}><X size={20} className="text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className={ic} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Price *</label>
              <input type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className={ic} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Compare Price</label>
              <input type="number" step="0.01" value={form.comparePrice} onChange={e => setForm({...form, comparePrice: e.target.value})} className={ic} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Stock *</label>
              <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required className={ic} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
              <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} required className={ic}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className={`${ic} resize-none`} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Image URLs (comma-separated)</label>
              <input value={form.images} onChange={e => setForm({...form, images: e.target.value})} className={ic} placeholder="https://..." />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className={ic} />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="accent-zulu-500 w-4 h-4" />
                <span className="text-sm text-gray-700">Featured product</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="flex-1 py-2.5 bg-zulu-600 text-white rounded-xl text-sm font-medium hover:bg-zulu-700 disabled:opacity-60">
              {mutation.isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ic = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zulu-500'
