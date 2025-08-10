'use client';

import { useEffect, Suspense, useState, FC } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FacebookPixel from '@/components/FacebookPixel';
import { useToast } from '@/hooks/use-toast';

// Declaração para o TypeScript saber sobre a função fbq
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

interface Settings {
  pixelId: string;
}

const ObrigadoContent = () => {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const name = searchParams.get('name');
  const value = searchParams.get('value');
  const email = searchParams.get('email'); // Opcional, para exibição ou uso futuro
  const phone = searchParams.get('phone'); // Opcional

  useEffect(() => {
    if (typeof window.fbq !== 'function') {
      console.warn("Função fbq do Pixel não encontrada. O evento de compra não será disparado.");
      toast({
          title: "Atenção",
          description: "O Pixel do Facebook não foi inicializado. A conversão não foi registrada.",
          variant: "destructive",
      });
      return;
    }

    if (value) {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        window.fbq('track', 'Purchase', {
          value: numericValue,
          currency: 'BRL',
          content_name: 'Venda Manual',
          content_ids: ['manual-sale'],
          content_type: 'product'
        });
        toast({
            title: "Sucesso!",
            description: "Evento de compra registrado no Pixel.",
        });
      }
    }
  }, [value, toast]);

  return (
    <Card className="w-full max-w-lg text-center">
      <CardHeader>
        <CardTitle className="text-2xl text-green-600">Venda Registrada com Sucesso!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg">
          Obrigado, a conversão de compra para <strong>{name || 'cliente'}</strong> no valor de <strong>R$ {parseFloat(value || '0').toFixed(2)}</strong> foi enviada ao Facebook.
        </p>
        <p className="text-sm text-gray-500">
          Você já pode fechar esta página.
        </p>
      </CardContent>
    </Card>
  );
};

export default function ObrigadoPage() {
    const [settings, setSettings] = useState<Settings | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/settings');
                if (response.ok) {
                    const data = await response.json();
                    setSettings(data);
                }
            } catch (error) {
                console.error("Erro ao carregar configurações do pixel", error);
            }
        };
        fetchSettings();
    }, []);


  return (
    <>
        {settings?.pixelId && <FacebookPixel pixelId={settings.pixelId} />}
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Suspense fallback={<div>Carregando...</div>}>
                <ObrigadoContent />
            </Suspense>
        </div>
    </>
  );
}
