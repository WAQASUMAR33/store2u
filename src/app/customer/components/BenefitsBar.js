import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldAlt, 
  faTruck, 
  faExchangeAlt, 
  faTag, 
  faCheckCircle,
  faShieldVirus
} from '@fortawesome/free-solid-svg-icons';
import 'tailwindcss/tailwind.css';

const benefits = [
  { icon: faShieldAlt, text: 'Safe Payments' },
  { icon: faTruck, text: 'Nationwide Delivery' },
  { icon: faExchangeAlt, text: 'Free & Easy Returns' },
  { icon: faTag, text: 'Best Price Guaranteed' },
  { icon: faCheckCircle, text: '100% Authentic Products' },
  { icon: faShieldVirus, text: 'Verified' },
];

const BenefitsBar = () => {
  return (
    <div className="bg-orange-50 py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center space-x-2">
            <FontAwesomeIcon icon={benefit.icon} className="text-orange-500" />
            <span className="text-gray-800">{benefit.text}</span>
            {index < benefits.length - 1 && <span className="text-gray-300">|</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsBar;
