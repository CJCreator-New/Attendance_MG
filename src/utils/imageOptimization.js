// Image optimization utilities

export const LazyImage = ({ src, alt, className, placeholder = '/placeholder.svg' }) => {
  const [imageSrc, setImageSrc] = React.useState(placeholder);
  const [isLoading, setIsLoading] = React.useState(true);
  const imgRef = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoading ? 'blur-sm' : ''}`}
      onLoad={() => setIsLoading(false)}
      loading="lazy"
    />
  );
};

export const optimizeImageUrl = (url, width, quality = 80) => {
  // For future integration with image CDN
  return url;
};
