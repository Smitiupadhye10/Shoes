import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-8">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* --- Company Info --- */}
        <div>
          <div className="flex items-center mb-4">
            <Link to="/" className="flex items-center">
              <img 
                src="https://res.cloudinary.com/dfhjtmvrz/image/upload/v1765630473/file_00000000ac50720780542fa210dc5c8e_e0c5v4.png" 
                alt="LENS LOGIC" 
                className="h-14 md:h-16 lg:h-20 w-auto object-contain"
                style={{ maxWidth: '300px' }}
              />
            </Link>
          </div>
          <p className="text-sm leading-6">
            Discover premium eyeglasses, sunglasses, and contact lenses at unbeatable prices.
            Style your vision with the latest trends and comfort-focused designs.
          </p>
        </div>

        {/* --- Quick Links --- */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/shop" className="hover:text-white">Shop</Link></li>
          </ul>
        </div>

        {/* --- Product Categories --- */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <ul className="space-y-2">
              <li><Link to="/category/Eyeglasses" className="hover:text-white">Eyeglasses</Link></li>
              <li><Link to="/category/Sunglasses" className="hover:text-white">Sunglasses</Link></li>
              <li><Link to="/category/Computer%20Glasses" className="hover:text-white">Computer Glasses</Link></li>
              <li><Link to="/category/Contact%20Lenses" className="hover:text-white">Contact Lenses</Link></li>
              <li><Link to="/category/Accessories" className="hover:text-white">Accessories</Link></li>
            </ul>
            <ul className="space-y-2">
              <li><Link to="/category/Skincare" className="hover:text-white">Skincare</Link></li>
              <li><Link to="/category/Bags" className="hover:text-white">Bags</Link></li>
              <li><Link to="/category/Men's%20Shoes" className="hover:text-white">Men's Shoes</Link></li>
              <li><Link to="/category/Women's%20Shoes" className="hover:text-white">Women's Shoes</Link></li>
            </ul>
          </div>
        </div>

        {/* --- Contact Info --- */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Get in Touch</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><MapPin size={16}/> 1245 Fashion Street, Bandra West, Mumbai - 400050, Maharashtra, India</li>
            <li className="flex items-center gap-2"><Phone size={16}/> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Phone size={16}/> +91 87654 32109</li>
            <li className="flex items-center gap-2"><Mail size={16}/> support@lenslogic.com</li>
          </ul>

          <div className="flex gap-4 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white"><Facebook size={20}/></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white"><Instagram size={20}/></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white"><Twitter size={20}/></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white"><Youtube size={20}/></a>
          </div>
        </div>
      </div>

      {/* --- Bottom Bar --- */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} LensLogic. All Rights Reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/terms-of-service" className="text-gray-500 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/shipping-policy" className="text-gray-500 hover:text-white transition-colors">
                Shipping Policy
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/return-policy" className="text-gray-500 hover:text-white transition-colors">
                Return & Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
