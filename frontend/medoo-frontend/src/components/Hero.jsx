import React from 'react';
import './Hero.css';
import { FaArrowRight } from 'react-icons/fa';
import sphereImage from '../assets/sphere.png';

const Hero = () => {
  const handleConnectWallet = () => {
    console.log('Connecting wallet from hero section...');
    // Implement wallet connection logic here
    alert('Wallet connection feature will be implemented soon!');
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Hệ sinh thái<br />
          giáo dục<br />
          phi tập trung
        </h1>
        <p className="hero-description">
          Medoo là một mạng xã hội để chia sẻ tài liệu học tập, truyền
          cảm hứng cho giáo viên và học viên thông qua nền tảng và
          các nút giáo dục
        </p>
        <button className="connect-wallet-btn" onClick={handleConnectWallet}>
          <span>Liên kết ví của bạn</span>
          <FaArrowRight className="arrow-icon" />
        </button>
      </div>
      <div className="hero-image">
        <img src={sphereImage} alt="3D Sphere" className="sphere-image" />
      </div>
    </section>
  );
};

export default Hero;