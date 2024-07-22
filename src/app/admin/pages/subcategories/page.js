"use client";
import React, { useEffect, useState } from 'react';
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

const SubcategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const fetchData = async () => {
    const fetchedCategories = await fetchCategories();
    const fetchedSubcategories = await fetchSubcategories();
    setCategories(fetchedCategories);
    setSubcategories(fetchedSubcategories);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Subcategories Management</h1>
      <FilterableTable subcategories={subcategories} fetchSubcategories={fetchData} categories={categories} />
    </div>
  );
};

export default SubcategoryPage;
