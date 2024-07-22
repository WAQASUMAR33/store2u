import React from 'react';
import { FaStar } from 'react-icons/fa';

const testimonials = [
  {
    name: 'John Doe',
    designation: 'CEO, Company Inc.',
    testimonial: 'This is the best service I have ever used. Highly recommend to everyone!',
    image: '/jawad1.png',
    rating: 5,
  },
  {
    name: 'Jane Smith',
    designation: 'CTO, Another Company',
    testimonial: 'Outstanding experience! The team was very professional and the end result was amazing.',
    image: '/jawad1.png',
    rating: 4,
  },
  {
    name: 'Sam Wilson',
    designation: 'Manager, Some Company',
    testimonial: 'Great service and very attentive to details. Will definitely use again.',
    image: '/jawad1.png',
    rating: 4.5,
  },
];

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} className="text-yellow-500" />
      ))}
      {halfStar && <FaStar className="text-yellow-500 half-star" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaStar key={i + fullStars} className="text-gray-300" />
      ))}
    </div>
  );
};

const TestimonialCard = ({ name, designation, testimonial, image, rating }) => (
  <div className="max-w-sm h-110 rounded-lg overflow-hidden shadow-lg p-6 bg-white flex flex-col items-center transform hover:scale-105 transition duration-300">
    <img src={image} alt={name} className="w-60 h-60 rounded-3xl object-cover mb-4" />
    <StarRating rating={rating} />
    <div className="text-center">
      <div className="font-bold text-xl">{name}</div>
      <div className="text-gray-600 mb-2">{designation}</div>
      <p className="text-gray-700 mb-4">{testimonial}</p>
     
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Customer Testimonials</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;