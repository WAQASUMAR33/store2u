// components/Subscribe.js
import React from 'react';

export default function Subscribe() {
  return (
    <div className="bg-blue-600 h-auto text-white py-12 px-6 rounded-lg flex flex-col justify-center items-center">
      <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-center">
        Subscribe For More Info And Update About Coupons
      </h2>
      <div className="flex items-center max-w-lg w-full mt-8">
        <div className="flex items-center bg-white text-blue-600 rounded-l-full px-4 py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 12V2m-4 4v2m4 6h6m-4 4h2M2 16V4a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H6l-4 4z"
            />
          </svg>
        </div>
        <input
          type="email"
          placeholder="Your email here"
          className="flex-1 px-4 py-2 text-black rounded-r-full focus:outline-none"
        />
        <button className="bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-2 rounded-full ml-2">
          Subscribe Now
        </button>
      </div>
    </div>
  );
}
