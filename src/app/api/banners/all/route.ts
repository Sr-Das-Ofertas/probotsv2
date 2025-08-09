import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { type Banner } from '@/data/products';

const dataFilePath = path.join(process.cwd(), 'src/db/banners.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const banners = JSON.parse(fileContents);
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ message: 'Error reading banners data' }, { status: 500 });
  }
} 