import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'src', 'db', 'settings.json');

// GET - Buscar configurações
export async function GET() {
  try {
    const settingsData = await fs.readFile(settingsPath, 'utf-8');
    const settings = JSON.parse(settingsData);
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Erro ao ler configurações:', error);
    return NextResponse.json(
      { error: 'Erro ao ler configurações' },
      { status: 500 }
    );
  }
}

// POST - Atualizar configurações
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { whatsappNumber } = body;

    if (!whatsappNumber) {
      return NextResponse.json(
        { error: 'Número de WhatsApp é obrigatório' },
        { status: 400 }
      );
    }

    const settings = { whatsappNumber };
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));

    return NextResponse.json({ message: 'Configurações atualizadas com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar configurações' },
      { status: 500 }
    );
  }
}
