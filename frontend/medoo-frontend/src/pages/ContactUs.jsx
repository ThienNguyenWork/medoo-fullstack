import React, { useState } from 'react';
import api from '../services/api';
import {
  EnvelopeIcon,
  ChatBubbleBottomCenterTextIcon,
  MapPinIcon,
  PhoneIcon,
} from '@heroicons/react/24/solid';

const ContactUs = () => {
  // State cho các trường form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otherContactMethod, setOtherContactMethod] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [content, setContent] = useState('');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      fullName,
      email,
      phone,
      otherContactMethod,
      questionType,
      content,
    };

    try {
      // Gọi API lưu thông tin contact
      await api.post('/contacts', formData);
      alert('Gửi thông tin liên hệ thành công!');
      setFullName('');
      setEmail('');
      setPhone('');
      setOtherContactMethod('');
      setQuestionType('');
      setContent('');
    } catch (error) {
      console.error(error);
      alert('Tài khoản của bạn đã gửi trước đó rồi. Xin vui lòng gửi lại sau.');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Banner/tiêu đề */}
      <div
        className="w-full h-60 flex flex-col items-center justify-center text-center"
        style={{
          backgroundColor: '#f8fafc',
          backgroundImage: 'url("https://medoo.io/assets/images/contact-us/banner-bg.webp")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay giúp làm mờ background để chữ dễ đọc */}
        <div
          className="w-full h-full flex flex-col items-center justify-center"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
            Chúng tôi rất mong nhận được ý kiến từ bạn
          </h1>
          <p className="text-lg md:text-xl text-gray-800">
            Đội ngũ của chúng tôi luôn sẵn sàng phản hồi với bạn
          </p>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* 4 thẻ thông tin liên hệ có icon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {/* Card 1 */}
          <div className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col space-y-2">
            <div className="bg-blue-100 rounded-full p-2 w-max">
              <EnvelopeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Liên hệ nhân viên tư vấn
            </h2>
            <p className="text-gray-600">Nhận được tư vấn tốt nhất</p>
            <p className="text-blue-600 font-medium">info@medoo.io</p>
          </div>
          {/* Card 2 */}
          <div className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col space-y-2">
            <div className="bg-blue-100 rounded-full p-2 w-max">
              <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Chat với nhân viên hỗ trợ
            </h2>
            <p className="text-gray-600">Chúng tôi luôn sẵn sàng giúp bạn</p>
            <p className="text-blue-600 font-medium">0346851858</p>
          </div>
          {/* Card 3 */}
          <div className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col space-y-2">
            <div className="bg-blue-100 rounded-full p-2 w-max">
              <MapPinIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Khám phá</h2>
            <p className="text-gray-600">Khám phá văn phòng</p>
            <p className="text-blue-600 font-medium whitespace-pre-line">
              Viwaseen Tower, 48 Tố Hữu, Trung Văn,
              <br />
              Nam Từ Liêm, Hà Nội, Việt Nam
            </p>
          </div>
          {/* Card 4 */}
          <div className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col space-y-2">
            <div className="bg-blue-100 rounded-full p-2 w-max">
              <PhoneIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Gọi cho chúng tôi
            </h2>
            <p className="text-gray-600">Từ thứ 2-6, 8h-17h</p>
            <p className="text-blue-600 font-medium">0346851858</p>
          </div>
        </div>

        {/* Form liên hệ - Hẹp lại và căn giữa */}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Liên hệ</h2>
        <form onSubmit={handleContactSubmit} className="max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Họ và tên */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-800" htmlFor="fullName">
              Họ và tên
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ tên..."
              required
              className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>
          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-800" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email..."
              required
              className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>
          {/* Số điện thoại */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-800" htmlFor="phone">
              Số điện thoại
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nhập số điện thoại..."
              className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>
          {/* Phương thức liên hệ khác */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-800" htmlFor="otherContactMethod">
              Phương thức liên hệ khác
            </label>
            <input
              type="text"
              id="otherContactMethod"
              value={otherContactMethod}
              onChange={(e) => setOtherContactMethod(e.target.value)}
              placeholder="Zalo, Skype, v.v..."
              className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>
          {/* Loại câu hỏi */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-800" htmlFor="questionType">
              Loại câu hỏi
            </label>
            <input
              type="text"
              id="questionType"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              placeholder="VD: Sản phẩm, dịch vụ, hỗ trợ..."
              className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>
          {/* Nội dung */}
          <div className="flex flex-col md:col-span-2">
            <label className="mb-1 font-medium text-gray-800" htmlFor="content">
              Hãy cho chúng tôi biết về việc bạn quan tâm đến
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={1000}
              rows={5}
              placeholder="0 / 1000"
              className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 text-gray-800"
            ></textarea>
          </div>
          {/* Nút submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Gửi tin nhắn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
