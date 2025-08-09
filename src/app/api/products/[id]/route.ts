import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { type Product } from '@/data/products';

const dataFilePath = path.join(process.cwd(), 'src/db/products.json');

// Helper function to read data
const readProducts = async (): Promise<Product[]> => {
  const fileContents = await fs.readFile(dataFilePath, 'utf8');
  return JSON.parse(fileContents);
};

// Helper function to write data
const writeProducts = async (products: Product[]) => {
  await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
};

// PUT (update) a product
export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const updatedData: Partial<Product> = await request.json();
    
    let products = await readProducts();
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    products[productIndex] = { ...products[productIndex], ...updatedData };
    await writeProducts(products);

    return NextResponse.json(products[productIndex]);
  } catch (error) {
    console.error(`Failed to update product ${context.params.id}:`, error);
    return NextResponse.json({ message: 'Error updating product' }, { status: 500 });
  }
}

// DELETE a product
export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    
    let products = await readProducts();
    const filteredProducts = products.filter(p => p.id !== id);

    if (products.length === filteredProducts.length) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    await writeProducts(filteredProducts);
    
    return NextResponse.json({ message: 'Product deleted' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete product ${context.params.id}:`, error);
    return NextResponse.json({ message: 'Error deleting product' }, { status: 500 });
  }
} 