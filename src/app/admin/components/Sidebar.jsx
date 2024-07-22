'use client';
import { useState } from 'react';
import { FaUsers, FaSignOutAlt, FaChevronDown, FaCube, FaShoppingCart, FaTags } from 'react-icons/fa';

const Sidebar = ({ setActiveComponent }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    customers: false,
    branches: false,
    adminUsers: false,
    filetypes: false,
    products: false,
    orders: false,
    categories: false,
  });

  const toggleDropdown = (key) => {
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    window.location.href = '/';
  };

  return (
    <div className="bg-blue-900 text-white w-64 min-h-screen flex flex-col">
      <div className="p-4 text-center">
        <img width={50} height={50} src="/ali.png" alt="Profile" className="rounded-full mx-auto mb-2" />
        <h2 className="text-lg font-semibold">M3X Traders</h2>
        <p className="text-green-400">● Online</p>
      </div>
      <div className="p-4 border-t border-gray-700">
        <ul className="mt-4 space-y-2">
          <li>
            <button
              className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              onClick={() => toggleDropdown('customers')}
            >
              <FaUsers className="h-5 w-5" />
              <span className="ml-2">Customers</span>
              <FaChevronDown className="h-5 w-5 ml-auto" />
            </button>
            {isDropdownOpen.customers && (
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <a href='/admin/pages/customers'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">View Customers</span>
                    </button>
                  </a>
                </li>
              </ul>
            )}
          </li>
          
          <li>
            <button
              className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              onClick={() => toggleDropdown('products')}
            >
              <FaCube className="h-5 w-5" />
              <span className="ml-2">Products</span>
              <FaChevronDown className="h-5 w-5 ml-auto" />
            </button>
            {isDropdownOpen.products && (
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <a href='/admin/pages/Products'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2"> Products</span>
                    </button>
                  </a>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button
              className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              onClick={() => toggleDropdown('orders')}
            >
              <FaShoppingCart className="h-5 w-5" />
              <span className="ml-2">Orders</span>
              <FaChevronDown className="h-5 w-5 ml-auto" />
            </button>
            {isDropdownOpen.orders && (
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <a href='/admin/pages/orders'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">View Orders</span>
                    </button>
                  </a>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button
              className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              onClick={() => toggleDropdown('categories')}
            >
              <FaTags className="h-5 w-5" />
              <span className="ml-2">Categories</span>
              <FaChevronDown className="h-5 w-5 ml-auto" />
            </button>
            {isDropdownOpen.categories && (
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <a href='/admin/pages/categories'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2"> Categories</span>
                    </button>
                  </a>
                </li>
                <li>
                  <a href='/admin/pages/subcategories'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">SubCategory</span>
                    </button>
                  </a>
                </li>
              </ul>
            )}
          </li>
          
          <li>
            <button
              className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="h-5 w-5" />
              <span className="ml-2">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
