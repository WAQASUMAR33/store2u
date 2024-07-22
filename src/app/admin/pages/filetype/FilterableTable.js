import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

const FilterableTable = ({ fetchData }) => {
  const [filter, setFilter] = useState('');
  const [filetypes, setFiletypes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
  });

  useEffect(() => {
    fetchData().then(data => {
      setFiletypes(data);
      setFilteredData(data);
    });
  }, []);

  useEffect(() => {
    setFilteredData(
      filetypes.filter(filetype =>
        filetype.title.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, filetypes]);

  const handleAddOrUpdateItem = async () => {
    setIsLoading(true);
    const method = newItem.id ? 'PUT' : 'POST';
    const url = newItem.id ? `/api/filetype/${newItem.id}` : '/api/filetype';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newItem.title }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add/update item');
      }
      fetchData().then(data => setFiletypes(data));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding/updating item:', error);
      alert(`Error: ${error.message}`);
    }
    setIsLoading(false);
  };

  const handleDeleteItem = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/filetype/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete item');
      }
      fetchData().then(data => setFiletypes(data));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(`Error: ${error.message}`);
    }
    setIsLoading(false);
  };

  const handleEditItem = (item) => {
    setNewItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
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
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => {
                setNewItem({ title: '' });
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out">Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
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
            <h2 className="text-xl mb-4">{newItem.id ? 'Edit File Type' : 'Add New File Type'}</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdateItem}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {newItem.id ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterableTable;
