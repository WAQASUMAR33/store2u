import { NextResponse } from 'next/server';
import multer from 'multer';
import prisma from '../../util/prisma';

import fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

const upload = multer({
  dest: 'public/Uploads/',
  limits: { fileSize: 1024 * 1024 * 5 }, // limit file size to 5 MB
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handleMultipartForm(req, res) {
  return new Promise((resolve, reject) => {
    upload.single('image')(req, res, (err) => {
      if (err) return reject(err);
      resolve(req);
    });
  });
}

export async function GET(req) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: true,
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req, res) {
  try {
    await handleMultipartForm(req, res);

    const { userId, total, status, orderItems } = req.body;
    const imageUrl = req.file ? `/Uploads/${req.file.filename}` : null;

    const newOrder = await prisma.order.create({
      data: {
        userId: parseInt(userId),
        total: parseFloat(total),
        status,
        imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: {
          create: orderItems.map(item => ({
            productId: parseInt(item.productId),
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
          })),
        },
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = req.query;
    const deletedOrder = await prisma.order.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json(deletedOrder);
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}

export async function PUT(req, res) {
  try {
    await handleMultipartForm(req, res);

    const { id, userId, total, status, orderItems } = req.body;
    const imageUrl = req.file ? `/Uploads/${req.file.filename}` : null;

    const updatedOrder = await prisma.order.update({
      where: {
        id: parseInt(id),
      },
      data: {
        userId: parseInt(userId),
        total: parseFloat(total),
        status,
        imageUrl,
        updatedAt: new Date(),
        orderItems: {
          deleteMany: {}, // Remove all current order items
          create: orderItems.map(item => ({
            productId: parseInt(item.productId),
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
          })),
        },
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
