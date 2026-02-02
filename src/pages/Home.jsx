import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const categories = [
        { 
  name: 'CCTV Camera',
  icon: '/assets/icon3.png',
  description: 'High-definition surveillance cameras for 24/7 security monitoring in homes, offices, and enterprises.'
},

{ 
  name: 'DVR/NVR',
  icon: '/assets/icon1.png',
  description: 'Digital and Network Video Recorders for storing, managing, and reviewing CCTV footage efficiently.'
},

{ 
  name: 'CCTV Accessories',
  icon: '/assets/icon7.png',
  description: 'Complete range of CCTV accessories including cables, power adapters, mounts, and connectors.'
},

{ 
  name: 'Power Banks',
  icon: '/assets/icon4.png',
  description: 'Portable high-capacity power banks for reliable backup charging of mobile devices and gadgets.'
},

{ 
  name: 'Fingerprint Scanner',
  icon: '/assets/icon5.png',
  description: 'Biometric fingerprint scanners for secure authentication, attendance systems, and access control.'
},

{ 
  name: 'GPS Tracking System',
  icon: '/assets/icon6.png',
  description: 'Real-time GPS tracking solutions for vehicles, assets, and fleet management with live location updates.'
}

  ];

  const services = [
    {
      icon: '🛡️',
      title: '24/7 Security',
      description: 'Round-the-clock protection for your property'
    },
    {
      icon: '💰',
      title: 'Best Prices',
      description: 'Competitive pricing on all products'
    },
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Quick delivery to your doorstep'
    },
    {
      icon: '🔧',
      title: 'Expert Support',
      description: 'Professional support available'
    }
  ];

  return (
    <div className="w-full bg-white pt-0">
      {/* Hero Section - Figma Design */}
      <section className="relative bg-white py-8 sm:py-12 md:py-16 lg:py-10 px-4 sm:px-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div>
              {/* Tagline Box */}
<div className="mb-6 md:mb-8 lg:mb-10 border-l-4 border-orange-500 pl-4 sm:pl-6 md:pl-8 py-2">
  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-2 font-medium tracking-wide">
    A Complete solution all electrical & electronic accessories
  </p>

  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-3 md:mb-4 font-medium tracking-wide">
    for all your
  </p>

  <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-tight">
    <span className="text-orange-500">SecU</span> Engineering
  </p>
</div>



              {/* Shop Now Button */}
              <Link to="/store">
                <button className="bg-orange-500 text-white px-6 sm:px-8 py-2.5 md:py-3 font-bold rounded hover:bg-orange-600 transition-all text-base md:text-lg">
                  Shop Now
                </button>
              </Link>
            </div>

            {/* Right Image */}
            <div className="flex justify-center">
              <img 
                src="/assets/hero3.png" 
                alt="Security Camera" 
                className="w-full max-w-2xl h-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* Separator Divider */}
        <div className="flex justify-center my-8 sm:my-10 md:my-12">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-px bg-gray-300 w-8 sm:w-12"></div>
            <svg className="w-5 sm:w-6 h-5 sm:h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            </svg>
            <div className="h-px bg-gray-300 w-8 sm:w-12"></div>
          </div>
        </div>
      </section>

      {/* Browse by Category Section */}
      <section className="bg-blue-100 py-8 sm:py-12 md:py-16 px-4 sm:px-5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
              BROWSE BY <span className="text-orange-500">CATEGORY</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <Link key={index} to="/store">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden h-full flex flex-col items-center py-4 sm:py-5 md:py-6 px-3 sm:px-4">
                  {/* Icon */}
                  <div className="mb-3 md:mb-4 w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 flex items-center justify-center">
                    <img src={category.icon} alt={category.name} className="w-full h-full object-contain" />
                  </div>

                  {/* Content */}
                  <div className="text-center flex-1 flex flex-col justify-between w-full">
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-3 md:mb-4 leading-relaxed h-12 flex items-center justify-center">
                        {category.description}
                      </p>
                    </div>
                    <button className="bg-orange-500 text-white px-6 sm:px-7 md:px-8 py-1.5 md:py-2 rounded font-bold hover:bg-orange-600 transition-all text-xs sm:text-sm mt-3 md:mt-4">
                      Know More
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-5 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center p-4 sm:p-5 md:p-6 hover:shadow-lg transition-all rounded-lg">
                <div className="text-4xl sm:text-5xl mb-3 md:mb-4">{service.icon}</div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1.5 md:mb-2">{service.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Section with Girl Image */}
      <section className="bg-blue-100 py-8 sm:py-12 md:py-16 px-4 sm:px-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
                Your Security Partner<br />
                <span className="text-orange-500 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black">SecU Engineering</span>
              </h2>
              <p className="text-gray-700 text-base md:text-lg mb-6 md:mb-8">
                Your Safety Our Priority
              </p>
              
              {/* Banner */}
              <div className="bg-orange-500 text-white py-3 md:py-4 px-4 md:px-6 rounded-lg text-center text-base md:text-lg lg:text-xl font-bold">
                Get 20% Off on Your First Purchase! Use Code: WELCOME20
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center">
              <img 
                src="/assets/girl.png" 
                alt="Promotional Girl" 
                className="max-w-md w-full h-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="bg-white text-gray-800 py-16 px-5 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          {/* Header with Logo and Button */}
          <div className="flex justify-between items-center mb-12 pb-4 border-b border-gray-300">
            <div className="flex items-center gap-2">
              <img src="/assets/logo.jpg" alt="SecU Engineering Logo" className="h-10 w-auto" />
              <span className="font-bold text-lg">SecU</span><span className="font-bold text-lg text-orange-500">Engineering</span>
            </div>
            <button className="bg-orange-500 text-white px-6 py-2 font-bold rounded hover:bg-orange-600 transition-all">
              Get In Touch
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
            {/* Company */}
            <div>
              <h3 className="text-sm font-bold uppercase text-gray-700 mb-4">COMPANY</h3>
              <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">Who we are</p>
              <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">Blog</p>
              <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">Careers</p>
              <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">Report Fraud</p>
              <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">Contact</p>
              <p className="text-gray-600 text-sm hover:text-orange-500 cursor-pointer">Investor Relations</p>
            </div>

            {/* For Service */}
            <div>
              <h3 className="text-sm font-bold uppercase text-gray-700 mb-4">FOR SERVICE</h3>
              <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">YT video support</p>
              <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">Case Studies</p>
              <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">Email Support</p>
              <p className="text-gray-600 text-sm hover:text-orange-500 cursor-pointer">Chat Support</p>
            </div>

            {/* For You */}
            <div>
              <h3 className="text-sm font-bold uppercase text-gray-700 mb-4">FOR YOU</h3>
              <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">Privacy</p>
              <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">Terms</p>
              <p className="text-gray-600 text-sm hover:text-orange-500 cursor-pointer">Security</p>
            </div>

            {/* Marketing */}
            <div>
              <h3 className="text-sm font-bold uppercase text-gray-700 mb-4">MARKETING</h3>
              <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">Posters/EDM</p>
              <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">Brouchers</p>
              <p className="text-gray-600 text-sm hover:text-orange-500 cursor-pointer">Schema</p>
              <p className="text-gray-600 text-sm hover:text-orange-500 cursor-pointer">Videos</p>
              <p className="text-gray-600 text-sm hover:text-orange-500 cursor-pointer">Events</p>
            </div>

            {/* Social Links and Apps */}
            <div>
              <h3 className="text-sm font-bold uppercase text-gray-700 mb-4">SOCIAL LINKS</h3>
              <div className="flex gap-3 mb-6">
                <a href="#" className="text-gray-600 hover:text-orange-500 text-xl">📱</a>
                <a href="#" className="text-gray-600 hover:text-orange-500 text-xl">📘</a>
                <a href="#" className="text-gray-600 hover:text-orange-500 text-xl">📹</a>
                <a href="#" className="text-gray-600 hover:text-orange-500 text-xl">🐦</a>
                <a href="#" className="text-gray-600 hover:text-orange-500 text-xl">💼</a>
              </div>
              
              {/* App Badges */}
              <div className="flex flex-col gap-2">
                <img src="/assets/google-play.png" alt="Google Play" className="h-10 w-auto" />
                <img src="/assets/app-store.png" alt="App Store" className="h-10 w-auto" />
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-300 pt-8 text-center text-gray-600 text-sm">
            <p className="mb-4">
              By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies. All trademarks are properties of their respective owners.
            </p>
            <p>2008-2026 © Eagle Eye™ Ltd. All rights reserved.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
