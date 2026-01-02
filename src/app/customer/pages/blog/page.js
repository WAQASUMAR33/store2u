'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar, FiClock, FiArrowRight, FiTag } from 'react-icons/fi';
import BlogCategorySlider from './components/BlogSlider';
import Subscribe from './components/Subcribe';
import BlogSection from './components/Blogsection';
import { BlogCardShimmer, GridShimmer } from '../../components/Shimmer';

export default function Blog() {
  const [featuredPost, setFeaturedPost] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [visibleBlogs, setVisibleBlogs] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/blog');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blogs: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle different response formats
        const blogsArray = Array.isArray(data) ? data : (data.data || []);
        
        setBlogs(blogsArray);
        if (blogsArray.length > 0) {
          setFeaturedPost(blogsArray[0]);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const showMoreBlogs = () => {
    setVisibleBlogs((prev) => prev + 6);
  };

  // Calculate reading time (approximate)
  const calculateReadingTime = (text) => {
    if (!text) return 1;
    const wordsPerMinute = 200;
    const textContent = text.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Our Blog
            </h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Discover the latest insights, tips, and stories
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        {loading ? (
          <>
            {/* Featured Post Shimmer */}
            <div className="mb-16">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2 h-64 md:h-96 bg-gray-200 animate-pulse"></div>
                  <div className="md:w-1/2 p-8 md:p-12 space-y-4">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Blog Posts Shimmer */}
            <div className="mb-12">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8"></div>
              <GridShimmer 
                ItemComponent={BlogCardShimmer} 
                count={6}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              />
            </div>
          </>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="md:flex">
                <div className="md:w-1/2 relative h-64 md:h-96">
                  <Image
                    width={800}
                    height={600}
                    src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${featuredPost.image}`}
                    alt={featuredPost.title || "Featured Blog Image"}
                    className="w-full h-full object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiTag className="w-4 h-4" />
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                        {featuredPost.category || 'Uncategorized'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCalendar className="w-4 h-4" />
                      <span>{formatDate(featuredPost.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      <span>{calculateReadingTime(featuredPost.description)} min read</span>
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 line-clamp-2">
                    {featuredPost.title}
                  </h2>
                  <div
                    className="text-gray-600 mb-6 line-clamp-3"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                    dangerouslySetInnerHTML={{ __html: featuredPost.description }}
                  />
                  <Link
                    href={`/customer/pages/blog/${featuredPost.id}`}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold group"
                  >
                    Read Full Article
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Slider */}
        {!loading && blogs.length > 0 && (
          <div className="mb-16">
            <BlogCategorySlider category="Perfume" blogs={blogs} />
          </div>
        )}

        {/* Blog Posts Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Latest Articles
            </h2>
            <div className="hidden md:block text-gray-600">
              {blogs.length} articles
            </div>
          </div>
          <BlogPosts 
            blogs={blogs.slice(0, visibleBlogs)} 
            calculateReadingTime={calculateReadingTime}
            formatDate={formatDate}
          />
        </div>

            {/* Show More Button */}
            {visibleBlogs < blogs.length && (
              <div className="text-center mt-12">
                <button
                  onClick={showMoreBlogs}
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full overflow-hidden transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Load More Articles
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Blog Section & Subscribe */}
      {!loading && blogs.length > 0 && (
        <div className="bg-gray-50 py-16 mt-12">
          <div className="container mx-auto px-4">
            <BlogSection blogs={blogs} title="Perfume" />
          </div>
        </div>
      )}
      
      {!loading && <Subscribe />}
    </div>
  );
}

/* Blog Posts Component */
function BlogPosts({ blogs, calculateReadingTime, formatDate }) {
  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No blog posts available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((post, index) => (
        <article
          key={post.id || index}
          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
        >
          <Link href={`/customer/pages/blog/${post.id}`}>
            <div className="relative h-56 overflow-hidden">
              <Image
                width={800}
                height={400}
                src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${post.image}`}
                alt={post.title || "Blog Image"}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </Link>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <FiCalendar className="w-3 h-3" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <FiClock className="w-3 h-3" />
                <span>{calculateReadingTime(post.description)} min</span>
              </div>
            </div>

            <div className="mb-3">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                {post.category || 'Uncategorized'}
              </span>
            </div>

            <Link href={`/customer/pages/blog/${post.id}`}>
              <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h3>
            </Link>

            <div
              className="text-gray-600 text-sm mb-4 line-clamp-3"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              dangerouslySetInnerHTML={{ __html: post.description }}
            />

            <Link
              href={`/customer/pages/blog/${post.id}`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm group"
            >
              Read More
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
