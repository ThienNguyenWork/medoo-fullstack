import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PaymentPage = () => {
  const { slugId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi mock API, luôn trả về thành công
    fetch(`/api/courses/${slugId}/payment/test`, { method: 'POST' })
      .finally(() => {
        // Chờ 2s rồi chuyển tiếp
        setTimeout(() => {
          navigate(`/course/${slugId}/learning`, { replace: true });
        }, 2000);
      });
  }, [navigate, slugId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Thanh toán thành công!
        </h1>
        <p className="mb-6">Cảm ơn bạn đã mua khóa học. Đang chuyển đến trang học…</p>
        <button
          onClick={() => navigate(`/course/${slugId}/learning`)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-xl"
        >
          Vào học ngay
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;