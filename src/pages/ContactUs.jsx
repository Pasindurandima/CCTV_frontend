import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      alert('Thank you for contacting us! We will get back to you within 24 hours.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="w-full bg-white pt-0">
      {/* Hero Section - Home Page Style */}
      <section className="relative bg-white py-16 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              {/* Tagline Box */}
              <div className="mb-10 border-l-4 border-orange-500 pl-8 py-2">
                <p className="text-xl md:text-2xl text-gray-600 mb-2 font-medium tracking-wide">
                  We're here to help
                </p>

                <p className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight">
                  <span className="text-orange-500">Get In</span> Touch
                </p>

                <p className="text-lg text-gray-600 mt-6 max-w-2xl">
                  Have questions about our CCTV systems or security solutions? Our expert team is ready to assist you anytime!
                </p>
              </div>

              {/* Browse Products Button */}
              <Link to="/store">
                <button className="bg-orange-500 text-white px-8 py-3 font-bold rounded hover:bg-orange-600 transition-all text-lg">
                  Browse Products
                </button>
              </Link>
            </div>

            {/* Right Image */}
            <div className="flex justify-center">
              <img 
                src="/assets/hero1.png" 
                alt="Contact Us" 
                className="w-full max-w-2xl h-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* Separator Divider */}
        <div className="flex justify-center my-12">
          <div className="flex items-center gap-4">
            <div className="h-px bg-gray-300 w-12"></div>
            <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            </svg>
            <div className="h-px bg-gray-300 w-12"></div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto py-16 px-5">
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 -mt-20 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-t-4 border-orange-500">
            <div className="mb-3 flex justify-center">
              <img src="/assets/call.png" alt="Call" className="h-12 w-12 object-contain" />
            </div>
            <h3 className="font-bold text-slate-800 text-center mb-2">Call Us</h3>
            <div className="text-center space-y-1">
              <a href="tel:0777602021" className="block text-black-600 hover:text-black-700 font-semibold">
                077 760 2021
              </a>
              <a href="tel:0774820276" className="block text-black-600 hover:text-black-700 font-semibold">
                077 482 0276
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-t-4 border-orange-500">
            <div className="mb-3 flex justify-center">
              <img src="/assets/mail.png" alt="Email" className="h-12 w-12 object-contain" />
            </div>
            <h3 className="font-bold text-slate-800 text-center mb-2">Email Us</h3>
            <p className="text-gray-600 text-center text-sm">
              <a href="mailto:engineering.secu@gmail.com" className="hover:text-blue-600">
                engineering.secu@gmail.com
              </a>
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-t-4 border-orange-500">
            <div className="mb-3 flex justify-center">
              <img src="/assets/location.png" alt="Location" className="h-12 w-12 object-contain" />
            </div>
            <h3 className="font-bold text-slate-800 text-center mb-2">Visit Us</h3>
            <p className="text-gray-600 text-center text-sm">
              123 Security Solutions Street<br />
              Colombo, Sri Lanka
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-t-4 border-orange-500">
            <div className="mb-3 flex justify-center">
              <img src="/assets/time.png" alt="Business Hours" className="h-12 w-12 object-contain" />
            </div>
            <h3 className="font-bold text-slate-800 text-center mb-2">Working Hours</h3>
            <p className="text-gray-600 text-center text-sm">
              Mon - Sat: 9AM - 6PM<br />
              Sunday: 10AM - 4PM
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left Side - Contact Information */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Let's Talk</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Whether you need advice on choosing the right CCTV system, have questions about our products, 
                or need technical support – we're here to help!
              </p>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <img src="/assets/call.png" alt="Call" className="w-6 h-6 object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Phone Numbers</h3>
                    <a href="tel:0777602021" className="block text-gray-600 hover:text-blue-700 font-semibold">
                      077 760 2021
                    </a>
                    <a href="tel:0774820276" className="block text-gray-600 hover:text-blue-700 font-semibold">
                      077 482 0276
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                    <img src="/assets/mail.png" alt="Email" className="w-6 h-6 object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Email Address</h3>
                    <a href="mailto:engineering.secu@gmail.com" className="block text-gray-600 hover:text-green-700">
                      engineering.secu@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <img src="/assets/location.png" alt="Location" className="w-6 h-6 object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Office Location</h3>
                    <p className="text-gray-600">
                      123 Security Solutions Street<br />
                      Colombo 00700<br />
                      Sri Lanka
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <img src="/assets/time.png" alt="Business Hours" className="w-6 h-6 object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 4:00 PM<br />
                      Sunday: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

         

          
          </div>

          {/* Right Side - Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you as soon as possible</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-slate-800 font-semibold">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block mb-2 text-slate-800 font-semibold">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="engineering.secu@gmail.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block mb-2 text-slate-800 font-semibold">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="077 760 2021"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block mb-2 text-slate-800 font-semibold">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="product-inquiry">Product Inquiry</option>
                      <option value="technical-support">Technical Support</option>
                      <option value="installation">Installation Service</option>
                      <option value="bulk-order">Bulk Order / Wholesale</option>
                      <option value="warranty">Warranty Claim</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2 text-slate-800 font-semibold">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg text-base resize-y transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-orange-500 text-white border-none py-4 px-10 rounded-lg cursor-pointer text-lg w-full font-bold transition-all hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-2 ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  We typically respond within 24 hours during business days
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Why Contact Us Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200">
            <div className="text-5xl mb-4">💼</div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Expert Consultation</h3>
            <p className="text-gray-700">
              Our security experts will help you choose the perfect CCTV system for your specific needs and budget.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Custom Solutions</h3>
            <p className="text-gray-700">
              Need a tailored security setup? We design custom solutions for homes, offices, and commercial properties.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Quick Response</h3>
            <p className="text-gray-700">
              We value your time! Our team responds quickly to all inquiries and provides immediate assistance.
            </p>
          </div>
        </div>
      </div>


      <Footer />


    </div>
  );
}

export default ContactUs;
