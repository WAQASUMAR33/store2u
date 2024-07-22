import React from 'react';
import Header from './components/Header';
import Categories from './components/Categories';
import FlashSale from './components/FlashSale';
import BenefitsBar from './components/BenefitsBar';
import Testimonials from './components/Testimonials';

const categoriesData = [
  { name: 'Wardrobe Organisers', image: '/wardrobe-organisers.jpg' },
  { name: 'Moisturizers', image: '/moisturizers.jpg' },
  { name: 'Studio Headphones', image: '/studio-headphones.jpg' },
  { name: 'Shampoo', image: '/shampoo.jpg' },
  { name: 'Space Savers', image: '/space-savers.jpg' },
  { name: 'Clips, Pins & Tacks', image: '/clips-pins-tacks.jpg' },
  { name: 'Wardrobe Organisers', image: '/wardrobe-organisers.jpg' },
  { name: 'Moisturizers', image: '/moisturizers.jpg' },
  { name: 'Studio Headphones', image: '/studio-headphones.jpg' },
  { name: 'Shampoo', image: '/shampoo.jpg' },
  { name: 'Space Savers', image: '/space-savers.jpg' },
  { name: 'Clips, Pins & Tacks', image: '/clips-pins-tacks.jpg' },
];

const CustomerPage = () => {
  return (
    <div>
      <Header />
      <main className="p-4">
        <BenefitsBar/>
        
        <FlashSale />
        <Categories categories={categoriesData} />
      
        <Testimonials/>
        <h1 className="text-2xl font-bold mb-4">Welcome to the Customer Page</h1>
        <p className="text-gray-700">
          This is the main content area for the customer page. You can add more components and content here.
        </p>
      </main>
    </div>
  );
};

export default CustomerPage;
