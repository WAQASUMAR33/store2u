import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, description, price, stock, subcategoryId, colors, sizes, images } = data;

    if (!images || images.length === 0) {
      throw new Error('No images provided');
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        subcategoryId: parseInt(subcategoryId),
        colors: JSON.stringify(colors),
        sizes: JSON.stringify(sizes),
        createdAt: new Date(),
        updatedAt: new Date(),
        images: {
          create: images.map(url => ({ url })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({
      status: 200,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      {
        message: 'Failed to create product',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.$queryRaw`SELECT product.*, image.url FROM product INNER JOIN image ON image.productId = product.id group by  product.id`;
    return NextResponse.json(products);
  } catch (error) {
    console.log('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Failed to fetch products', error: error.message },
      { status: 500 }
    );
  }
}
