import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';

// PUT endpoint to update a file type
export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, title } = data;
    const updatedFiletype = await prisma.filetype.update({
      where: { id: parseInt(id) },
      data: {
        title,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(updatedFiletype);
  } catch (error) {
    console.error('Error updating file type', error);
    return NextResponse.json(
      {
        message: 'Failed to update file type',
        status: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    const deletedfiletype = await prisma.Filetype.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(deletedfiletype);
  } catch (error) {
    console.error('Error deleting filetype:', error);
    return NextResponse.json(
      {
        message: 'Failed to delete filetype',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}