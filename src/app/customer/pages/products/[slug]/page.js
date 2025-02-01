// app/customer/pages/products/[slug]/page.js

import ProductPage from './product'; // Import your ProductPage component
import { notFound } from 'next/navigation';

// Fetch product data server-side using async function
async function getProductData(slug) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ;

  try {
    const res = await fetch(`${apiUrl}/api/products/${slug}`, { cache: 'no-store' });

    if (!res.ok) {
      console.error('Failed to fetch product data:', res.status);
      return null;
    }

    const data = await res.json();
    console.log("From page.js data is : ",data.data);
    return data.data;

  } catch (error) {
    console.error('Error fetching product data:', error);
    return null;
  }
}

// Metadata generation
export async function generateMetadata({ params }) {
  const { slug } = params;
  const productData = await getProductData(slug);

  if (!productData?.product) {
    return {
      title: 'Product not found',
      description: 'No product information available',
    };
  }

  return {
    title: productData.product.meta_title || productData.product.name || 'Product Title',
    description: productData.product.meta_description || 'Product Description',
    keywords: productData.product.meta_keywords || 'Product Keywords',
  };
}

const ProductDetailsPage = async ({ params }) => {
  const { slug } = params;

  // Fetch the product data using 'slug'
  const productData = await getProductData(slug);

  // Handle product not found
  if (!productData?.product) {
    return notFound(); // Use Next.js built-in 404 handling
  }

  // Return the ProductPage component with the fetched product data
  return <ProductPage productData={productData} />;
};

export default ProductDetailsPage;
