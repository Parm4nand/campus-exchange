import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HorizontalImageScroller = ({ images, height = "h-56" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images.length, isPaused]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Restart auto-scroll after 5 seconds
    setTimeout(() => {
      if (!isPaused) {
        intervalRef.current = setInterval(() => {
          setCurrentIndex(prev => (prev + 1) % images.length);
        }, 3000);
      }
    }, 5000);
  };

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % images.length);
  };

  const prevSlide = () => {
    goToSlide((currentIndex - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`${height} bg-gray-200 rounded-xl flex items-center justify-center`}>
        <span className="text-gray-500">No images</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className={`${height} rounded-xl overflow-hidden`}>
        <img
          src={images[0]}
          alt="Event"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div 
      className={`relative ${height} rounded-xl overflow-hidden group`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Current Image */}
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-500"
      />

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={20} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-white w-4' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Pause/Play Indicator */}
      {isPaused && (
        <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
         
        </div>
      )}
    </div>
  );
};

export default HorizontalImageScroller;