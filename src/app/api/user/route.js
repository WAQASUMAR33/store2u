import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    // Remove the id from the data if it's present
    const { id, ...customerData } = data;

    const newCustomer = await prisma.Customer.create({
      data: {
        ...customerData,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      {
        message: 'Failed to create customer',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const customers = await prisma.Customer.findMany();
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch customers',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
