import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="bg-gray-50 text-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 via-teal-500 to-cyan-400 text-white">
        <div className="container mx-auto px-6 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                See the world clearer — stylishly.
              </h1>
              <p className="max-w-xl text-lg opacity-90 mb-6">
                At LensLogic we craft premium eyeglasses, sunglasses and contact lenses with
                precision optics and modern design. Comfort, clarity and confidence — all
                in one pair.
              </p>

              <div className="flex gap-3 flex-wrap">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-semibold rounded-md shadow hover:shadow-lg transition"
                >
                  Shop Glasses
                </Link>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-medium rounded-md hover:bg-white/10 transition"
                >
                  Contact Us
                </a>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              {/* Simple glasses illustration SVG */}
              <div className="bg-white/10 p-8 rounded-3xl shadow-xl">
                <svg width="320" height="220" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect rx="20" width="320" height="220" fill="white" opacity="0.03"/>
                  <g transform="translate(20,40)" stroke="white" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
                    <path d="M12 48c0-24 20-40 44-40s44 16 44 40" strokeOpacity="0.95"/>
                    <path d="M252 48c0-24-20-40-44-40s-44 16-44 40" strokeOpacity="0.95"/>
                    <rect x="72" y="33" width="80" height="30" rx="8" fill="white" opacity="0.06"/>
                    <path d="M100 48h20" strokeOpacity="0.9"/>
                    <line x1="0" y1="48" x2="16" y2="48" />
                    <line x1="304" y1="48" x2="288" y2="48" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-2">Precision Optics</h3>
            <p className="text-sm text-gray-600">High-quality lenses crafted for sharp, comfortable vision.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-2">Stylish Frames</h3>
            <p className="text-sm text-gray-600">A curated collection of frames to match your personality.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-2">Risk-free Try</h3>
            <p className="text-sm text-gray-600">Try at home and return within 30 days if you're not happy.</p>
          </div>
        </div>
      </section>

      {/* Stats / Why choose us */}
      <section className="bg-white border-t py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600">100k+</div>
              <div className="text-sm text-gray-600">Happy customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">4.9 ★</div>
              <div className="text-sm text-gray-600">Average product rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">30 days</div>
              <div className="text-sm text-gray-600">Free returns</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="container mx-auto px-6 py-12">
        <div className="bg-indigo-600 text-white rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-semibold">Need help finding the right pair?</h3>
            <p className="text-indigo-100 mt-2">Our specialists are happy to help — free consultation and lens recommendations.</p>
          </div>
          <div className="flex gap-3">
            <a href="mailto:support@lenslogic.example" className="px-5 py-3 bg-white text-indigo-700 rounded-md font-semibold">Email Us</a>
            <Link to="/shop" className="px-5 py-3 border border-white/30 rounded-md text-white">Browse Frames</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
