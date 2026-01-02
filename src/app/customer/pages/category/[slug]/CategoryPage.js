'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ThreeDots } from 'react-loader-spinner';
import Image from 'next/image';

/**
 * Fetches subcategories by category slug
 * @param {string} categorySlug - Category slug identifier
 * @returns {Promise<Array>} Array of subcategories
 */
const fetchSubcategoriesByCategorySlug = async (categorySlug) => {
  if (!categorySlug) {
    return [];
  }

  try {
    const response = await axios.get(`/api/subcategories/${categorySlug}`);
    if (response.data?.status && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching subcategories:', error);
    }
    return [];
  }
};

/**
 * Category Page Component
 * Displays category information and its subcategories
 */
const CategoryPage = ({ categoryData }) => {
  const { slug } = useParams();
  const router = useRouter();
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubcategories = useCallback(async () => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const subcategoriesData = await fetchSubcategoriesByCategorySlug(slug);
      setSubcategories(Array.isArray(subcategoriesData) ? subcategoriesData : []);
    } catch (err) {
      setError('Failed to fetch subcategories. Please try again later.');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching subcategories:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  // Handle subcategory click to navigate to the subcategory's page
  const handleSubcategoryClick = useCallback((subcategorySlug) => {
    if (subcategorySlug) {
      router.push(`/customer/pages/subcategories/${subcategorySlug}`);
    }
  }, [router]);
  
  // Background colors for subcategory cards
  const backgroundColors = ['bg-red-100', 'bg-green-100', 'bg-blue-100', 'bg-pink-100', 'bg-gray-100', 'bg-yellow-100'];

  // Display loading spinner when data is still being fetched
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" role="status" aria-label="Loading subcategories">
        <ThreeDots 
          height="80" 
          width="80" 
          radius="9" 
          color="#3498db" 
          ariaLabel="three-dots-loading" 
          visible={true} 
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-800 font-semibold mb-2">Error</p>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchSubcategories}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600 text-center">Category information not available.</p>
      </div>
    );
  }

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder-image.png';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    const baseUrl = process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL || '';
    return baseUrl ? `${baseUrl}/${imageUrl}` : imageUrl;
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <h1 className="text-3xl font-bold mb-2">{categoryData.name || 'Category'}</h1>
      <h2 className="text-xl font-semibold mb-6 text-gray-600">Subcategories</h2>
      
      {subcategories && subcategories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {subcategories.map((subcategory, index) => (
            <motion.div
              key={subcategory.id || index}
              className={`${backgroundColors[index % backgroundColors.length]} shadow-lg overflow-hidden text-center p-2 cursor-pointer rounded-lg transition-all`}
              onClick={() => handleSubcategoryClick(subcategory.slug)}
              whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.3 }}
              style={{ minHeight: '200px' }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSubcategoryClick(subcategory.slug);
                }
              }}
              aria-label={`View ${subcategory.name} subcategory`}
            >
              {subcategory.imageUrl ? (
                <Image
                  width={200}
                  height={200}
                  src={getImageUrl(subcategory.imageUrl)}
                  alt={subcategory.name || 'Subcategory image'}
                  className="w-full h-40 object-cover mb-2 rounded"
                  unoptimized
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.png';
                  }}
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 mb-2 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}
              <p className="text-lg font-normal">{subcategory.name || 'Unnamed Subcategory'}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No subcategories available for this category.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
