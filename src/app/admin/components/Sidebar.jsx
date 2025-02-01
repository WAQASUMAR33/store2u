'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // for redirecting users
import {
  FaUsers,
  FaSignOutAlt,
  FaChevronDown,
  FaCube,
  FaShoppingCart,
  FaTags,
  FaPaintBrush,
  FaRuler,
  FaCogs,
  FaTicketAlt,
  FaImages,
  FaStar,
  FaBlog,
  FaHome,
  FaPhone,
  FaStore,
  FaPage4
} from 'react-icons/fa';

const Sidebar = ({ setActiveComponent }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    customers: false,
    products: false,
    orders: false,
    categories: false,
    size: false,
    color: false,
    settings: false,
    coupons: false,
    sliders: false,
    socialmedia: false,
    blog: false
  });

  const router = useRouter(); // useRouter for navigation

  // Check if the user is authenticated
  useEffect(() => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    if (!token) {
      // Redirect to the login page if not authenticated
      router.push('/admin');
    }
  }, [router]);

  const toggleDropdown = (key) => {
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  // Handle logout
  const handleLogout = () => {

    Cookies.remove('token');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/admin';
  };

  return (
    <div className="bg-gray-700 text-white flex flex-col text-sm" style={{ width: '250px', height: '100vh', overflowY: 'auto' }}>
      <div className="p-4 text-center">
        <Image
                 width={1000}
                  height={1000}
                  placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAUFBQUGBQYHBwYJCQgJCQ0MCwsMDRMODw4PDhMdEhUSEhUSHRofGRcZHxouJCAgJC41LSotNUA5OUBRTVFqao4BBQUFBQYFBgcHBgkJCAkJDQwLCwwNEw4PDg8OEx0SFRISFRIdGh8ZFxkfGi4kICAkLjUtKi01QDk5QFFNUWpqjv/CABEIAfQB9AMBIgACEQEDEQH/xAAaAAEBAQEBAQEAAAAAAAAAAAAABQQCAwEI/9oACAEBAAAAAP1WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGyoAAAAAA4hAAABrqgAAAAAOYIAAAa6oAAAAADmCAAAGuqAAAAAA5ggAABrqnyaHLoAAAc+285ggAABrqnMEAAAAGqscwQAAA11TmCH3R65fMAAA1VjmCAAAGuqcwR1b7JmIAABqrHMEAAANdU5girrHyN4gAAaqxzBAAADXVOYJ9u9BOwAAAaqxzBAAADXVOYJ9udhOwAatMwAaqxzBAAADXVOYIo7xzE4B3b6lZADVWOYIAAAa6pzBCju++UnyB9raSFwA1VjmCAAAGuqcwQdPnwDfRGWSA1VjmCAAAGuqcwQA3+Gd62voS8YGqscwQAAA11TmCAN1JH8bPqD5D4BqrHMEAAANdU5ggG6j9PD3AZ44NVY5ggAABrqnMEBsqAAEvGGqscwQAAA11TmCBrqgAD5D4GqscwQAAA11TmCDVWAAB4RhqrHMEAAANdU5ghprfQAAJmI1VjmCAAAGuqcwRprfQAAHMXzaqxzBAAADXVOYI2agAABg8GqscwQAAA11TmCAAAADVWOYIAAAa6pzBAAAABqrHMEAAANdU+QAAAAAaa5zBAAADXVHkAAAAD76HMEAAANdUAAAAABzBAAADXVAAAAAAcwQAAA11QAAAAAHMEAAAPbWAAAAAA4wgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/xAA2EAABAQQIBAUDAwUBAAAAAAABAwACBBEUFSAzUlNyoSRAkcESITAxcRATUSJBUAUyYZCx4f/aAAgBAQABPwD/AH9wV6dLSaTSaTSaTSaTSaTSaTSaTSaTSaTSaTSaTSaTSaTSaTSaTSaTSaTSaTSaTKh37Kuk8xBXx09/4dUcOrp5iCvjp7/w6o4dXTzEFfHT3/h1Rw6unmIK+OnvYVLzqTzzvuA1YROIdGrCJxDo1YROIdGrCJxDo1YROIdGpkRiamRGJqwicQ6NWETiHRqwicQ6NWETiHRqwicQ6NWETiHRqwicQ6NWETiHRqwicQ6NWETiHRqwicQ6NWETiHRqwicQ6NWETiHRqwicQ6NWETiHRqwicQ6NWETiHRqwicQ6NWETiHRqwicQ6NWETiHRqZEYmQiV1FACQQffysKjh1dPMQV8dPewtdKfHPwd8LCo4dXTzEFfHT3sLXSnxaAJZOFVfE5SDVesROYLKJPuGTzpHLQd8LCo4dXTzEFfHT3sLXSnxZddefIAEyWQh3ER+Xj9SARItEw3g/U5Mj/nKwd8LCo4dXTzEFfHT3sLXSnxZg0R4A/+70+lkgEMun9pUu8pB3wsKjh1dPMQV8dPewtdKfFgCZZN0OpugfgWv6h5quvfl3lIO+FhUcOrp5iCvjp72FrpT4sDyLIvgoJn/H/PK1/UH/GuP8O9/QhkQo8SfYNEw4LgecdkR7+nB3wsKjh1dPMQV8dPewtdKfFmCXDr3geE3e9lR8OOEks+88+8Sfc200y+9IMm46m6APpFIBN8F0fpe29KDvhYVHDq6eYgr46e9ha6U+LSEYAJKdQzj7r4mD9FYlJzyJmfwGWWeUemT/5bHm0Kg6m54iP1PDb6qJhRMuln3C48XT7j0YO+FhUcOrp5iCvjp72FrpT4tgvD2JDeN/EerEk+hBIOvHxvHyBsxSIfd8To/UNx6MHfCwqOHV08xBXx097C10p8eohCfccLzxIaIh3kSP3B+qKJUekPYM66HXQ6BIC1FoFJ+f7GZ+PQg74WFRw6unmIK+OnvYWulPj04aG8X63x5e4H5+j7rrwLpEw0Qg8k9+XWDpeIAEyWh0Qm7L9z7m2o468mQf3Z9wuPEH3FuDvhYVHDq6eYgr46e9ha6U+PShYbxyff/t/6wEvqQ686QRMH8snB/aVJJn+B+PRikPGkVAPMbi3B3wsKjh1dPMQV8dPewtdKfHow0MXz4nvJ0b8hFoeB7xO/2k9Dag74WFRw6unmIK+OnvYWulPj0IaGKpmf7GAAEhyDzgfdIIZ9wuPEH3FmDvhYVHDq6eYgr46e9ha6U+LcPDlR6Z8nRuwAAAA5KNRcecJdPmBZg74WFRw6unmIK+OnvYWulPi1Dw5Ve/DoYOh10ACQHKRaHgPjHs9Yg74WFRw6unmIK+OnvYWulPizDwryxJnID3LOugAACQHKvuuvul0ic2VSKbxB+sHfCwqOHV08xBXx097C10p8WYeJCTsiJtWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb2FllfuPTlL6wd8LCo4dXTzEFfHT3sLXSnxz8HfCwqOHV08xBXx097C10p8c/B3wsKjh1dPMQV8dPexEPSSf+OfhCAsLCo4dXTzEFfHT3sPOgggiYLUdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7OIJOGYcAsKjh1dPMQV8dPf+HVHDq6eYgr46e/8OqOHV08xBXx09/4dUcOrp5hFX7TxMpzEmp5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92fjS84874JTBE5/n/f7//EABQRAQAAAAAAAAAAAAAAAAAAAKD/2gAIAQIBAT8AAB//xAAUEQEAAAAAAAAAAAAAAAAAAACg/9oACAEDAQE/AAAf/9k="
            src="/store2ulogo.png" alt="Profile" className="rounded-[2px] px-2 py-2 mx-auto mb-2 bg-white" />
        <h2 className="text-lg font-semibold">Store2u</h2>
        <p className="text-green-400">● Online</p>
      </div>
      <div className="p-4 border-t border-gray-700">
        <ul className="mt-4 space-y-2">
          <li>
            <a href='/admin/pages/Main'>
              <button
                className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              >
                <FaHome className="h-5 w-5" />
                <span className="ml-2">Home</span>
              </button>
            </a>
          </li>

          <li>
            <button
              className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              onClick={() => toggleDropdown('customers')}
            >
              <FaUsers className="h-5 w-5" />
              <span className="ml-2">Customers Data</span>
              <FaChevronDown className="h-3 w-3 ml-auto" />
            </button>
            {isDropdownOpen.customers && (
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <a href='/admin/pages/customer'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Customers</span>
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
              <FaChevronDown className="h-3 w-3 ml-auto" />
            </button>
            {isDropdownOpen.products && (
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <a href='/admin/pages/Products'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2 text-md">All Products</span>
                    </button>
                  </a>
                </li>
                <li>
                  <a href='/admin/pages/add-product'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Add Products</span>
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
              <FaChevronDown className="h-3 w-3 ml-auto" />
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
              <FaChevronDown className="h-3 w-3 ml-auto" />
            </button>
            {isDropdownOpen.categories && (
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <a href='/admin/pages/categories'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Categories</span>
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
              onClick={() => toggleDropdown('size')}
            >
              <FaRuler className="h-5 w-5" />
              <span className="ml-2">Size</span>
              <FaChevronDown className="h-3 w-3 ml-auto" />
            </button>
            {isDropdownOpen.size && (
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <a href='/admin/pages/size'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Sizes</span>
                    </button>
                  </a>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button
              className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              onClick={() => toggleDropdown('color')}
            >
              <FaPaintBrush className="h-5 w-5" />
              <span className="ml-2">Color</span>
              <FaChevronDown className="h-3 w-3 ml-auto" />
            </button>
            {isDropdownOpen.color && (
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <a href='/admin/pages/color'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Colors</span>
                    </button>
                  </a>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button
              className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              onClick={() => toggleDropdown('settings')}
            >
              <FaCogs className="h-5 w-5" />
              <span className="ml-2">Settings</span>
              <FaChevronDown className="h-3 w-3 ml-auto" />
            </button>
            {isDropdownOpen.settings && (
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <a href='/admin/pages/settings'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Settings</span>
                    </button>
                  </a>
                </li>
                <li>
                  <a href='/admin/pages/facebook-pixel'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Facebook Pixel</span>
                    </button>
                  </a>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button
              className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              onClick={() => toggleDropdown('coupons')}
            >
              <FaTicketAlt className="h-5 w-5" />
              <span className="ml-2">Coupons</span>
              <FaChevronDown className="h-3 w-3 ml-auto" />
            </button>
            {isDropdownOpen.coupons && (
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <a href='/admin/pages/coupons'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Coupons</span>
                    </button>
                  </a>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button
              className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              onClick={() => toggleDropdown('sliders')} // Toggle for sliders
            >
              <FaImages className="h-5 w-5" />
              <span className="ml-2">Slider</span>
              <FaChevronDown className="h-3 w-3 ml-auto" />
            </button>
            {isDropdownOpen.sliders && (
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <a href='/admin/pages/slider'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">View Sliders</span>
                    </button>
                  </a>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button
              className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              onClick={() => toggleDropdown('socialmedia')} // Toggle for social media
            >
              <FaUsers className="h-5 w-5" />
              <span className="ml-2">Social Media</span>
              <FaChevronDown className="h-3 w-3 ml-auto" />
            </button>
            {isDropdownOpen.socialmedia && (
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <a href='/admin/pages/socialmedia'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Manage Social Media</span>
                    </button>
                  </a>
                </li>
              </ul>
            )}
          </li>

          

          {/* Blog Dropdown */}
          <li>
            <button
              className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              onClick={() => toggleDropdown('blog')} // Toggle for blog
            >
              <FaBlog className="h-5 w-5" />
              <span className="ml-2">Blog</span>
              <FaChevronDown className="h-3 w-3 ml-auto" />
            </button>
            {isDropdownOpen.blog && (
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <a href='/admin/pages/Blogs'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Add Blog</span>
                    </button>
                  </a>
                </li>
                <li>
                  <a href='/admin/pages/BlogCategory'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Blog Categories</span>
                    </button>
                  </a>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button
              className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              onClick={() => toggleDropdown('reviews')}
            >
              <FaStar className="h-5 w-5" />
              <span className="ml-2">Customer Reviews</span>
              <FaChevronDown className="h-3 w-3 ml-auto" />
            </button>
            {isDropdownOpen.reviews && (
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <a href='/admin/pages/reviews'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">View Reviews</span>
                    </button>
                  </a>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button
              className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              onClick={() => toggleDropdown('pages')} // Toggle for social media
            >
              <FaPage4 className="h-5 w-5" />
              <span className="ml-2">Pages</span>
              <FaChevronDown className="h-3 w-3 ml-auto" />
            </button>
            {isDropdownOpen.pages && (
              <ul className=" mt-2 space-y-2 text-sm">
                 <li>
                  <a href='/admin/pages/addPrivacyPolicy'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Privacy Policy</span>
                    </button>
                  </a>
                </li>
                <li>
                  <a href='/admin/pages/addTermsAndConditions'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Terms & Conditions</span>
                    </button>
                  </a>
                </li>
                <li>
                  <a href='/admin/pages/addShippingPolicy'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Shipping Policy</span>
                    </button>
                  </a>
                </li>
                <li>
                  <a href='/admin/pages/addReturnAndExchangePolicy'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Return & Exchange Policy</span>
                    </button>
                  </a>
                </li>
                <li>
                  <a href='/admin/pages/addAboutUs'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">About Us</span>
                    </button>
                  </a>
                </li>
                <li>
                  <a href='/admin/pages/addContactUs'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Contact Us</span>
                    </button>
                  </a>
                </li>
              </ul>
            )}
          </li>
          <li>
            <a href='/admin/pages/addFAQ'>
            <button
              className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
            >
              <FaUsers className="h-5 w-5" />
              <span className="ml-2">FAQs</span>
            </button>
            </a>
          </li>
          <li>
            <a href='/admin/pages/addContactInfo'>
              <button
                className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              >
                <FaPhone className="h-5 w-5" />
                <span className="ml-2">Contact Info</span>
              </button>
            </a>
          </li>
          <li>
            <a href='/admin/pages/CompanyDetails'>
              <button
                className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              >
                <FaStore className="h-5 w-5" />
                <span className="ml-2">Company Details</span>
              </button>
            </a>
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
