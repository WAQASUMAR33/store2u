import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
    try {
      const formData = await request.formData();
      const name = formData.get('name');
      const image = formData.get('image');
      let imageUrl = '';
  
      if (image) {
        const imagePath = `/uploads/${Date.now()}_${image.name}`;
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
  
        await fs.writeFile(path.join(process.cwd(), 'public', imagePath), buffer);
        imageUrl = imagePath;
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

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch categories',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
