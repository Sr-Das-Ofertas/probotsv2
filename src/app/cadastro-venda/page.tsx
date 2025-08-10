'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import FacebookPixel from '@/components/FacebookPixel';

interface Settings {
  pixelId: string;
}

export default function CadastroVendaPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const saleValue = 149.90;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        } else {
          throw new Error('Falha ao carregar configurações');
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as configurações do Pixel.",
          variant: "destructive",
        });
      }
    };
    fetchSettings();
  }, [toast]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email) {
        toast({
            title: "Campos obrigatórios",
            description: "Por favor, preencha o nome e o email.",
            variant: "destructive",
        });
        setLoading(false);
        return;
    }

    const params = new URLSearchParams({
      name,
      email,
      phone,
      value: saleValue.toString(),
    });

    router.push(`/obrigado?${params.toString()}`);
  };

  return (
    <>
      {settings?.pixelId && <FacebookPixel pixelId={settings.pixelId} />}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Cadastro Manual de Venda</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nome do Cliente</label>
                <Input
                  id="name"
                  type="text"
                  placeholder="João da Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email do Cliente</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="joao.silva@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Telefone do Cliente (Opcional)</label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrar Venda'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
