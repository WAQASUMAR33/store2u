import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { FaDownload, FaTimes } from 'react-icons/fa';

const visaTypes = ["Skilled Immigration", "Business Immigration", "Student Immigration", "Citizenship Immigration", "Study Visa"];
const visaCountries = ["UK", "USA", "Canada", "Australia", "Hungary", "Italy", "Finland", "France", "Poland", "Germany", "Sweden", "Austria", "Portugal", "Netherlands", "Belgium", "Norway"];
// Handling the uploaded files

const FilterableTable = ({ data, fetchData }) => {
// Handling the uploaded files
const handleDownloadFile = (file) => {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleCancelFile = (index) => {
  setUploads(uploads.filter((_, i) => i !== index));
};


  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newItem, setNewItem] = useState({
    Full_Name: '',
    Passport_No: '',
    CNIC_No: '',
    Father_Name: '',
    Visa_Type: '',
    Visa_Country: '',
    Nationality: '',
    City: '',
    Address: '',
    Phone_No1: '',
    Phone_No2: '',
    Gender: '',
    Age: '',
    Email: '',
    Interested_Country: '',
    Educational_Activity: '',
    List_degree_completed: '',
    Marital_Status: '',
    NTN_No: '',
    Employment_Status: '',
    Parents_CNIC_No: '',
    Birth_Place: '',
    Uploaded_Files: '',
  });
  const [fileTypes, setFileTypes] = useState([]);
  const [selectedFileType, setSelectedFileType] = useState('');
  const [file, setFile] = useState(null);
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    fetchFileTypes();
    setFilteredData(
      data.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, data]);

  const fetchFileTypes = async () => {
    try {
      const response = await fetch('/api/filetype');
      const data = await response.json();
      setFileTypes(data);
    } catch (error) {
      console.error('Error fetching file types:', error);
    }
  };

  const handleFileTypeChange = (event) => {
    setSelectedFileType(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleAddFile = () => {
    if (file && selectedFileType) {
      const newUpload = { file, type: selectedFileType };
      setUploads([...uploads, newUpload]);
      setFile(null);
      setSelectedFileType('');
    } else {
      alert('Please select a file type and file');
    }
  };

  const handleAddOrUpdateItem = async () => {
    setIsLoading(true);
    const method = newItem.id ? 'PUT' : 'POST';
    const url = newItem.id ? `/api/user/${newItem.id}` : '/api/user';
  
    // Include uploads in newItem
    const updatedNewItem = {
      ...newItem,
      Uploaded_Files: JSON.stringify(uploads)
    };
  
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNewItem),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add/update item');
      }
      await handleSaveFiles();
      fetchData(); // Refresh the data after adding/updating
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding/updating item:', error);
      alert(`Error: ${error.message}`);
    }
    setIsLoading(false);
  };
  

  const handleSaveFiles = async () => {
    const formData = new FormData();
    uploads.forEach(upload => {
      formData.append('files', upload.file);
      formData.append('types', upload.type);
    });
    try {
      const response = await fetch('/api/uploadfile', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to save files');
      setUploads([]); // Clear after upload
    } catch (error) {
      console.error('Error saving files:', error);
      throw new Error('Error uploading files');
    }
  };

  const handleDeleteItem = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete item');
      }
      fetchData(); // Refresh the data after deleting
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(`Error: ${error.message}`);
    }
    setIsLoading(false);
  };

  const handleEditItem = (item) => {
    setNewItem(item);
    setUploads(item.Uploaded_Files ? JSON.parse(item.Uploaded_Files) : []);
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
          <h2 className="text-xl font-semibold text-gray-800">Customers List</h2>
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
                  Full_Name: '',
                  Passport_No: '',
                  CNIC_No: '',
                  Father_Name: '',
                  Visa_Type: '',
                  Visa_Country: '',
                  City: '',
                  Address: '',
                  Phone_No1: '',
                  Phone_No2: '',
                  Gender: '',
                  Age: '',
                  Email: '',
                  Interested_Country: '',
                  Educational_Activity: '',
                  List_degree_completed: '',
                  Marital_Status: '',
                  NTN_No: '',
                  Employment_Status: '',
                  Parents_CNIC_No: '',
                  Birth_Place: '',
                  Uploaded_Files: '',
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visa Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visa Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.Full_Name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.Email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.Phone_No1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.Visa_Type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.Visa_Country}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.City}</td>
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
          <div className="bg-white p-4 w-[900px] max-h-[90vh] overflow-y-auto rounded shadow-lg">
            <h2 className="text-xl mb-4">{newItem.id ? 'Edit Customer' : 'Add New Customer'}</h2>
            <div className="grid grid-cols-1 gap-4">
              {/* Visa Details */}
              <h3 className="text-lg" >Visa Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Visa Type</label>
                  <select
                    value={newItem.Visa_Type}
                    onChange={(e) => setNewItem({ ...newItem, Visa_Type: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {visaTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Visa Country</label>
                  <select
                    value={newItem.Visa_Country}
                    onChange={(e) => setNewItem({ ...newItem, Visa_Country: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {visaCountries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Personal Information Section */}
              <h3 className="text-lg" >Personal Information</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={newItem.Full_Name}
                    onChange={(e) => setNewItem({ ...newItem, Full_Name: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Passport No</label>
                  <input
                    type="text"
                    value={newItem.Passport_No}
                    onChange={(e) => setNewItem({ ...newItem, Passport_No: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">CNIC No</label>
                  <input
                    type="text"
                    value={newItem.CNIC_No}
                    onChange={(e) => setNewItem({ ...newItem, CNIC_No: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Father Name</label>
                  <input
                    type="text"
                    value={newItem.Father_Name}
                    onChange={(e) => setNewItem({ ...newItem, Father_Name: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Nationality</label>
                  <input
                    type="text"
                    value={newItem.Nationality}
                    onChange={(e) => setNewItem({ ...newItem, Nationality: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={newItem.City}
                    onChange={(e) => setNewItem({ ...newItem, City: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    value={newItem.Address}
                    onChange={(e) => setNewItem({ ...newItem, Address: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={newItem.Email}
                    onChange={(e) => setNewItem({ ...newItem, Email: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Phone No1</label>
                  <input
                    type="text"
                    value={newItem.Phone_No1}
                    onChange={(e) => setNewItem({ ...newItem, Phone_No1: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Phone No2</label>
                  <input
                    type="text"
                    value={newItem.Phone_No2}
                    onChange={(e) => setNewItem({ ...newItem, Phone_No2: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <input
                    type="text"
                    value={newItem.Gender}
                    onChange={(e) => setNewItem({ ...newItem, Gender: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="text"
                    value={newItem.Age}
                    onChange={(e) => setNewItem({ ...newItem, Age: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Interested Country</label>
                  <input
                    type="text"
                    value={newItem.Interested_Country}
                    onChange={(e) => setNewItem({ ...newItem, Interested_Country: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                </div>
                <h3 className="text-lg" >Educational Information</h3>
                <div className="grid grid-cols-3 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Educational Activity</label>
                  <input
                    type="text"
                    value={newItem.Educational_Activity}
                    onChange={(e) => setNewItem({ ...newItem, Educational_Activity: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">List of Degrees Completed</label>
                  <input
                    type="text"
                    value={newItem.List_degree_completed}
                    onChange={(e) => setNewItem({ ...newItem, List_degree_completed: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                </div>
                <h3 className="text-lg" >Other Information</h3>
                <div className="grid grid-cols-3 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                  <input
                    type="text"
                    value={newItem.Marital_Status}
                    onChange={(e) => setNewItem({ ...newItem, Marital_Status: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">NTN No</label>
                  <input
                    type="text"
                    value={newItem.NTN_No}
                    onChange={(e) => setNewItem({ ...newItem, NTN_No: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Employment Status</label>
                  <input
                    type="text"
                    value={newItem.Employment_Status}
                    onChange={(e) => setNewItem({ ...newItem, Employment_Status: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Parents CNIC No</label>
                  <input
                    type="text"
                    value={newItem.Parents_CNIC_No}
                    onChange={(e) => setNewItem({ ...newItem, Parents_CNIC_No: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Birth Place</label>
                  <input
                    type="text"
                    value={newItem.Birth_Place}
                    onChange={(e) => setNewItem({ ...newItem, Birth_Place: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {/* File Upload Section */}
              <div className="mb-4">
<h3 className="text-lg font-semibold mb-2">File Upload</h3>
  <div className="grid grid-cols-2 gap-4">
    <div>
      <select value={selectedFileType} onChange={handleFileTypeChange} className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">Select File Type</option>
        {fileTypes.map(type => (
          <option key={type.id} value={type.title}>{type.title}</option>
        ))}
      </select>
      <input type="file" onChange={handleFileChange} className="mt-2 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <button onClick={handleAddFile} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Upload File</button>
    </div>
    <div>
      <h3 className="text-lg font-semibold mb-2">Uploaded Files</h3>
      {uploads.length > 0 && (
        <ul className="mt-2 list-disc list-inside">
          {uploads.map((upload, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{upload.file.name ? upload.file.name : upload.name} - {upload.type}</span>
              <div>
                <button onClick={() => handleDownloadFile(upload.file ? upload.file : new File([], upload.name))} className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">
                  <FaDownload />
                </button>
                <button onClick={() => handleCancelFile(index)} className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                  <FaTimes />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterableTable;
