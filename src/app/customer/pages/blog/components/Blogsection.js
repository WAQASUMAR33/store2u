'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // ✅ Import Image from 'next/image'

const BlogSection = ({ blogs, title, category }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blogsToShow, setBlogsToShow] = useState(4); // Default to 4
  const router = useRouter();

  // Filter blogs by category
  const filteredBlogs = blogs.filter(blog => blog.category === title);

  useEffect(() => {
    // Adjust number of blogs to show based on screen width
    const updateBlogsToShow = () => {
      if (window.innerWidth >= 1024) {
        setBlogsToShow(4);
      } else if (window.innerWidth >= 768) {
        setBlogsToShow(2);
      } else {
        setBlogsToShow(1);
      }
    };

    updateBlogsToShow();
    window.addEventListener('resize', updateBlogsToShow);
    return () => window.removeEventListener('resize', updateBlogsToShow);
  }, []);

  const handlePrevious = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? Math.ceil(filteredBlogs.length / blogsToShow) - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === Math.ceil(filteredBlogs.length / blogsToShow) - 1 ? 0 : prevIndex + 1
    );
  };

  const handleBlogClick = blog => {
    router.push(`/customer/pages/blog/${blog.id}`);
  };

  return (
    <div className="relative flex flex-col bg-white h-full justify-center items-center w-full px-4">
      <h2 className="text-2xl bg-[#06089B] font-bold mb-4 p-2 text-white w-full">{title}</h2>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrevious}
        className="text-white p-2 absolute z-50 bg-yellow-400 left-5 rounded-full hover:scale-110 transition duration-300"
      >
        <span className="text-white font-bold">&#10094;</span>
      </button>
      <button
        onClick={handleNext}
        className="text-white p-2 absolute z-50 bg-yellow-400 right-5 rounded-full hover:scale-110 transition duration-300"
      >
        <span className="text-white font-bold">&#10095;</span>
      </button>

      {/* Blog Slider */}
      <div className="relative overflow-hidden rounded-lg w-full">
        <div
          className="flex transition-transform duration-700 space-x-4 ease-in-out py-10"
          style={{ transform: `translateX(-${currentIndex * (100 / blogsToShow)}%)` }}
        >
          {filteredBlogs.map((blog, index) => (
            <div
              key={index}
              className="flex-shrink-0 cursor-pointer"
              style={{ flexBasis: `${100 / blogsToShow}%` }}
              onClick={() => handleBlogClick(blog)}
            >
              <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                {/* Blog Image */}
                <div className="relative pb-56 flex-shrink-0">
                  <Image
                    width={1000}
                    height={1000}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSk..." // Replace with actual Base64 placeholder
                    src={blog.image ? `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${blog.image}` : "/fallback.jpg"}
                    alt={blog.title || "Blog Image"}
                    className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                  />
                </div>

                {/* Blog Content */}
                <div className="p-4 flex-grow">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{blog.title}</h3>
                  <div
                    className="text-gray-700 text-sm overflow-hidden text-ellipsis"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3, // Limit to 3 lines
                      WebkitBoxOrient: 'vertical',
                    }}
                    dangerouslySetInnerHTML={{ __html: blog.description }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
