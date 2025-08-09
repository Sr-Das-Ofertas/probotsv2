import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { type Category } from '@/data/products';

const dataFilePath = path.join(process.cwd(), 'src/db/categories.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const categories = JSON.parse(fileContents);
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ message: 'Error reading categories data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newCategory: Omit<Category, 'id' | 'productIds'> = await request.json();
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const categories: Category[] = JSON.parse(fileContents);
    
    const categoryToAdd: Category = { ...newCategory, id: Date.now().toString(), productIds: [] };
    categories.push(categoryToAdd);
    
    await fs.writeFile(dataFilePath, JSON.stringify(categories, null, 2));
    
    return NextResponse.json(categoryToAdd, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating category' }, { status: 500 });
  }
} 