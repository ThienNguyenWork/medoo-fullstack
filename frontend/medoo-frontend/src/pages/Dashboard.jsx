// src/pages/DashboardPage.jsx
import React from 'react';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import DashboardSidebar from '../components/Dashboard/DashboardSidebar';
import DashboardMainContent from '../components/Dashboard/DashboardMainContent';

const DashboardPage = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <DashboardHeader />

      {/* Nội dung chính (Sidebar + MainContent) */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <DashboardMainContent />
      </div>
    </div>
  );
};

export default DashboardPage;
