import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { type Product } from '@/data/products';

const dataFilePath = path.join(process.cwd(), 'src/db/products.json');

// GET all products
export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const products = JSON.parse(fileContents);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to read products:', error);
    return NextResponse.json({ message: 'Error reading products data' }, { status: 500 });
  }
}

// POST a new product
export async function POST(request: Request) {
  try {
    const newProduct: Omit<Product, 'id'> = await request.json();
    
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const products: Product[] = JSON.parse(fileContents);
    
    const productToAdd: Product = { ...newProduct, id: Date.now().toString() };
    products.push(productToAdd);
    
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
    
    return NextResponse.json(productToAdd, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ message: 'Error creating product' }, { status: 500 });
  }
} 