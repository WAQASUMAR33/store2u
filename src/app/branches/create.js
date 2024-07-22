'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateBranch() {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          address,
          city,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create branch');
        return;
      }

      const data = await response.json();
      router.push('/branches'); // Redirect to the branches list page or another page
    } catch (error) {
      console.error('Failed to submit form:', error);
      setError('Failed to create branch');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Branch</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600"
        >
          Create Branch
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
