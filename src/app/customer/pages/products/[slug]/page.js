// app/customer/pages/products/[slug]/page.js

import ProductPage from './product';
import { notFound } from 'next/navigation';

/**
 * Fetches product data from the API
 * @param {string} slug - Product slug identifier
 * @returns {Promise<Object|null>} Product data or null if error
 */
async function getProductData(slug) {
  if (!slug) {
    return null;
  }

  try {
    // Use relative URL for better compatibility
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const apiUrl = baseUrl ? `${baseUrl}/api/products/${slug}` : `/api/products/${slug}`;
    
    // Use ISR (Incremental Static Regeneration) for better performance
    // Revalidate every 60 seconds, but serve stale content immediately
    const res = await fetch(apiUrl, { 
      next: { revalidate: 60 }, // Cache for 60 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch product: ${res.status}`);
    }

    const data = await res.json();
    
    if (!data?.data) {
      return null;
    }

    return data.data;
  } catch (error) {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching product data:', error);
    }
    return null;
  }
}

/**
 * Generates metadata for SEO
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const productData = await getProductData(slug);

  if (!productData?.product) {
    return {
      title: 'Product Not Found | Store2U',
      description: 'The product you are looking for could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { product } = productData;
  const title = product.meta_title || product.name || 'Product Details';
  const description = product.meta_description || 
    `Shop ${product.name} at Store2U. ${product.description ? product.description.substring(0, 150) : 'Quality products at great prices.'}`;

  return {
    title: `${title} | Store2U`,
    description,
    keywords: product.meta_keywords || product.name,
    openGraph: {
      title: `${title} | Store2U`,
      description,
      type: 'website',
      images: product.images?.[0]?.url ? [
        {
          url: product.images[0].url.startsWith('http') 
            ? product.images[0].url 
            : `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${product.images[0].url}`,
          alt: product.name,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Store2U`,
      description,
    },
  };
}

/**
 * Product Details Page Component
 * Server component that fetches product data and renders the client component
 */
const ProductDetailsPage = async ({ params }) => {
  const { slug } = await params;

  if (!slug) {
    return notFound();
  }

  const productData = await getProductData(slug);

  if (!productData?.product) {
    return notFound();
  }

  return <ProductPage productData={productData} />;
};

export default ProductDetailsPage;
