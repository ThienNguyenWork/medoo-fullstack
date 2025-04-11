import React from 'react';

const Footer = () => {
  return (
    <footer
      className="bg-[url('https://medoo.io/assets/images/footer-web3-bg.webp')] bg-cover bg-no-repeat text-white py-10"
    >
      {/* Container chính */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Phần trên: Logo & mạng xã hội */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          {/* Logo (hoặc tên thương hiệu) */}
          <div className="flex items-center space-x-2">
            {/* Thay bằng logo nếu có */}
            <span className="text-2xl font-bold uppercase">Medoo</span>
          </div>
          {/* Mạng xã hội */}
          <div className="flex space-x-4">
            <a
              href="/"
              className="transition-colors hover:text-gray-300"
              aria-label="Facebook"
            >
              Facebook
            </a>
            <a
              href="/"
              className="transition-colors hover:text-gray-300"
              aria-label="Linkedin"
            >
              Linkedin
            </a>
            <a
              href="/"
              className="transition-colors hover:text-gray-300"
              aria-label="Twitter"
            >
              Twitter
            </a>
            <a
              href="/"
              className="transition-colors hover:text-gray-300"
              aria-label="Telegram"
            >
              Telegram
            </a>
          </div>
        </div>

        {/* Phần giữa: các cột link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Hệ sinh thái */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hệ sinh thái</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:underline">
                  Marketplace (Chợ)
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  Nhà cung cấp nội dung
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  LMS
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  Học &amp; Nhận
                </a>
              </li>
            </ul>
          </div>
          {/* Sản phẩm */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sản phẩm</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:underline">
                  LMS
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  Số hoá bài giảng
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  Khóa học
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  Cuộc thi
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  Báo giá
                </a>
              </li>
            </ul>
          </div>
          {/* Tài nguyên */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tài nguyên</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:underline">
                  Pitch Deck
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  Whitepaper
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  Bài viết
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  Hướng dẫn thanh toán với VNPay
                </a>
              </li>
            </ul>
          </div>
          {/* Chính sách chung & hỗ trợ */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Chính sách chung &amp; hỗ trợ
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:underline">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  Bài viết
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  Chính sách bảo mật thông tin
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  Quy chế hoạt động
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  Cơ chế giải quyết tranh chấp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Phần QR Code & thông báo tham gia cộng đồng */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-black/20 p-4 rounded-md mb-8">
          {/* Text */}
          <div className="mb-4 sm:mb-0">
            <p className="font-semibold">
              Quét để tham gia cộng đồng Medoo
            </p>
          </div>
          {/* QR Code (thay bằng ảnh QR thực tế nếu có) */}
          <div>
            <img
              src="https://via.placeholder.com/100x100.png?text=QR+Code"
              alt="QR code"
              className="w-24 h-24 object-cover"
            />
          </div>
        </div>

        {/* Dòng cuối: Bản quyền và thông báo */}
        <div className="border-t border-white/20 pt-4 flex flex-col gap-2">
          <p className="text-sm">
            Bản quyền © Medoo | Bảo lưu mọi quyền
          </p>
          <p className="text-xs text-gray-200">
            Website đang chạy chế độ thử nghiệm, chờ cấp phép từ Bộ Công Thương.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
