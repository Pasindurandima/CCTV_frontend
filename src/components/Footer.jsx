import React from 'react';

function Footer() {
  return (
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company */}
          <div>
            <h3 className="text-sm font-bold uppercase text-gray-700 mb-4">COMPANY</h3>
            <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">Home</p>
            <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">Store</p>
            <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">About Us</p>
            <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">Contact Us</p>

          </div>

          {/* For Service */}
          <div>
            <h3 className="text-sm font-bold uppercase text-gray-700 mb-4">FOR SERVICE</h3>
            <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">CCTV Camera Installation</p>
            <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">GPS Installation</p>
            <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">Sola projects</p>
            <p className="text-gray-600 text-sm hover:text-orange-500 cursor-pointer">All Wiring</p>
          </div>


          <div>
            <h3 className="text-sm font-bold uppercase text-gray-700 mb-4">Categories</h3>
            <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">CCTV Camera</p>
            <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">Power Bank</p>
            <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">Sola Panel</p>
            <p className="text-gray-600 text-sm hover:text-orange-500 cursor-pointer">All Electrical Accessories</p>
          </div>

    

          {/* Marketing */}
          <div>
            <h3 className="text-sm font-bold uppercase text-gray-700 mb-4">MARKETING</h3>
            <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">Facebook</p>
            <p className="text-gray-600 text-sm mb-2 hover:text-orange-500 cursor-pointer">Whatsapp</p>
            <p className="text-gray-600 text-sm hover:text-orange-500 cursor-pointer">Email</p>
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
  );
}

export default Footer;
