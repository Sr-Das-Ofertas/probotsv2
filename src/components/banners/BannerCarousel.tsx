'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import type { Banner } from '@/data/products';

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateCurrentIndex = useCallback(() => {
    if (emblaApi) {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/banners');
        if (!res.ok) throw new Error('Failed to fetch banners');
        const data = await res.json();
        setBanners(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', updateCurrentIndex);
    return () => {
      emblaApi.off('select', updateCurrentIndex);
    };
  }, [emblaApi, updateCurrentIndex]);
  
  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full h-screen overflow-hidden box-border pt-36" ref={emblaRef}>
      <div className="flex h-full">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
            className="flex-shrink-0 w-full h-full relative"
        >
          <div className="relative w-full h-full">
            <Image
              src={banner.image}
              alt={banner.title}
              fill
                className="object-contain"
              priority={index === 0}
            />
            </div>
          </div>
        ))}
        </div>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
