import React, { useState } from 'react';

const AwardsSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="reward-section py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header Section - Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12 md:mb-16">
          <div className="md:col-span-2 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <p className="text-blue-600 font-medium text-lg">AWARDS</p>
          </div>
          <div className="md:col-span-3">
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-normal leading-tight">
              Awards & Recognition
              <span className="block bg-gradient-to-r from-blue-600 to-purple-500 text-transparent bg-clip-text">
                We Achieved
              </span>
            </h2>
          </div>
        </div>

        {/* Awards Items - Improved hover effect */}
        <div className="space-y-4">
          {[1, 2].map((cardId) => (
            <div 
              key={cardId}
              className="group relative border-t border-b border-gray-200 py-8"
              onMouseEnter={() => setHoveredCard(cardId)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Number */}
                <div className="col-span-1 text-2xl font-medium text-blue-600">
                  0{cardId}
                </div>

                {/* Image Container - Smooth transition */}
                <div className={`col-span-4 transition-all duration-500 overflow-hidden ${
                  hoveredCard === cardId ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="relative aspect-video rounded-lg overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
                    <img
                      alt={cardId === 1 ? "Education Impact Award" : "Web3 Projects Award"}
                      loading="lazy"
                      src={cardId === 1 
                        ? "https://medoo.io/assets/images/edu-impact.webp" 
                        : "https://medoo.io/assets/images/amaze-reward.webp"
                      }
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="col-span-7">
                  <h3 className="text-2xl md:text-3xl font-semibold mb-2">
                    {cardId === 1 
                      ? "Education Impact Of The Year" 
                      : "Top 3/30 Global Web3 Projects"
                    }
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {cardId === 1 ? "SEI Awards 2023" : "Pitchverse Awards"}
                  </p>
</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;