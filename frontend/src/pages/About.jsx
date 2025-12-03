import React from "react";
import { Link } from "react-router-dom";
import {
  Eye, Shield, Truck, Star, Users, Award, Clock,
  MapPin, Mail, Phone, ArrowRight, CheckCircle,
  Target, Lightbulb, Heart
} from "lucide-react";

const About = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section className="pt-0 py-0 md:pt-0 pb-16 md:pb-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container-optic">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{ backgroundColor: 'var(--accent-yellow)', color: 'var(--text-primary)' }}
              >
                <Eye className="w-4 h-4" />
                Since {new Date().getFullYear()}
              </div>

              <h1 className="text-optic-heading text-4xl md:text-5xl lg:text-6xl leading-tight" style={{ color: 'var(--text-primary)' }}>
                See the world{" "}
                <span style={{ color: 'var(--accent-yellow)' }}>
                  clearer
                </span>{" "}
                — stylishly.
              </h1>
              <p className="text-optic-body text-lg md:text-xl leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                At LensLogic we craft premium eyeglasses, sunglasses and contact
                lenses with precision optics and modern design. Comfort, clarity
                and confidence — all in one pair.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/shop"
                  className="btn-primary"
                >
                  Shop Glasses
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#contact"
                  className="btn-secondary"
                >
                  Contact Us
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5" style={{ color: 'var(--accent-yellow)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>100k+ Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" style={{ color: 'var(--accent-yellow)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Award Winning</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="p-8 rounded-3xl shadow-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <img
                    src="https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762756168/women_1262x519_xsp8do.webp"
                    alt="Sunglasses Banner"
                    width={400}
                    height={280}
                    className="object-cover rounded-lg shadow-md w-full"
                  />
                </div>

                {/* Floating Labels */}
                <div className="absolute -top-4 -right-4 px-4 py-2 rounded-full font-bold shadow-lg"
                  style={{ backgroundColor: 'var(--accent-yellow)', color: 'var(--text-primary)' }}
                >
                  Premium Quality
                </div>
                <div className="absolute -bottom-4 -left-4 px-4 py-2 rounded-full font-bold shadow-lg"
                  style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-secondary)' }}
                >
                  Trusted Brand
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container-optic">
          <div className="text-center mb-16">
            <h2 className="text-optic-heading text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: 'var(--text-primary)' }}>
              Why Choose LensLogic?
            </h2>
            <p className="text-optic-body text-lg md:text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              We're dedicated to providing exceptional eyewear solutions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <div className="card-optic p-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: 'var(--accent-yellow)' }}
                >
                  <Eye className="w-8 h-8" style={{ color: 'var(--text-primary)' }} />
                </div>
                <h3 className="text-optic-heading text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Precision Optics</h3>
                <p className="text-optic-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  High-quality lenses crafted with advanced technology for sharp, comfortable vision.
                </p>
              </div>
            </div>
            <div className="group">
              <div className="card-optic p-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: 'var(--accent-yellow)' }}
                >
                  <Shield className="w-8 h-8" style={{ color: 'var(--text-primary)' }} />
                </div>
                <h3 className="text-optic-heading text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Stylish Frames</h3>
                <p className="text-optic-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  A curated collection of trendy frames to match your personality.
                </p>
              </div>
            </div>
            <div className="group">
              <div className="card-optic p-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: 'var(--accent-yellow)' }}
                >
                  <Heart className="w-8 h-8" style={{ color: 'var(--text-primary)' }} />
                </div>
                <h3 className="text-optic-heading text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Risk-free Try</h3>
                <p className="text-optic-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  30-day risk-free trial. Your satisfaction is our priority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--accent-yellow)' }}>
        <div className="container-optic">
          <div className="text-center mb-12">
            <h2 className="text-optic-heading text-3xl md:text-4xl mb-4" style={{ color: 'var(--text-primary)' }}>Our Impact in Numbers</h2>
            <p className="text-optic-body text-lg" style={{ color: 'var(--text-secondary)' }}>Trusted by thousands of happy customers</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-optic-heading text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>100k+</div>
              <div className="text-optic-body" style={{ color: 'var(--text-secondary)' }}>Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-optic-heading text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>4.9 ★</div>
              <div className="text-optic-body" style={{ color: 'var(--text-secondary)' }}>Average Rating</div>
            </div>
            <div className="space-y-2">
              <div className="text-optic-heading text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>500+</div>
              <div className="text-optic-body" style={{ color: 'var(--text-secondary)' }}>Products</div>
            </div>
            <div className="space-y-2">
              <div className="text-optic-heading text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>30</div>
              <div className="text-optic-body" style={{ color: 'var(--text-secondary)' }}>Day Returns</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-16 md:py-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container-optic">
          <div className="rounded-3xl p-12 lg:p-16 shadow-2xl" style={{ backgroundColor: 'var(--text-primary)' }}>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-optic-heading text-3xl md:text-4xl" style={{ color: 'var(--bg-secondary)' }}>
                  Need help finding the right pair?
                </h3>
                <p className="text-optic-body text-lg md:text-xl leading-relaxed" style={{ color: 'var(--bg-secondary)' }}>
                  Our specialists are happy to help — free consultation and lens recommendations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:support@lenslogic.example"
                    className="btn-secondary"
                  >
                    <Mail className="w-5 h-5" />
                    Email Us
                  </a>
                  <Link
                    to="/shop"
                    className="btn-accent"
                  >
                    Browse Frames
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'var(--accent-yellow)' }}
                  >
                    <Phone className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <h4 className="text-optic-heading text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Call Us</h4>
                  <p className="text-optic-body" style={{ color: 'var(--text-secondary)' }}>+91 98765 43210</p>
                  <p className="text-optic-body text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Mon-Sat, 9AM-6PM</p>
                </div>
                <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'var(--accent-yellow)' }}
                  >
                    <MapPin className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <h4 className="text-optic-heading text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Visit Us</h4>
                  <p className="text-optic-body" style={{ color: 'var(--text-secondary)' }}>Multiple Locations</p>
                  <p className="text-optic-body text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Across India</p>
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