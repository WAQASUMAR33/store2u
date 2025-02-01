'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ContactInfoPage = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
    address: '',
    website: '',
    owner: '',
  });
  const [contactInfo, setContactInfo] = useState(null);

  // Fetch the initial contact info if it exists
  useEffect(() => {
    async function fetchContactInfo() {
      try {
        const response = await axios.get('/api/contactinfo');
        if (Array.isArray(response.data) && response.data.length > 0) {
          const existingContact = response.data[0];
          setContactInfo(existingContact);
          setFormData({
            phoneNumber: existingContact.phoneNumber || '',
            email: existingContact.email || '',
            address: existingContact.address || '',
            website: existingContact.website || '',
            owner: existingContact.owner || '',
          });
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    }
    fetchContactInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (contactInfo && contactInfo.id) {
        // Update existing contact info
        await axios.put(`/api/contactinfo/${contactInfo.id}`, formData, {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        // Create new contact info
        const response = await axios.post('/api/contactinfo', formData, {
          headers: { 'Content-Type': 'application/json' },
        });
        setContactInfo(response.data);
      }
      alert('Contact information saved successfully!');
    } catch (error) {
      console.error('Error saving contact info:', error);
      alert('Failed to save contact information.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Contact Information</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['phoneNumber', 'email', 'address', 'website', 'owner'].map((field, index) => (
          <div key={index}>
            <label className="block text-gray-600 font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}:</label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>
        ))}
        <button type="submit" className="w-full mt-4 p-3 bg-gray-700 text-white font-semibold rounded hover:bg-gray-800 transition">
          {contactInfo ? 'Update Contact Info' : 'Save Contact Info'}
        </button>
      </form>
    </div>
  );
};

export default ContactInfoPage;
