import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile } from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No files received.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replaceAll(' ', '_');

  try {
    await writeFile(path.join(process.cwd(), 'public/Upload', filename), buffer);
    return NextResponse.json({ message: 'Success', filePath: `/Upload/${filename}`, status: 201 });
  } catch (error) {
    console.error('Error occurred', error);
    return NextResponse.json({ message: 'Failed', status: 500 });
  }
}
