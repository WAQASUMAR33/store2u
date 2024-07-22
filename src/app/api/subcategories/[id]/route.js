import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';
import fs from 'fs';
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
    const categoryId = parseInt(formData.get('categoryId'));
    const imageFile = formData.get('image');

    let imageUrl = '';
    if (imageFile) {
      const imageExtension = path.extname(imageFile.name);
      const imageName = `${uuidv4()}${imageExtension}`;
      const imagePath = path.join(uploadDir, imageName);
      const arrayBuffer = await imageFile.arrayBuffer();
      fs.writeFileSync(imagePath, Buffer.from(arrayBuffer));
      imageUrl = `/uploads/${imageName}`;
    }

    const newSubcategory = await prisma.subcategory.create({
      data: {
        name,
        categoryId,
        imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newSubcategory);
  } catch (error) {
    console.error('Error creating subcategory:', error);
    return NextResponse.json(
      {
        message: 'Failed to create subcategory',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const categoryId = parseInt(formData.get('categoryId'));
    const imageFile = formData.get('image');

    let imageUrl = formData.get('imageUrl');
    if (imageFile) {
      const imageExtension = path.extname(imageFile.name);
      const imageName = `${uuidv4()}${imageExtension}`;
      const imagePath = path.join(uploadDir, imageName);
      const arrayBuffer = await imageFile.arrayBuffer();
      fs.writeFileSync(imagePath, Buffer.from(arrayBuffer));
      imageUrl = `/uploads/${imageName}`;
    }

    const updatedSubcategory = await prisma.subcategory.update({
      where: { id: parseInt(params.id) },
      data: {
        name,
        categoryId,
        imageUrl,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedSubcategory);
  } catch (error) {
    console.error('Error updating subcategory:', error);
    return NextResponse.json(
      {
        message: 'Failed to update subcategory',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
    try {
      const subcategoryId = parseInt(params.id);
  
      // Find all products in the subcategory
      const products = await prisma.product.findMany({
        where: { subcategoryId: subcategoryId },
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
        where: { subcategoryId: subcategoryId },
      });
  
      // Now delete the subcategory
      const deletedSubcategory = await prisma.subcategory.delete({
        where: { id: subcategoryId },
      });
  
      return NextResponse.json(deletedSubcategory);
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      return NextResponse.json(
        {
          message: 'Failed to delete subcategory',
          status: false,
          error: error.message,
        },
        { status: 500 }
      );
    }
  }