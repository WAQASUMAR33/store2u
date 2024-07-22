import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    const product = await prisma.product.findUnique({
      where: { id: id },
      include: {
        subcategory: true,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch product',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const { name, description, price, stock, subcategoryId, colors, sizes } = await request.json();
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        subcategoryId: subcategoryId ? parseInt(subcategoryId) : null,
        colors: colors ? JSON.parse(colors) : null,
        sizes: sizes ? JSON.parse(sizes) : null,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      {
        message: 'Failed to update product',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    const deletedProduct = await prisma.product.delete({
      where: { id: id },
    });
    return NextResponse.json(deletedProduct);
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      {
        message: 'Failed to delete product',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
