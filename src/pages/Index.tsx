import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { LoginForm } from '@/components/Login/LoginForm';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { StudentDashboard } from '@/components/Dashboard/StudentDashboard';
import { TeacherDashboard } from '@/components/Dashboard/TeacherDashboard';
import { AdminDashboard } from '@/components/Dashboard/AdminDashboard';
import { SitemapViewer } from '@/components/Sitemap/SitemapViewer';
import { Button } from '@/components/ui/button';
import { Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const [showSitemap, setShowSitemap] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const navigate = useNavigate();

  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'ko' ? 'en' : 'ko');
  };

  // 로그인된 사용자를 역할에 따라 적절한 페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'student':
          navigate('/student');
          break;
        case 'teacher':
          navigate('/teacher');
          break;
        case 'admin':
          navigate('/admin');
          break;
      }
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (showSitemap) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header 
          onLanguageToggle={handleLanguageToggle}
          currentLanguage={currentLanguage}
        />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-4">
            <Button 
              variant="ghost" 
              onClick={() => setShowSitemap(false)}
              className="mb-4"
            >
              ← 대시보드로 돌아가기
            </Button>
          </div>
          <SitemapViewer />
        </main>
        <Footer />
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onLanguageToggle={handleLanguageToggle}
        currentLanguage={currentLanguage}
      />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              onClick={() => setShowSitemap(true)}
              className="flex items-center space-x-2"
            >
              <Map className="h-4 w-4" />
              <span>사이트맵 보기</span>
            </Button>
          </div>
        </div>
        {renderDashboard()}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
