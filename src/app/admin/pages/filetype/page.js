'use client';
import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

const FilterType = () => {
  const [filetypes, setFiletypes] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredFiletypes, setFilteredFiletypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newFiletype, setNewFiletype] = useState({ id: '', title: '' });

  useEffect(() => {
    fetchFiletypes();
  }, []);

  useEffect(() => {
    setFilteredFiletypes(
      filetypes.filter((filetype) =>
        filetype.title.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, filetypes]);

  const fetchFiletypes = async () => {
    try {
      const response = await fetch('/api/filetype');
      const result = await response.json();
      setFiletypes(result);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching filetypes:', error);
      setIsLoading(false);
    }
  };

  const handleAddOrUpdateFiletype = async () => {
    setIsLoading(true);
    try {
      const method = newFiletype.id ? 'PUT' : 'POST';
      const endpoint = newFiletype.id ? `/api/filetype/${newFiletype.id}` : '/api/filetype';
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFiletype),
      });

      if (!response.ok) {
        throw new Error('Failed to save filetype');
      }

      fetchFiletypes();
      setIsModalOpen(false);
      setNewFiletype({ id: '', title: '' });
    } catch (error) {
      console.error('Error saving filetype:', error);
    }
    setIsLoading(false);
  };

  const handleDeleteFiletype = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/filetype/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete filetype');
      }

      fetchFiletypes();
    } catch (error) {
      console.error('Error deleting filetype:', error);
    }
    setIsLoading(false);
  };

  const handleEditFiletype = (filetype) => {
    setNewFiletype(filetype);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
      <div className="bg-white shadow rounded-lg p-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">File Types</h2>
          <div className="flex space-x-2">
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFiletypes.map((filetype) => (
                <tr key={filetype.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{filetype.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{filetype.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(filetype.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(filetype.updatedAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditFiletype(filetype)}
                      className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out">Edit
                    </button>
                    <button
                      onClick={() => handleDeleteFiletype(filetype.id)}
                      className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out">Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 w-[700px] rounded shadow-lg">
            <h2 className="text-xl mb-4">{newFiletype.id ? 'Edit File Type' : 'Add New File Type'}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={newFiletype.title}
                onChange={(e) => setNewFiletype({ ...newFiletype, title: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdateFiletype}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {newFiletype.id ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterType;
