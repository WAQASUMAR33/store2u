'use client';
import { useState } from 'react';

const NewCustomerForm = () => {
  const [formData, setFormData] = useState({
    Full_Name: '',
    Passport_No: '',
    CNIC_No: '',
    Father_Name: '',
    Nationality: '',
    City: '',
    Address: '',
    Phone_No1: '',
    Phone_No2: '',
    Gender: '',
    Age: '',
    Email: '',
    Interested_Country: '',
    Educational_Actitvity: '',
    List_degree_completed: '',
    Marital_Status: '',
    NTN_N0: '',
    Employment_Status: '',
    Parents_CNIC_No: '',
    Birth_Place: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to create customer');
      }

      const result = await response.json();
      console.log('Customer created:', result);
      // Reset form after successful submission
      setFormData({
        Full_Name: '',
        Passport_No: '',
        CNIC_No: '',
        Father_Name: '',
        Nationality: '',
        City: '',
        Address: '',
        Phone_No1: '',
        Phone_No2: '',
        Gender: '',
        Age: '',
        Email: '',
        Interested_Country: '',
        Educational_Actitvity: '',
        List_degree_completed: '',
        Marital_Status: '',
        NTN_N0: '',
        Employment_Status: '',
        Parents_CNIC_No: '',
        Birth_Place: '',
      });
    } catch (error) {
      console.error('Error:', error);
      alert(error.message); // Provide feedback to the user
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Customer</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div className="mb-4" key={key}>
            <label htmlFor={key} className="block text-sm font-medium text-gray-700">
              {key.replace(/_/g, ' ')}
            </label>
            <input
              type="text"
              id={key}
              name={key}
              className="mt-1 p-2 block w-full border rounded-md"
              value={formData[key]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md"
        >
          Create Customer
        </button>
      </form>
    </div>
  );
};

export default NewCustomerForm;
