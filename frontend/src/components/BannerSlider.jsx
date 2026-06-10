import React, { useState, useEffect } from 'react';
import '../styles/BannerSlider.css';

const banners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop',
    title: 'End of Season Sale',
    subtitle: 'Up to 50% Off on all Premium Brands.',
    buttonText: 'Shop Now',
    link: '#shop'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
    title: 'New Arrivals',
    subtitle: 'Discover the latest fashion trends curated just for you.',
    buttonText: 'Explore',
    link: '#explore'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
    title: 'Tech Gadgets',
    subtitle: 'Elevate your experience with top-tier electronics.',
    buttonText: 'View Gadgets',
    link: '#tech'
  }
];

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(slideInterval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  return (
    <div className="banner-slider">
      <div 
        className="banner-slider-inner"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div className="banner-slide" key={banner.id}>
            <div className="banner-image-wrapper">
              <img src={banner.image} alt={banner.title} className="banner-image" />
              <div className="banner-overlay"></div>
            </div>
            <div className="banner-content">
              <h1 className="banner-title">{banner.title}</h1>
              <p className="banner-subtitle">{banner.subtitle}</p>
              <button className="banner-btn" onClick={() => window.scrollTo({ top: 500, behavior: 'smooth'})}>
                {banner.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="banner-control prev" onClick={prevSlide} aria-label="Previous slide">
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <button className="banner-control next" onClick={nextSlide} aria-label="Next slide">
        <i className="fa-solid fa-chevron-right"></i>
      </button>

      <div className="banner-indicators">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
