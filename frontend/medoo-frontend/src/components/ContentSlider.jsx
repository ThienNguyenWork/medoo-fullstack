import React, { useState, useEffect } from 'react';

const FullWidthSlider = () => {
  const slides = [
    {
      id: 1,
      title: "Thị trường khóa học trực tuyến",
      description: "Một nền tảng học tập trực tuyến cung cấp các khóa học theo yêu cầu về nhiều chủ đề khác nhau. Học mọi lúc, mọi nơi.",
      buttonText: "Khám phá khóa học"
    },
    {
      id: 2,
      title: "Nền tảng giảng dạy trực tuyến",
      description: "Một nền tảng dành cho người hướng dẫn, gia sư và KOL để truyền bá kiến thức ra thế giới.",
      buttonText: "Bắt đầu giảng dạy"
    },
    {
      id: 3,
      title: "Trung tâm Học tập & Kiếm tiền điện tử",
      description: "Một phần chính của các sáng kiến học tập và kiếm tiền trong không gian tiền điện tử.",
      buttonText: "Tìm hiểu thêm"
    },
    {
      id: 4,
      title: "LMS toàn diện",
      description: "Hệ thống đào tạo và phát triển nguồn nhân lực nội bộ trọn gói cho các tổ chức giáo dục và doanh nghiệp.",
      buttonText: "Bắt đầu dùng thử"
    }
  ];

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setTransitioning(true);
        setTimeout(() => {
          setActiveSlide((prev) => (prev + 1) % slides.length);
          setTransitioning(false);
        }, 500);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handleDotClick = (index) => {
    if (index !== activeSlide) {
      setTransitioning(true);
      setTimeout(() => {
        setActiveSlide(index);
        setTransitioning(false);
      }, 500);
    }
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background full width */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('https://medoo.io/assets/images/home-ecosystem-bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      </div>

      {/* Content container - giữ nguyên max-width nhưng full width background */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Left content */}
          <div className={`flex-1 transition-opacity duration-500 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              {slides[activeSlide].title}
            </h2>
            <p className="text-gray-200 mb-6 text-lg md:text-xl drop-shadow-md">
              {slides[activeSlide].description}
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
              {slides[activeSlide].buttonText} ▼
            </button>
          </div>

          {/* Right image placeholder */}
          <div className={`flex-1 h-64 md:h-96 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-md transition-opacity duration-500 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
            <span className="text-white text-opacity-80">Slide {activeSlide + 1} - Hình ảnh sẽ được thêm vào sau</span>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center space-x-3 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className="relative w-8 h-2 rounded-full overflow-hidden bg-white bg-opacity-30"
            >
              <div 
                className={`absolute top-0 left-0 h-full ${activeSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                style={{
                  width: activeSlide === index && !isPaused ? '0%' : '100%',
                  transition: activeSlide === index && !isPaused ? 'width 5s linear' : 'none'
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullWidthSlider;