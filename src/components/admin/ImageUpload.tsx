'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Copy, Check } from 'lucide-react';

export function ImageUpload() {
  const [urls, setUrls] = useState({
    logo: 'https://media.discordapp.net/attachments/1221867569460543508/1390175869577859133/logo.jpg?ex=68674dab&is=6865fc2b&hm=9316f84be1a6a445dd36bc945053c0a7a94d0cefcfa4f57ae4820a5102a6e876&=&format=webp&width=864&height=864',
    banner1: '',
    banner2: '',
    banner3: '',
    detalhes: 'https://cdn.discordapp.com/attachments/1221867569460543508/1390175868747382906/detalhes.png?ex=68674dab&is=6865fc2b&hm=e6d78b21750231ad8f249364e33282b37026a4b9ef8ddcd00b7da36dadac2b17&'
  });
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSave = () => {
    // Salvar URLs no localStorage para uso futuro
    localStorage.setItem('proboots-custom-images', JSON.stringify(urls));
    alert('URLs salvas! Para usar as imagens, atualize os componentes correspondentes.');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload de Imagens Personalizadas</CardTitle>
          <p className="text-sm text-gray-600">
            Cole as URLs das suas imagens hospedadas ou use um serviço como Imgur, Google Drive, etc.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium mb-2">Logo do Site (32x32px recomendado)</label>
            <div className="flex gap-2">
              <Input
                placeholder="https://exemplo.com/logo.jpg"
                value={urls.logo}
                onChange={(e) => setUrls({...urls, logo: e.target.value})}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(urls.logo, 'logo')}
                disabled={!urls.logo}
              >
                {copied === 'logo' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            {urls.logo && (
              <img src={urls.logo} alt="Preview logo" className="mt-2 w-8 h-8 rounded object-cover" />
            )}
          </div>

          {/* Banner 1 */}
          <div>
            <label className="block text-sm font-medium mb-2">Banner Principal 1 (800x400px recomendado)</label>
            <div className="flex gap-2">
              <Input
                placeholder="https://exemplo.com/banner1.jpg"
                value={urls.banner1}
                onChange={(e) => setUrls({...urls, banner1: e.target.value})}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(urls.banner1, 'banner1')}
                disabled={!urls.banner1}
              >
                {copied === 'banner1' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            {urls.banner1 && (
              <img src={urls.banner1} alt="Preview banner 1" className="mt-2 w-full h-24 rounded object-cover" />
            )}
          </div>

          {/* Banner 2 */}
          <div>
            <label className="block text-sm font-medium mb-2">Banner Principal 2 (800x400px recomendado)</label>
            <div className="flex gap-2">
              <Input
                placeholder="https://exemplo.com/banner2.jpg"
                value={urls.banner2}
                onChange={(e) => setUrls({...urls, banner2: e.target.value})}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(urls.banner2, 'banner2')}
                disabled={!urls.banner2}
              >
                {copied === 'banner2' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            {urls.banner2 && (
              <img src={urls.banner2} alt="Preview banner 2" className="mt-2 w-full h-24 rounded object-cover" />
            )}
          </div>

          {/* Banner 3 */}
          <div>
            <label className="block text-sm font-medium mb-2">Banner Principal 3 (800x400px recomendado)</label>
            <div className="flex gap-2">
              <Input
                placeholder="https://exemplo.com/banner3.jpg"
                value={urls.banner3}
                onChange={(e) => setUrls({...urls, banner3: e.target.value})}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(urls.banner3, 'banner3')}
                disabled={!urls.banner3}
              >
                {copied === 'banner3' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            {urls.banner3 && (
              <img src={urls.banner3} alt="Preview banner 3" className="mt-2 w-full h-24 rounded object-cover" />
            )}
          </div>

          {/* Detalhes */}
          <div>
            <label className="block text-sm font-medium mb-2">Imagem de Detalhes dos Produtos (600x400px recomendado)</label>
            <div className="flex gap-2">
              <Input
                placeholder="https://exemplo.com/detalhes.png"
                value={urls.detalhes}
                onChange={(e) => setUrls({...urls, detalhes: e.target.value})}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(urls.detalhes, 'detalhes')}
                disabled={!urls.detalhes}
              >
                {copied === 'detalhes' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            {urls.detalhes && (
              <img src={urls.detalhes} alt="Preview detalhes" className="mt-2 w-full h-32 rounded object-cover" />
            )}
          </div>

          <Button onClick={handleSave} className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Salvar URLs das Imagens
          </Button>
        </CardContent>
      </Card>

      {/* Instruções */}
      <Card>
        <CardHeader>
          <CardTitle>Como usar suas próprias imagens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-medium">1. Hospedar imagens online:</h4>
              <p className="text-gray-600">Use serviços como Imgur, Google Drive, Dropbox ou qualquer hosting de imagens</p>
            </div>
            <div>
              <h4 className="font-medium">2. Copiar URLs:</h4>
              <p className="text-gray-600">Cole as URLs diretas das imagens nos campos acima</p>
            </div>
            <div>
              <h4 className="font-medium">3. Aplicar no site:</h4>
              <p className="text-gray-600">Use os botões "Editar" nos banners para atualizar as URLs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
