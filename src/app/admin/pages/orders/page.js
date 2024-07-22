'use client'
import { useEffect, useState } from 'react';
import FilterableTable from './FilterableTable'; // Ensure the correct import path

const OrdersPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/orders');
      const result = await response.json();
      setData(result);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {isLoading ? (
        <div className="text-center text-2xl">Loading...</div>
      ) : (
        <FilterableTable data={data} fetchData={fetchData} />
      )}
    </div>
  );
};

export default OrdersPage;
