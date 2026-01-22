import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Color palette for each slide - extracted from shoe colors
const getColorForSlide = (index, total) => {
  const colors = [
    { bg: '#F5F1E8', strip: '#E8D5C4' }, // Beige/Tan
    { bg: '#E8E8E8', strip: '#D4D4D4' }, // Light Gray
    { bg: '#F0E6D2', strip: '#E0D4B8' }, // Cream
    { bg: '#E5E3DF', strip: '#D4D2CE' }, // Warm Gray
    { bg: '#F2EDE5', strip: '#E5D9C8' }, // Beige
    { bg: '#E8E5E0', strip: '#D6D3CD' }, // Light Beige
    { bg: '#F5F0E8', strip: '#E8DDD0' }, // Cream Beige
    { bg: '#EDE8E0', strip: '#DDD4C8' }, // Warm Beige
    { bg: '#F0ECE5', strip: '#E3DBCF' }, // Soft Beige
    { bg: '#E8E5DF', strip: '#D6D3CC' }, // Neutral Beige
  ];
  return colors[index % colors.length];
};

const LuxuryCarousel = ({ slides = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        }, 2500); // Increased to 2.5 seconds for smoother viewing
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

  const currentSlide = slides[currentIndex];
  const currentColors = getColorForSlide(currentIndex, slides.length);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        background: `linear-gradient(180deg, ${currentColors.bg} 0%, ${currentColors.bg} 50%, ${currentColors.strip} 50%, ${currentColors.strip} 100%)`,
        transition: 'background 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Navigation Arrows - Hidden on mobile, visible on desktop */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToPrev();
        }}
        className="hidden md:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-white transition-colors" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          goToNext();
        }}
        className="hidden md:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-white transition-colors" />
      </button>

      {/* Carousel Container */}
      <div className="relative h-[400px] sm:h-[450px] md:h-[600px] lg:h-[700px] overflow-hidden pt-6 sm:pt-8 md:pt-10 lg:pt-12 pb-14 sm:pb-18 md:pb-22 lg:pb-24">
        <div className="flex items-center justify-center h-full relative">
          {visibleSlides.map(({ index, position, slide }) => {
            const isCurrent = position === 'current';
            const isPrev = position === 'prev';
            const isNext = position === 'next';
            const slideColors = getColorForSlide(index, slides.length);
            
            // Calculate sizing and positioning for horizontal layout
            // Mobile: Larger images, smaller container
            // Desktop: Original sizing
            let scale, opacity, width, maxWidth, translateX, zIndex;
            
            if (isCurrent) {
              scale = 1;
              opacity = 1;
              zIndex = 20;
              // Mobile: 70vw for larger images, Desktop: 45vw
              width = isMobile ? '70vw' : '45vw';
              maxWidth = isMobile ? '600px' : '650px';
              translateX = 0;
            } else if (isPrev) {
              scale = isMobile ? 0.75 : 0.85;
              opacity = isMobile ? 0.4 : 0.6;
              zIndex = 5;
              width = isMobile ? '40vw' : '35vw';
              maxWidth = isMobile ? '400px' : '450px';
              translateX = isMobile ? -100 : -120;
            } else if (isNext) {
              scale = isMobile ? 0.75 : 0.85;
              opacity = isMobile ? 0.4 : 0.6;
              zIndex = 5;
              width = isMobile ? '40vw' : '35vw';
              maxWidth = isMobile ? '400px' : '450px';
              translateX = isMobile ? 100 : 120;
            }
            
            const widthValue = parseFloat(width);
            const dragOffsetValue = isCurrent ? dragOffset : (isPrev ? dragOffset * 0.3 : dragOffset * 0.3);
            
            // Calculate vertical offset - move shoes up to prevent overlap
            const verticalOffset = isMobile ? (isCurrent ? -30 : -20) : (isCurrent ? -15 : -10);
            
            return (
              <div
                key={`slide-${index}`}
                className="absolute h-full flex items-center justify-center"
                style={{
                  transform: `translateX(calc(${translateX}% + ${dragOffsetValue}px)) translateY(${verticalOffset}px) scale(${scale})`,
                  transformOrigin: 'center center',
                  opacity,
                  zIndex,
                  width,
                  maxWidth,
                  left: `calc(50% - ${widthValue / 2}vw)`,
                  transition: isDragging 
                    ? 'none' 
                    : 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), scale 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform, opacity, scale',
                  pointerEvents: isCurrent ? 'auto' : 'none',
                }}
              >
                <SlideContent 
                  slide={slide} 
                  isActive={isCurrent} 
                  colors={slideColors}
                  isPrev={isPrev}
                  isNext={isNext}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-1.5 sm:gap-2 items-center">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gray-800 shadow-md'
                : 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/60 hover:bg-white/80 border border-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            style={{
              transition: 'all 0.3s ease-in-out',
            }}
          />
        ))}
      </div>

    </div>
  );
};

// Slide Content Component
const SlideContent = ({ slide, isActive, colors, isPrev, isNext }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-2 sm:px-4 md:px-8">
      {/* Shoe Image - Centered and properly sized */}
      <div
        className="relative z-10 w-full flex items-center justify-center"
        style={{
          transform: isActive ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
          flex: '1 1 auto',
          minHeight: 0,
        }}
      >
        <img
          src={slide.image}
          alt={slide.title || slide.subCategory}
          className="w-full h-auto object-contain"
          loading="lazy"
          style={{
            filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1))',
            transition: 'all 0.3s ease-in-out',
            maxHeight: isActive ? '90%' : '85%',
            maxWidth: '95%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>
    </div>
  );
};

export default LuxuryCarousel;
