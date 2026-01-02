'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiMail, FiSend } from 'react-icons/fi';

export default function Subscribe() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call - replace with actual subscription endpoint
    setTimeout(() => {
      toast.success('Thank you for subscribing!');
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16 md:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full p-4 mb-6">
            <FiMail className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest articles, tips, and exclusive offers delivered straight to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiMail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-full focus:outline-none focus:ring-4 focus:ring-white/50 transition-all shadow-lg"
                required
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full overflow-hidden transition-all duration-300 hover:bg-gray-100 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe Now
                    <FiSend className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </div>
          <p className="text-center text-blue-100 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </div>
    </div>
  );
}
