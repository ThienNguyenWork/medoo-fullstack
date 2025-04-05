import React, { useState, useRef, useEffect } from 'react';

const RoadmapSlider = () => {
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const scrollContainerRef = useRef(null);
  const cardRefs = useRef([]);

  const roadmapData = [
    {
      year: '2022',
      items: [
        'Phát triển Sản phẩm MVP',
        'Whitepaper',
        'Trang web dự án',
        'Nhóm sáng lập'
      ]
    },
    {
      year: '2023',
      items: [
        'Kế hoạch Đi ra thị trường',
        'Nền tảng Beta',
        'Tích hợp Công nghệ Web3'
      ]
    },
    {
      year: 'I+II/2024',
      items: [
        'Mở rộng đối tác',
        'Phát triển Cộng đồng',
        'Tăng cường Hợp tác Xã hội',
        'Vòng Seed và Private',
        'Quyên góp từ cộng đồng'
      ]
    },
    {
      year: 'III+IV/2024',
      items: [
        'Bán công khai IDO',
        'Niêm yết Token trên Sàn giao dịch',
        'Niêm yết NFT',
        'Ra mắt ứng dụng di động',
        'Bắt đầu Dự án Trí tuệ nhân tạo Medoo',
        'SDK Nút Giáo dục Medoo',
        'Thị trường NFT'
      ]
    },
    {
      year: '2025-2026',
      items: [
        'Mở rộng Kinh doanh Toàn cầu',
        'Lớp 2 Blockchain cho Giáo dục',
        'Dịch vụ Giáo dục',
        'Trí tuệ nhân tạo Medoo cho Giáo dục',
        'Nút sự kiện'
      ]
    }
  ];

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    const cardWidth = cardRefs.current[0]?.offsetWidth || 0;
    const scrollAmount = cardWidth + 32;
    
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }

    setTimeout(() => updateButtonVisibility(), 300);
  };

  const updateButtonVisibility = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftButton(scrollLeft > 10);
    setShowRightButton(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    container.addEventListener('scroll', updateButtonVisibility);
    return () => container.removeEventListener('scroll', updateButtonVisibility);
  }, []);

  return (
    <div 
      className="relative py-20 bg-cover bg-center"
      style={{ backgroundImage: 'url(https://medoo.io/assets/images/roadmap-bg.webp)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-white mb-16 text-center font-display">
          ROADMAP
        </h2>

        <div className="relative group">
          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto space-x-8 pb-12"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {roadmapData.map((item, index) => (
              <div
                key={index}
                ref={(el) => (cardRefs.current[index] = el)}
                className="flex-shrink-0 w-[360px] bg-white/10 backdrop-blur-lg rounded-2xl p-8"
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white border-l-4 border-blue-500 pl-4">
                    {item.year}
                  </h3>
                </div>
                <ul className="space-y-4">
                  {item.items.map((task, i) => (
                    <li 
                      key={i}
                      className="flex items-start text-gray-200 text-lg"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 mr-3 flex-shrink-0" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Navigation Buttons - Bên phải */}
          <div className="absolute bottom-0 right-6 flex gap-4">
            {showLeftButton && (
              <button 
                onClick={() => handleScroll('left')}
                className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {showRightButton && (
              <button 
                onClick={() => handleScroll('right')}
                className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapSlider;