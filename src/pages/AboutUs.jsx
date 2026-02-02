import React from 'react';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

function AboutUs() {
  return (
    <div className="w-full bg-white pt-0">
      {/* Hero Section */}
      


      






      {/* Company Story Section */}
      <section className="bg-white py-16 px-2">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-30 items-center">
            {/* Image */}
            <div className="flex justify-center">
              <img 
                src="/assets/about-company.png" 
                alt="Our Company" 
                className="w-full max-w-xl h-auto rounded-lg shadow-2xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {/* Story Content */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Our <span className="text-orange-500">Story</span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Established in <strong className="text-orange-500">2020</strong>, we have become Sri Lanka's leading provider of 
                cutting-edge CCTV cameras, security systems, and surveillance equipment. Our journey began with a simple 
                mission: to make advanced security technology accessible and affordable for everyone.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Today, we proudly serve <strong className="text-orange-500">thousands of satisfied customers</strong> across 
                the island, from residential homes to large commercial enterprises. Our commitment to quality, innovation, 
                and customer satisfaction has made us the go-to destination for all security needs.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="bg-orange-100 px-6 py-3 rounded-lg border-l-4 border-orange-500">
                  <p className="text-3xl font-bold text-orange-500">500+</p>
                  <p className="text-sm text-gray-600 font-medium">Happy Clients</p>
                </div>
                <div className="bg-orange-100 px-6 py-3 rounded-lg border-l-4 border-orange-500">
                  <p className="text-3xl font-bold text-orange-500">1000+</p>
                  <p className="text-sm text-gray-600 font-medium">Projects Done</p>
                </div>
                <div className="bg-orange-100 px-6 py-3 rounded-lg border-l-4 border-orange-500">
                  <p className="text-3xl font-bold text-orange-500">5+</p>
                  <p className="text-sm text-gray-600 font-medium">Years Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 px-5 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="bg-orange-500 text-white p-10 rounded-lg shadow-lg">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg text-orange-50 leading-relaxed">
                To provide state-of-the-art security solutions that protect what matters most to our customers. 
                We strive to deliver exceptional quality products, professional installation services, and 
                unmatched customer support at competitive prices.
              </p>
            </div>

            <div className="bg-gray-800 text-white p-10 rounded-lg shadow-lg">
              <div className="text-5xl mb-4">👁️</div>
              <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
              <p className="text-lg text-gray-100 leading-relaxed">
                To become Sri Lanka's most trusted and innovative security solutions provider, setting new 
                standards in the industry through cutting-edge technology, reliability, and customer-centric 
                approach. We envision a safer tomorrow for all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-blue-100 py-16 px-5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
            WHY <span className="text-orange-500">CHOOSE US</span>?
          </h2>
          <p className="text-center text-gray-700 text-lg mb-12 max-w-2xl mx-auto">
            We're not just selling products – we're providing complete security solutions backed by expertise and care
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all border-b-4 border-orange-500">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                We stock only genuine products from world-renowned brands like Hikvision, EZVIZ, and VStarcam.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all border-b-4 border-orange-500">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Island-wide delivery within 3-5 days. Same-day delivery available in Colombo and suburbs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all border-b-4 border-orange-500">
              <div className="text-4xl mb-3">🔧</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Expert Installation</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Professional installation by certified technicians with years of experience in security systems.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all border-b-4 border-orange-500">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Round-the-clock customer support and technical assistance whenever you need us.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all border-b-4 border-orange-500">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Best Prices</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Competitive pricing with flexible payment options and special discounts for bulk orders.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all border-b-4 border-orange-500">
              <div className="text-4xl mb-3">✓</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Warranty Assured</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                All products come with manufacturer warranty and our own quality guarantee.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all border-b-4 border-orange-500">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Complete Packages</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Ready-to-install CCTV packages with cameras, DVR/NVR, cables, and all accessories included.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all border-b-4 border-orange-500">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Free Training</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Comprehensive training on system operation and mobile app usage after installation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="bg-gray-800 text-white py-16 px-5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            OUR CORE <span className="text-orange-500">VALUES</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4 items-start">
              <div className="text-4xl">🤝</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Integrity</h3>
                <p className="text-gray-300 leading-relaxed">
                  We conduct business with complete honesty and transparency. No hidden costs, no false promises 
                  – just genuine products and honest service.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="text-4xl">❤️</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Customer First</h3>
                <p className="text-gray-300 leading-relaxed">
                  Your satisfaction is our top priority. We go above and beyond to ensure you get the perfect 
                  security solution for your needs and budget.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start group">
              <div className="text-4xl group-hover:scale-110 transition-transform">💡</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Innovation</h3>
                <p className="text-gray-300 leading-relaxed">
                  We continuously update our product range with the latest technology to provide you with 
                  cutting-edge security solutions.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start group">
              <div className="text-4xl group-hover:scale-110 transition-transform">⭐</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Excellence</h3>
                <p className="text-gray-300 leading-relaxed">
                  From product quality to customer service, we maintain the highest standards in everything 
                  we do. Your security deserves nothing less.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-5 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Ready to Secure Your <span className="text-orange-500">Space</span>?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation and let our experts design the perfect security solution for your needs.
          </p>
          <Link to="/contact">
            <button className="bg-orange-500 text-white px-8 py-3 font-bold rounded-lg hover:bg-orange-600 transition-all text-lg">
              Get In Touch
            </button>
          </Link>
        </div>
      </section>


      <Footer />


    </div>
  );
}

export default AboutUs;
