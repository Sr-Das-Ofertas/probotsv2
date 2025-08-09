import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { type Category } from '@/data/products';

const dataFilePath = path.join(process.cwd(), 'src/db/categories.json');

const readCategories = async (): Promise<Category[]> => {
  const fileContents = await fs.readFile(dataFilePath, 'utf8');
  return JSON.parse(fileContents);
};

const writeCategories = async (categories: Category[]) => {
  await fs.writeFile(dataFilePath, JSON.stringify(categories, null, 2));
};

export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const updatedData: Partial<Category> = await request.json();
    let categories = await readCategories();
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    categories[index] = { ...categories[index], ...updatedData };
    await writeCategories(categories);

    return NextResponse.json(categories[index]);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating category' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    let categories = await readCategories();
    const filtered = categories.filter(c => c.id !== id);

    if (categories.length === filtered.length) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    await writeCategories(filtered);
    return NextResponse.json({ message: 'Category deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting category' }, { status: 500 });
  }
} 