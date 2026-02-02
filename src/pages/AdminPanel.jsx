import { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    originalPrice: '',
    category: '',
    shortDesc: '',
    features: [''],
    imageFile: null,
    imagePreview: '',
    imageFile1: null,
    imagePreview1: '',
    imageFile2: null,
    imagePreview2: '',
    imageFile3: null,
    imagePreview3: ''
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage({ text: 'Failed to fetch products', type: 'error' });
      setProducts([]);
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/categories/active');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image file selection
  const handleImageChange = (e, imageNumber = 0) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ text: 'Please select a valid image file', type: 'error' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: 'Image size must be less than 5MB', type: 'error' });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (imageNumber === 0) {
          setFormData(prev => ({ 
            ...prev, 
            imageFile: file,
            imagePreview: reader.result 
          }));
        } else if (imageNumber === 1) {
          setFormData(prev => ({ 
            ...prev, 
            imageFile1: file,
            imagePreview1: reader.result 
          }));
        } else if (imageNumber === 2) {
          setFormData(prev => ({ 
            ...prev, 
            imageFile2: file,
            imagePreview2: reader.result 
          }));
        } else if (imageNumber === 3) {
          setFormData(prev => ({ 
            ...prev, 
            imageFile3: file,
            imagePreview3: reader.result 
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const removeImage = (imageNumber = 0) => {
    if (imageNumber === 0) {
      setFormData({ ...formData, imageFile: null, imagePreview: '' });
    } else if (imageNumber === 1) {
      setFormData({ ...formData, imageFile1: null, imagePreview1: '' });
    } else if (imageNumber === 2) {
      setFormData({ ...formData, imageFile2: null, imagePreview2: '' });
    } else if (imageNumber === 3) {
      setFormData({ ...formData, imageFile3: null, imagePreview3: '' });
    }
  };

  // Handle feature input changes
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  // Add new feature input
  const addFeatureInput = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  // Remove feature input
  const removeFeatureInput = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    // Filter out empty features
    const filteredFeatures = formData.features.filter(f => f.trim() !== '');

    try {
      // Try multipart form data first (with file)
      if (formData.imageFile || formData.imageFile1 || formData.imageFile2 || formData.imageFile3) {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('brand', formData.brand);
        formDataToSend.append('price', parseFloat(formData.price));
        formDataToSend.append('originalPrice', formData.originalPrice ? parseFloat(formData.originalPrice) : null);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('shortDesc', formData.shortDesc);
        formDataToSend.append('features', JSON.stringify(filteredFeatures));
        
        // Append images
        if (formData.imageFile) {
          formDataToSend.append('image', formData.imageFile);
        }
        if (formData.imageFile1) {
          formDataToSend.append('image1', formData.imageFile1);
        }
        if (formData.imageFile2) {
          formDataToSend.append('image2', formData.imageFile2);
        }
        if (formData.imageFile3) {
          formDataToSend.append('image3', formData.imageFile3);
        }

        const url = editMode 
          ? `http://localhost:8080/api/products/${editId}`
          : 'http://localhost:8080/api/products';
        
        const method = editMode ? 'PUT' : 'POST';

        console.log('Sending FormData with images:', {
          name: formData.name,
          brand: formData.brand,
          price: formData.price,
          images: [
            formData.imageFile?.name,
            formData.imageFile1?.name,
            formData.imageFile2?.name,
            formData.imageFile3?.name
          ].filter(Boolean)
        });

        const response = await fetch(url, {
          method: method,
          body: formDataToSend,
        });

        if (response.ok) {
          setMessage({ 
            text: editMode ? 'Product updated successfully!' : 'Product added successfully!', 
            type: 'success' 
          });
          resetForm();
          fetchProducts();
        } else {
          const errorData = await response.json().catch(() => null);
          const errorMessage = errorData?.error || errorData?.message || 'Failed to save product. Please check all fields.';
          setMessage({ text: errorMessage, type: 'error' });
          console.error('Server error:', errorData);
        }
      } else {
        // Fall back to JSON if no image
        const productData = {
          name: formData.name,
          brand: formData.brand,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          category: formData.category,
          shortDesc: formData.shortDesc,
          features: filteredFeatures,
          imageUrl: formData.imagePreview
        };

        const url = editMode 
          ? `http://localhost:8080/api/products/${editId}`
          : 'http://localhost:8080/api/products';
        
        const method = editMode ? 'PUT' : 'POST';

        console.log('Sending JSON (no image):', productData);

        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });

        if (response.ok) {
          setMessage({ 
            text: editMode ? 'Product updated successfully!' : 'Product added successfully!', 
            type: 'success' 
          });
          resetForm();
          fetchProducts();
        } else {
          const errorData = await response.json().catch(() => null);
          const errorMessage = errorData?.error || errorData?.message || 'Failed to save product. Please check all fields.';
          setMessage({ text: errorMessage, type: 'error' });
          console.error('Server error:', errorData);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'Network error: Unable to connect to server. Please make sure the backend is running.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      price: '',
      originalPrice: '',
      category: '',
      shortDesc: '',
      features: [''],
      imageFile: null,
      imagePreview: '',
      imageFile1: null,
      imagePreview1: '',
      imageFile2: null,
      imagePreview2: '',
      imageFile3: null,
      imagePreview3: ''
    });
    setEditMode(false);
    setEditId(null);
  };

  // Edit product
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      category: product.category,
      shortDesc: product.shortDesc,
      features: product.features && product.features.length > 0 ? product.features : [''],
      imageFile: null,
      imagePreview: product.imageUrl || ''
    });
    setEditMode(true);
    setEditId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete product
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setMessage({ text: 'Product deleted successfully!', type: 'success' });
          fetchProducts();
        } else {
          setMessage({ text: 'Failed to delete product', type: 'error' });
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage({ text: 'An error occurred', type: 'error' });
      }
    }
  };

  return (
    <div className="w-full bg-white pt-0">
     

      {/* Main Content */}
      <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-5 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Message Display */}
          {message.text && (
            <div className={`mb-4 sm:mb-5 md:mb-6 p-3 sm:p-4 rounded-lg border-l-4 flex items-start gap-2 sm:gap-3 text-sm sm:text-base ${
              message.type === 'success' 
                ? 'bg-green-100 border-green-500 text-green-700' 
                : 'bg-red-100 border-red-500 text-red-700'
            }`}>
              <span className="text-lg sm:text-xl flex-shrink-0">{message.type === 'success' ? '✅' : '⚠️'}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base">{message.type === 'success' ? 'Success' : 'Error'}</p>
                <p className="text-xs sm:text-sm mt-0.5">{message.text}</p>
              </div>
            </div>
          )}

          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-8 flex items-center gap-2">
              {editMode ? (
                '✏️ Edit Product'
              ) : (
                <>
                  <span className="text-orange-500 text-2xl sm:text-3xl md:text-4xl font-bold">+</span>
                  Add New Product
                </>
              )}
            </h2>


            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Product Name and Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                <div>
                  <label className="block mb-1.5 md:mb-2 text-slate-800 font-semibold text-sm md:text-base">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product name"
                    className="w-full py-2 md:py-3 px-3 md:px-4 border-2 border-gray-300 rounded-lg text-sm md:text-base transition-all focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 md:mb-2 text-slate-800 font-semibold text-sm md:text-base">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter brand name"
                    className="w-full py-2 md:py-3 px-3 md:px-4 border-2 border-gray-300 rounded-lg text-sm md:text-base transition-all focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  />
                </div>
              </div>

              {/* Price Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                <div>
                  <label className="block mb-1.5 md:mb-2 text-slate-800 font-semibold text-sm md:text-base">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    placeholder="0.00"
                    className="w-full py-2 md:py-3 px-3 md:px-4 border-2 border-gray-300 rounded-lg text-sm md:text-base transition-all focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 md:mb-2 text-slate-800 font-semibold text-sm md:text-base">
                    Original Price
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    placeholder="0.00"
                    className="w-full py-2 md:py-3 px-3 md:px-4 border-2 border-gray-300 rounded-lg text-sm md:text-base transition-all focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 mb-1.5 md:mb-2">
                  <label className="text-slate-800 font-semibold text-sm md:text-base">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => window.location.href = '/admin/categories'}
                    className="bg-blue-500 text-white px-3 py-1.5 rounded text-xs md:text-sm font-semibold hover:bg-blue-600 transition-all"
                  >
                    📂 Manage Categories
                  </button>
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full py-2 md:py-3 px-3 md:px-4 border-2 border-gray-300 rounded-lg text-sm md:text-base transition-all focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    ⚠️ No categories found. Click "Manage Categories" to add categories.
                  </p>
                )}
              </div>

              {/* Short Description */}
              <div>
                <label className="block mb-2 text-slate-800 font-semibold">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="shortDesc"
                  value={formData.shortDesc}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Brief description of the product"
                  className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg text-base transition-all focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block mb-2 text-slate-800 font-semibold">
                  Product Images (up to 3 images)
                </label>
                
                {/* Image 1 */}
                <div className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-all">
                  <h4 className="font-semibold mb-2">Image 1</h4>
                  <input
                    type="file"
                    id="image-input-1"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 1)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('image-input-1').click()}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all inline-block"
                  >
                    📸 Browse Image 1
                  </button>
                  
                  {formData.imagePreview1 && (
                    <div className="mt-4">
                      <img 
                        src={formData.imagePreview1} 
                        alt="Preview 1" 
                        className="max-w-xs mx-auto rounded-lg shadow-md"
                      />
                      <p className="text-gray-600 text-sm mt-2">
                        {formData.imageFile1 ? formData.imageFile1.name : 'Current Image'}
                      </p>
                      {formData.imageFile1 && (
                        <button
                          type="button"
                          onClick={() => removeImage(1)}
                          className="bg-red-500 text-white px-4 py-1 rounded text-sm mt-2 hover:bg-red-600 transition-all"
                        >
                          ✕ Remove Image 1
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Image 2 */}
                <div className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-all">
                  <h4 className="font-semibold mb-2">Image 2 (Optional)</h4>
                  <input
                    type="file"
                    id="image-input-2"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 2)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('image-input-2').click()}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all inline-block"
                  >
                    📸 Browse Image 2
                  </button>
                  
                  {formData.imagePreview2 && (
                    <div className="mt-4">
                      <img 
                        src={formData.imagePreview2} 
                        alt="Preview 2" 
                        className="max-w-xs mx-auto rounded-lg shadow-md"
                      />
                      <p className="text-gray-600 text-sm mt-2">
                        {formData.imageFile2 ? formData.imageFile2.name : 'Current Image'}
                      </p>
                      {formData.imageFile2 && (
                        <button
                          type="button"
                          onClick={() => removeImage(2)}
                          className="bg-red-500 text-white px-4 py-1 rounded text-sm mt-2 hover:bg-red-600 transition-all"
                        >
                          ✕ Remove Image 2
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Image 3 */}
                <div className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-all">
                  <h4 className="font-semibold mb-2">Image 3 (Optional)</h4>
                  <input
                    type="file"
                    id="image-input-3"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 3)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('image-input-3').click()}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all inline-block"
                  >
                    📸 Browse Image 3
                  </button>
                  
                  {formData.imagePreview3 && (
                    <div className="mt-4">
                      <img 
                        src={formData.imagePreview3} 
                        alt="Preview 3" 
                        className="max-w-xs mx-auto rounded-lg shadow-md"
                      />
                      <p className="text-gray-600 text-sm mt-2">
                        {formData.imageFile3 ? formData.imageFile3.name : 'Current Image'}
                      </p>
                      {formData.imageFile3 && (
                        <button
                          type="button"
                          onClick={() => removeImage(3)}
                          className="bg-red-500 text-white px-4 py-1 rounded text-sm mt-2 hover:bg-red-600 transition-all"
                        >
                          ✕ Remove Image 3
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mt-2">
                  ℹ️ Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB per image
                </p>
              </div>

              {/* Features */}
              <div>
                <label className="block mb-2 text-slate-800 font-semibold">
                  Features
                </label>
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                        className="flex-1 py-2 px-4 border-2 border-gray-300 rounded-lg text-base transition-all focus:outline-none focus:border-orange-500"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureInput(index)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addFeatureInput}
                  className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all"
                >
                  + Add Feature
                </button>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-8 rounded-lg font-bold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                >
                  {loading ? 'Saving...' : editMode ? 'Update Product' : 'Add Product'}
                </button>
                {editMode && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="border-2 border-gray-300 text-gray-700 py-3 px-8 rounded-lg font-bold hover:bg-gray-50 transition-all"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Products List Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                📋 All Products <span className="text-orange-500">({products.length})</span>
              </h2>
              <button
                onClick={fetchProducts}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all flex items-center gap-2"
              >
                🔄 Refresh
              </button>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products available. Add your first product above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
                    {(product.imageUrl1 || product.imageUrl) ? (
                      <div className="h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group">
                        <img
                          src={product.imageUrl1 || product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                    ) : (
                      <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <div className="text-6xl mb-2">📷</div>
                          <p className="text-sm">No Image</p>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">🏢 {product.brand}</p>
                      <p className="text-sm text-gray-600 mb-1">🏷️ {product.category}</p>
                      <p className="text-lg font-bold text-orange-500 mb-2">💵 Rs {product.price}</p>
                      {product.features && product.features.length > 0 && (
                        <p className="text-sm text-gray-600 mb-4">✨ {product.features.length} features</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-all"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
