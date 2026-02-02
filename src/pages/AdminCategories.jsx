import { useState, useEffect } from 'react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    id: null,
    name: '',
    description: ''
  });

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/categories');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setMessage({ text: 'Failed to fetch categories', type: 'error' });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Show message with auto-hide
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentCategory({
      ...currentCategory,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Open modal for adding new category
  const handleAddNew = () => {
    setEditMode(false);
    setCurrentCategory({
      id: null,
      name: '',
      description: ''
    });
    setShowModal(true);
  };

  // Open modal for editing category
  const handleEdit = (category) => {
    setEditMode(true);
    setCurrentCategory(category);
    setShowModal(true);
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editMode
        ? `http://localhost:8080/api/categories/${currentCategory.id}`
        : 'http://localhost:8080/api/categories';
      
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentCategory),
      });

      if (response.ok) {
        showMessage(
          editMode ? 'Category updated successfully!' : 'Category added successfully!',
          'success'
        );
        setShowModal(false);
        fetchCategories();
      } else {
        const errorText = await response.text();
        showMessage(errorText || 'Operation failed', 'error');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      showMessage('Error saving category', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showMessage('Category deleted successfully!', 'success');
        fetchCategories();
      } else {
        const errorText = await response.text();
        showMessage(errorText || 'Failed to delete category', 'error');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showMessage('Error deleting category', 'error');
    }
  };

  // Toggle category active status
  const handleToggleStatus = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/categories/${id}/toggle`, {
        method: 'PATCH',
      });

      if (response.ok) {
        showMessage('Category status updated!', 'success');
        fetchCategories();
      } else {
        showMessage('Failed to update status', 'error');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      showMessage('Error toggling status', 'error');
    }
  };

  return (
    <div className="w-full bg-white">
    

      {/* Main Content */}
      <section className="py-12 px-5 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg border-l-4 font-semibold flex items-start gap-3 ${
              message.type === 'success' 
                ? 'bg-green-100 border-green-500 text-green-700' 
                : 'bg-red-100 border-red-500 text-red-700'
            }`}>
              <span className="text-xl">{message.type === 'success' ? '✅' : '⚠️'}</span>
              <div>
                <p className="font-semibold">{message.type === 'success' ? 'Success' : 'Error'}</p>
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          )}

          {/* Categories Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                📂 All Categories <span className="text-orange-500">({categories.length})</span>
              </h2>
              <button
                onClick={handleAddNew}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transform hover:-translate-y-1 transition-all"
              >
                ➕ Add New
              </button>
            </div>

            {categories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No categories found. Click "Add New" to create one.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-orange-400 text-white">
                      <th className="px-6 py-4 text-left font-semibold">Name</th>
                      <th className="px-6 py-4 text-left font-semibold">Description</th>
                      <th className="px-6 py-4 text-left font-semibold">Created At</th>
                      <th className="px-6 py-4 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-50 transition-all">
                        <td className="px-6 py-4 font-semibold text-gray-800">{category.name}</td>
                        <td className="px-6 py-4 text-gray-600 max-w-xs">{category.description || '-'}</td>
                        <td className="px-6 py-4 text-gray-600">{new Date(category.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEdit(category)}
                              className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded transition-all text-lg transform hover:scale-110"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded transition-all text-lg transform hover:scale-110"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-white bg-opacity-60 flex justify-center items-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-8 w-96 max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editMode ? '✏️ Edit Category' : '➕ Add New Category'}
              </h2>
              <button 
                className="text-gray-600 hover:text-gray-900 text-2xl cursor-pointer hover:bg-gray-200 p-1 rounded transition-all"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-700 font-semibold">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentCategory.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Wireless Camera"
                  className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg text-base transition-all focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-semibold">
                  Description
                </label>
                <textarea
                  name="description"
                  value={currentCategory.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Brief description of the category..."
                  className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg text-base transition-all focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg font-bold hover:bg-orange-600 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : editMode ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-bold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
