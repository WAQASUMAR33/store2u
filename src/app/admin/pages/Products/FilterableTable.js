import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Select from 'react-select';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


const FilterableTable = ({ products, fetchProducts, categories, subcategories }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(products || []);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    subcategoryId: '',
    colors: [],
    sizes: [],
    image: null, // Image file
    imageUrl: '', // Image URL
  });
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFilteredData(
      (products || []).filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, products]);

  useEffect(() => {
    if (newProduct.categoryId) {
      setFilteredSubcategories(
        (subcategories || []).filter(subcat => subcat.categoryId === parseInt(newProduct.categoryId))
      );
    } else {
      setFilteredSubcategories([]);
    }
  }, [newProduct.categoryId, subcategories]);

  const handleAddNewItem = async () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.stock || !newProduct.subcategoryId) {
      alert("All fields are required");
      return;
    }
    setIsLoading(true);
    try {
      const uploadedImages = await Promise.all(images.map(async (img) => {
        const imageBase64 = await convertToBase64(img);
        const response = await fetch('https://appstore.store2u.ca/uploadImage.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: imageBase64 }),
        });
        const result = await response.json();
        if (response.ok) {
          return result.image_url;
        } else {
          throw new Error(result.error || 'Failed to upload image');
        }
      }));
  
      const productToSubmit = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        subcategoryId: parseInt(newProduct.subcategoryId),
        colors: JSON.stringify(newProduct.colors.map(color => color.value)),
        sizes: JSON.stringify(newProduct.sizes.map(size => size.value)),
        images: uploadedImages,
      };
  
      const response = newProduct.id 
        ? await fetch(`/api/products/${newProduct.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(productToSubmit),
          })
        : await fetch(`/api/products`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(productToSubmit),
          });
  
      if (response.ok) {
        fetchProducts(); // Refresh the data after adding/updating
        setIsModalOpen(false);
        setNewProduct({
          id: null,
          name: '',
          description: '',
          price: '',
          stock: '',
          categoryId: '',
          subcategoryId: '',
          colors: [],
          sizes: [],
          image: null,
          imageUrl: '',
        });
        setImages([]);
      } else {
        const errorData = await response.json();
        console.error('Failed to create/update product:', errorData.message);
      }
    } catch (error) {
      console.error('Error adding/updating item:', error);
    }
    setIsLoading(false);
  };
  
  const handleDeleteItem = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        fetchProducts(); // Refresh the data after deleting
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    setIsLoading(false);
  };
  
  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditItem = (item) => {
    setNewProduct({
      ...item,
      colors: Array.isArray(item.colors) ? item.colors.map(color => ({ value: color, label: color })) : [],
      sizes: Array.isArray(item.sizes) ? item.sizes.map(size => ({ value: size, label: size })) : [],
      image: null, // Reset image for edit
      imageUrl: item.imageUrl, // Existing image URL
    });
    setImages(item.images || []);
    setIsModalOpen(true);
  };
  
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };
  
  const colorOptions = [
    { value: 'Red', label: 'Red' },
    { value: 'Blue', label: 'Blue' },
    { value: 'Green', label: 'Green' },
    // Add more colors as needed
  ];

  const sizeOptions = [
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    // Add more sizes as needed
  ];


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
      <div className="bg-white shadow rounded-lg p-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Products List</h2>
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
                setNewProduct({
                  id: null,
                  name: '',
                  description: '',
                  price: '',
                  stock: '',
                  categoryId: '',
                  subcategoryId: '',
                  colors: [],
                  sizes: [],
                  image: null,
                  imageUrl: '',
                });
                setImages([]);
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(filteredData) && filteredData.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.url ? <img src={`https://appstore.store2u.ca/uploads/${item.url}`} alt={item.name} className="w-12 h-12 object-cover" /> : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.updatedAt).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 w-[700px]  rounded shadow-lg">
          <div className="flex justify-end space-x-2 mt-4">
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
                {newProduct.id ? 'Update' : 'Add'}
              </button>
            </div>
            <Tabs>
              <TabList>
                <Tab>Details</Tab>
                <Tab>Images</Tab>
              </TabList>
            <div className='h-[80vh] overflow-y-auto'>
              <TabPanel>
                <h2 className="text-xl mb-4 ">{newProduct.id ? 'Edit Product' : 'Add New Product'}</h2>
                <div className="mb-4 ">
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) => {
                      const categoryId = e.target.value;
                      setNewProduct({ ...newProduct, categoryId, subcategoryId: '' });
                      setFilteredSubcategories(
                        (subcategories || []).filter(subcat => subcat.categoryId === parseInt(categoryId))
                      );
                    }}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {Array.isArray(categories) && categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                {filteredSubcategories.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                    <select
                      value={newProduct.subcategoryId}
                      onChange={(e) => setNewProduct({ ...newProduct, subcategoryId: e.target.value })}
                      className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Subcategory</option>
                      {filteredSubcategories.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Colors</label>
                  <Select
                    isMulti
                    value={newProduct.colors}
                    onChange={(selected) => setNewProduct({ ...newProduct, colors: selected })}
                    options={colorOptions}
                    className="mt-1"
                    classNamePrefix="select"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Sizes</label>
                  <Select
                    isMulti
                    value={newProduct.sizes}
                    onChange={(selected) => setNewProduct({ ...newProduct, sizes: selected })}
                    options={sizeOptions}
                    className="mt-1"
                    classNamePrefix="select"
                  />
                </div>
              </TabPanel>
              <TabPanel>
      <h2 className="text-xl mb-4">Upload Images</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Images</label>
        <input
          type="file"
          onChange={handleImageChange}
          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          multiple
        />
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Uploaded Images</h3>
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Product Image ${index}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </TabPanel>
    </div>
            </Tabs>
            {/* <div className="flex justify-end space-x-2 mt-4">
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
                {newProduct.id ? 'Update' : 'Add'}
              </button>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterableTable;
