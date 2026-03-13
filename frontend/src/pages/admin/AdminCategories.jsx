import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import { categoryApi } from '../../api'
import { PageLoader } from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function AdminCategories() {
  const [showForm, setShowForm] = useState(false)
  const [editingCat, setEditingCat] = useState(null)
  const qc = useQueryClient()

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories-admin'],
    queryFn: () => categoryApi.getAll().then(r => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryApi.delete(id),
    onSuccess: () => { qc.invalidateQueries(['categories-admin']); toast.success('Category deleted') },
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => { setEditingCat(null); setShowForm(true) }}
          className="flex items-center gap-2 bg-zulu-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-zulu-700"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {isLoading ? <PageLoader /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">/{cat.slug}</p>
                  {cat.description && <p className="text-sm text-gray-600 mt-2">{cat.description}</p>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingCat(cat); setShowForm(true) }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(cat.id) }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${cat.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {cat.active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-500">Order: {cat.sortOrder}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <CategoryFormModal
          category={editingCat}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); qc.invalidateQueries(['categories-admin']); qc.invalidateQueries(['categories']) }}
        />
      )}
    </div>
  )
}

function CategoryFormModal({ category, onClose, onSuccess }) {
  const isEdit = !!category
  const [form, setForm] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    sortOrder: category?.sortOrder || 0,
  })

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? categoryApi.update(category.id, data) : categoryApi.create(data),
    onSuccess: () => { toast.success(isEdit ? 'Updated!' : 'Created!'); onSuccess() },
    onError: (e) => toast.error(e.response?.data?.message || 'Error'),
  })

  const handleNameChange = (name) => {
    setForm({ ...form, name, slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-semibold">{isEdit ? 'Edit Category' : 'Add Category'}</h2>
          <button onClick={onClose}><X size={20} className="text-gray-500" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(form) }} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
            <input value={form.name} onChange={e => handleNameChange(e.target.value)} required className={ic} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Slug *</label>
            <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} required className={ic} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className={`${ic} resize-none`} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Sort Order</label>
            <input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: parseInt(e.target.value)})} className={ic} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border rounded-xl text-sm">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="flex-1 py-2.5 bg-zulu-600 text-white rounded-xl text-sm disabled:opacity-60">
              {mutation.isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ic = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zulu-500'
