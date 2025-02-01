'use client';
import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import axios from 'axios';

const FaqSection = () => {
  const [faqs, setFaqs] = useState([]); // Store fetched FAQs
  const [activeIndex, setActiveIndex] = useState(null);

  // Fetch FAQs from API on component mount
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get('/api/faq');
        setFaqs(response.data); // Set the fetched FAQs
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };
    fetchFaqs();
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 mb-8 md:mb-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 p-4 sm:p-10 md:p-0">
            Frequently<br /> Asked Questions
          </h2>
        </div>
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          {faqs.map((faq, index) => (
            <div key={faq.id} className={`p-4 border-b ${activeIndex === index ? 'bg-gray-100' : ''}`}>
              <div 
                className="flex items-center cursor-pointer justify-between" 
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-base sm:text-lg font-medium text-gray-800 flex-1">{faq.question}</span>
                {activeIndex === index ? (
                  <FiChevronUp className="text-gray-600 ml-4" />
                ) : (
                  <FiChevronDown className="text-gray-600 ml-4" />
                )}
              </div>
              <div className={`overflow-hidden transition-all duration-500 ${activeIndex === index ? 'max-h-screen' : 'max-h-0'}`}>
                <p className="mt-4 text-sm sm:text-base text-gray-700">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
