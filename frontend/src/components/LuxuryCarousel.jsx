import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const LuxuryCarousel = ({ slides = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);

  // Reset drag offset when index changes (but not during drag)
  useEffect(() => {
    if (!isDragging) {
      setDragOffset(0);
    }
  }, [currentIndex, isDragging]);

  // Auto-play functionality - separate effect to ensure it keeps running
  useEffect(() => {
    // Function to start/restart auto-play
    const startAutoPlay = () => {
      // Clear any existing interval first
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Only start if conditions are met
      if (!isPaused && !isDragging && slides.length > 1) {
        intervalRef.current = setInterval(() => {
          setCurrentIndex((prev) => {
            const next = (prev + 1) % slides.length;
            return next;
          });
        }, 1500);
      }
    };

    // Stop auto-play if conditions not met
    if (isPaused || isDragging || slides.length <= 1) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      // Start or restart auto-play
      startAutoPlay();
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused, isDragging, slides.length]);

  // Handle mouse drag
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragOffset(0);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const offset = e.clientX - dragStart;
    setDragOffset(offset);
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    
    const threshold = 100; // Minimum drag distance to trigger slide change
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
      } else {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
  }, [isDragging, dragOffset, slides.length]);

  // Handle touch events for mobile
  const handleTouchStart = useCallback((e) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
    setDragOffset(0);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    const offset = e.touches[0].clientX - dragStart;
    setDragOffset(offset);
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    
    const threshold = 100;
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
      } else {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
  }, [isDragging, dragOffset, slides.length]);

  // Navigation functions
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  // Calculate visible slides (current, prev, next)
  const getVisibleSlides = () => {
    const visible = [];
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    const nextIndex = (currentIndex + 1) % slides.length;
    
    visible.push({ index: prevIndex, position: 'prev', slide: slides[prevIndex] });
    visible.push({ index: currentIndex, position: 'current', slide: slides[currentIndex] });
    visible.push({ index: nextIndex, position: 'next', slide: slides[nextIndex] });
    
    return visible;
  };

  const visibleSlides = getVisibleSlides();

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
      onMouseEnter={(e) => {
        setIsPaused(true);
      }}
      onMouseLeave={(e) => {
        setIsPaused(false);
        if (isDragging) {
          handleMouseUp();
        }
      }}
      ref={carouselRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Navigation Arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToPrev();
        }}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-white transition-colors" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          goToNext();
        }}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-white transition-colors" />
      </button>

      {/* Carousel Container */}
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
        <div className="flex items-center justify-center h-full relative">
          {visibleSlides.map(({ index, position, slide }) => {
            const isCurrent = position === 'current';
            const isPrev = position === 'prev';
            const isNext = position === 'next';
            
            // Calculate sizing and positioning for horizontal layout
            let scale = 0.85;
            let opacity = 0.7;
            let zIndex = 10;
            let width = '35vw';
            let maxWidth = '450px';
            let translateX = 0;
            
            if (isCurrent) {
              scale = 1;
              opacity = 1;
              zIndex = 20;
              width = '45vw';
              maxWidth = '650px';
              translateX = 0;
            } else if (isPrev) {
              scale = 0.85;
              opacity = 0.7;
              zIndex = 5;
              width = '35vw';
              maxWidth = '450px';
              translateX = -120;
            } else if (isNext) {
              scale = 0.85;
              opacity = 0.7;
              zIndex = 5;
              width = '35vw';
              maxWidth = '450px';
              translateX = 120;
            }
            
            const widthValue = parseFloat(width);
            const dragOffsetValue = isCurrent ? dragOffset : (isPrev ? dragOffset * 0.3 : dragOffset * 0.3);
            
            return (
              <div
                key={`slide-${index}`}
                className="absolute h-full"
                style={{
                  transform: `translateX(calc(${translateX}% + ${dragOffsetValue}px)) scale(${scale})`,
                  transformOrigin: 'center center',
                  opacity,
                  zIndex,
                  width,
                  maxWidth,
                  left: `calc(50% - ${widthValue / 2}vw)`,
                  transition: isDragging 
                    ? 'none' 
                    : 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.8s ease-in-out, scale 0.8s ease-in-out',
                  willChange: 'transform, opacity, scale',
                  boxShadow: 'none',
                  filter: 'none',
                  pointerEvents: isCurrent ? 'auto' : 'none',
                }}
              >
                <SlideContent slide={slide} isActive={isCurrent} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-8 h-2 bg-white'
                : 'w-2 h-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
};

// Slide Content Component
const SlideContent = ({ slide, isActive }) => {
  return (
    <div className="relative w-full h-full">
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          transform: isActive ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 0.8s ease-in-out',
        }}
      >
        <img
          src={slide.image}
          alt={slide.title || slide.subCategory}
          className="w-full h-full object-contain"
          loading="lazy"
          style={{
            filter: 'none',
            boxShadow: 'none',
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      </div>
    </div>
  );
};

export default LuxuryCarousel;
