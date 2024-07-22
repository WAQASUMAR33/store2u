'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateBranchForm() {
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const branchData = {
      title,
      city,
      address,
    };

    try {
      const response = await fetch('/api/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(branchData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create branch');
      }

      setTitle('');
      setCity('');
      setAddress('');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Create a New Branch</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          className="mt-1 p-2 block w-full border rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
        <input
          type="text"
          id="city"
          className="mt-1 p-2 block w-full border rounded-md"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          id="address"
          className="mt-1 p-2 block w-full border rounded-md"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Branch'}
      </button>
    </form>
  );
}
