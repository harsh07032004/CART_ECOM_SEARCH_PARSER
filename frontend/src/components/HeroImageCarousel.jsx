import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Import product images
import headphonesImage from "@/assets/headphones.jpg";
import tshirtImage from "@/assets/tshirt.jpg";
import securityCameraImage from "@/assets/security-camera.jpg";
import coffeeImage from "@/assets/coffee.jpg";
import yogaMatImage from "@/assets/yoga-mat.jpg";
import faceCreamImage from "@/assets/face-cream.jpg";
import phoneCaseImage from "@/assets/phone-case.jpg";
import bookImage from "@/assets/book.jpg";

const carouselSlides = [
  {
    id: 1,
    image: headphonesImage,
    title: "Premium Electronics",
    category: "Electronics",
    description: "Discover the latest in wireless audio technology"
  },
  {
    id: 2,
    image: tshirtImage,
    title: "Fashion Collection",
    category: "Clothing",
    description: "Trendy apparel for every style and occasion"
  },
  {
    id: 3,
    image: securityCameraImage,
    title: "Smart Home Tech",
    category: "Electronics",
    description: "Secure and connected living solutions"
  },
  {
    id: 4,
    image: coffeeImage,
    title: "Gourmet Selection",
    category: "Food & Beverages",
    description: "Premium coffee beans from around the world"
  },
  {
    id: 5,
    image: yogaMatImage,
    title: "Fitness Essentials",
    category: "Sports & Fitness",
    description: "Everything you need for a healthy lifestyle"
  },
  {
    id: 6,
    image: faceCreamImage,
    title: "Beauty & Wellness",
    category: "Beauty & Health",
    description: "Premium skincare for radiant results"
  }
];

export function HeroImageCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of manual navigation
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="relative w-full h-[400px] md:h-[500px] mb-12 overflow-hidden rounded-xl">
      <Card className="relative w-full h-full overflow-hidden">
        {/* Image slides */}
        <div className="relative w-full h-full">
          {carouselSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide 
                  ? "opacity-100 scale-100" 
                  : "opacity-0 scale-105"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient - Cyber Style */}
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
              
              {/* Content overlay */}
              <div className="absolute inset-0 flex items-center justify-start p-8 md:p-16">
                <div className="text-foreground max-w-xl animate-fade-in-up">
                  <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase border border-primary/20 rounded-full bg-primary/10 backdrop-blur-md">
                    {slide.category}
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
                    {slide.description}
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Shop Collection
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white rounded-full h-12 w-12 transition-all duration-300 hover:scale-110"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white rounded-full h-12 w-12 transition-all duration-300 hover:scale-110"
          onClick={goToNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        {/* Auto-play indicator */}
        <div className="absolute top-4 right-4">
          <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
        </div>
      </Card>
    </section>
  );
} 