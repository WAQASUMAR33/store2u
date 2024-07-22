import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    const customer = await prisma.customer.findUnique({
      where: {
        id: id,
      },
    });
    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch customer',
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
    const data = await request.json();
    const updatedCustomer = await prisma.Customer.update({
      where: {
        id: id,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      {
        message: 'Failed to update customer',
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
    const deletedCustomer = await prisma.Customer.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(deletedCustomer);
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      {
        message: 'Failed to delete customer',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
