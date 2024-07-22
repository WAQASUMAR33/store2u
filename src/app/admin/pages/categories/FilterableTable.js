import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

const FilterableTable = ({ data, fetchData }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newItem, setNewItem] = useState({
    id: null,
    name: '',
    imageUrl: '',
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    setFilteredData(
      data.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, data]);

  const handleAddNewItem = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', newItem.name);
      if (image) {
        formData.append('image', image);
      } else if (newItem.id) {
        formData.append('imageUrl', newItem.imageUrl);
      }

      const response = newItem.id 
        ? await fetch(`/api/categories/${newItem.id}`, {
            method: 'PUT',
            body: formData,
          })
        : await fetch('/api/categories', {
            method: 'POST',
            body: formData,
          });

      const result = await response.json();
      fetchData(); // Refresh the data after adding or updating
      setIsModalOpen(false);
      setNewItem({ id: null, name: '', imageUrl: '' });
      setImage(null);
    } catch (error) {
      console.error('Error adding or updating item:', error);
    }
    setIsLoading(false);
  };


  const handleDeleteItem = async (id) => {
    setIsLoading(true);
    try {
      await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetchData(); // Refresh the data after deleting
    } catch (error) {
      console.error('Error deleting item:', error);
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
          <h2 className="text-xl font-semibold text-gray-800">Categories List</h2>
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
                setNewItem({
                  id: null,
                  name: '',
                  imageUrl: '',
                });
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover" />}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover" />}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.updatedAt).toLocaleString()}</td>
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
            <h2 className="text-xl mb-4">{newItem.id ? 'Edit Category' : 'Add New Category'}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {newItem.imageUrl && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Current Image</label>
                <img src={newItem.imageUrl} alt={newItem.name} className="w-32 h-32 object-cover mb-2" />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">New Image</label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
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
                onClick={handleAddNewItem}
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
