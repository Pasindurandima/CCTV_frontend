import { useState, useEffect } from 'react';

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    quantity: 0,
    reorderLevel: 0
  });
  const [adjustData, setAdjustData] = useState({
    type: 'add',
    amount: 0,
    reason: ''
  });
  const [newInventory, setNewInventory] = useState({
    productId: '',
    productName: '',
    quantity: 0,
    reorderLevel: 10,
    unitPrice: 0
  });

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/inventory');
      const data = await response.json();
      setInventory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInventory)
      });
      
      if (response.ok) {
        alert('Inventory added successfully!');
        setShowAddModal(false);
        setNewInventory({
          productId: '',
          productName: '',
          quantity: 0,
          reorderLevel: 10,
          unitPrice: 0
        });
        fetchInventory();
      } else {
        const error = await response.text();
        alert('Failed to add inventory: ' + error);
      }
    } catch (error) {
      console.error('Error adding inventory:', error);
      alert('Error adding inventory');
    }
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/inventory/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        alert('Inventory updated successfully!');
        setShowUpdateModal(false);
        fetchInventory();
      } else {
        alert('Failed to update inventory');
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
      alert('Error updating inventory');
    }
  };

  const handleAdjustStock = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/inventory/${selectedProduct.id}/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adjustData)
      });
      
      if (response.ok) {
        alert('Stock adjusted successfully!');
        setShowAdjustModal(false);
        setAdjustData({ type: 'add', amount: 0, reason: '' });
        fetchInventory();
      } else {
        const error = await response.text();
        alert('Failed to adjust stock: ' + error);
      }
    } catch (error) {
      console.error('Error adjusting stock:', error);
      alert('Error adjusting stock');
    }
  };

  const handleDeleteInventory = async (id) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/inventory/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          alert('Inventory deleted successfully!');
          fetchInventory();
        } else {
          alert('Failed to delete inventory');
        }
      } catch (error) {
        console.error('Error deleting inventory:', error);
        alert('Error deleting inventory');
      }
    }
  };

  const handleProductSelect = (e) => {
    const productId = parseInt(e.target.value);
    const product = products.find(p => p.id === productId);
    if (product) {
      setNewInventory({
        ...newInventory,
        productId: product.id,
        productName: product.name,
        unitPrice: product.price
      });
    }
  };

  const openUpdateModal = (item) => {
    setSelectedProduct(item);
    setUpdateData({
      quantity: item.quantity,
      reorderLevel: item.reorderLevel
    });
    setShowUpdateModal(true);
  };

  const openAdjustModal = (item) => {
    setSelectedProduct(item);
    setAdjustData({ type: 'add', amount: 0, reason: '' });
    setShowAdjustModal(true);
  };

  const filteredInventory = inventory.filter(item =>
    item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => item.quantity <= item.reorderLevel);
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-full bg-gray-50 min-h-screen pt-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-5 py-8 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">📋 Inventory Management</h1>
            <p className="text-gray-600 text-lg">Manage your product stock levels and locations</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-yellow-300 to-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all transform hover:scale-105">
            ➕ Add Inventory
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-200 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4">
              <div className="text-4xl">📦</div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Items</p>
                <h3 className="text-3xl font-bold text-gray-800">{inventory.length}</h3>
                <span className="text-xs text-gray-500">Unique Products</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-200 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🔢</div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Quantity</p>
                <h3 className="text-3xl font-bold text-gray-800">{totalQuantity}</h3>
                <span className="text-xs text-gray-500">Units in Stock</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-200 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4">
              <div className="text-4xl">⚠️</div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Low Stock Items</p>
                <h3 className="text-3xl font-bold text-gray-800">{lowStockItems.length}</h3>
                <span className="text-xs text-gray-500">Need Reordering</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-200 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4">
              <div className="text-4xl">💰</div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Stock Value</p>
                <h3 className="text-3xl font-bold text-gray-800">Rs {totalValue.toFixed(2)}</h3>
                <span className="text-xs text-gray-500">Current Worth</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <span className="absolute left-4 top-3 text-xl">🔍</span>
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3 text-gray-500 hover:text-orange-500 text-xl">✖</button>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-orange-200 p-4 rounded-lg mb-8 flex gap-4">
            <div className="text-3xl">⚠️</div>
            <div>
              <h3 className="font-bold text-yellow-900 mb-1">Low Stock Alert</h3>
              <p className="text-yellow-800">{lowStockItems.length} items are at or below reorder level and need attention</p>
            </div>
          </div>
        )}

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading inventory...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Product ID</th>
                    <th className="px-6 py-4 text-left font-semibold">Product Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Quantity</th>
                    <th className="px-6 py-4 text-left font-semibold">Reorder Level</th>
                    <th className="px-6 py-4 text-left font-semibold">Unit Price</th>
                    <th className="px-6 py-4 text-left font-semibold">Total Value</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold">Last Updated</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item, idx) => (
                    <tr key={item.id} className={`border-b transition-colors hover:bg-gray-50 ${item.quantity <= item.reorderLevel ? 'bg-red-50' : ''}`}>
                      <td className="px-6 py-4 text-gray-800">{item.productId}</td>
                      <td className="px-6 py-4 font-semibold text-gray-800">{item.productName}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${item.quantity <= item.reorderLevel ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-800">{item.reorderLevel}</td>
                      <td className="px-6 py-4 text-gray-800">Rs {item.unitPrice?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-800">Rs {(item.quantity * item.unitPrice).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${item.quantity <= item.reorderLevel ? 'bg-red-100 text-red-700' : item.quantity > item.reorderLevel * 2 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {item.quantity <= item.reorderLevel ? '🔴 Low Stock' : item.quantity > item.reorderLevel * 2 ? '🟢 Overstocked' : '🟡 In Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-800 text-sm">{new Date(item.lastUpdated).toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => openAdjustModal(item)} title="Adjust Stock" className="text-xl hover:scale-125 transition-transform">📊</button>
                          <button onClick={() => openUpdateModal(item)} title="Edit" className="text-xl hover:scale-125 transition-transform">✏️</button>
                          <button onClick={() => handleDeleteInventory(item.id)} title="Delete" className="text-xl hover:scale-125 transition-transform">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredInventory.length === 0 && (
                    <tr>
                      <td colSpan="9" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="text-6xl">📦</div>
                          <p className="text-gray-600 text-lg">No inventory items found</p>
                          <button onClick={() => setShowAddModal(true)} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all">
                            Add Your First Item
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Inventory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-md flex items-center justify-center z-[1000]" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold">➕ Add New Inventory</h2>
              <button onClick={() => setShowAddModal(false)} className="text-xl hover:bg-white hover:bg-opacity-20 p-1 rounded transition">✖</button>
            </div>
            <form onSubmit={handleAddInventory} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Product: *</label>
                <select
                  value={newInventory.productId}
                  onChange={handleProductSelect}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                >
                  <option value="">Choose a product...</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - Rs {product.price}
                    </option>
                  ))}
                </select>
              </div>
              
              {newInventory.productId && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name:</label>
                    <input
                      type="text"
                      value={newInventory.productName}
                      readOnly
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Initial Quantity: *</label>
                      <input
                        type="number"
                        value={newInventory.quantity}
                        onChange={(e) => setNewInventory({ ...newInventory, quantity: parseInt(e.target.value) || 0 })}
                        required
                        min="0"
                        placeholder="0"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Reorder Level: *</label>
                      <input
                        type="number"
                        value={newInventory.reorderLevel}
                        onChange={(e) => setNewInventory({ ...newInventory, reorderLevel: parseInt(e.target.value) || 0 })}
                        required
                        min="0"
                        placeholder="10"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Unit Price:</label>
                    <input
                      type="number"
                      value={newInventory.unitPrice}
                      readOnly
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                      step="0.01"
                    />
                  </div>
                </>
              )}
              
              <div className="flex gap-3 pt-4 border-t">
                <button type="submit" disabled={!newInventory.productId} className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  ✅ Add Inventory
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all">
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-md flex items-center justify-center z-[1000]" onClick={() => setShowUpdateModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">✏️ Update Inventory - {selectedProduct?.productName}</h2>
              <button onClick={() => setShowUpdateModal(false)} className="text-xl hover:bg-orange hover:bg-opacity-20 p-1 rounded transition">✖</button>
            </div>
            <form onSubmit={handleUpdateStock} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity: *</label>
                <input
                  type="number"
                  value={updateData.quantity}
                  onChange={(e) => setUpdateData({ ...updateData, quantity: parseInt(e.target.value) || 0 })}
                  required
                  min="0"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reorder Level: *</label>
                <input
                  type="number"
                  value={updateData.reorderLevel}
                  onChange={(e) => setUpdateData({ ...updateData, reorderLevel: parseInt(e.target.value) || 0 })}
                  required
                  min="0"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button type="submit" className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">💾 Save Changes</button>
                <button type="button" onClick={() => setShowUpdateModal(false)} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all">
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-md flex items-center justify-center z-[1000]" onClick={() => setShowAdjustModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">📊 Adjust Stock - {selectedProduct?.productName}</h2>
              <button onClick={() => setShowAdjustModal(false)} className="text-xl hover:bg-white hover:bg-opacity-20 p-1 rounded transition">✖</button>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mx-6 mt-6">
              <p className="text-blue-900">Current Stock: <strong>{selectedProduct?.quantity}</strong> units</p>
            </div>
            <form onSubmit={handleAdjustStock} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Adjustment Type: *</label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-purple-50 transition">
                    <input
                      type="radio"
                      value="add"
                      checked={adjustData.type === 'add'}
                      onChange={(e) => setAdjustData({ ...adjustData, type: e.target.value })}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 text-gray-700 font-medium">➕ Add Stock (Received)</span>
                  </label>
                  <label className="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-purple-50 transition">
                    <input
                      type="radio"
                      value="remove"
                      checked={adjustData.type === 'remove'}
                      onChange={(e) => setAdjustData({ ...adjustData, type: e.target.value })}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 text-gray-700 font-medium">➖ Remove Stock (Sold/Damaged)</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount: *</label>
                <input
                  type="number"
                  value={adjustData.amount}
                  onChange={(e) => setAdjustData({ ...adjustData, amount: parseInt(e.target.value) || 0 })}
                  required
                  min="1"
                  placeholder="Enter quantity"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </div>
             
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <p className="text-purple-900">New Stock Level: <strong>
                  {adjustData.type === 'add' 
                    ? selectedProduct?.quantity + (adjustData.amount || 0)
                    : selectedProduct?.quantity - (adjustData.amount || 0)}
                </strong> units</p>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button type="submit" className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">✅ Apply Adjustment</button>
                <button type="button" onClick={() => setShowAdjustModal(false)} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all">
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminInventory;
