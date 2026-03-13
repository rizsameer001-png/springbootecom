import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { User, MapPin, Lock, Save } from 'lucide-react'
import api from '../../api'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, login } = useAuthStore()
  const [tab, setTab] = useState('profile')

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/api/user/profile').then(r => r.data),
  })

  const { register: regProfile, handleSubmit: handleProfile } = useForm({
    values: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phone: profile?.phone || '',
    },
  })

  const { register: regPwd, handleSubmit: handlePwd, reset: resetPwd } = useForm()

  const updateMutation = useMutation({
    mutationFn: (data) => api.put('/api/user/profile', data),
    onSuccess: () => toast.success('Profile updated!'),
    onError: () => toast.error('Update failed'),
  })

  const passwordMutation = useMutation({
    mutationFn: (data) => api.put('/api/user/change-password', data),
    onSuccess: () => { toast.success('Password changed!'); resetPwd() },
    onError: () => toast.error('Wrong current password'),
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'password', label: 'Password', icon: Lock },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">My Account</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        {tab === 'profile' && (
          <form onSubmit={handleProfile(d => updateMutation.mutate(d))} className="space-y-4">
            <h2 className="font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                <input {...regProfile('firstName')} className={ic} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                <input {...regProfile('lastName')} className={ic} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input value={profile?.email || ''} disabled className={`${ic} bg-gray-50 text-gray-500 cursor-not-allowed`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
              <input {...regProfile('phone')} placeholder="+1 (555) 000-0000" className={ic} />
            </div>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 bg-zulu-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-zulu-700 disabled:opacity-60 transition-colors"
            >
              <Save size={15} /> {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}

        {tab === 'address' && (
          <form
            onSubmit={handleProfile(d => updateMutation.mutate({ address: d }))}
            className="space-y-4"
          >
            <h2 className="font-semibold text-gray-900 mb-4">Default Shipping Address</h2>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Street</label>
              <input
                defaultValue={profile?.defaultAddress?.street}
                {...regProfile('street')}
                className={ic}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                <input defaultValue={profile?.defaultAddress?.city} {...regProfile('city')} className={ic} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                <input defaultValue={profile?.defaultAddress?.state} {...regProfile('state')} className={ic} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">ZIP Code</label>
                <input defaultValue={profile?.defaultAddress?.zipCode} {...regProfile('zipCode')} className={ic} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Country</label>
                <input defaultValue={profile?.defaultAddress?.country} {...regProfile('country')} className={ic} />
              </div>
            </div>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 bg-zulu-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-zulu-700 disabled:opacity-60"
            >
              <Save size={15} /> {updateMutation.isPending ? 'Saving...' : 'Save Address'}
            </button>
          </form>
        )}

        {tab === 'password' && (
          <form
            onSubmit={handlePwd(d => passwordMutation.mutate(d))}
            className="space-y-4"
          >
            <h2 className="font-semibold text-gray-900 mb-4">Change Password</h2>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Current Password</label>
              <input type="password" {...regPwd('currentPassword', { required: true })} className={ic} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" {...regPwd('newPassword', { required: true, minLength: 6 })} className={ic} />
            </div>
            <button
              type="submit"
              disabled={passwordMutation.isPending}
              className="flex items-center gap-2 bg-zulu-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-zulu-700 disabled:opacity-60"
            >
              <Lock size={15} /> {passwordMutation.isPending ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

const ic = 'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zulu-500'
