import React, { useEffect, useRef } from 'react';

const LogoCarousel = () => {
  const logoItems = [
    { id: 1, logo: 'https://medoo.io/assets/images/web3-9cat.webp' },
    { id: 2, logo: 'https://medoo.io/assets/images/web3-aba.webp' },
    { id: 3, logo: 'https://medoo.io/assets/images/web3-blockvn.webp' },
    { id: 4, logo: 'https://medoo.io/assets/images/web3-coinstore.webp' },
    { id: 5, logo: 'https://medoo.io/assets/images/web3-dts.webp' },
    { id: 6, logo: 'https://medoo.io/assets/images/web3-lightlink.webp' },
    { id: 7, logo: 'https://medoo.io/assets/images/web3-near.webp' },
    { id: 8, logo: 'https://medoo.io/assets/images/web3-remitano.webp' },
    { id: 9, logo: 'https://medoo.io/assets/images/web3-renec.webp' },
    { id: 10, logo: 'https://medoo.io/assets/images/web3-solana.webp' }
  ];

  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const carouselContent = carousel.querySelector('.carousel-content');
    const carouselItems = Array.from(carouselContent.children);
    
    carouselItems.forEach(item => {
      const clone = item.cloneNode(true);
      carouselContent.appendChild(clone);
    });

    let animationId;
    let position = 0;
    const speed = 1;

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
              style={{ minWidth: '160px' }}
            >
              <img 
                src={item.logo} 
                alt="logo"
                className="w-auto object-contain filter brightness-0 invert"
                style={{ 
                  height: '40px', // Tăng kích thước logo lên 80px
                  maxWidth: '160px', // Giới hạn chiều rộng tối đa
                  transform: 'scale(2.2)' // Phóng to hình ảnh lên 1.5 lần
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoCarousel;