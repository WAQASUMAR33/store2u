'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import Image from 'next/image';

const TopCategories = () => {
  const [categories, setCategories] = useState([]); // Ensure it's initialized as an array
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories'); // Replace with your actual API endpoint
        console.log('Fetched Categories:', response.data); // Debugging line

        // Access the categories correctly from response.data.data
        setCategories(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]); // Set categories as an empty array if error occurs
      }
    };
    fetchCategories();
  }, []);

  // Use slug instead of id
  const handleCategoryClick = (categorySlug) => {
    router.push(`/customer/pages/category/${categorySlug}`);
  };

  const backgroundColors = [
    'bg-red-100', 'bg-green-100', 'bg-blue-100', 'bg-pink-100', 'bg-gray-100', 'bg-yellow-100'
  ];

  return (
    <div className="container mx-auto py-8 bg-white text-center"> {/* Centered container */}
      <h2 className="text-2xl font-semibold mb-6">Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-center">    {/* 6 categories in a row on large screens */}
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((category, index) => (
            <motion.div
              key={category.slug} // Use slug as the key
              className={`${backgroundColors[index % backgroundColors.length]} rounded overflow-hidden text-center p-4 cursor-pointer`}
              onClick={() => handleCategoryClick(category.slug)} // Pass the slug to the handler
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
              style={{ minHeight: '240px' }} // Adjust the minHeight value as needed
            >
              {category.imageUrl ? (
                <motion.img
                  src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${category.imageUrl}`}
                  alt={category.name}
                  className="w-full h-40 object-cover mb-2 rounded-md" // Adjusted image size
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => {
                    console.error(`Failed to load image: ${e.target.src}`);
                    e.target.onerror = null; 
                    e.target.src = '/fallback-image.jpg'; // Replace with a path to a fallback image
                  }}
                />
              ) : (
                <Image
                  width={1000}
                  height={1000}
                  placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
                  src="/fallback-image.jpg"
                  alt={category.name}
                  className="w-full h-40 object-cover mb-2 rounded-md" // Ensured same size as dynamic image
                />
              )}
              <p className="text-lg font-semibold">{category.name}</p> {/* Slightly larger text */}
              <p className="text-gray-500">{category.tagline}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">No categories available</p>
        )}
      </div>
    </div>
  );
};

export default TopCategories;
