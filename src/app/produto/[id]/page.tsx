'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { ArrowLeft, ShoppingCart, Heart, Share2, Minus, Plus, Check } from 'lucide-react';
import Image from 'next/image';
import type { Product } from '@/data/products';
import { useToast } from '@/hooks/use-toast';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [detalhesImageUrl, setDetalhesImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);
  const { addItem, formatPrice } = useCart();
  const { toast } = useToast();

  const sizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];

  // URL de fallback local
  const fallbackImageUrl = '/detalhes.png';

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const products: Product[] = await res.json();
        const foundProduct = products.find(p => p.id === params.id);
        setProduct(foundProduct || null);
      } catch (error) {
        console.error(error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    // Carregar imagem de detalhes do localStorage ou usar fallback
    if (typeof window !== 'undefined') {
      try {
        const customImages = localStorage.getItem('proboots-custom-images');
        console.log('Custom images from localStorage:', customImages);
        
        if (customImages) {
          const images = JSON.parse(customImages);
          console.log('Parsed images:', images);
          
          if (images.detalhes && images.detalhes.trim() !== '') {
            console.log('Using custom detalhes image:', images.detalhes);
            setDetalhesImageUrl(images.detalhes);
          } else {
            console.log('No custom detalhes image found, using fallback');
            setDetalhesImageUrl(fallbackImageUrl);
          }
        } else {
          console.log('No custom images in localStorage, using fallback');
          setDetalhesImageUrl(fallbackImageUrl);
        }
      } catch (error) {
        console.error('Erro ao carregar imagem de detalhes:', error);
        setDetalhesImageUrl(fallbackImageUrl);
      }
    }

    fetchProduct();
  }, [params.id]);

  const handleImageError = () => {
    console.error('Erro ao carregar imagem de detalhes');
    setImageError(true);
  };

  // Log da URL da imagem para debug
  useEffect(() => {
    console.log('Current detalhes image URL:', detalhesImageUrl);
    console.log('Image error state:', imageError);
  }, [detalhesImageUrl, imageError]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center pt-32">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500">Produto não encontrado</p>
            <Button onClick={() => router.push('/')}>
              Voltar ao início
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: '⚠️ Tamanho não selecionado',
        description: 'Por favor, selecione um tamanho antes de adicionar ao carrinho.',
        variant: 'destructive',
      });
      return;
    }
    addItem(product, quantity, selectedSize);
    toast({
      title: '🛒 Produto adicionado ao carrinho!',
      description: `${product.name} (Tamanho: ${selectedSize}) foi adicionado com sucesso.`,
      variant: 'cart',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Header com botão voltar */}
        <div className="bg-white p-4 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-gray-600 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Galeria de imagens */}
        <div className="bg-white p-4">
          <div className="relative w-full h-80 mb-4 rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImageIndex] || product.coverImage}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.discount && (
              <Badge className="absolute top-4 left-4 bg-green-500 text-white">
                {product.discount}% OFF
              </Badge>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-bold">FORA DE ESTOQUE</span>
              </div>
            )}
          </div>

          {/* Miniaturas */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações do produto */}
        <div className="bg-white p-4 space-y-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h1>

            <div className="flex items-center gap-2 mb-3">
              {product.bestSeller && (
                <Badge className="bg-green-500">Mais Vendido</Badge>
              )}
              {product.featured && (
                <Badge className="bg-purple-500">Destaque</Badge>
              )}
              {product.forYou && (
                <Badge className="bg-red-500">Para Você</Badge>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </div>
              {product.originalPrice && (
                <div className="flex items-center gap-2">
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-green-600 font-medium">
                    Economia de {formatPrice(product.originalPrice - product.price)}
                  </span>
                </div>
              )}
              <div className="text-sm text-gray-600">
                ou 5x de {formatPrice(Math.floor(product.price / 5))} sem juros
              </div>
            </div>
          </div>

          {/* Seleção de tamanho */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Tamanho:</h3>
            <div className="grid grid-cols-5 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 px-3 border rounded-lg text-sm font-medium transition-colors ${
                    selectedSize === size
                      ? 'border-red-600 bg-red-50 text-red-600'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantidade */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Quantidade:</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-medium min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="space-y-3">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.inStock ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Favoritar
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>

        {/* Descrição do produto */}
        <div className="bg-white p-4 mt-2">
          <h3 className="font-bold text-lg text-gray-900 mb-3">Descrição</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            {product.description}
          </p>
          <div className="mt-6">
            <img
              src={imageError ? fallbackImageUrl : detalhesImageUrl}
              alt="Tabela de medidas do produto"
              className="w-full rounded-lg"
              onError={handleImageError}
              onLoad={() => setImageError(false)}
            />
          </div>
        </div>

        {/* Especificações */}
        <div className="bg-white p-4 mt-2">
          <h3 className="font-bold text-lg text-gray-900 mb-3">Especificações</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Categoria:</span>
              <span className="font-medium capitalize">{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Disponibilidade:</span>
              <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? 'Em estoque' : 'Fora de estoque'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">SKU:</span>
              <span className="font-medium">PRB-{product.id}</span>
            </div>
          </div>
        </div>

        {/* Informações de entrega */}
        <div className="bg-white p-4 mt-2 mb-6">
          <h3 className="font-bold text-lg text-gray-900 mb-3">Entrega</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">🚚</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Frete Grátis</p>
                <p className="text-xs text-gray-600">Entrega em todo o Brasil</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">📦</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Envio Rápido</p>
                <p className="text-xs text-gray-600">Acompanhe com código de rastreio</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
