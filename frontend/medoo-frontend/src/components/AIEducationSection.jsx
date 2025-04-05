import React, { useState, useEffect, useRef } from 'react';

const AIEducationSection = () => {
  // Phases control
  const [leftPhase, setLeftPhase] = useState(-1);
  const [rightPhase, setRightPhase] = useState(-1);
  const [isFixed, setIsFixed] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const heroRef = useRef(null);
  const phaseData = useRef({
    initialHeroTop: 0,
    PHASE_HEIGHT: 0,
    totalAnimationHeight: 0
  });

  // Animation styles
  const tableStyles = {
    left: {
      '-1': { transform: 'translateY(100px)', opacity: 0 },
      0: { transform: 'translateY(75px)', opacity: 1 },
      1: { transform: 'translateY(50px)', opacity: 1 }
    },
    right: {
      '-1': { transform: 'translateY(100px)', opacity: 0 },
      0: { transform: 'translateY(75px)', opacity: 1 },
      1: { transform: 'translateY(50px)', opacity: 1 }
    }
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        phaseData.current.initialHeroTop = window.scrollY + rect.top;
        phaseData.current.PHASE_HEIGHT = window.innerHeight / 4;
        phaseData.current.totalAnimationHeight = phaseData.current.PHASE_HEIGHT * 7;
      }
    };

    const handleScroll = () => {
      if (!heroRef.current) return;
      
      const { initialHeroTop, PHASE_HEIGHT, totalAnimationHeight } = phaseData.current;
      const scrollY = window.scrollY;
      const relativeScroll = scrollY - initialHeroTop;
      const heroRect = heroRef.current.getBoundingClientRect();

      // Fixed position handling
      if (heroRect.top <= 0 && scrollY >= initialHeroTop && !isAnimationComplete) {
        !isFixed && setIsFixed(true);
      } else if (scrollY < initialHeroTop && isFixed) {
        setIsFixed(false);
        setLeftPhase(-1);
        setRightPhase(-1);
      }

      // Phase transitions
      if (isFixed && !isAnimationComplete) {
        if (relativeScroll >= totalAnimationHeight) {
          setIsFixed(false);
          setIsAnimationComplete(true);
          setLeftPhase(1);
          setRightPhase(1);
        } else {
          const currentPhase = Math.floor(relativeScroll / PHASE_HEIGHT);
          switch(currentPhase) {
            case 0: 
              setLeftPhase(-1);
              setRightPhase(-1);
              break;
            case 1: 
              setLeftPhase(0);
              setRightPhase(-1);
              break;
            case 2: 
              setLeftPhase(1);
              setRightPhase(-1);
              break;
            case 3: 
              setLeftPhase(1);
              setRightPhase(-1);
              break;
            case 4: 
              setLeftPhase(1);
              setRightPhase(0);
              break;
            case 5: 
              setLeftPhase(1);
              setRightPhase(0);
              break;
            case 6: 
              setLeftPhase(1);
              setRightPhase(1);
              break;
            default:
              break;
          }
        }
      }
    };

    updateDimensions();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [isFixed, isAnimationComplete]);

  return (
    <div className="relative">
      {/* Hero Section */}
      <div
        ref={heroRef}
        className={`h-screen flex flex-col items-center justify-center bg-gray-900 transition-all duration-300 ${
          isFixed && !isAnimationComplete ? 'fixed top-0 left-0 w-full z-50' : 'relative'
        }`}
      >
        {/* Main Title */}
        <div className="mb-12 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Chuyển đổi
            <span className="block mt-2 text-blue-400">bằng AI</span>
          </h1>
        </div>

        {/* Tables Container */}
        <div className="w-full max-w-7xl px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Table */}
            <div
              className="transition-transform duration-700 ease-out"
              style={tableStyles.left[leftPhase]}
            >
              <div className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-2xl h-full">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    S (A1) S
                  </h2>
                  <div className="text-blue-400 text-4xl md:text-5xl font-bold">
                    6.0
                  </div>
                  <p className="text-gray-300 text-sm md:text-base">
                    Học tập được cá nhân hóa, được hỗ trợ bởi AI
                  </p>
                </div>
              </div>
            </div>

            {/* Right Table */}
            <div
              className="transition-transform duration-700 ease-out"
              style={tableStyles.right[rightPhase]}
            >
              <div className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-2xl h-full">
                <div className="text-center space-y-6">
                  <p className="text-gray-300 text-sm md:text-base">
                    Khai thác sức mạnh của AI để tạo các khóa học một cách dễ dàng...
                  </p>
                  <div className="border-t border-gray-700 pt-6">
                    <p className="text-gray-300 text-sm md:text-base">
                      Trải nghiệm học tập phù hợp hơn bao giờ hết...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Spacer */}
      {isFixed && !isAnimationComplete && (
        <div 
          className="invisible" 
          style={{ height: `${window.innerHeight * 2}px` }}
        />
      )}
    </div>
  );
};

export default AIEducationSection;