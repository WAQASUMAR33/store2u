import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const subcategories = await prisma.subcategory.findMany({
      include: {
        category: true,
      },
    });
    return NextResponse.json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch subcategories',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const categoryId = formData.get('categoryId');
    const image = formData.get('image');
    let imageUrl = '';

    if (image) {
      const imagePath = `/uploads/${Date.now()}_${image.name}`;
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await fs.writeFile(path.join(process.cwd(), 'public', imagePath), buffer);
      imageUrl = imagePath;
    }

    const newSubcategory = await prisma.subcategory.create({
      data: {
        name,
        categoryId: parseInt(categoryId),
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
