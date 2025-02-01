'use client';
import React, { useEffect, useState } from 'react';

const SocialMediaForm = () => {
  const [formData, setFormData] = useState({
    id: null,
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: '',
    pinterest: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch social media links on mount
  useEffect(() => {
    const fetchSocialMediaLinks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/socialmedia');
        const result = await response.json();
        if (result.status && result.data.length > 0) {
          const existingData = result.data[0];
          setFormData({
            id: existingData.id,
            facebook: existingData.facebook || '',
            instagram: existingData.instagram || '',
            twitter: existingData.twitter || '',
            tiktok: existingData.tiktok || '',
            pinterest: existingData.pinterest || '',
          });
        }
      } catch (error) {
        console.error('Error fetching social media links:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocialMediaLinks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/socialmedia', {
        method: 'POST', // Using POST to handle both create and update
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.status) {
        alert('Social media links updated successfully!');
      } else {
        alert('Failed to update social media links.');
      }
    } catch (error) {
      console.error('Error updating social media links:', error);
      alert('An error occurred while updating the data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Social Media Links</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        {['facebook', 'instagram', 'twitter', 'tiktok', 'pinterest'].map((platform, index) => (
          <div key={index}>
            <label className="block text-gray-600 font-medium capitalize">
              {platform} URL:
            </label>
            <input
              type="url"
              name={platform}
              value={formData[platform]}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full mt-4 p-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700 transition"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Links'}
        </button>
      </form>
    </div>
  );
};

export default SocialMediaForm;
