import { Link } from 'react-router-dom'
import { Store, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-zulu-500 rounded-lg flex items-center justify-center">
                <Store size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">ZuluGshop</span>
            </div>
            <p className="text-sm leading-relaxed">
              Your premier destination for quality products. Shop with confidence.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-white mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-zulu-400 transition-colors">All Products</Link></li>
              <li><Link to="/products?featured=true" className="hover:text-zulu-400 transition-colors">Featured</Link></li>
              <li><Link to="/cart" className="hover:text-zulu-400 transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-white mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-zulu-400 transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-zulu-400 transition-colors">Register</Link></li>
              <li><Link to="/orders" className="hover:text-zulu-400 transition-colors">My Orders</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail size={14} /> support@zulugshop.com</li>
              <li className="flex items-center gap-2"><Phone size={14} /> +1 (555) 000-0000</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> New York, USA</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© 2024 ZuluGshop. Built with Spring Boot & React.</p>
        </div>
      </div>
    </footer>
  )
}
