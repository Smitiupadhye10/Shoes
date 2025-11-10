import React from "react";
import { Link } from "react-router-dom";
import {
  Eye, Shield, Truck, Star, Users, Award, Clock,
  MapPin, Mail, Phone, ArrowRight, CheckCircle,
  Target, Lightbulb, Heart
} from "lucide-react";

const About = () => {
  return (
    <div className="bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-20 right-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative container mx-auto px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                <Eye className="w-4 h-4" />
                Since 2020
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
                See the world{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400">
                  clearer
                </span>{" "}
                — stylishly.
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                At LensLogic we craft premium eyeglasses, sunglasses and contact
                lenses with precision optics and modern design. Comfort, clarity
                and confidence — all in one pair.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Shop Glasses
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Contact Us
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-400" />
                  <span className="text-sm">100k+ Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Award Winning</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm p-12 rounded-3xl shadow-2xl">
                  <img
                    src="https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762756168/women_1262x519_xsp8do.webp"
                    alt="Sunglasses Banner"
                    width={400}
                    height={280}
                    className="object-cover rounded-lg shadow-md"
                  />

                </div>

                {/* Floating Labels */}
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg animate-bounce">
                  Premium Quality
                </div>
                <div className="absolute -bottom-4 -left-4 bg-green-400 text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg">
                  Trusted Brand
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose LensLogic?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're dedicated to providing exceptional eyewear solutions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 bg-sky-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Precision Optics</h3>
                <p className="text-gray-600 leading-relaxed">
                  High-quality lenses crafted with advanced technology for sharp, comfortable vision.
                </p>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Stylish Frames</h3>
                <p className="text-gray-600 leading-relaxed">
                  A curated collection of trendy frames to match your personality.
                </p>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Risk-free Try</h3>
                <p className="text-gray-600 leading-relaxed">
                  30-day risk-free trial. Your satisfaction is our priority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-sky-600 to-indigo-600">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Impact in Numbers</h2>
            <p className="text-sky-100 text-lg">Trusted by thousands of happy customers</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-5xl font-bold text-white">100k+</div>
              <div className="text-sky-100">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-white">4.9 ★</div>
              <div className="text-sky-100">Average Rating</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-white">500+</div>
              <div className="text-sky-100">Products</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-white">30</div>
              <div className="text-sky-100">Day Returns</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-sky-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-sky-600 to-indigo-600 rounded-3xl p-12 lg:p-16 shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-4xl font-bold text-white">
                  Need help finding the right pair?
                </h3>
                <p className="text-xl text-white/90 leading-relaxed">
                  Our specialists are happy to help — free consultation and lens recommendations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:support@lenslogic.example"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-sky-700 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg"
                  >
                    <Mail className="w-5 h-5" />
                    Email Us
                  </a>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
                  >
                    Browse Frames
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Call Us</h4>
                  <p className="text-white/80">+91 98765 43210</p>
                  <p className="text-white/60 text-sm mt-1">Mon-Sat, 9AM-6PM</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Visit Us</h4>
                  <p className="text-white/80">Multiple Locations</p>
                  <p className="text-white/60 text-sm mt-1">Across India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;