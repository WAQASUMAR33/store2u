'use client';

import React, { useEffect, useState } from 'react';
import { FiChevronRight, FiFacebook, FiInstagram } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa'; // Import TikTok icon
import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/navigation';

const TopBar = () => {
  const router = useRouter();
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: '',
  });
  const [loading, setLoading] = useState(true); // Loading state

  const fetchSocialMediaLinks = async () => {
    try {
      const response = await fetch(`/api/socialfirstrecodlink/2`);
      const data = await response.json();
      console.log('Response of social media links:', data);
      if (data.status) {
        setSocialMediaLinks(data.data);
      } else {
        console.error('Failed to fetch social media links');
      }
    } catch (error) {
      console.error('Error fetching social media links:', error);
    } finally {
      setLoading(false);
    }
  };

  const animationControls = useAnimation(); // Animation controls

  useEffect(() => {
    fetchSocialMediaLinks(); // Fetch social media links
    startAnimation(); // Start the animation on component mount
  }, [router]);

  const startAnimation = () => {
    animationControls.start({
      x: '-80%', // Move to the left
      transition: {
        duration: 25,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
        onRepeat: () => {
          animationControls.set({ x: '100%' }); // Reset to the right on loop
        },
      },
    });
  };

  const handleViewDetailsClick = () => {
    router.push('/customer/pages/discounted-products');
  };

  return (
    <div className="hidden w-full md:flex justify-center bg-white py-2 border-b border-gray-300 text-gray-800">
      <div className="container w-full flex flex-col md:flex-row justify-between items-center px-4">
        <div className="flex flex-col md:flex-row md:space-x-4 text-sm w-full">
          <div className="flex space-x-4 mb-2 md:mb-0 min-w-44">
            <a href="/customer/pages/contactus" className="hover:underline">
              Contact Us
            </a>
            <span>/</span>
            <a href="/customer/pages/aboutus" className="hover:underline">
              About Us
            </a>
          </div>
          <div className="hidden md:flex w-full overflow-x-hidden relative">
            <motion.div
              className="flex items-center space-x-6 text-gray-600 whitespace-nowrap absolute w-full"
              initial={{ x: '100%' }}
              animate={animationControls}
              onMouseEnter={() => animationControls.stop()} // Pause on hover
              onMouseLeave={() => startAnimation()} // Resume on hover leave
            >
              <FiChevronRight />
              <span>Get great devices up to 50% off</span>
              <button onClick={handleViewDetailsClick} className="text-blue-500 hover:underline">
                View details
              </button>
            </motion.div>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-4 text-sm">
          <div className="flex items-center justify-end space-x-2 text-[18px]">
            {loading ? (
              <p>Loading...</p> // Show loading while fetching data
            ) : (
              <>
                <a
                  href={socialMediaLinks.facebook || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500"
                >
                  <FiFacebook className="text-blue-600" />
                </a>
                <a
                  href={socialMediaLinks.instagram || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-500"
                >
                  <FiInstagram className="text-pink-500" />
                </a>
                <a
                  href={socialMediaLinks.tiktok || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black"
                >
                  <FaTiktok className="text-black" />
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
