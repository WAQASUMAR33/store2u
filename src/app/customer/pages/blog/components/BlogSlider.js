'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function BlogCategorySlider({ category, blogs }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter blogs based on the category
  const filteredBlogs = blogs.filter((blog) => blog.category === category);

  // If there are no blogs in this category, return early
  if (filteredBlogs.length === 0) {
    return (
      <div className="w-full bg-white p-6 shadow-md text-center">
        <h2 className="text-2xl font-bold text-blue-500 mb-4">{category}</h2>
        <p className="text-gray-500">No blogs available in this category.</p>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? filteredBlogs.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === filteredBlogs.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="w-full bg-white p-6 shadow-md">
      <h2 className="text-2xl font-bold text-blue-500 mb-4">{category}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column: Slider */}
        <div className="relative items-center flex col-span-1 lg:col-span-2">
          <button
            onClick={handlePrevious}
            className="text-white p-2 absolute z-50 bg-yellow-400 left-5 rounded-full hover:scale-110 transition duration-300"
          >
            &#10094;
          </button>
          <button
            onClick={handleNext}
            className="text-white p-2 absolute z-50 bg-yellow-400 right-5 rounded-full hover:scale-110 transition duration-300"
          >
            &#10095;
          </button>

          <div className="relative w-full overflow-hidden rounded-lg shadow-xl">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {filteredBlogs.map((blog, index) => (
                <div
                  key={blog.id}
                  className="w-full flex-shrink-0"
                  style={{ flexBasis: '100%' }}
                >
                  <a href={`/customer/pages/blog/${blog.id}`}>
                    <div className="relative w-full h-64 sm:h-80 lg:h-[700px]">
                      <Image
                        width={1000}
                        height={1000}
                        src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${blog.image}`}
                        alt={blog.title}
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute bottom-0 bg-black bg-opacity-50 text-white p-4 w-full rounded-b-lg">
                        <h3 className="text-lg font-semibold">{blog.title}</h3>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Remaining blogs */}
        <div className="flex flex-col h-screen overflow-y-auto space-y-4">
          {filteredBlogs
            .slice(currentIndex + 1)
            .concat(filteredBlogs.slice(0, currentIndex))
            .map((blog, index) => (
              <div key={blog.id} className="flex items-center space-x-4">
                <div className="w-1/3">
                  <Image
                    width={1000}
                    height={1000}
                    src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${blog.image}`}
                    alt={blog.title}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </div>
                <div className="w-2/3">
                  <a href={`/customer/pages/blog/${blog.id}`}>
                    <h4 className="text-md font-bold text-gray-700">{blog.title}</h4>
                    <p className="text-sm text-gray-500 truncate">{blog.description}</p>
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
