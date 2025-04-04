import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import sphereImage from '../assets/sphere.png';
import LogoCarousel from './LogoCarousel';

const Hero = () => {
  const handleConnectWallet = () => {
    console.log('Connecting wallet from hero section...');
    alert('Wallet connection feature will be implemented soon!');
  };

  return (
    <>
      <section className="flex px-20 py-16 bg-white min-h-[600px] items-center">
        <div className="flex-1 flex flex-col justify-center pr-12">
          <h1 className="text-7xl font-bold text-blue-900 mb-5 leading-tight">
            Hệ sinh thái<br />
            giáo dục<br />
            phi tập trung
          </h1>
          
          <p className="text-base text-gray-600 mb-8 max-w-[550px] leading-relaxed">
            Medoo là một mạng xã hội để chia sẻ tài liệu học tập, truyền
            cảm hứng cho giáo viên và học viên thông qua nền tảng và
            các nút giáo dục
          </p>
          
          {/* Nút với hiệu ứng đổ màu khi hover vào button */}
          <div className="relative inline-block">
            <button 
              className="relative flex items-center gap-3 text-white rounded-full px-8 py-4 text-base cursor-pointer w-fit
                        overflow-hidden border-none outline-none group"
              onClick={handleConnectWallet}
            >
              {/* Lớp nền đen cố định */}
              <span className="absolute inset-0 bg-gray-900 rounded-full z-0"></span>
              
              {/* Lớp gradient sẽ đổ màu */}
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full 
                             w-0 h-full transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] 
                             group-hover:w-full z-0"></span>
              
              {/* Nội dung button */}
              <span className="relative z-10">Liên kết ví của bạn</span>
              <FaArrowRight className="text-sm relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <img 
            src={sphereImage} 
            alt="3D Sphere" 
            className="max-w-full h-auto" 
          />
        </div>
      </section>

      {/* Thêm LogoCarousel ngay sau section Hero */}
      <LogoCarousel />
    </>
  );
};

export default Hero;