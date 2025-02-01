'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ThreeDots } from 'react-loader-spinner';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
      <div className="flex items-center justify-center min-h-screen">
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
                 width={1000}
                  height={1000}
                  placeholder="data:image/jpeg;base64,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"
          
                        src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${category.imageUrl}`}
                        alt={category.name}
                        className="w-full h-[220px] md:h-[320px] shadow-md object-cover cursor-pointer"
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
                              <motion.img
                                src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${product.images[0].url}`}
                                alt={product.name}
                                className="h-[220px] w-full object-contain mb-4 rounded bg-white cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => handleProductClick(product.slug)}
                              />
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
