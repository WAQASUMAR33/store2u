import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';

// POST endpoint to create a new file type
export async function POST(request) {
  try {
    const data = await request.json();
    const { title } = data;
    const newFiletype = await prisma.Filetype.create({
      data: {
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(newFiletype);
  } catch (error) {
    console.error('Error creating file type', error);
    return NextResponse.json(
      {
        message: 'Failed to create file type',
        status: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

// GET endpoint to fetch all file types
export async function GET() {
  try {
    const filetypes = await prisma.Filetype.findMany();
    return NextResponse.json(filetypes);
  } catch (error) {
    console.error('Error fetching file types:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch file types',
        status: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
