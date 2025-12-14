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
          <ul className="space-y-2 text-sm">
            <li><Link to="/category/eyeglasses" className="hover:text-white">Eyeglasses</Link></li>
            <li><Link to="/category/sunglasses" className="hover:text-white">Sunglasses</Link></li>
            <li><Link to="/category/computer-glasses" className="hover:text-white">Computer Glasses</Link></li>
            <li><Link to="/category/contact-lenses" className="hover:text-white">Contact Lenses</Link></li>
          </ul>
        </div>

        {/* --- Contact Info --- */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Get in Touch</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><MapPin size={16}/> Office No. 618, Gera Imperium Rise, Hinjawadi Phase II </li>
            <li className="flex items-center gap-2"><Phone size={16}/> +91 75583 38015</li>
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
      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Glasses Store. All Rights Reserved.  
      </div>
    </footer>
  );
};

export default Footer;
