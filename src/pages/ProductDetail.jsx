import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductImageSlideshow from '../components/ProductImageSlideshow';

const CONTACT_NUMBERS = {
  phone1: '077 760 2021',
  phone2: '077 482 0276'
};

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Extract technical specs from shortDesc
  const extractSpecs = (shortDesc) => {
    const specs = {};
    
    // Extract Camera/Device Type
    const typeMatch = shortDesc.match(/^([^,]+)/);
    if (typeMatch) specs.type = typeMatch[1].trim();
    
    // Extract Resolution
    const resolutionMatch = shortDesc.match(/(\d+(?:K|MP|p|VA|TB|GB|mAh|inches?|"|Channels?)[\s\/]*[\d]*[\s\w]*)/i);
    if (resolutionMatch) specs.resolution = resolutionMatch[1].trim();
    
    // Extract Connectivity
    const connectivityMatch = shortDesc.match(/(WiFi|4G|Ethernet|PoE|Coaxial|Analog|Bluetooth|Wireless|RCA|DC|RJ45)[^,]*/i);
    if (connectivityMatch) specs.connectivity = connectivityMatch[0].trim();
    
    return specs;
  };

  const technicalSpecs = product ? extractSpecs(product.shortDesc) : {};

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 md:py-20 px-3 sm:px-4 md:px-5 mt-20 lg:mt-24 text-center">
        <div className="inline-block animate-spin rounded-full h-12 sm:h-16 w-12 sm:w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">Loading product...</p>
      </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto py-10 md:py-20 px-3 sm:px-4 md:px-5 mt-20 lg:mt-24 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">Product Not Found</h2>
        <Link to="/store" className="text-blue-500 hover:text-blue-600 text-sm sm:text-base">
          ← Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 md:py-10 px-3 sm:px-4 md:px-5 mt-20 lg:mt-24">
      {/* Breadcrumb */}
     {/*
      <div className="mb-4 md:mb-6 text-xs sm:text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        <span className="mx-1 md:mx-2">/</span>
        <Link to="/store" className="hover:text-blue-500">Store</Link>
        <span className="mx-1 md:mx-2">/</span>
        <span className="text-slate-800 line-clamp-1">{product.name}</span>
      </div>
      */}

      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 md:mb-6 text-blue-500 hover:text-blue-600 flex items-center gap-2 text-sm md:text-base"
      >
        ← Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
        {/* Product Image Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 sticky top-20 md:top-24 h-fit">
            {/* Product Images Slideshow */}
            <ProductImageSlideshow images={product.imageUrls || (product.imageUrl ? [product.imageUrl] : [])} name={product.name} />
          {product.brand && (
            <div className="inline-block bg-orange-100 text-orange-600 px-3 md:px-4 py-2 rounded-full text-xs sm:text-sm font-bold w-full text-center">
              {product.brand}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-4">{product.name}</h1>
          
          {/* Price Section */}
          <div className="mb-6">
            <div className="text-3xl sm:text-4xl font-bold text-orange-500">
              Rs {product.price.toFixed(2)}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">Current price</p>
          </div>

          {/* Category */}
          <div className="mb-6">
            <span className="inline-block bg-gray-100 text-gray-700 px-3 md:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold">
              Category: {product.category}
            </span>
          </div>

          {/* Short Description */}
          <div className="mb-6">
            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-2">Product Overview</h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">{product.shortDesc}</p>
          </div>

          {/* Technical Specifications Summary */}
          <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-orange-50 rounded-lg border border-blue-200">
            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-3">Technical Specifications</h3>
            <div className="grid grid-cols-1 gap-2 md:gap-3">
              {technicalSpecs.type && (
                <div className="flex items-start gap-2 text-xs sm:text-sm md:text-base">
                  <span className="font-semibold text-gray-700 min-w-24 md:min-w-32 flex-shrink-0">Type:</span>
                  <span className="text-gray-800">{technicalSpecs.type}</span>
                </div>
              )}
              {technicalSpecs.resolution && (
                <div className="flex items-start gap-2 text-xs sm:text-sm md:text-base">
                  <span className="font-semibold text-gray-700 min-w-24 md:min-w-32 flex-shrink-0">Resolution:</span>
                  <span className="text-gray-800">{technicalSpecs.resolution}</span>
                </div>
              )}
              {technicalSpecs.connectivity && (
                <div className="flex items-start gap-2 text-xs sm:text-sm md:text-base">
                  <span className="font-semibold text-gray-700 min-w-24 md:min-w-32 flex-shrink-0">Connectivity:</span>
                  <span className="text-gray-800">{technicalSpecs.connectivity}</span>
                </div>
              )}
              <div className="flex items-start gap-2 text-xs sm:text-sm md:text-base">
                <span className="font-semibold text-gray-700 min-w-24 md:min-w-32 flex-shrink-0">Brand:</span>
                <span className="text-gray-800">{product.brand}</span>
              </div>
              <div className="flex items-start gap-2 text-xs sm:text-sm md:text-base">
                <span className="font-semibold text-gray-700 min-w-24 md:min-w-32 flex-shrink-0">Category:</span>
                <span className="text-gray-800">{product.category}</span>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="mb-6 md:mb-8">
            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-3">Key Features</h3>
            <ul className="space-y-1.5 md:space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-xs sm:text-sm md:text-base text-gray-700">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 md:gap-4 flex-col sm:flex-row">
            <button
              onClick={() => {
                addToCart(product);
                navigate('/cart');
              }}
              className="flex-1 bg-orange-500 text-white py-3 md:py-4 px-4 md:px-6 rounded-lg font-bold text-base md:text-lg hover:bg-orange-600 active:bg-orange-700 transition-all text-center"
            >
              Add to Cart
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-slate-700 py-3 md:py-4 px-4 md:px-6 rounded-lg font-bold transition-all text-base md:text-lg">
              ❤️
            </button>
          </div>

          {/* Stock Status */}
          <div className="mt-4 md:mt-6 flex items-center gap-2 text-green-600">
            <span className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></span>
            <span className="font-semibold text-sm md:text-base">In Stock</span>
          </div>

          {/* Contact for Orders */}
          <div className="mt-4 md:mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-bold text-slate-800 mb-2 text-sm md:text-base">📞 Call to Order</h4>
            <div className="space-y-1">
              <a href={`tel:${CONTACT_NUMBERS.phone1}`} className="block text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm md:text-base">
                {CONTACT_NUMBERS.phone1}
              </a>
              <a href={`tel:${CONTACT_NUMBERS.phone2}`} className="block text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm md:text-base">
                {CONTACT_NUMBERS.phone2}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information Tabs */}
      <div className="mt-8 md:mt-12 bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 md:mb-6">Detailed Specifications</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column - Product Specifications */}
          <div>
            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-3 md:mb-4 pb-2 border-b-2 border-blue-500">Product Information</h3>
            <div className="space-y-2 md:space-y-3">
              <div className="flex flex-col sm:flex-row justify-between py-2 md:py-3 border-b border-gray-200 hover:bg-gray-50 px-2 rounded transition-colors gap-2">
                <span className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base">Product Name:</span>
                <span className="text-gray-800 text-xs sm:text-sm md:text-base text-right max-w-xs">{product.name}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between py-2 md:py-3 border-b border-gray-200 hover:bg-gray-50 px-2 rounded transition-colors gap-2">
                <span className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base">Brand:</span>
                <span className="text-gray-800 text-xs sm:text-sm md:text-base text-right">{product.brand}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200 hover:bg-gray-50 px-2 rounded transition-colors">
                <span className="font-semibold text-gray-700">Category:</span>
                <span className="text-gray-800">{product.category}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200 hover:bg-gray-50 px-2 rounded transition-colors">
                <span className="font-semibold text-gray-700">Model:</span>
                <span className="text-gray-800">{product.name.split(' ')[0]} {product.name.split(' ')[1]}</span>
              </div>
              {technicalSpecs.type && (
                <div className="flex justify-between py-3 border-b border-gray-200 hover:bg-gray-50 px-2 rounded transition-colors">
                  <span className="font-semibold text-gray-700">Device Type:</span>
                  <span className="text-gray-800 text-right max-w-xs">{technicalSpecs.type}</span>
                </div>
              )}
              {technicalSpecs.resolution && (
                <div className="flex justify-between py-3 border-b border-gray-200 hover:bg-gray-50 px-2 rounded transition-colors">
                  <span className="font-semibold text-gray-700">Resolution/Capacity:</span>
                  <span className="text-gray-800">{technicalSpecs.resolution}</span>
                </div>
              )}
              {technicalSpecs.connectivity && (
                <div className="flex justify-between py-3 border-b border-gray-200 hover:bg-gray-50 px-2 rounded transition-colors">
                  <span className="font-semibold text-gray-700">Connectivity:</span>
                  <span className="text-gray-800 text-right max-w-xs">{technicalSpecs.connectivity}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-b border-gray-200 hover:bg-gray-50 px-2 rounded transition-colors">
                <span className="font-semibold text-gray-700">Warranty:</span>
                <span className="text-gray-800">1 Year Manufacturer Warranty</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200 hover:bg-gray-50 px-2 rounded transition-colors">
                <span className="font-semibold text-gray-700">Condition:</span>
                <span className="text-green-600 font-semibold">Brand New</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200 hover:bg-gray-50 px-2 rounded transition-colors">
                <span className="font-semibold text-gray-700">Stock Status:</span>
                <span className="text-green-600 font-semibold">In Stock</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Purchase & Support Information */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b-2 border-blue-500">Purchase & Support</h3>
            <div className="space-y-4">
              {/* Pricing Information */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-bold text-gray-800 mb-2">💰 Price Information</h4>
                <div className="space-y-2">
                 
                  <p className="text-gray-700">
                    <span className="font-semibold">Current Price:</span>
                    <span className="ml-2 text-2xl text-orange-600 font-bold">Rs {product.price.toFixed(2)}</span>
                  </p>
                 
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-bold text-gray-800 mb-2">🚚 Shipping & Delivery</h4>
                <div className="text-gray-700 space-y-2">
                  <p>✓ Free shipping on orders over $200</p>
                  <p>✓ Fast delivery within 3-5 business days</p>
                  <p>✓ Cash on Delivery available</p>
                  <p>✓ Island-wide delivery service</p>
                </div>
              </div>

              {/* Return Policy */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-bold text-gray-800 mb-2">🔄 Returns & Warranty</h4>
                <div className="text-gray-700 space-y-2">
                  <p>✓ 7-day return policy</p>
                  <p>✓ 1 Year manufacturer warranty</p>
                  <p>✓ Professional installation available</p>
                  <p>✓ Lifetime technical support</p>
                </div>
              </div>

              {/* Customer Support */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-bold text-gray-800 mb-2">📞 Customer Support</h4>
                <div className="text-gray-700 space-y-2">
                  <p className="font-semibold">Contact us for:</p>
                  <p>• Product inquiries</p>
                  <p>• Technical support</p>
                  <p>• Installation guidance</p>
                  <p>• Bulk order discounts</p>
                  <div className="mt-3 pt-3 border-t border-purple-300">
                    <a href={`tel:${CONTACT_NUMBERS.phone1}`} className="block text-blue-600 hover:text-blue-700 font-bold text-lg">
                      📱 {CONTACT_NUMBERS.phone1}
                    </a>
                    <a href={`tel:${CONTACT_NUMBERS.phone2}`} className="block text-blue-600 hover:text-blue-700 font-bold text-lg">
                      📱 {CONTACT_NUMBERS.phone2}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="mt-8 bg-orange-50 text-black rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Our Products?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">✓</div>
            <h3 className="font-bold mb-2">Genuine Products</h3>
            <p className="text-sm text-black">100% authentic items with warranty</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="font-bold mb-2">Fast Delivery</h3>
            <p className="text-sm text-black">Quick shipping across Sri Lanka</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">💯</div>
            <h3 className="font-bold mb-2">Quality Assured</h3>
            <p className="text-sm text-black">Tested & verified products</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">👨‍💼</div>
            <h3 className="font-bold mb-2">Expert Support</h3>
            <p className="text-sm text-black">Professional guidance available</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
