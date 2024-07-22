import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const uploadDir = path.join(process.cwd(), 'public/uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const imageFile = formData.get('image');

    let imageUrl = '';
    if (imageFile) {
      const imageExtension = path.extname(imageFile.name);
      const imageName = `${uuidv4()}${imageExtension}`;
      const imagePath = path.join(uploadDir, imageName);
      const arrayBuffer = await imageFile.arrayBuffer();
      await fsPromises.writeFile(imagePath, Buffer.from(arrayBuffer));
      imageUrl = `/uploads/${imageName}`;
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      {
        message: 'Failed to create category',
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
    const formData = await request.formData();
    const name = formData.get('name');
    const imageFile = formData.get('image');

    let imageUrl = formData.get('imageUrl');
    if (imageFile) {
      const imageExtension = path.extname(imageFile.name);
      const imageName = `${uuidv4()}${imageExtension}`;
      const imagePath = path.join(uploadDir, imageName);
      const arrayBuffer = await imageFile.arrayBuffer();
      await fsPromises.writeFile(imagePath, Buffer.from(arrayBuffer));
      imageUrl = `/uploads/${imageName}`;
    }

    const updatedCategory = await prisma.category.update({
      where: { id: id },
      data: {
        name,
        imageUrl,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      {
        message: 'Failed to update category',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const categoryId = parseInt(params.id);

    // Find all subcategories in the category
    const subcategories = await prisma.subcategory.findMany({
      where: { categoryId: categoryId },
    });

    // Loop through each subcategory
    for (const subcategory of subcategories) {
      // Find all products in the subcategory
      const products = await prisma.product.findMany({
        where: { subcategoryId: subcategory.id },
      });

      // Delete related order items and images for each product
      for (const product of products) {
        await prisma.orderItem.deleteMany({
          where: { productId: product.id },
        });

        await prisma.image.deleteMany({
          where: { productId: product.id },
        });
      }

      // Delete the products in the subcategory
      await prisma.product.deleteMany({
        where: { subcategoryId: subcategory.id },
      });
    }

    // Delete the subcategories in the category
    await prisma.subcategory.deleteMany({
      where: { categoryId: categoryId },
    });

    // Now delete the category
    const deletedCategory = await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json(deletedCategory);
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      {
        message: 'Failed to delete category',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    const category = await prisma.category.findUnique({
      where: { id: id },
      include: {
        subcategories: true,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch category',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
