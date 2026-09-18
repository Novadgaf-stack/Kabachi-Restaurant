import React, { useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  aspectRatio?: string; // e.g. "aspect-4/3"
  hoverScale?: boolean;
}

export function LazyImage({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  aspectRatio = 'aspect-4/3',
  hoverScale = false,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#E7E3DC] ${aspectRatio} ${wrapperClassName}`}
    >
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-[#E7E3DC] animate-pulse"
          aria-hidden="true"
        />
      )}
      <img
        src={hasError ? '/logo.png' : src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${hoverScale ? 'img-hover-scale' : ''} ${className}`}
      />
    </div>
  );
}
