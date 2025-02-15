'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { addToCart, setCart } from '../../../../store/cartSlice';
import { ThreeDots } from 'react-loader-spinner';
import Modal from 'react-modal';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { FaShare, FaTimes, FaUpload } from 'react-icons/fa';
import Image from 'next/image';

const ProductPage = ({ productData }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(productData.product);
  console.log("product details are: ",product);
  const [relatedProducts, setRelatedProducts] = useState(productData.relatedProducts || []);
  const [reviews, setReviews] = useState([]);
  const [cart, setCartState] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);


  const [linkshare, setLinkShare] = useState(false);
  const ProductLink = `https://www.store2u.ca/customer/pages/products/${product.slug}`;

  const handlelinkshare = () => {
    setLinkShare(!linkshare);
  };
  
  useEffect(()=>{
    console.log("Colors :",colors);
    console.log("Sizes :",sizes);
  },[colors,sizes]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(ProductLink);
    alert("Link copied to clipboard!");
  };

  // Fetch product details and related products
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true); // Start loading when fetching starts
        const response = await axios.get(`/api/products/${product.slug}`);
        const fetchedata = response.data;
        const { product: fetchedProduct, relatedProducts,colors,sizes } = fetchedata.data;

        console.log("Fetched234 data is  ",fetchedata)
        setSizes(sizes|| '[]');
        setColors(colors || '[]');
        setProduct(fetchedProduct);
        setRelatedProducts(relatedProducts);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false); // Stop loading when data is fetched
      }
    };

    if (product.slug) {
      fetchProduct();
    }
  }, [product.slug]);


  // Fetch reviews for the product
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/getreviews?productId=${product.id}`);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (product.id) {
      fetchReviews();
    }
  }, [product.id]);

  // Handle Review Submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const username = localStorage.getItem('userName'); // Fetch the username from localStorage

    if (!username) {
      // If user is not authenticated, redirect to login page
      toast.error('You must be logged in to submit a review.');
      router.push('/customer/pages/login'); // Redirect to login page
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error('Please provide a valid rating between 1 and 5.');
      return;
    }

    try {
      setReviewLoading(true);
      const response = await axios.post('/api/reviews', {
        productId: product.id,
        reviewer: username, // Use the username from localStorage
        rating,
        comment,
      });

      if (response.data.status === 201) {
        toast.success('Your review has been submitted.');
        setRating(0);
        setComment('');
      } else {
        toast.error('Failed to submit review.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('An error occurred while submitting your review.');
    } finally {
      setReviewLoading(false);
    }
  };

  // Add product to cart
  // const handleAddToCart = () => {
  //   if (quantity > product.stock) {
  //     toast.error(`You cannot add more than ${product.stock} of this item.`);
  //     return;
  //   }

  //   if ((sizes.length > 0 && !selectedSize) || (colors.length > 0 && !selectedColor)) {
  //     toast.error('Please select a size and color.');
  //     return;
  //   }

  //   const newCartItem = {
  //     id: `${product.id}-${selectedSize || 'default'}-${selectedColor || 'default'}`,
  //     productId: product.id,
  //     quantity,
  //     price: product.discount
  //       ? calculateOriginalPrice(product.price, product.discount)
  //       : product.price,
  //     selectedColor,
  //     selectedSize,
  //     images: product.images,
  //     name: product.name,
  //     discount: product.discount,
  //   };

  //   dispatch(addToCart(newCartItem));
  //   setIsModalOpen(true);
  //   toast.success('Item added to cart successfully!');
  // };
  const prevcart = useSelector(state => state.cart.items);

  const handleAddToCart = () => {

    if (product.stock == 0){
      toast.error(`This product is out of stock.`);
      return;
    }

    if (quantity > product.stock) {
      toast.error(`You cannot add more than ${product.stock} of this item.`);
      return;
    }

    if ((sizes.length > 0 && !selectedSize) || (colors.length > 0 && !selectedColor)) {
      toast.error('Please select a size and color.');
      return;
    }

    const newCartItem = {
      id: `${product.id}-${selectedSize || 'default'}-${selectedColor || 'default'}`,
      productId: product.id,
      quantity,
      price: product.discount
        ? calculateOriginalPrice(product.price, product.discount)
        : product.price,
      selectedColor,
      selectedSize,
      images: product.images,
      name: product.name,
      discount: product.discount,
    };

    const existingItemIndex = prevcart.findIndex(
      (item) =>
        item.productId === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    let updatedCart = [...prevcart];
    console.log("Previous items in the cart is :", prevcart);

    if (existingItemIndex !== -1) {
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + quantity,
      };
    } else {
      updatedCart.push(newCartItem);
      console.log("Previous items in the cart after adding is  :", updatedCart);
    }

    setCartState(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    dispatch(setCart(updatedCart));

    toast.success('Item added to cart successfully!');
    setIsModalOpen(true);
  };


  const handlebuynow = () => {

    if (product.stock == 0){
      toast.error(`This product is out of stock.`);
      return;
    }

    if (quantity > product.stock) {
      toast.error(`You cannot add more than ${product.stock} of this item.`);
      return;
    }

    if ((sizes.length > 0 && !selectedSize) || (colors.length > 0 && !selectedColor)) {
      toast.error('Please select a size and color.');
      return;
    }

    const newCartItem = {
      id: `${product.id}-${selectedSize || 'default'}-${selectedColor || 'default'}`,
      productId: product.id,
      quantity,
      price: product.discount
        ? calculateOriginalPrice(product.price, product.discount)
        : product.price,
      selectedColor,
      selectedSize,
      images: product.images,
      name: product.name,
      discount: product.discount,
    };

    const existingItemIndex = prevcart.findIndex(
      (item) =>
        item.productId === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    let updatedCart = [...prevcart];
    console.log("Previous items in the cart is :", prevcart);

    if (existingItemIndex !== -1) {
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + quantity,
      };
    } else {
      updatedCart.push(newCartItem);
      console.log("Previous items in the cart after adding is  :", updatedCart);
    }

    setCartState(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    dispatch(setCart(updatedCart));

    toast.success('Item added to cart successfully!');
    router.push('/customer/pages/cart');
    // setIsModalOpen(true);
  };



  const calculateOriginalPrice = (price, discount) => {
    return price - price * (discount / 100);
  };

  // Utility function to get the image URL
  const getImageUrl = (url) => {
    return `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${url}`;
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // router.push('/');
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ThreeDots height="80" width="80" radius="9" color="#3498db" ariaLabel="three-dots-loading" visible={true} />
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 pt-8">
      <ToastContainer />
      {isNavigating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#3498db"
            ariaLabel="three-dots-loading"
            visible={true}
          />
        </div>
      )}
      <div className="flex space-x-6 min-h-screen">
        {/* Product Images and Details */}
        <div className="w-full lg:w-3/5 mb-0 flex flex-col lg:flex-row h-full ">
          <div className="flex flex-col lg:flex-row relative  w-full">
            {product.discount && (<>
              <div className='absolute top-0 right-6  z-10'>
                <span>
                  <div className='size-[3em] rounded-full bg-red-500 flex justify-center items-center text-white text-[1.5rem]'>
                    -{product.discount}%
                  </div>
                </span>
              </div>
            </>)}

            {/* Image Thumbnails */}
            <div className="flex w-20 flex-col justify-start items-center mr-4">
              {product.images &&
                product.images.map((image, index) => (
                  <Image
                 width={1000}
                  height={1000}
                  placeholder="data:image/jpeg;base64,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"
          
                    key={index}
                    src={getImageUrl(image.url)}
                    alt={product.name}
                    className={`w-20 h-20 object-contain mb-2 cursor-pointer ${index === currentImageIndex ? 'opacity-100' : 'opacity-50'
                      }`}
                    onClick={() => handleThumbnailClick(index)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.png';
                    }}
                  />
                ))}
            </div>
            {/* Main Image */}
            <div className="relative w-full pl-4 flex justify-center items-center">
              {product.images && product.images.length > 0 ? (
                <>
                  <motion.img
                    key={currentImageIndex}
                    src={getImageUrl(product.images[currentImageIndex].url)}
                    alt={product.name}
                    className="w-full h-[400px] object-contain mb-4 cursor-pointer"
                    transition={{ duration: 0.3 }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.png';
                    }}
                  />
                </>


              ) : (
                <div className="h-48 w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Info and Add to Cart */}
        <div className="w-full lg:w-2/5 h-full flex flex-col">
          <h2 className="text-2xl font-bold mb-4">{product.name.toUpperCase()}</h2>
          <p className='text-lg mt-2 mb-2'> {product.sku}</p>

          <div className="flex items-center mb-4 w-full">
            <div className='flex justify-between w-full'>
              {product.discount ? (
                <div className='flex'>
                  <span className="text-green-500 text-xl line-through mr-4">
                    Rs.{formatPrice(product.price)}
                  </span>
                  <span className="text-red-500 font-bold text-xl">
                    Rs.{formatPrice(calculateOriginalPrice(product.price, product.discount))}
                  </span>
                </div>
              ) : (
                <div className="text-red-500 text-2xl">Rs.{formatPrice(product.price)}</div>
              )}
              <div className="relative">
                <button
                  onClick={handlelinkshare}
                  className="absolute top-0 right-0 w-[6rem] h-[3rem] rounded-xl bg-white group  flex border border-gray-800 hover:scale-105 transform transition-all duration-300 justify-center items-center text-gray-800 gap-2"
                >
                  <FaShare className="text-xl group-hover:rotate-[360deg] transform transition-all duration-500" />
                  Share
                </button>

                {linkshare && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 md:p-0">
                    <div className="h-[20rem] md:w-[40rem] w-[400px] bg-white rounded-xl shadow-lg p-6 relative flex flex-col justify-center items-center">
                      <button onClick={handlelinkshare}
                        className="mt-4 absolute top-0 right-4 px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                        <FaTimes />
                      </button>
                      <div className='flex'>
                        <Image
                 width={1000}
                  height={1000}
                  placeholder="data:image/jpeg;base64,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"
           src={getImageUrl(product.images[0].url)} className='md:w-[5rem] md:h-[5rem] w-[8rem] h-[8rem]'/>
                        <div className='flex flex-col p-2'>
                          <p className='text-lg line-clamp-1'>{product.name}</p>
                          {product.discount ? (
                            <div className='flex'>
                              <span className="text-green-500 text-lg line-through mr-4">
                                Rs.{formatPrice(product.price)}
                              </span>
                              <span className="text-red-500 font-bold text-lg">
                                Rs.{formatPrice(calculateOriginalPrice(product.price, product.discount))}
                              </span>
                            </div>
                          ) : (
                            <div className="text-red-500 text-2xl">Rs.{formatPrice(product.price)}</div>
                          )}
                        </div>
                      </div>
                      <h2 className="text-lg font-semibold mb-4">Share this Product</h2>
                      <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg border border-gray-300 mb-4 w-full">
                        <span className="text-gray-600 text-sm truncate">{ProductLink}</span>
                        <button
                          onClick={handleCopyLink}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Stock Info */}
          {product.stock === 0 && (
            <p className="text-lg font-bold text-red-700 mb-1">Out of Stock</p>
          )}
          {product.stock > 0 && (
            <p className="text-lg font-bold text-green-700 mb-1">In Stock</p>
          )}

          {/* Color Selection */}
          {colors.length > 0 && (
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2">Select Color</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 cursor-pointer ${selectedColor === color.name ? 'border-black' : 'border-gray-300'
                      }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    <span className="sr-only">{color.name}</span>
                  </button>
                ))}
              </div>
              {selectedColor && (
                <p className="text-sm mt-2">
                  Selected Color: <strong>{selectedColor}</strong>
                </p>
              )}
            </div>
          )}

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2">Select Size</h3>
              <div className="flex space-x-2">
                {sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size.name)}
                    disabled={size.stock === 0}
                    className={`w-10 h-10 border text-center flex items-center justify-center cursor-pointer
                      ${selectedSize === size.name ? 'border-black border-[2px]' : 'border-gray-300'} 
                      ${size.stock === 0 ? 'line-through cursor-not-allowed text-gray-400' : 'hover:border-black'}`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center mb-4 border border-gray-300 rounded-full px-4 py-1 w-32">
            <button
              className="text-gray-700 px-2"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
            >
              <FiMinus />
            </button>
            <span className="mx-4">{quantity}</span>
            <button
              className="text-gray-700 px-2"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              <FiPlus />
            </button>
          </div>

          {/* Add to Cart Button */}
          <div className='flex justify-center items-center gap-4'>
            <button
              className="bg-teal-500 text-white py-2 px-4 rounded-full w-full text-center"
              onClick={handleAddToCart}
             
            >
              Add to cart
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-full w-full text-center"
              onClick={handlebuynow}
            
            >
              Buy Now
            </button>
          </div>


          {/* Product Description */}
          <h3 className="text-md font-semibold text-gray-700 mb-4 mt-4">Description</h3>
          <div
            className="text-gray-500 mb-4"
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></div>

          {/* Customer Reviews */}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-6">Customer Reviews</h3>
            {Array.isArray(reviews) && reviews.length > 0 ? (
              <div className="flex flex-col space-y-4">
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-lg p-6 flex flex-col border border-gray-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="flex items-center justify-center bg-gray-200 rounded-full h-12 w-12 text-lg font-bold">
                        {review.reviewer.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold">{review.reviewer}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      {Array(review.rating)
                        .fill()
                        .map((_, i) => (
                          <span key={i} className="text-yellow-500">
                            &#9733;
                          </span>
                        ))}
                      {Array(5 - review.rating)
                        .fill()
                        .map((_, i) => (
                          <span key={i} className="text-gray-300">
                            &#9733;
                          </span>
                        ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
            )}


            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>

              {/* Check if user is logged in */}
              {localStorage.getItem('userName') ? (
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
                      Rating
                    </label>
                    <select
                      id="rating"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    >
                      <option value="">Select Rating</option>
                      <option value="1">1 Star</option>
                      <option value="2">2 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      rows="4"
                      placeholder="Write your review..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    disabled={reviewLoading}
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                // Show this statement if the user is not logged in
                <p className="text-gray-500">
                  If you want to leave a review, please <a href="/customer/pages/login" className="text-blue-500">log in</a>.
                </p>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-12 mb-8">
        <h3 className="text-2xl font-semibold mb-6">Related Products</h3>
        <div className="rounded grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 px-1 sm:px-4 lg:px-0">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((relatedProduct) => {
              const originalPrice = calculateOriginalPrice(
                relatedProduct.price,
                relatedProduct.discount
              );
              return (
                <div
                  key={relatedProduct.slug}
                  className="bg-white shadow-md rounded-sm cursor-pointer border border-gray-300 relative min-h-[320px] w-full"
                  onClick={() => router.push(`/customer/pages/products/${relatedProduct.slug}`)}
                >
                  {relatedProduct.discount && (
                    <div className="absolute z-40 top-0 left-0 bg-red-100 text-red-600 font-normal text-sm px-1 py-0.5">
                      {relatedProduct.discount.toFixed(2)}% OFF
                    </div>
                  )}
                  <div className="relative overflow-hidden">
                    {relatedProduct.images && relatedProduct.images.length > 0 ? (
                      <motion.img
                        src={getImageUrl(relatedProduct.images[0].url)}
                        alt={relatedProduct.name}
                        className="h-[240px] w-full object-contain mb-4 rounded bg-white"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.png';
                        }}
                      />
                    ) : (
                      <div className="h-[240px] w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                    <button
                      className="absolute bottom-2 right-2 bg-teal-500 text-white h-8 w-8 flex justify-center items-center rounded-full shadow-lg hover:bg-teal-600 transition-colors duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/customer/pages/products/${relatedProduct.slug}`);
                      }}
                    >
                      <span className="text-xl font-bold leading-none">+</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 px-2">
                    <div className="flex items-center">
                      {relatedProduct.discount ? (
                        <div className="flex items-center justify-center gap-3 flex-row-reverse">
                          <p className="text-md font-normal text-gray-700 line-through">
                            Rs.{formatPrice(relatedProduct.price)}
                          </p>
                          <p className="text-md font-bold text-red-700">
                            Rs.{formatPrice(originalPrice)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm font-bold text-gray-700">
                          Rs.{formatPrice(relatedProduct.price)}
                        </p>
                      )}
                    </div>
                  </div>
                  <h3
                    className=" pl-2 text-sm font-normal text-gray-800 overflow-hidden hover:underline hover:text-blue-400 cursor-pointer"
                    style={{
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      maxHeight: '3em',
                    }}
                    onClick={() => router.push(`/customer/pages/products/${relatedProduct.slug}`)}
                  >
                    {relatedProduct.name.toUpperCase()}
                  </h3>
                </div>
              );
            })
          ) : (
            <div className="text-center col-span-full py-8 text-gray-500">
              No related products available.
            </div>
          )}
        </div>
      </div>

      {/* Modal for Related Products */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Related Products"
        style={{
          overlay: {
            zIndex: 10000,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            zIndex: 10001,
            margin: 'auto',
            width: 'fit-content',
            height: 'fit-content',
            padding: '20px',
            textAlign: 'center',
          },
        }}
      >
        <div className="flex flex-col items-center">
          <div className="flex justify-between w-full">
            <h2 className="text-xl font-semibold mb-4">
              Products You May Be Interested In
            </h2>
            <button className="text-gray-500" onClick={handleCloseModal}>
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.slug}
                className="flex flex-col items-center w-32 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => {
                  router.push(`/customer/pages/products/${relatedProduct.slug}`);
                  setIsModalOpen(false);
                }}
              >
                <Image
                 width={1000}
                  height={1000}
                  placeholder="data:image/jpeg;base64,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"
          
                  src={getImageUrl(relatedProduct.images[0]?.url || '')}
                  alt={relatedProduct.name}
                  className="w-32 h-32 object-cover mb-2"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.png';
                  }}
                />
                <p
                  className="text-sm text-gray-800 truncate w-full"
                  title={relatedProduct.name}
                >
                  {relatedProduct.name}
                </p>
                <p className="text-sm text-red-500">
                  Rs.{formatPrice(relatedProduct.price)}
                </p>
              </div>
            ))}
          </div>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4"
            onClick={handleCloseModal}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductPage;
