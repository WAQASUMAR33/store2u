import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const FilterableTable = () => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newPixel, setNewPixel] = useState({ id: '', pixelCode: '' });
  
  useEffect(() => {
    fetchPixels();
  }, []);

  // Fetch all Facebook Pixel codes
  const fetchPixels = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/pixels');
      const data = await response.json();
      setFilteredData(data.data);
    } catch (error) {
      console.error('Error fetching pixels:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setFilteredData((prevData) =>
      (prevData || []).filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter]);

  const handleAddNewPixel = async () => {
    setIsModalOpen(false);
    setIsLoading(true);
    try {
      const response = newPixel.id
        ? await fetch(`/api/pixels/${newPixel.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPixel),
          })
        : await fetch('/api/pixels', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pixelCode: newPixel.pixelCode }),
          });

      if (!response.ok) {
        throw new Error('Failed to add or update pixel code');
      }

      fetchPixels(); // Refresh the list
      setNewPixel({ id: '', pixelCode: '' });
    } catch (error) {
      console.error('Error adding/updating pixel:', error);
    }
    setIsLoading(false);
  };

  const handleEditPixel = (item) => {
    setNewPixel({ id: item.id, pixelCode: item.pixelCode });
    setIsModalOpen(true);
  };

  const handleDeletePixel = async (id) => {
    setIsLoading(true);
    try {
      await fetch(`/api/pixels/${id}`, { method: 'DELETE' });
      fetchPixels(); // Refresh the list
    } catch (error) {
      console.error('Error deleting pixel:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className=" bg-gray-100 min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
      <div className="bg-white shadow rounded-lg p-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Facebook Pixel Codes</h2>
          <div className="flex space-x-2">
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => {
                setNewPixel({ id: '', pixelCode: '' });
                setIsModalOpen(true);
              }}
            >
              <PlusIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        {isSearchVisible && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pixel Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(filteredData) && filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.pixelCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditPixel(item)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePixel(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding/editing pixel code */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">{newPixel.id ? 'Edit Pixel Code' : 'Add New Pixel Code'}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Pixel Code</label>
              <input
                type="text"
                value={newPixel.pixelCode}
                onChange={(e) => setNewPixel({ ...newPixel, pixelCode: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewPixel}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {newPixel.id ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterableTable;
