'use client';
import { useEffect, useState } from 'react';
import FilterableTable from './FilterableTable';

const fetchCategories = async () => {
  try {
    const response = await fetch('/api/categories');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

const fetchSubcategories = async () => {
  try {
    const response = await fetch('/api/subcategories');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
};

const fetchProducts = async () => {
  try {
    const response = await fetch('/api/products');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const [fetchedProducts, fetchedCategories, fetchedSubcategories] = await Promise.all([
      fetchProducts(),
      fetchCategories(),
      fetchSubcategories(),
    ]);
    setProducts(fetchedProducts);
    setCategories(fetchedCategories);
    setSubcategories(fetchedSubcategories);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {isLoading ? (
        <div className="text-center text-2xl">Loading...</div>
      ) : (
        <FilterableTable
          products={products}
          fetchProducts={fetchData}
          categories={categories}
          subcategories={subcategories}
        />
      )}
    </div>
  );
};

export default ProductsPage;
