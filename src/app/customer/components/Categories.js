import React from 'react';
import PropTypes from 'prop-types';
import 'tailwindcss/tailwind.css';

const Categories = ({ categories }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden text-center p-4 transform transition duration-300 hover:scale-105 hover:shadow-xl"
          >
            <img src={category.image} alt={category.name} className="w-full h-32 object-cover mb-2" />
            <p className="text-lg font-semibold">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

Categories.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Categories;
