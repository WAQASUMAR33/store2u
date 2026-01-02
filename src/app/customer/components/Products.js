'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ThreeDots } from 'react-loader-spinner';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ProductCardShimmer, GridShimmer } from './Shimmer';

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [productIndices, setProductIndices] = useState({});
  const [windowWidth, setWindowWidth] = useState(0); // To handle responsive product display

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        console.log('Fetching categories...');
        const categoryResponse = await axios.get('/api/categories');
        const categoriesData = categoryResponse.data.data || [];
        console.log('Categories fetched:', categoriesData);
        setCategories(categoriesData);

        console.log('Fetching subcategories...');
        const subcategoryResponse = await axios.get('/api/subcategories');
        const subcategoriesData = subcategoryResponse.data.data || [];
        console.log('Subcategories fetched:', subcategoriesData);
        setSubcategories(subcategoriesData);

        console.log('Fetching products...');
        const productsResponse = await axios.get('/api/products');
        const productsData = productsResponse.data || [];
        console.log('Products fetched:', productsData);
        setProducts(productsData);

        // Initialize product indices
        const initialIndices = {};
        categoriesData.forEach((category) => {
          initialIndices[category.slug] = 0;
        });
        console.log('Initial product indices:', initialIndices);
        setProductIndices(initialIndices);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories and products:', error);
        setLoading(false);
      }
    };

    fetchCategoriesAndSubcategories();

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      console.log('Window resized:', window.innerWidth);
    };

    // Set initial window width
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Updated to accept 'slug' instead of 'id'
  const handleProductClick = (slug) => {
    console.log(`Navigating to product with slug: ${slug}`);
    router.push(`/customer/pages/products/${slug}`); // Navigate using slug
  };

  const scrollRight = (categorySlug, categoryProducts) => {
    setProductIndices((prevIndices) => {
      const productsPerView = windowWidth < 640 ? 2 : 4;
      const nextIndex = Math.min(
        prevIndices[categorySlug] + 1,
        categoryProducts.length - productsPerView
      );
      console.log(`Scrolling right in category '${categorySlug}': new index ${nextIndex}`);
      return { ...prevIndices, [categorySlug]: nextIndex };
    });
  };

  const scrollLeft = (categorySlug) => {
    setProductIndices((prevIndices) => {
      const prevIndex = Math.max(prevIndices[categorySlug] - 1, 0);
      console.log(`Scrolling left in category '${categorySlug}': new index ${prevIndex}`);
      return { ...prevIndices, [categorySlug]: prevIndex };
    });
  };

  const formatPrice = (price) => {
    return price.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const calculateOriginalPrice = (price, discount) => {
    if (typeof price === 'number' && typeof discount === 'number') {
      return price - price * (discount / 100);
    }
    return price;
  };

  if (loading) {
    return (
      <section className="py-8 bg-white">
        <div className="container mx-auto">
          <div className="mb-4">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 items-start">
            <div className="h-[320px] bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0 sm:grid-cols-2 md:grid-cols-4">
              <GridShimmer ItemComponent={ProductCardShimmer} count={4} className="grid grid-cols-2 gap-x-4 gap-y-0 sm:grid-cols-2 md:grid-cols-4 w-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  console.log('Rendering products...');

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto">
        {categories.map((category) => {
          const categorySubcategories = subcategories.filter(
            (subcat) => subcat.categoryId === category.id // Match subcategories by categoryId
          );
          console.log(
            `Category '${category.name}' has ${categorySubcategories.length} subcategories.`
          );

          // Match products by subcategorySlug
          const categoryProducts = products.filter((product) =>
            categorySubcategories.some(
              (subcat) => subcat.slug === product.subcategorySlug // Correct filtering by slug
            )
          );
          console.log(`Category '${category.name}' has ${categoryProducts.length} products.`);

          if (categoryProducts.length === 0) {
            console.log(`No products found for category '${category.name}'. Skipping.`);
            return null;
          }

          const currentProductIndex = productIndices[category.slug] || 0;
          const productsPerView = windowWidth < 640 ? 2 : 4;
          const visibleProducts = categoryProducts.slice(
            currentProductIndex,
            currentProductIndex + productsPerView
          );

          return (
            <div key={category.slug} className="mb-4">
              <h3 className="text-xl text-gray-800 font-bold mb-2 text-center md:text-left">
                {category.name}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 items-start">
                <div className="category-image">
                  <Link href={`/customer/pages/category/${category.slug}`}>
                    {category.imageUrl ? (
                      <Image
                        width={400}
                        height={320}
                        src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${category.imageUrl}`}
                        alt={category.name}
                        className="w-full h-[220px] md:h-[320px] shadow-md object-cover cursor-pointer"
                        loading="lazy"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-[220px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 cursor-pointer">
                        No Image
                      </div>
                    )}
                  </Link>
                  <p className="text-gray-500 mt-2 text-center md:text-left">
                    {category.description}
                  </p>
                </div>

                <div className="relative">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0 sm:grid-cols-2 md:grid-cols-4">
                    {visibleProducts.map((product) => {
                      const originalPrice = calculateOriginalPrice(product.price, product.discount);
                      return (
                        <div
                          key={product.slug}
                          className="bg-white shadow-md cursor-pointer border border-gray-300 relative h-[320px] flex-shrink-0"
                        >
                          {product.discount && (
                            <div className="absolute z-40 top-0 left-0 bg-red-100 text-red-600 font-normal text-sm px-1 py-0.5">
                              {product.discount.toFixed(2)}% OFF
                            </div>
                          )}
                          <div className="relative overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="h-[220px] w-full mb-4 rounded bg-white cursor-pointer overflow-hidden"
                                onClick={() => handleProductClick(product.slug)}
                              >
                                <Image
                                  width={300}
                                  height={220}
                                  src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${product.images[0].url}`}
                                  alt={product.name}
                                  className="h-[220px] w-full object-contain"
                                  loading="lazy"
                                  sizes="(max-width: 640px) 50vw, 25vw"
                                />
                              </motion.div>
                            ) : (
                              <div
                                className="h-[220px] w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500 cursor-pointer"
                                onClick={() => handleProductClick(product.slug)}
                              >
                                No Image
                              </div>
                            )}
                            <button
                              className="absolute bottom-2 right-2 bg-teal-500 text-white h-8 w-8 flex justify-center items-center rounded-full shadow-lg hover:bg-teal-600 transition-colors duration-300"
                              onClick={() => handleProductClick(product.slug)}
                            >
                              <span className="text-xl font-bold leading-none">+</span>
                            </button>
                          </div>
                          <div className="px-2">
                            <div className="grid grid-cols-2 px-0 py-2">
                              <div className="flex items-center">
                                {product.discount ? (
                                  <div className="flex items-center justify-center gap-3 flex-row-reverse">
                                    <p className="text-xs font-normal text-gray-700 line-through">
                                      Rs.{formatPrice(product.price)}
                                    </p>
                                    <p className="text-md font-bold text-red-700">
                                      Rs.{formatPrice(originalPrice)}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-md font-bold text-gray-700">
                                    Rs.{formatPrice(product.price)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <h3
                              className="text-sm font-normal text-gray-800 overflow-hidden hover:underline hover:text-blue-400 cursor-pointer"
                              style={{
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2,
                                maxHeight: '3em',
                              }}
                              onClick={() => handleProductClick(product.slug)}
                            >
                              {product.name.toUpperCase()}
                            </h3>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Left Arrow */}
                  <button
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 hover:bg-gray-300"
                    onClick={() => scrollLeft(category.slug)}
                    disabled={currentProductIndex === 0}
                  >
                    <FiChevronLeft className="h-6 w-6 text-gray-700" />
                  </button>

                  {/* Right Arrow */}
                  <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 hover:bg-gray-300"
                    onClick={() => scrollRight(category.slug, categoryProducts)}
                    disabled={
                      currentProductIndex + productsPerView >= categoryProducts.length
                    }
                  >
                    <FiChevronRight className="h-6 w-6 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Products;
