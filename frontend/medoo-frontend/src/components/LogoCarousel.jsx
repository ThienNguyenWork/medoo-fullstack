import React, { useEffect, useRef } from 'react';

const LogoCarousel = () => {
  // Danh sách các logo với hình ảnh và tên
  const logoItems = [
    {
      id: 1,
      name: 'DTS',
      logo: '/logos/dts-logo.png', // Đường dẫn đến hình ảnh logo
      compactName: 'DTS'
    },
    {
      id: 2,
      name: 'A7B CAT DIGITAL',
      logo: '/logos/a7b-logo.png',
      compactName: '9 CAT DIGITAL' // Tên rút gọn
    },
    {
      id: 3,
      name: 'NEAR',
      logo: '/logos/near-logo.png',
      compactName: 'NEAR'
    },
    {
      id: 4,
      name: 'Semitano',
      logo: '/logos/semitano-logo.png'
    },
    {
      id: 5,
      name: 'SOLANA',
      logo: '/logos/solana-logo.png'
    },
    {
      id: 6,
      name: 'Coin',
      logo: '/logos/coin-logo.png'
    },
    {
      id: 7,
      name: 'RENEC',
      logo: '/logos/renec-logo.png'
    }
  ];

  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const carouselContent = carousel.querySelector('.carousel-content');
    const carouselItems = Array.from(carouselContent.children);
    
    // Nhân đôi nội dung để tạo hiệu ứng loop mượt
    carouselItems.forEach(item => {
      const clone = item.cloneNode(true);
      carouselContent.appendChild(clone);
    });

    let animationId;
    let position = 0;
    const speed = 1; // Tốc độ chạy

    const animate = () => {
      position -= speed;
      if (position <= -carouselContent.scrollWidth / 2) {
        position = 0;
      }
      carouselContent.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="py-12 bg-black w-full">
      <div 
        ref={carouselRef}
        className="carousel-container overflow-hidden w-full"
      >
        <div className="carousel-content flex whitespace-nowrap">
          {logoItems.map((item) => (
            <div 
              key={item.id}
              className="inline-flex items-center justify-center mx-8 px-4"
              style={{ minWidth: '220px' }}
            >
              <div className="flex items-center gap-4">
                {/* Hiển thị logo */}
                <div className="flex-shrink-0">
                  <img 
                    src={item.logo} 
                    alt={`${item.name} logo`}
                    className="h-12 w-12 object-contain" // Kích thước logo
                  />
                </div>
                
                {/* Hiển thị tên */}
                <span className="text-2xl font-extrabold text-white brightness-125">
                  {item.compactName || item.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoCarousel;