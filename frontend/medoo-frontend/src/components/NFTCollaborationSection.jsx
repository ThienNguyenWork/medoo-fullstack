import React from 'react';

const NFTEducationPlatform = () => {
  const features = [
    {
      title: 'Quản lý Khóa học cho Chủ sở hữu NFT',
      items: ['Dashboard tùy biến', 'Theo dõi hiệu suất', 'Tích hợp ví Web3']
    },
    {
      title: 'Mô hình Cộng tác Nhà xuất bản',
      items: ['Hợp đồng thông minh', 'Royalty tự động', 'Quản lý phiên bản']
    },
    {
      title: 'Tích cực Quảng bá NFT Nhà xuất bản',
      items: ['Chiến dịch tiếp thị', 'Phân tích dữ liệu', 'Tối ưu ROI']
    },
    {
      title: 'Chúng tôi Trân trọng Giáo viên của mình',
      items: ['Thanh toán minh bạch', 'Bảo vệ bản quyền', 'Cộng đồng hỗ trợ']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 sm:px-8 lg:px-24 xl:px-32">
      <div className="max-w-[1366px] mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden">
        {/* Main Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-16 p-14">
          
          {/* Left Column - Content Section */}
          <div className="space-y-8">
            {/* Icon Section */}
            <div className="bg-blue-100 w-fit p-5 rounded-2xl">
              <span className="text-3xl">📘</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl font-bold leading-tight">
              Đổi mới Giáo dục
              <span className="block text-blue-600 mt-3">với NFT</span>
            </h1>

            {/* Accessibility Section */}
            <div className="space-y-6 border-l-4 border-blue-500 pl-6 ml-2">
              <h2 className="text-2xl font-semibold">ACCESSIBILITY</h2>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Name
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Role
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Keyboard-focusable
                </li>
              </ul>
            </div>

            {/* Description Text */}
            <div className="space-y-6 text-gray-600 pr-8">
              <p className="leading-relaxed">
                Xây dựng thư viện chương trình học toàn cầu phi tập trung, 
                độc lập được tạo ra và sở hữu bởi giáo viên và cộng đồng qua Web3.
              </p>
              
              <p className="leading-relaxed">
                Giáo viên có thể biến nội dung thành NFT,
                cung cấp cổ phần sở hữu độc đáo và quyền quản lý minh bạch.
              </p>
            </div>
          </div>

          {/* Right Column - Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-blue-100 transition-all">
                <div className="space-y-6">
                  {/* Feature Title */}
                  <h3 className="text-2xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  
                  {/* Feature Items */}
                  <ul className="space-y-4">
                    {feature.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <span className="flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Footer Section */}
        <div className="border-t border-gray-200 mx-14 pt-10 pb-14">
          <p className="text-center text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Chúng tôi đang tạo dựng hệ sinh thái giáo dục mở nơi tri thức được sở hữu và chia sẻ công bằng thông qua công nghệ blockchain và NFT.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NFTEducationPlatform;