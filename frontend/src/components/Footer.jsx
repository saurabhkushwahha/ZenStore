import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-emerald-400 text-xl font-semibold mb-4">Zenstore</h2>
            <p className="text-sm text-gray-400 tracking-wide">
              Discover eco-friendly and stylish fashion that cares for the planet and elevates your lifestyle.
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-emerald-400 mb-4">Customer Service</h3>
            <ul className="text-sm space-y-2">
              <li><a href="/contact" className="hover:text-emerald-400">Contact Us</a></li>
              <li><a href="/faq" className="hover:text-emerald-400">FAQ</a></li>
              <li><a href="/returns" className="hover:text-emerald-400">Return Policy</a></li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="text-lg font-semibold text-emerald-400 mb-4">About Us</h3>
            <ul className="text-sm space-y-2">
              <li><a href="/about" className="hover:text-emerald-400">Our Story</a></li>
              <li><a href="/sustainability" className="hover:text-emerald-400">Sustainability</a></li>
              <li><a href="/careers" className="hover:text-emerald-400">Careers</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-emerald-400 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="hover:text-emerald-400"><FaFacebook size={24} /></a>
              <a href="https://twitter.com" className="hover:text-emerald-400"><FaTwitter size={24} /></a>
              <a href="https://instagram.com" className="hover:text-emerald-400"><FaInstagram size={24} /></a>
              <a href="https://linkedin.com" className="hover:text-emerald-400"><FaLinkedin size={24} /></a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm border-t border-gray-700 pt-6">
          &copy; {new Date().getFullYear()} Zenstore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
