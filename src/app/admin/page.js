'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneno: '',
    city: '',
    role: 'ADMIN', // Default role can be ADMIN or CUSTOMER
    image: null,
    base64: '',
  });

  const router = useRouter();

  // Check if a token already exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Redirect to the appropriate page based on stored role
      const userRole = localStorage.getItem('role');
      if (userRole === 'ADMIN') {
        router.push('/admin/pages/Products');
      } else if (userRole === 'CUSTOMER') {
        router.push('/customer/pages/login');
      }
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/login', { email, password });
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token); // Store JWT token in localStorage
        localStorage.setItem('role', user.role); // Store user role in localStorage

        if (user.role === 'ADMIN') {
          alert('Login Successfully');
          router.push('/admin/pages/Main');
        } else if (user.role === 'CUSTOMER') {
          alert('This ID exists for a customer');
          router.push('/customer/pages/login');
        } else {
          setError('Unknown role. Please contact support.');
        }
      } else {
        setError(response.data.message || 'Failed to log in. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
      setError('Failed to log in. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const uploadedImageUrl = await uploadImage(formData.base64);

      const formDataToSend = {
        ...formData,
        imageUrl: uploadedImageUrl,
        base64: '', // Remove base64 as it's no longer needed
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
      });

      const data = await response.json();
      if (data) {
        router.push('/admin');
      }

      if (data.status !== 100) {
        alert(data.message);
      } else {
        router.push('/admin/pages/register');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const uploadImage = async (base64) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_UPLOAD_IMAGE_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
      });
      const result = await response.json();
      if (response.ok) {
        return result.image_url; // Ensure this key matches the response from your upload endpoint
      } else {
        throw new Error(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: file,
        base64: reader.result.split(',')[1], // Get base64 part of the string
      }));
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {!isRegistering ? (
        <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleLogin}>
          <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      ) : (
        <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleRegister}>
          <h2 className="text-2xl font-bold mb-6">Register</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneno"
              value={formData.phoneno}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Profile Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
            Register
          </button>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsRegistering(false)}
              className="w-full mt-2 py-2 rounded-md text-white bg-gray-500 hover:bg-gray-600"
            >
              Back to Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginPage;
