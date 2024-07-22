'use client'
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, 
  faUser, 
  faSearch, 
  faBars, 
  faTimes, 
  faTshirt, 
  faMobileAlt, 
  faLaptop, 
  faCouch 
} from '@fortawesome/free-solid-svg-icons';
import 'tailwindcss/tailwind.css';

const MegaMenu = ({ categories }) => (
  <div className="w-[800px] absolute left-0 p-3 bg-white shadow-lg z-50 rounded-lg text-center mt-2">
    <div className="flex flex-wrap bg-white text-black">
      {categories.map((category, index) => (
        <div key={index} className="w-full md:w-1/3 p-3 text-md">
          <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
          <div>
            {category.links.map((link, idx) => (
              <a key={idx} href={link.href} className="flex items-center mt-2 p-2 hover:text-blue-500">
                <FontAwesomeIcon icon={link.icon} className="mr-2" />
                {link.text}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

function Header() {
  const [showMegaMenu, setShowMegaMenu] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMegaMenu = (menu) => {
    setShowMegaMenu(prevMenu => (prevMenu === menu ? '' : menu));
  };

  const categoriesMenu = [
    {
      title: 'Fashion',
      links: [
        { href: '#', text: 'Men', icon: faTshirt },
        { href: '#', text: 'Women', icon: faTshirt },
        { href: '#', text: 'Kids', icon: faTshirt },
      ],
    },
    {
      title: 'Electronics',
      links: [
        { href: '#', text: 'Mobiles', icon: faMobileAlt },
        { href: '#', text: 'Laptops', icon: faLaptop },
        { href: '#', text: 'Accessories', icon: faMobileAlt },
      ],
    },
    {
      title: 'Home & Living',
      links: [
        { href: '#', text: 'Furniture', icon: faCouch },
        { href: '#', text: 'Kitchen', icon: faCouch },
        { href: '#', text: 'Decor', icon: faCouch },
      ],
    },
  ];

  return (
    <header className="relative z-50 p-4 flex items-center bg-white text-black shadow-md">
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="text-xl font-bold flex items-center">
          <img src='/web-logo.png' className='px-3' alt="Logo" />
          <span>Luxury Store</span>
        </div>
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="text-2xl" />
        </button>
      </div>
      <nav className={`w-full md:flex md:items-center md:justify-center transition-all duration-300 ${mobileMenuOpen ? 'flex' : 'hidden'} flex-col md:flex-row mt-2 md:mt-0`}>
        <a href="/" className="nav-link hover:bg-gray-200 px-4 py-2 rounded-md transition duration-200">Home</a>
        <div
          className="relative mt-2 md:mt-0"
          onMouseEnter={() => toggleMegaMenu('categories')}
          onMouseLeave={() => toggleMegaMenu('')}
        >
          <a href="#" className="nav-link hover:bg-gray-200 px-4 py-2 rounded-md transition duration-200">Categories</a>
          {showMegaMenu === 'categories' && <MegaMenu categories={categoriesMenu} />}
        </div>
        <a href="/about" className="nav-link hover:bg-gray-200 px-4 py-2 rounded-md transition duration-200">About</a>
        <a href="/contact" className="nav-link hover:bg-gray-200 px-4 py-2 rounded-md transition duration-200">Contact</a>
      </nav>
      <div className="flex items-center ml-auto">
        <FontAwesomeIcon icon={faSearch} className="text-2xl mr-4 cursor-pointer" />
        <FontAwesomeIcon icon={faShoppingCart} className="text-2xl mr-4 cursor-pointer" />
        <FontAwesomeIcon icon={faUser} className="text-2xl cursor-pointer" />
      </div>
    </header>
  );
}

export default Header;
