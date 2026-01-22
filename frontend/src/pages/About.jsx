import React from "react";
import { Link } from "react-router-dom";
import {
  Footprints, Shield, Truck, Star, Users, Award, Clock,
  MapPin, Mail, Phone, ArrowRight, CheckCircle,
  Target, Lightbulb, Heart, Sparkles, Zap, ShoppingBag
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
                style={{ backgroundColor: 'var(--text-heading)', color: 'var(--bg-primary)' }}
              >
                <Footprints className="w-4 h-4" />
                Since {new Date().getFullYear()}
              </div>

              <h1 className="text-optic-heading text-4xl md:text-5xl lg:text-6xl leading-tight" style={{ color: 'var(--text-primary)' }}>
                Step into{" "}
                <span style={{ color: 'var(--text-heading)' }}>
                  style
                </span>{" "}
                — comfortably.
              </h1>
              <p className="text-optic-body text-lg md:text-xl leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                At Sole mate, we offer premium footwear for men, women, and kids. 
                From elegant heels to comfortable sneakers, we have the perfect pair 
                for every step of your journey. Quality, comfort, and style — all in one step.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/shop"
                  className="btn-primary"
                >
                  Shop Shoes
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
                  <Star className="w-5 h-5" style={{ color: 'var(--text-heading)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>100k+ Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" style={{ color: 'var(--text-heading)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Award Winning</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="p-8 rounded-3xl shadow-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <img
                    src="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1767696040/EDC0F91F-97FF-4715-81CD-E175A8CDE64E_1_201_a_nd6vfj.jpg"
                    alt="Shoes Collection"
                    width={400}
                    height={280}
                    className="object-cover rounded-lg shadow-md w-full"
                  />
                </div>

                {/* Floating Labels */}
                <div className="absolute -top-4 -right-4 px-4 py-2 rounded-full font-bold shadow-lg"
                  style={{ backgroundColor: 'var(--text-heading)', color: 'var(--bg-primary)' }}
                >
                  Premium Quality
                </div>
                <div className="absolute -bottom-4 -left-4 px-4 py-2 rounded-full font-bold shadow-lg"
                  style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}
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
              Why Choose Sole mate?
            </h2>
            <p className="text-optic-body text-lg md:text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              We're dedicated to providing exceptional footwear for the whole family
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <div className="card-optic p-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: 'var(--text-heading)' }}
                >
                  <Footprints className="w-8 h-8" style={{ color: 'var(--bg-primary)' }} />
                </div>
                <h3 className="text-optic-heading text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Premium Quality</h3>
                <p className="text-optic-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  High-quality materials and expert craftsmanship ensure durability and comfort in every step.
                </p>
              </div>
            </div>
            <div className="group">
              <div className="card-optic p-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: 'var(--text-heading)' }}
                >
                  <Sparkles className="w-8 h-8" style={{ color: 'var(--bg-primary)' }} />
                </div>
                <h3 className="text-optic-heading text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Stylish Designs</h3>
                <p className="text-optic-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  A curated collection of trendy shoes for men, women, and kids to match every style and occasion.
                </p>
              </div>
            </div>
            <div className="group">
              <div className="card-optic p-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: 'var(--text-heading)' }}
                >
                  <Heart className="w-8 h-8" style={{ color: 'var(--bg-primary)' }} />
                </div>
                <h3 className="text-optic-heading text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Easy Returns</h3>
                <p className="text-optic-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  30-day hassle-free returns. Your satisfaction is our priority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container-optic">
          <div className="text-center mb-16">
            <h2 className="text-optic-heading text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: 'var(--text-primary)' }}>
              Footwear for Everyone
            </h2>
            <p className="text-optic-body text-lg md:text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Discover our extensive collection of premium shoes for men, women, and kids
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Men's Shoes */}
            <Link 
              to="/category/Men's%20Shoes"
              className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1768803998/856c975f66ac7693d0b98710d84764d5_tytkqj.jpg"
                  alt="Men's Shoes"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white/20 backdrop-blur-sm"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    <Footprints className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Men's Shoes</h3>
                  <p className="text-white/90 text-sm">Formal, Sneakers, Boots, Loafers, Sandals & More</p>
                </div>
              </div>
              <div className="p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <p className="text-optic-body text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  From classic formal shoes to trendy sneakers, rugged boots, comfortable loafers, and casual sandals, find the perfect pair for every occasion.
                </p>
                <div className="mt-4 flex items-center gap-2 font-medium" style={{ color: 'var(--text-primary)' }}>
                  <span className="text-sm">Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Women's Shoes */}
            <Link 
              to="/category/Women's%20Shoes"
              className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1768804079/c6f3a08a4ecf9aadc2160080dcd405d0_sgouyc.jpg"
                  alt="Women's Shoes"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white/20 backdrop-blur-sm"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Women's Shoes</h3>
                  <p className="text-white/90 text-sm">Heels, Flats, Sneakers, Chappals & More</p>
                </div>
              </div>
              <div className="p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <p className="text-optic-body text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Elegant heels, comfortable flats, stylish sneakers, trendy boots, and casual chappals to complement your unique style.
                </p>
                <div className="mt-4 flex items-center gap-2 font-medium" style={{ color: 'var(--text-primary)' }}>
                  <span className="text-sm">Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Kids Shoes */}
            <Link 
              to="/category/Kids%20Shoes"
              className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1768804408/Kids_Sk8-Mid_Reissue_Hook_and_Loop_Shoes_4-8_Years_in_Green__Vans_UK_coxb35.jpg"
                  alt="Kids Shoes"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white/20 backdrop-blur-sm"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Kids Shoes</h3>
                  <p className="text-white/90 text-sm">Comfortable & Durable Designs</p>
                </div>
              </div>
              <div className="p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <p className="text-optic-body text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Durable, comfortable, and fun designs that keep up with your child's active lifestyle and growing feet.
                </p>
                <div className="mt-4 flex items-center gap-2 font-medium" style={{ color: 'var(--text-primary)' }}>
                  <span className="text-sm">Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container-optic">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{ backgroundColor: 'var(--text-heading)', color: 'var(--bg-primary)' }}
              >
                <Target className="w-4 h-4" />
                Our Mission
              </div>
              <h2 className="text-optic-heading text-3xl md:text-4xl lg:text-5xl" style={{ color: 'var(--text-primary)' }}>
                Quality Footwear for Every Step
              </h2>
              <p className="text-optic-body text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                At Sole mate, we believe that great shoes are the foundation of great style. We're committed to providing 
                high-quality footwear that combines comfort, durability, and fashion-forward designs for men, women, and children.
              </p>
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--text-heading)' }}
                  >
                    <CheckCircle className="w-5 h-5" style={{ color: 'var(--bg-primary)' }} />
                  </div>
                  <div>
                    <h4 className="text-optic-heading font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Premium Materials</h4>
                    <p className="text-optic-body text-sm" style={{ color: 'var(--text-secondary)' }}>
                      We source only the finest materials to ensure durability and comfort
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--text-heading)' }}
                  >
                    <CheckCircle className="w-5 h-5" style={{ color: 'var(--bg-primary)' }} />
                  </div>
                  <div>
                    <h4 className="text-optic-heading font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Family-Focused</h4>
                    <p className="text-optic-body text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Complete collections for men, women, and kids - one stop for the whole family
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--text-heading)' }}
                  >
                    <CheckCircle className="w-5 h-5" style={{ color: 'var(--bg-primary)' }} />
                  </div>
                  <div>
                    <h4 className="text-optic-heading font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Customer Satisfaction</h4>
                    <p className="text-optic-body text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Your happiness is our priority - easy returns and excellent customer service
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1768804817/Sandals_The_Whole_Fam_Will_Love_ds4rh1.jpg"
                  alt="Quality Footwear"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 px-6 py-4 rounded-2xl shadow-xl"
                style={{ backgroundColor: 'var(--text-primary)' }}
              >
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8" style={{ color: 'var(--bg-secondary)' }} />
                  <div>
                    <div className="text-lg font-bold" style={{ color: 'var(--bg-secondary)' }}>Award Winning</div>
                    <div className="text-sm" style={{ color: 'var(--bg-secondary)', opacity: 0.8 }}>Quality & Service</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--text-heading)' }}>
        <div className="container-optic">
          <div className="text-center mb-12">
            <h2 className="text-optic-heading text-3xl md:text-4xl mb-4" style={{ color: 'var(--bg-primary)' }}>Our Impact in Numbers</h2>
            <p className="text-optic-body text-lg" style={{ color: 'var(--bg-secondary)' }}>Trusted by thousands of happy customers</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-optic-heading text-4xl md:text-5xl font-bold" style={{ color: 'var(--bg-primary)' }}>100k+</div>
              <div className="text-optic-body" style={{ color: 'var(--bg-secondary)' }}>Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-optic-heading text-4xl md:text-5xl font-bold" style={{ color: 'var(--bg-primary)' }}>4.9 ★</div>
              <div className="text-optic-body" style={{ color: 'var(--bg-secondary)' }}>Average Rating</div>
            </div>
            <div className="space-y-2">
              <div className="text-optic-heading text-4xl md:text-5xl font-bold" style={{ color: 'var(--bg-primary)' }}>1000+</div>
              <div className="text-optic-body" style={{ color: 'var(--bg-secondary)' }}>Shoe Styles</div>
            </div>
            <div className="space-y-2">
              <div className="text-optic-heading text-4xl md:text-5xl font-bold" style={{ color: 'var(--bg-primary)' }}>30</div>
              <div className="text-optic-body" style={{ color: 'var(--bg-secondary)' }}>Day Returns</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-16 md:py-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container-optic">
          <div className="rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 shadow-2xl" style={{ backgroundColor: 'var(--text-primary)' }}>
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-optic-heading text-2xl sm:text-3xl md:text-4xl" style={{ color: 'var(--bg-secondary)' }}>
                  Need help finding the perfect pair?
                </h3>
                <p className="text-optic-body text-base sm:text-lg md:text-xl leading-relaxed" style={{ color: 'var(--bg-secondary)' }}>
                  Our specialists are happy to help — free consultation and size recommendations for men's, women's, and kids shoes.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a
                    href="mailto:support@solemate.in"
                    className="btn-secondary text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    Email Us
                  </a>
                  <Link
                    to="/shop"
                    className="btn-accent text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-center gap-2"
                  >
                    Browse Shoes
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="rounded-2xl p-4 sm:p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4"
                    style={{ backgroundColor: 'var(--text-heading)' }}
                  >
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--bg-primary)' }} />
                  </div>
                  <h4 className="text-optic-heading text-base sm:text-lg font-semibold mb-1.5 sm:mb-2" style={{ color: 'var(--text-primary)' }}>Call Us</h4>
                  <p className="text-optic-body text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>+91 98765 43210</p>
                  <p className="text-optic-body text-xs sm:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Mon-Sat, 9AM-6PM</p>
                </div>
                <div className="rounded-2xl p-4 sm:p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4"
                    style={{ backgroundColor: 'var(--text-heading)' }}
                  >
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--bg-primary)' }} />
                  </div>
                  <h4 className="text-optic-heading text-base sm:text-lg font-semibold mb-1.5 sm:mb-2" style={{ color: 'var(--text-primary)' }}>Visit Us</h4>
                  <p className="text-optic-body text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>Multiple Locations</p>
                  <p className="text-optic-body text-xs sm:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Across India</p>
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